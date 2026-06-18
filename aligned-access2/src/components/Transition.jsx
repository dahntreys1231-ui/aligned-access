import StagePill from "./StagePill";

const COPY = {
  reality: {
    title: "Now, the evidence",
    body:
      "You just mapped the access you\u2019ve granted. Now consider what this person has actually demonstrated \u2014 not what they could become, not who they used to be, but the pattern of evidence itself.",
  },
  align: {
    title: "Two more, then the diagnosis",
    body:
      "Last stretch \u2014 a couple of reflection questions on reciprocity and consistency, then we\u2019ll compare everything you\u2019ve shared.",
  },
};

export default function Transition({ stage, onNext }) {
  const c = COPY[stage];
  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <StagePill stage={stage} />
      <h2 style={styles.title}>{c.title}</h2>
      <p style={styles.body}>{c.body}</p>
      <button style={styles.cta} onClick={onNext}>
        Continue \u2192
      </button>
    </div>
  );
}

const styles = {
  title: { fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, margin: "0 0 10px" },
  body: { fontSize: 14.5, color: "var(--ink-faint)", lineHeight: 1.7, margin: "0 0 1.5rem" },
  cta: {
    background: "var(--ink)",
    color: "var(--parchment)",
    border: "none",
    borderRadius: 8,
    padding: "0.7rem 1.5rem",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
};
