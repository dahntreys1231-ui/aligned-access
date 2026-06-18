export default function Hero({ onStart }) {
  return (
    <section style={styles.wrap}>
      <div style={styles.inner}>
        <p style={styles.eyebrow}>Aligned Access</p>
        <h1 style={styles.title}>
          What level of access<br />does reality support?
        </h1>
        <p style={styles.sub}>
          A short, honest diagnostic. Think of one relationship \u2014 a friend, a
          partner, a colleague \u2014 and walk through what access you\u2019ve
          granted, what evidence they\u2019ve actually shown, and whether the two
          line up.
        </p>
        <button style={styles.cta} onClick={onStart}>
          Begin the assessment \u2192
        </button>
        <div style={styles.thesis}>
          <ThesisRow text="When access exceeds reality, instability emerges." />
          <ThesisRow text="When access falls below reality, stagnation emerges." />
          <ThesisRow text="When access corresponds with reality, flourishing becomes possible." accent />
        </div>
      </div>
    </section>
  );
}

function ThesisRow({ text, accent }) {
  return (
    <p style={{ ...styles.thesisLine, color: accent ? "var(--sage-deep)" : "var(--ink-faint)" }}>
      {text}
    </p>
  );
}

const styles = {
  wrap: {
    background: "var(--ink)",
    color: "var(--parchment)",
    padding: "5rem 1.5rem 4rem",
  },
  inner: {
    maxWidth: 680,
    margin: "0 auto",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--amber)",
    margin: "0 0 1.25rem",
  },
  title: {
    fontFamily: "var(--serif)",
    fontWeight: 500,
    fontSize: "clamp(2rem, 5vw, 3.1rem)",
    lineHeight: 1.15,
    margin: "0 0 1.25rem",
    letterSpacing: "-0.01em",
  },
  sub: {
    fontSize: 17,
    lineHeight: 1.7,
    color: "rgba(242,237,227,0.78)",
    margin: "0 0 2rem",
    maxWidth: 560,
  },
  cta: {
    background: "var(--clay)",
    color: "#FFF3EE",
    border: "none",
    borderRadius: 8,
    padding: "0.85rem 1.75rem",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  thesis: {
    marginTop: "3rem",
    paddingTop: "2rem",
    borderTop: "0.5px solid rgba(242,237,227,0.18)",
  },
  thesisLine: {
    fontSize: 14,
    lineHeight: 1.8,
    margin: "0 0 4px",
  },
};
