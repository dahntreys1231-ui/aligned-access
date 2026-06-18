import { useState } from "react";

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function EmailGate({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const valid = isValidEmail(email);

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (valid) onSubmit(email);
  }

  return (
    <form style={{ animation: "fadeIn 0.35s ease" }} onSubmit={handleSubmit}>
      <p style={styles.eyebrow}>Your diagnosis is ready</p>
      <h2 style={styles.title}>Where should we send it?</h2>
      <p style={styles.body}>
        Enter your email to see your full breakdown — your alignment state,
        any distortions at play, and what stewardship looks like from here.
        We’ll also use it to send occasional guidance on aligning access
        with reality.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{
          ...styles.input,
          borderColor: touched && !valid ? "var(--clay)" : "var(--border-soft)",
        }}
        autoFocus
      />
      {touched && !valid && (
        <p style={styles.error}>That doesn’t look like a valid email yet.</p>
      )}
      <button type="submit" style={styles.cta}>
        Show my diagnosis →
      </button>
      <p style={styles.fine}>No spam. Unsubscribe anytime.</p>
    </form>
  );
}

const styles = {
  eyebrow: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--sage-deep)",
    margin: "0 0 8px",
  },
  title: { fontFamily: "var(--serif)", fontSize: 24, fontWeight: 500, margin: "0 0 10px" },
  body: { fontSize: 14.5, color: "var(--ink-faint)", lineHeight: 1.7, margin: "0 0 1.5rem", maxWidth: 480 },
  input: {
    width: "100%",
    maxWidth: 360,
    height: 46,
    borderRadius: 8,
    border: "0.5px solid",
    padding: "0 14px",
    fontSize: 15,
    background: "#fff",
    color: "var(--ink)",
    display: "block",
    marginBottom: 8,
  },
  error: { fontSize: 13, color: "var(--clay-deep)", margin: "0 0 12px" },
  cta: {
    background: "var(--clay)",
    color: "#FFF3EE",
    border: "none",
    borderRadius: 8,
    padding: "0.75rem 1.5rem",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    marginTop: 8,
  },
  fine: { fontSize: 12, color: "var(--ink-faint-2)", marginTop: 10 },
};
