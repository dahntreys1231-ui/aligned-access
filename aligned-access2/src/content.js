export const LEVELS = [
  { name: "Awareness", desc: "\u201cI know of you.\u201d \u2014 access to attention" },
  { name: "Familiarity", desc: "\u201cI\u2019m learning who you are.\u201d \u2014 access to interaction" },
  { name: "Trust", desc: "\u201cI am vulnerable with you.\u201d \u2014 access to vulnerability" },
  { name: "Commitment", desc: "\u201cI invest in you.\u201d \u2014 access to intentional investment" },
  { name: "Partnership", desc: "\u201cI build with you.\u201d \u2014 access to shared creation" },
  { name: "Legacy", desc: "\u201cI share my future with you.\u201d \u2014 access to future influence" },
];

export const SCALE_LABELS = ["Not at all", "Slightly", "Somewhat", "Mostly", "Fully"];

export const ACCESS_QUESTIONS = LEVELS.map((l, i) => ({
  key: `acc${i}`,
  stage: "access",
  label: l.name,
  text: `How much access have you actually granted at the level of ${l.name.toLowerCase()}?`,
  hint: l.desc,
}));

export const REALITY_QUESTIONS = LEVELS.map((l, i) => ({
  key: `rea${i}`,
  stage: "reality",
  label: l.name,
  text: `How much evidence has this person actually demonstrated to earn ${l.name.toLowerCase()}?`,
  hint: "Evidence \u2014 not potential, not history, not how you feel about them.",
}));

export const REFLECTION_QUESTIONS = [
  {
    key: "recip",
    stage: "align",
    text: "This relationship feels mutual \u2014 contribution flows both ways.",
  },
  {
    key: "consist",
    stage: "align",
    text: "Their behavior has been consistent over time, not just promising.",
  },
];

export const STAGE_META = {
  access: { label: "Diagnostic 1 \u00b7 access", color: "var(--sage-deep)", bg: "rgba(124,144,130,0.16)" },
  reality: { label: "Diagnostic 2 \u00b7 reality", color: "var(--amber-deep)", bg: "rgba(201,163,87,0.18)" },
  align: { label: "Diagnostic 3 \u00b7 alignment", color: "var(--clay-deep)", bg: "rgba(184,101,74,0.14)" },
};
