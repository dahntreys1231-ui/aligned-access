import crypto from "crypto";

// Vercel serverless function. Lives at /api/subscribe and is called from
// the frontend via fetch("/api/subscribe", { method: "POST", ... }).
//
// The Mailchimp API key NEVER touches the browser — it only exists here,
// as an environment variable on the server. This is the whole reason this
// function exists rather than calling Mailchimp directly from React.
//
// Required environment variables (set these in your hosting dashboard,
// not in code):
//   MAILCHIMP_API_KEY     e.g. "abc123...-us21"  (the "-us21" suffix tells
//                          you the server prefix used below)
//   MAILCHIMP_SERVER_PREFIX  e.g. "us21"  (same suffix as above, just the
//                          part after the dash)
//   MAILCHIMP_LIST_ID     your Audience/List ID, found in Mailchimp under
//                          Audience > Settings > Audience name and defaults

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, answers, diagnosis } = req.body || {};

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !serverPrefix || !listId) {
    console.error("Missing Mailchimp environment variables");
    return res.status(500).json({ error: "Server is not configured correctly" });
  }

  const subscriberHash = crypto
    .createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");

  const memberUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;
  const tagsUrl = `${memberUrl}/tags`;
  const authHeader = `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`;

  // All three possible alignment states. Whichever one applies this time
  // gets explicitly set to "active"; the other two (if previously set)
  // get explicitly set to "inactive". This matters because Mailchimp's
  // "Tag added" automation trigger only fires on the transition from
  // absent/inactive -> active. Without this cycling, someone retaking the
  // assessment and landing on the same result as last time (or simply
  // already having all three tags from repeated testing) would never
  // re-trigger the email, since the tag would already be "active" and
  // nothing would actually change.
  const ALL_STATES = ["Aligned", "Overextended", "Restricted"];

  const memberBody = {
    email_address: email,
    status_if_new: "subscribed",
    merge_fields: diagnosis?.state ? { STATE: diagnosis.state } : undefined,
  };

  try {
    // Step 1: create/update the member (no tags here — handled separately
    // below so we can reliably force the active/inactive transition).
    const mcResponse = await fetch(memberUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(memberBody),
    });

    const data = await mcResponse.json();

    if (!mcResponse.ok) {
      console.error("Mailchimp error:", data);
      return res.status(mcResponse.status).json({ error: data.detail || "Mailchimp request failed" });
    }

    // Step 2: cycle tags so the current result is always a fresh
    // "added" event, even on repeat submissions.
    if (diagnosis?.state && ALL_STATES.includes(diagnosis.state)) {
      const tagsBody = {
        tags: ALL_STATES.map((state) => ({
          name: state,
          status: state === diagnosis.state ? "active" : "inactive",
        })),
      };

      const tagsResponse = await fetch(tagsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(tagsBody),
      });

      if (!tagsResponse.ok) {
        const tagsData = await tagsResponse.json().catch(() => ({}));
        console.error("Mailchimp tags error:", tagsData);
        // Don't fail the whole request over this — the contact is still
        // subscribed correctly even if tag-cycling has an issue.
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Something went wrong reaching Mailchimp" });
  }
}
