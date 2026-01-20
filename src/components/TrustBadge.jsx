function TrustBadge({ auditLabel, engagement }) {
  let label = "Medium Trust";
  let color = "#f1c40f"; // yellow

  if (auditLabel === "Good" && engagement >= 3) {
    label = "High Trust";
    color = "#2ecc71"; // green
  } else if (auditLabel === "High Risk" || engagement < 2) {
    label = "Low Trust";
    color = "#e74c3c"; // red
  }

  return (
    <span
      style={{
        background: color,
        color: "#fff",
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
      title="Trust based on audit and engagement rate"
    >
      {label}
    </span>
  );
}

export default TrustBadge;
