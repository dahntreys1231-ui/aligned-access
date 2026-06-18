import { LEVELS, ACCESS_QUESTIONS, REALITY_QUESTIONS } from "./content";

function average(answers, keys) {
  const sum = keys.reduce((s, k) => s + answers[k], 0);
  return sum / keys.length;
}

// Pure function: takes the full answers map, returns a diagnosis object.
// Kept separate from components so the scoring model can be refined
// independently as real response data comes in.
export function diagnose(answers) {
  const accKeys = ACCESS_QUESTIONS.map((q) => q.key);
  const reaKeys = REALITY_QUESTIONS.map((q) => q.key);

  const accessAvg = average(answers, accKeys);
  const realityAvg = average(answers, reaKeys);
  const gap = accessAvg - realityAvg;

  const recip = answers.recip;
  const consist = answers.consist;

  let state, stateDesc, stateColor;
  if (Math.abs(gap) < 0.6) {
    state = "Aligned";
    stateColor = "var(--sage-deep)";
    stateDesc =
      "The access you’ve granted roughly matches the evidence this person has demonstrated. This is what corresponding alignment looks like.";
  } else if (gap >= 0.6) {
    state = "Overextended";
    stateColor = "var(--clay-deep)";
    stateDesc =
      "You’ve granted more access than the current evidence supports. This is where instability tends to emerge — not because the person is bad, but because access has outpaced reality.";
  } else {
    state = "Restricted";
    stateColor = "var(--amber-deep)";
    stateDesc =
      "The evidence this person has demonstrated exceeds the access you’ve granted them. This can be wise caution — or it can be stagnation if the evidence has been consistently ignored.";
  }

  const distortions = [];
  if (gap >= 0.6 && recip <= 1) {
    distortions.push({
      name: "Potential distortion",
      desc: "Access may be based on who they could become, rather than who they’ve shown themselves to be so far.",
    });
  }
  if (gap >= 0.6 && consist <= 1) {
    distortions.push({
      name: "Reality distortion",
      desc: "There may be observable, inconsistent patterns that are being minimized or explained away.",
    });
  }
  if (recip <= 1 && gap >= 0) {
    distortions.push({
      name: "Reciprocity distortion",
      desc: "Investment in this relationship may be flowing mostly in one direction.",
    });
  }
  if (gap < -0.4 && consist >= 3) {
    distortions.push({
      name: "Historical distortion (in reverse)",
      desc: "Consistent, demonstrated change may not yet be reflected in the access you’re willing to grant — worth checking if restoration is overdue.",
    });
  }

  let stewardAction, stewardDesc;
  if (state === "Overextended") {
    stewardAction = "Reduce or pause expansion";
    stewardDesc =
      "Consider scaling access back to match current evidence, while leaving room for it to be restored as reality changes.";
  } else if (state === "Restricted") {
    stewardAction = "Consider expanding";
    stewardDesc =
      "If the evidence is real and sustained, restricting access further than reality supports can create stagnation rather than protection.";
  } else {
    stewardAction = "Maintain";
    stewardDesc =
      "Keep observing. Alignment today doesn’t mean alignment forever — reality will keep evolving, and so should the access that corresponds to it.";
  }

  const levelBreakdown = LEVELS.map((l, i) => ({
    name: l.name,
    access: answers[`acc${i}`],
    reality: answers[`rea${i}`],
  }));

  return {
    accessAvg,
    realityAvg,
    gap,
    state,
    stateColor,
    stateDesc,
    distortions,
    stewardAction,
    stewardDesc,
    levelBreakdown,
  };
}
