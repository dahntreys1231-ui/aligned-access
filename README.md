# Aligned Access — Three Diagnostics Assessment

A standalone React web app implementing the Aligned Access assessment: a
guided walk through the Three Diagnostics (access granted, evidence
demonstrated, alignment) ending in a diagnosis with distortion flags and
stewardship guidance.

## Run it locally

```
npm install
npm run dev
```

Opens at `http://localhost:5173`. Note: this runs the React app only —
the Mailchimp serverless function (`api/subscribe.js`) won't execute under
plain `vite dev`, since that's a Vercel/Netlify convention, not something
Vite runs itself. The email form will still work locally, it just won't
reach Mailchimp until deployed. To test the Mailchimp connection before
deploying, install the Vercel CLI (`npm i -g vercel`) and run `vercel dev`
instead, which emulates the serverless functions locally.

## Deploy it (get a real URL)

Easiest path — both are free for this scale and take about two minutes:

**Vercel**
1. Go to vercel.com, sign up/in
2. Click "Add New Project" → "Deploy" → drag this whole folder onto the page
   (or push it to a GitHub repo first and import that repo)
3. Vercel auto-detects Vite, no config needed — click Deploy

**Netlify**
1. Go to app.netlify.com
2. Drag the folder (after running `npm run build`, drag the `dist` folder)
   onto the deploy area
3. You get a live URL immediately

Either way you can later attach your own domain (e.g. alignedaccess.com) in
that platform's settings.

## Wiring up Mailchimp (already coded — just needs your credentials)

The email gate now calls a real serverless function at `api/subscribe.js`,
which adds the email to your Mailchimp audience. It also tags each
contact with their alignment state (Aligned / Overextended / Restricted),
so you can later send different follow-ups to each group.

**Why a serverless function and not a direct call from React:** your
Mailchimp API key has to stay secret. If it were called directly from the
browser, anyone could open dev tools, find the key, and use it to access
your whole Mailchimp account. The serverless function is a small piece of
code that runs on Vercel/Netlify's servers, not in the visitor's browser —
the key lives there as an environment variable, never in the code itself
and never sent to the visitor.

### 1. Get your three Mailchimp values

- **API key**: Mailchimp account → profile icon (bottom left) → Profile →
  Extras → API keys → Create A Key. It'll look like
  `abc123def456...-us21`. The `-us21` part at the end is your server
  prefix — you'll need it separately below.
- **Server prefix**: the part after the dash in your API key (e.g. `us21`).
- **List/Audience ID**: Audience → All contacts → Settings → Audience name
  and defaults → "Audience ID" near the bottom.

### 2. (Optional but recommended) Add a merge tag for alignment state

If you want the "Aligned / Overextended / Restricted" tag to work, no
extra setup is needed — tags are created automatically by Mailchimp the
first time they're used. You'll see them appear under Audience → Tags
after your first real submission.

### 3. Set environment variables on your hosting platform

Don't put these in any file in this project — set them in your hosting
dashboard so they're never committed to code or visible to visitors.

**On Vercel:** Project → Settings → Environment Variables → add:
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX`
- `MAILCHIMP_LIST_ID`

**On Netlify:** Site configuration → Environment variables → add the same
three.

Redeploy after adding them (Vercel/Netlify usually prompt you to).

### 4. Test the basic connection

Once deployed with the environment variables set, run through the
assessment on your live URL, submit a real email, then check Mailchimp's
Audience → All contacts — the email should appear within a few seconds,
tagged with the alignment state it received.

If it doesn't show up, check your hosting platform's function logs
(Vercel: Project → Deployments → click a deployment → Functions tab) for
the error message — `api/subscribe.js` logs the specific Mailchimp error
if the request fails.

### 5. Send people their result automatically (optional, recommended)

Right now contacts land in your audience tagged with their state, but
nothing emails them unless you set that up inside Mailchimp itself —
adding someone to a list never auto-sends anything on its own.

The cleanest way to send a real, complete result (not just a one-word
tag) is to write three separate emails — one for each alignment state —
and use the `STATE` merge field (already being sent by `api/subscribe.js`)
to route each contact to the right one. Mailchimp merge fields aren't
well suited to long paragraphs, so this is more reliable than trying to
stuff your full stewardship guidance into a tag.

**Set up the merge field (one time):**
1. Audience → Settings → Audience fields and *|MERGE|* tags → Add A Field
2. Name it "Alignment state", type Text, and make sure the tag it's
   assigned is exactly `STATE` (Mailchimp will show you the tag — if it
   generates something else, like `MERGE6`, that's fine too, just note
   what it is and use that exact name in `api/subscribe.js` instead)

**Build three automations (one per state):**
1. Automations → Create → Custom Journey (or "Classic Automation" →
   "When someone joins my audience" if you're on a simpler plan)
2. Trigger: "Signs up" / "Joins audience"
3. Add a condition/filter step: only continue if `STATE` equals
   `Aligned` (and a second journey for `Overextended`, a third for
   `Restricted`)
4. After the condition, add a "Send email" step and write the actual
   result content for that state — for example, the Aligned email can
   include the description and guidance text from `diagnose.js`'s
   Aligned branch, rewritten as a warm, complete email rather than just
   a tag
5. Turn the automation on

This means three short content-writing tasks inside Mailchimp (one email
per state), not more code — the code side (tagging and sending `STATE`)
is already done.

## Where things live, if you want to edit

- `src/content.js` — all question text, level names/descriptions, scale
  labels. Edit wording here without touching any logic.
- `src/diagnose.js` — the scoring model: how access/reality averages become
  an alignment state, and the rules that flag each distortion. This is the
  part most worth refining once real responses come in (see "Next" below).
- `src/components/Hero.jsx` — the landing section copy and the core thesis
  lines.
- `src/components/EmailGate.jsx` — the email capture screen and copy.
- `src/App.jsx` — wires the whole flow together; `captureEmail()` near the
  top is currently a stub that just logs to console — swap in a real call
  to Mailchimp/ConvertKit/your own backend when ready.

## What's NOT done yet (by design — these were sequenced for later)

1. **Response/assessment data storage** — no database. Mailchimp now
   stores the email and a tag for the alignment state, but the full
   answer set (all 14 question responses) isn't persisted anywhere. If
   you want to start building the dataset described in Phase 4 of your
   strategy, that needs its own backend + database to store full responses
   per user, not just the Mailchimp tag.
2. **Domain/hosting** — this is a deployable app, not yet a live URL. See
   "Deploy it" above. Note: the Mailchimp serverless function only works
   once deployed to Vercel or Netlify (or similar) — it will not work with
   a plain `npm run dev` static export, since it needs the platform's
   serverless runtime.
3. **Scoring model validation** — current thresholds (e.g. a 0.6-point gap
   triggers Overextended/Restricted) are a reasonable first pass, not
   validated against real response distributions. Worth revisiting once you
   have actual data.
