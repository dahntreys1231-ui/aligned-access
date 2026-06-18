import StagePill from "./StagePill";
import { SCALE_LABELS } from "../content";

export default function Question({ question, value, onAnswer, onBack, onNext, canBack }) {
  return (
    <div style={styles.wrap}>
      <StagePill stage={question.stage} />
      {question.label && <p style={styles.label}>{question.label}</p>}
      <p style={styles.text}>{question.text}</p>
      {question.hint && <p style={styles.hint}>{question.hint}</p>}

      <div style={styles.scale}>
        {SCALE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            style={{
              ...styles.dot,
              background: value === i ? "var(--clay)" : "var(--parchment)",
              borderColor: value === i ? "var(--clay)" : "var(--border-soft)",
              color: value === i ? "#FFF3EE" : "var(--ink-faint)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={onBack} disabled={!canBack}>
          ← Back
        </button>
        <button
          style={{ ...styles.navBtn, ...styles.primary, opacity: value === undefined ? 0.4 : 1 }}
          onClick={onNext}
          disabled={value === undefined}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { animation: "fadeIn 0.3s ease" },
  label: { fontSize: 12, color: "var(--ink-faint-2)", margin: "0 0 4px", fontWeight: 500 },
  text: { fontSize: 18, lineHeight: 1.5, margin: "0 0 6px" },
  hint: { fontSize: 13, color: "var(--ink-faint-2)", margin: "0 0 4px" },
  scale: { display: "flex", justifyContent: "space-between", gap: 6, marginTop: 18, flexWrap: "wrap" },
  dot: {
    flex: "1 1 80px",
    height: 42,
    borderRadius: 8,
    border: "0.5px solid",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  nav: { display: "flex", justifyContent: "space-between", marginTop: "1.75rem" },
  navBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "0.5px solid var(--border-soft)",
    background: "var(--parchment)",
    color: "var(--ink)",
    fontSize: 14,
    cursor: "pointer",
  },
  primary: { background: "var(--ink)", color: "var(--parchment)", borderColor: "var(--ink)" },
};
