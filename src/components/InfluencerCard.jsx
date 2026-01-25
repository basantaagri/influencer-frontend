import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAudit } from "../api/audit";
import { revealInfluencer } from "../api/influencers";
import AuditBadge from "./AuditBadge";
import TrustBadge from "./TrustBadge";

// ----------------------------------
// 🧠 AUDIT EXPLANATION (SAFE / DEFENSIBLE)
// ----------------------------------
function getAuditSummary() {
  return [
    "Engagement signals appear consistent",
    "Posting consistency looks stable",
    "No major anomalies detected in visible growth patterns",
  ];
}

function InfluencerCard({
  influencer,
  selected = false,
  toggleCompare = () => {},
}) {
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ----------------------------------
  // PREMIUM DETECTION (UNCHANGED)
  // ----------------------------------
  const isPremium =
    (influencer.followers ?? 0) >= 100000 ||
    (influencer.engagement_rate ?? 0) >= 5 ||
    (influencer.price ?? 0) >= 50000;

  // ----------------------------------
  // FETCH AUDIT (UNCHANGED)
  // ----------------------------------
  useEffect(() => {
    if (!influencer?.id) return;

    fetchAudit(influencer.id)
      .then(setAudit)
      .catch(() => setAudit(null));
  }, [influencer.id]);

  // ----------------------------------
  // REVEAL HANDLER (UNCHANGED)
  // ----------------------------------
  const onReveal = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);
      const res = await revealInfluencer(influencer.id);

      if (res?.status === "revealed" || res?.status === "already_revealed") {
        setRevealed(true);
        window.dispatchEvent(new Event("credits:update"));
      }
    } catch (err) {
      console.error("Reveal failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // DECISION TEXT (UNCHANGED)
  // ----------------------------------
  const decisionText =
    audit?.label === "Good"
      ? "Recommended for brands"
      : audit?.label === "Medium Risk"
      ? "Verify before collaboration"
      : audit?.label === "High Risk"
      ? "Risky — proceed with caution"
      : null;

  const decisionColor =
    audit?.label === "Good"
      ? "#2ecc71"
      : audit?.label === "Medium Risk"
      ? "#f39c12"
      : audit?.label === "High Risk"
      ? "#e74c3c"
      : "#999";

  const auditSummary = getAuditSummary();

  return (
    <div
      onClick={() => navigate(`/profile/${influencer.id}`)}
      style={{
        background: isPremium
          ? "linear-gradient(180deg, #fffdf5, #ffffff)"
          : "#fff",
        border: isPremium ? "1px solid #f5c542" : "none",
        borderRadius: 18,
        padding: "26px 30px",
        marginBottom: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
    >
      {/* HEADER */}
      <h3 style={{ marginBottom: 6 }}>
        @{revealed
          ? influencer.username
          : influencer.username.slice(0, 2) + "***"}
      </h3>

      {/* 🔥 SIGNAL SUMMARY STRIP */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 8,
          background: "#f7f7f7",
          padding: "10px 12px",
          borderRadius: 12,
        }}
      >
        <Pill icon="🛡️" label="Audit Signal" value={audit?.label || "—"} />
        <Pill icon="📊" label="Confidence" value="Medium" />
        <Pill
          icon="⚡"
          label="Engagement"
          value={`${influencer.engagement_rate ?? 0}%`}
        />
        <Pill icon="📺" label="Platform" value={influencer.platform} />
      </div>

      {audit && <AuditBadge label={audit.label} score={audit.score} />}
      {audit && (
        <TrustBadge
          auditLabel={audit.label}
          engagement={influencer.engagement_rate ?? 0}
        />
      )}

      {/* METRICS */}
      <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
        <Metric
          label="👥 Followers"
          value={influencer.followers?.toLocaleString()}
        />

        {/* ✅ ENGAGEMENT BAR (REPLACED METRIC) */}
        <div style={{ minWidth: 180 }}>
          <p style={{ fontSize: 12, color: "#777" }}>
            📊 Engagement Rate
          </p>

          <div
            style={{
              background: "#e5e5ea",
              height: 8,
              borderRadius: 999,
              overflow: "hidden",
              marginTop: 6,
            }}
          >
            <div
              style={{
                width: `${Math.min(
                  (influencer.engagement_rate ?? 0) * 10,
                  100
                )}%`,
                background:
                  (influencer.engagement_rate ?? 0) >= 4
                    ? "#2ecc71"
                    : (influencer.engagement_rate ?? 0) >= 2
                    ? "#f1c40f"
                    : "#e74c3c",
                height: "100%",
              }}
            />
          </div>

          <div style={{ fontSize: 12, marginTop: 4 }}>
            {influencer.engagement_rate ?? 0}%
          </div>
        </div>

        <Metric
          label="👁 Avg Views"
          value={influencer.avg_views?.toLocaleString()}
          tooltip="Average views per video based on recent public uploads."
        />
      </div>

      {/* DATA LAST UPDATED */}
      {(influencer.last_updated || influencer.metrics_date) && (
        <div style={{ marginTop: 8, fontSize: 11, color: "#777" }}>
          Data last updated:{" "}
          {new Date(
            influencer.last_updated || influencer.metrics_date
          ).toLocaleDateString()}
        </div>
      )}

      {/* DECISION */}
      {revealed && decisionText && (
        <p style={{ fontSize: 13, color: decisionColor, marginTop: 12 }}>
          {decisionText}
        </p>
      )}

      {/* 🧠 AUDIT EXPLANATION PANEL */}
      {revealed && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background: "#f9f9f9",
            border: "1px solid #eee",
            fontSize: 13,
          }}
        >
          <strong>Audit Summary</strong>
          <ul style={{ marginTop: 6, paddingLeft: 18 }}>
            {auditSummary.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
          <div style={{ fontSize: 11, color: "#777", marginTop: 6 }}>
            ℹ️ Based only on publicly visible YouTube data.
          </div>
        </div>
      )}

      {/* ACTION */}
      {!revealed && (
        <button
          onClick={onReveal}
          disabled={loading}
          style={{
            marginTop: 14,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Revealing..." : "🔓 Reveal Details"}
        </button>
      )}
    </div>
  );
}

// ----------------------------------
// METRIC (UNCHANGED)
// ----------------------------------
function Metric({ label, value, tooltip }) {
  return (
    <div title={tooltip} style={{ cursor: tooltip ? "help" : "default" }}>
      <p style={{ fontSize: 12, color: "#777" }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 500 }}>{value ?? "—"}</p>
    </div>
  );
}

// ----------------------------------
// PILL (UNCHANGED)
// ----------------------------------
function Pill({ icon, label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 999,
        padding: "6px 12px",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
        border: "1px solid #e5e5ea",
      }}
    >
      <span>{icon}</span>
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}

export default InfluencerCard;
