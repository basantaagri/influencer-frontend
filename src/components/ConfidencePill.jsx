function ConfidencePill({ tier }) {
  if (!tier) return null;

  const map = {
    High: { color: "#2ecc71", bg: "#eafaf1", icon: "🟢" },
    Medium: { color: "#f39c12", bg: "#fff6e5", icon: "🟡" },
    Low: { color: "#e74c3c", bg: "#fdecea", icon: "🔴" },
    Unknown: { color: "#999", bg: "#f4f4f4", icon: "⚪" },
  };

  const c = map[tier] || map.Unknown;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.color}22`,
      }}
    >
      <span>{c.icon}</span>
      Confidence: {tier}
    </span>
  );
}

export default ConfidencePill;
