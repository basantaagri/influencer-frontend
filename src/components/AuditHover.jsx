import { useState } from "react";

function AuditHover({ score, notes }) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{
        marginTop: 12,
        position: "relative",
        display: "inline-block",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* SCORE LABEL */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          cursor: "help",
        }}
      >
        Audit Score: {score}/100
      </div>

      {/* HOVER BOX */}
      {show && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            background: "#111",
            color: "#fff",
            padding: 12,
            borderRadius: 10,
            width: 260,
            zIndex: 20,
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <strong>Why this score?</strong>

          <ul
            style={{
              paddingLeft: 18,
              marginTop: 6,
              marginBottom: 8,
              fontSize: 13,
            }}
          >
            {Array.isArray(notes) &&
              notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}

            {!notes?.length && (
              <li>
                Based on engagement consistency and
                follower quality.
              </li>
            )}
          </ul>

          <p
            style={{
              fontSize: 12,
              opacity: 0.8,
              margin: 0,
            }}
          >
            Login to view full breakdown
          </p>
        </div>
      )}
    </div>
  );
}

export default AuditHover;
