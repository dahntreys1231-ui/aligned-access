export default function ProgressTrack({ total, done }) {
  return (
    <div style={styles.track}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.seg,
            background: i < done ? "var(--clay)" : "var(--border-soft)",
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  track: { display: "flex", gap: 6, marginBottom: "1.75rem" },
  seg: { flex: 1, height: 3, borderRadius: 2, transition: "background 0.3s" },
};
