export default function Results({ diagnosis, onRestart }) {
  const { state, stateColor, stateDesc, distortions, stewardAction, stewardDesc, levelBreakdown } = diagnosis;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <p style={styles.eyebrow}>Your diagnosis</p>
      <h1 style={{ ...styles.state, color: stateColor }}>{state}</h1>
      <p style={styles.stateDesc}>{stateDesc}</p>

      <div style={styles.chartCard}>
        <p style={styles.chartTitle}>Access granted vs. evidence demonstrated</p>
        {levelBreakdown.map((row) => (
          <div key={row.name} style={{ marginBottom: 10 }}>
            <p style={styles.rowLabel}>{row.name}</p>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${(row.access / 4) * 100}%` }} />
              <div style={{ ...styles.tick, left: `${(row.reality / 4) * 100}%` }} />
            </div>
          </div>
        ))}
        <div style={styles.legend}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendSwatch, background: "var(--ink)" }} />
            Access granted
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendTick }} />
            Evidence demonstrated
          </span>
        </div>
      </div>

      {distortions.length > 0 ? (
        <>
          <p style={styles.sectionLabel}>Possible distortions at play</p>
          {distortions.map((d) => (
            <div key={d.name} style={styles.distortion}>
              <p style={styles.distortionName}>{d.name}</p>
              <p style={styles.distortionDesc}>{d.desc}</p>
            </div>
          ))}
        </>
      ) : (
        <p style={styles.noDistortion}>No strong distortion signal detected in your answers.</p>
      )}

      <div style={styles.steward}>
        <p style={styles.stewardLabel}>Steward accordingly</p>
        <p style={styles.stewardAction}>{stewardAction}</p>
        <p style={styles.stewardDesc}>{stewardDesc}</p>
      </div>

      <div style={styles.ctaCard}>
        <p style={styles.ctaTitle}>Want a second perspective?</p>
        <p style={styles.ctaBody}>
          People often struggle to evaluate situations objectively when
          they’re emotionally involved. Coaching brings outside
          perspective and accountability to a decision like this one.
        </p>
        <a href="#" style={styles.ctaBtn}>Explore coaching →</a>
      </div>

      <button style={styles.restart} onClick={onRestart}>
        Start over with a different relationship →
      </button>
    </div>
  );
}

const styles = {
  eyebrow: {
    fontSize: 12,
    color: "var(--ink-faint-2)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    fontWeight: 500,
    margin: "0 0 8px",
  },
  state: { fontFamily: "var(--serif)", fontSize: 30, fontWeight: 500, margin: "0 0 4px" },
  stateDesc: { fontSize: 15, lineHeight: 1.7, color: "var(--ink-faint)", margin: "0 0 1.5rem", maxWidth: 540 },
  chartCard: { background: "var(--parchment-dim)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" },
  chartTitle: { fontSize: 13, fontWeight: 500, margin: "0 0 14px" },
  rowLabel: { fontSize: 12, color: "var(--ink-faint-2)", margin: "0 0 3px" },
  barTrack: { position: "relative", height: 8, background: "var(--border-soft)", borderRadius: 4 },
  barFill: { position: "absolute", left: 0, top: 0, height: 8, background: "var(--ink)", borderRadius: 4 },
  tick: { position: "absolute", top: -3, width: 2, height: 14, background: "var(--clay)" },
  legend: { display: "flex", gap: 16, marginTop: 10, fontSize: 11, color: "var(--ink-faint-2)" },
  legendItem: { display: "flex", alignItems: "center", gap: 4 },
  legendSwatch: { display: "inline-block", width: 10, height: 8, borderRadius: 2 },
  legendTick: { display: "inline-block", width: 2, height: 10, background: "var(--clay)" },
  sectionLabel: { fontSize: 13, fontWeight: 500, margin: "0 0 10px" },
  distortion: { borderLeft: "2px solid var(--amber)", padding: "2px 0 2px 12px", marginBottom: 12 },
  distortionName: { fontSize: 14, fontWeight: 500, margin: "0 0 2px" },
  distortionDesc: { fontSize: 13, color: "var(--ink-faint)", margin: 0, lineHeight: 1.6 },
  noDistortion: { fontSize: 13, color: "var(--ink-faint)", margin: "0 0 1.25rem" },
  steward: { borderTop: "0.5px solid var(--border-soft)", paddingTop: "1.25rem", marginTop: "0.5rem" },
  stewardLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--ink-faint-2)", fontWeight: 500, margin: "0 0 6px" },
  stewardAction: { fontSize: 16, fontWeight: 500, margin: "0 0 4px" },
  stewardDesc: { fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.6, margin: 0 },
  ctaCard: { background: "var(--ink)", color: "var(--parchment)", borderRadius: 12, padding: "1.5rem", marginTop: "2rem" },
  ctaTitle: { fontFamily: "var(--serif)", fontSize: 18, fontWeight: 500, margin: "0 0 8px" },
  ctaBody: { fontSize: 14, lineHeight: 1.7, color: "rgba(242,237,227,0.78)", margin: "0 0 1.1rem", maxWidth: 460 },
  ctaBtn: { display: "inline-block", background: "var(--clay)", color: "#FFF3EE", borderRadius: 8, padding: "0.65rem 1.3rem", fontSize: 14, fontWeight: 500, textDecoration: "none" },
  restart: {
    display: "block",
    marginTop: "1.5rem",
    background: "none",
    border: "0.5px solid var(--border-soft)",
    borderRadius: 8,
    padding: "0.7rem 1.2rem",
    fontSize: 13.5,
    color: "var(--ink-faint)",
    cursor: "pointer",
  },
};
