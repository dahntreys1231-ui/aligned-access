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

  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

  // We only send the short alignment state as both a tag and a merge
  // field — Mailchimp merge field values are meant for short data (text
  // fields are capped at 255 bytes and aren't well suited to paragraphs),
  // and merge tag NAMES are capped at 10 characters. Rather than fight
  // those limits by squeezing the full stewardship paragraph into a
  // merge field, the recommended approach is to write three separate,
  // complete welcome emails inside Mailchimp (one each for Aligned,
  // Overextended, Restricted) and use this STATE tag to decide which one
  // a contact receives — see README for the exact automation setup.
  const body = {
    email_address: email,
    status_if_new: "subscribed",
    tags: diagnosis?.state ? [diagnosis.state] : undefined,
    merge_fields: diagnosis?.state ? { STATE: diagnosis.state } : undefined,
  };

  try {
    const mcResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    });

    const data = await mcResponse.json();

    if (!mcResponse.ok) {
      console.error("Mailchimp error:", data);
      return res.status(mcResponse.status).json({ error: data.detail || "Mailchimp request failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Something went wrong reaching Mailchimp" });
  }
}
