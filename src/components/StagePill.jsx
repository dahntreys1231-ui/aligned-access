import { STAGE_META } from "../content";

export default function StagePill({ stage }) {
  const meta = STAGE_META[stage];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 20,
        marginBottom: 10,
        color: meta.color,
        background: meta.bg,
      }}
    >
      {meta.label}
    </span>
  );
}
