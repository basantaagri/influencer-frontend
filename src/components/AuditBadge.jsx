import { useState } from "react";
import AuditHover from "./AuditHover";

function AuditBadge({ label, score, notes }) {
  const [hover, setHover] = useState(false);

  let color = "#999";

  if (label === "Good") color = "#2ecc71";        // green
  if (label === "Medium Risk") color = "#f1c40f"; // yellow
  if (label === "High Risk") color = "#e74c3c";   // red

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        marginLeft: 8,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* BADGE */}
      <span
        style={{
          background: color,
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "6px",
          fontSize: "12px",
          cursor: "help",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      {/* OPTIONAL HOVER (SAFE) */}
      {hover && score != null && (
        <AuditHover score={score} notes={notes} />
      )}
    </span>
  );
}

export default AuditBadge;
