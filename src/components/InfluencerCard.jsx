import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAudit } from "../api/audit";
import { revealInfluencer } from "../api/influencers";
import AuditBadge from "./AuditBadge";
import TrustBadge from "./TrustBadge";

function InfluencerCard({
  influencer,
  selected = false,          // ✅ compare state
  toggleCompare = () => {},  // ✅ compare handler
}) {
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ----------------------------------
  // PREMIUM DETECTION (UI ONLY)
  // ----------------------------------
  const isPremium =
    (influencer.followers ?? 0) >= 100000 ||
    (influencer.engagement_rate ?? 0) >= 5 ||
    (influencer.price ?? 0) >= 50000;

  // ----------------------------------
  // FETCH AUDIT (SAFE)
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

      if (
        res?.status === "revealed" ||
        res?.status === "already_revealed"
      ) {
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
  // PLACEHOLDERS
  // ----------------------------------
  const onToggleSave = (e) => {
    e.stopPropagation();
  };

  const onRequestCollab = (e) => {
    e.stopPropagation();
    alert("Coming soon");
  };

  // ----------------------------------
  // DECISION TEXT
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

  return (
    <div
      className="card-wrapper"
      onClick={() => navigate(`/profile/${influencer.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 8px 28px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow =
          "0 4px 20px rgba(0,0,0,0.06)";
      }}
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
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* ✅ COMPARE CHECKBOX */}
            <input
              type="checkbox"
              checked={selected}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleCompare(influencer)}
              style={{ cursor: "pointer" }}
            />

            {/* AVATAR */}
            <img
              src={influencer.avatar_url}
              alt={influencer.username}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
                filter: revealed ? "none" : "grayscale(100%)",
              }}
            />

            {/* USERNAME + BADGES */}
            <h3
              style={{
                margin: 0,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              @{revealed
                ? influencer.username
                : influencer.username.slice(0, 2) + "***"}

              {isPremium && (
                <span
                  style={{
                    background: "#f5c542",
                    color: "#111",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 999,
                  }}
                >
                  PREMIUM
                </span>
              )}

              {audit && (
                <AuditBadge label={audit.label} score={audit.score} />
              )}

              {audit && (
                <TrustBadge
                  auditLabel={audit.label}
                  engagement={influencer.engagement_rate ?? 0}
                />
              )}
            </h3>
          </div>

          {/* SHORTLIST (DISABLED) */}
          <button
            onClick={onToggleSave}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 22,
              cursor: "not-allowed",
              color: "#ccc",
            }}
            aria-label="Save influencer (coming soon)"
          >
            ★
          </button>
        </div>

        <p style={{ marginTop: 6, fontSize: 14, color: "#666" }}>
          {influencer.platform} • {influencer.niche}
        </p>

        {revealed && influencer.profile_url && (
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
          opacity: revealed ? 1 : 0.4,
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

      {/* ================= DECISION ================= */}
      {revealed && decisionText && (
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
          ₹{(influencer.price ?? 0).toLocaleString()}
        </p>

        {audit && revealed && (
          <p style={{ fontSize: 12, color: "#666" }}>
            Audit score: {audit.score}/100
          </p>
        )}
      </div>

      {/* ================= ACTION ================= */}
      {!revealed ? (
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
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? "Revealing..."
            : isPremium
            ? "🔓 Reveal Premium Details"
            : "🔓 Reveal Details"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${influencer.id}`);
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            View Profile
          </button>

          <button
            onClick={onRequestCollab}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ⭐ Save
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------
// METRIC
// ----------------------------------
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
