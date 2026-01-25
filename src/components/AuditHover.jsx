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
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <strong>Why this score?</strong>

          <ul
            style={{
              paddingLeft: 18,
              marginTop: 6,
              marginBottom: 10,
              fontSize: 13,
            }}
          >
            {Array.isArray(notes) &&
              notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}

            {!notes?.length && (
              <li>
                Based on publicly visible engagement patterns.
              </li>
            )}
          </ul>

          {/* 🔒 DATA COVERAGE (ADDED – SAFE) */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: 8,
              marginTop: 8,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            <strong style={{ fontSize: 12 }}>
              Data Coverage
            </strong>
            <ul
              style={{
                paddingLeft: 16,
                marginTop: 4,
                marginBottom: 6,
              }}
            >
              <li>✔ Followers: Available</li>
              <li>✔ Engagement Rate: Available</li>
              <li>✖ Audience Demographics: Not Available</li>
              <li>✖ Private Analytics: Not Available</li>
            </ul>

            <p
              style={{
                fontSize: 11,
                opacity: 0.7,
                margin: 0,
              }}
            >
              Audit is limited to the data listed above.
              Missing data is not inferred.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditHover;
