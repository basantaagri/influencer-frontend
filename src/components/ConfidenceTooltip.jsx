import { useState } from "react";

function ConfidenceTooltip({ signals }) {
  const [open, setOpen] = useState(false);

  if (!signals) return null;

  return (
    <span style={{ position: "relative" }}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          fontSize: 12,
          cursor: "pointer",
          color: "#555",
          textDecoration: "underline",
        }}
      >
        Why this confidence?
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 0,
            width: 260,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 12,
            fontSize: 12,
            boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
            zIndex: 10,
          }}
        >
          <strong>Confidence Factors</strong>
          <ul style={{ paddingLeft: 16, marginTop: 8 }}>
            <li>
              Engagement:{" "}
              <strong>{signals.engagement ?? "—"}%</strong>
            </li>
            <li>
              Reach ratio:{" "}
              <strong>
                {signals.reach_ratio != null
                  ? signals.reach_ratio
                  : "—"}
              </strong>
            </li>
            <li>
              Consistency:{" "}
              <strong>{signals.consistency}</strong>
            </li>
          </ul>

          <div
            style={{
              marginTop: 8,
              fontSize: 11,
              color: "#777",
            }}
          >
            Based only on public data. No private analytics used.
          </div>
        </div>
      )}
    </span>
  );
}

export default ConfidenceTooltip;
