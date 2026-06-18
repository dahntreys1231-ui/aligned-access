export const LEVELS = [
  { name: "Awareness", desc: "“I know of you.” — access to attention" },
  { name: "Familiarity", desc: "“I’m learning who you are.” — access to interaction" },
  { name: "Trust", desc: "“I am vulnerable with you.” — access to vulnerability" },
  { name: "Commitment", desc: "“I invest in you.” — access to intentional investment" },
  { name: "Partnership", desc: "“I build with you.” — access to shared creation" },
  { name: "Legacy", desc: "“I share my future with you.” — access to future influence" },
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
  hint: "Evidence — not potential, not history, not how you feel about them.",
}));

export const REFLECTION_QUESTIONS = [
  {
    key: "recip",
    stage: "align",
    text: "This relationship feels mutual — contribution flows both ways.",
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
