import crypto from "crypto";

// Vercel serverless function. Lives at /api/subscribe and is called from
// the frontend via fetch("/api/subscribe", { method: "POST", ... }).
//
// Required environment variables (set in Vercel dashboard):
//   MAILCHIMP_API_KEY        e.g. "abc123...-us22"
//   MAILCHIMP_SERVER_PREFIX  e.g. "us22"
//   MAILCHIMP_LIST_ID        your Audience/List ID

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

  const ALL_STATES = ["Aligned", "Overextended", "Restricted"];

  const memberBody = {
    email_address: email,
    status_if_new: "subscribed",
    merge_fields: diagnosis?.state ? { STATE: diagnosis.state } : undefined,
  };

  try {
    // Step 1: Upsert the contact (tags handled separately below).
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

    // Steps 2 + 3: Force a genuine inactive -> active transition for the
    // current result tag so Mailchimp's "Tag added" automation fires every
    // time -- including when the same result comes up on a repeat submission.
    //
    // TWO separate calls are required:
    //   2. Set ALL result tags to inactive (clear the slate).
    //   3. Set only the current result tag to active (fresh addition).
    //
    // A single combined call (inactive others + active current) does NOT
    // reliably re-trigger the automation when the tag was already active,
    // because Mailchimp only fires on a genuine absent/inactive -> active
    // transition and won't fire if the tag state didn't actually change.
    if (diagnosis?.state && ALL_STATES.includes(diagnosis.state)) {
      // 2. Remove all result tags.
      await fetch(tagsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({
          tags: ALL_STATES.map((state) => ({ name: state, status: "inactive" })),
        }),
      });

      // 3. Add the current result tag fresh.
      const tagsResponse = await fetch(tagsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({
          tags: [{ name: diagnosis.state, status: "active" }],
        }),
      });

      if (!tagsResponse.ok) {
        const tagsData = await tagsResponse.json().catch(() => ({}));
        console.error("Mailchimp tags error:", tagsData);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Something went wrong reaching Mailchimp" });
  }
}
