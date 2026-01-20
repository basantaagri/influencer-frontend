import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAudit } from "../api/audit";
import AuditBadge from "./AuditBadge";
import TrustBadge from "./TrustBadge";
import {
  isShortlisted,
  toggleShortlist,
} from "../utils/shortlist";
import { createOrder } from "../utils/orders";

function InfluencerCard({ influencer }) {
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [saved, setSaved] = useState(false);

  // --------------------------------------------------
  // FETCH AUDIT + SHORTLIST STATUS (SAFE)
  // --------------------------------------------------
  useEffect(() => {
    fetchAudit(influencer.id)
      .then(setAudit)
      .catch(() => setAudit(null));

    isShortlisted(influencer.id)
      .then(setSaved)
      .catch(() => setSaved(false));
  }, [influencer.id]);

  // --------------------------------------------------
  // SHORTLIST TOGGLE
  // --------------------------------------------------
  const onToggleSave = async (e) => {
    e.stopPropagation();
    const updated = await toggleShortlist(influencer.id);
    setSaved(updated.includes(influencer.id));
  };

  // --------------------------------------------------
  // CREATE ORDER
  // --------------------------------------------------
  const onRequestCollab = async (e) => {
    e.stopPropagation();
    await createOrder({
      id: influencer.id,
      name: influencer.name,
      price: influencer.price ?? influencer.price_per_post ?? 0,
    });
    alert("Collaboration request sent");
  };

  // --------------------------------------------------
  // DECISION TEXT (RARE FEATURE)
  // --------------------------------------------------
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

  return (
    <div
      className="card-wrapper"
      onClick={() => navigate(`/profile/${influencer.id}`)}
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: "26px 30px",
        marginBottom: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h3 style={{ margin: 0, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {influencer.name}

            {audit && (
              <AuditBadge
                label={audit.label}
                score={audit.score}
              />
            )}

            {audit && (
              <TrustBadge
                auditLabel={audit.label}
                engagement={influencer.engagement_rate ?? 0}
              />
            )}
          </h3>

          <button
            onClick={onToggleSave}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: saved ? "#f5b301" : "#ccc",
            }}
            aria-label="Save influencer"
          >
            ★
          </button>
        </div>

        <p style={{ marginTop: 6, fontSize: 14, color: "#666" }}>
          {influencer.platform} • {influencer.niche}
        </p>

        {/* 🔗 CLICKABLE SOCIAL PROFILE (MANDATORY) */}
        {influencer.profile_url && (
          <a
            href={influencer.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 13,
              color: "#0071e3",
              textDecoration: "none",
            }}
          >
            View Profile →
          </a>
        )}
      </div>

      {/* ================= METRICS ================= */}
      <div
        style={{
          display: "flex",
          gap: 40,
          marginBottom: 14,
        }}
      >
        <Metric
          label="Followers"
          value={
            influencer.followers
              ? influencer.followers.toLocaleString()
              : "—"
          }
          muted
        />

        <Metric
          label="Avg Views"
          value={
            influencer.avg_views
              ? influencer.avg_views.toLocaleString()
              : "—"
          }
        />

        <Metric
          label="Engagement"
          value={`${influencer.engagement_rate ?? 0}%`}
        />
      </div>

      {/* ================= DECISION HINT ================= */}
      {decisionText && (
        <p
          style={{
            fontSize: 13,
            color: decisionColor,
            marginBottom: 10,
          }}
        >
          {decisionText}
        </p>
      )}

      {/* ================= FOOTER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: 20, fontWeight: 600 }}>
          ₹{(influencer.price ?? influencer.price_per_post ?? 0).toLocaleString()}
        </p>

        {audit && (
          <p style={{ fontSize: 12, color: "#666" }}>
            Audit score: {audit.score}/100
          </p>
        )}
      </div>

      {/* ================= ACTION ================= */}
      <button
        onClick={onRequestCollab}
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
        Request Collaboration
      </button>
    </div>
  );
}

// --------------------------------------------------
// METRIC (REUSED, SAFE)
// --------------------------------------------------
function Metric({ label, value, muted }) {
  return (
    <div>
      <p style={{ fontSize: 12, color: "#777" }}>{label}</p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: muted ? "#999" : "#111",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default InfluencerCard;
