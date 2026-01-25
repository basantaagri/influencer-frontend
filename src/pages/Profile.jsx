import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchInfluencerById } from "../api/influencers";
import { fetchAudit } from "../api/audit";
import { createOrder, getOrders } from "../utils/orders";
import AuditBadge from "../components/AuditBadge";
import TrustBadge from "../components/TrustBadge";
import ConfidenceTooltip from "../components/ConfidenceTooltip";

function Profile() {
  const { id } = useParams();

  const [influencer, setInfluencer] = useState(null);
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordered, setOrdered] = useState(false);

  // -----------------------------
  // Fetch influencer
  // -----------------------------
  useEffect(() => {
    let mounted = true;

    fetchInfluencerById(id)
      .then((data) => {
        if (!mounted) return;
        setInfluencer(data || null);
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  // -----------------------------
  // Fetch audit
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    fetchAudit(id)
      .then((res) => setAudit(res || null))
      .catch(() => {});
  }, [id]);

  // -----------------------------
  // Check if already ordered
  // -----------------------------
  useEffect(() => {
    if (!influencer) return;

    const existing = getOrders().some(
      (o) => o.influencer_id === influencer.id
    );

    setOrdered(existing);
  }, [influencer]);

  function handleRequest() {
    createOrder(influencer);
    setOrdered(true);
  }

  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        Loading profile…
      </div>
    );
  }

  if (!influencer) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        Influencer not found.
      </div>
    );
  }

  // -----------------------------
  // Confidence styling
  // -----------------------------
  const confidenceColor =
    influencer.confidence_tier === "High"
      ? "#2ecc71"
      : influencer.confidence_tier === "Medium"
      ? "#f39c12"
      : influencer.confidence_tier === "Low"
      ? "#e74c3c"
      : "#999";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px" }}>
      {/* ================= HERO ================= */}
      <section style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 600,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          @{influencer.username}

          {audit?.label && (
            <AuditBadge label={audit.label} score={audit.score} />
          )}

          {audit?.label && (
            <TrustBadge
              auditLabel={audit.label}
              engagement={influencer.engagement_rate ?? 0}
            />
          )}
        </h1>

        <p style={{ fontSize: 18, color: "#6e6e73" }}>
          {influencer.platform} • {influencer.niche}
          {influencer.location && ` • ${influencer.location}`}
        </p>

        {/* 🔥 SIGNAL SUMMARY STRIP */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 12,
            background: "#f7f7f7",
            padding: "12px 14px",
            borderRadius: 14,
          }}
        >
          <Pill icon="🛡️" label="Audit" value={audit?.label || "—"} />

          <Pill
            icon="🎯"
            label="Confidence"
            value={influencer.confidence_tier || "—"}
            color={confidenceColor}
          />

          <Pill
            icon="📊"
            label="Score"
            value={
              influencer.final_audit_score != null
                ? influencer.final_audit_score
                : "—"
            }
          />

          <Pill
            icon="⚡"
            label="Engagement"
            value={`${influencer.engagement_rate ?? 0}%`}
          />

          <Pill icon="📺" label="Platform" value={influencer.platform} />
        </div>

        {/* 🔍 WHY THIS CONFIDENCE */}
        {influencer.audit_signals && (
          <div style={{ marginTop: 8 }}>
            <ConfidenceTooltip signals={influencer.audit_signals} />
          </div>
        )}

        {(influencer.last_updated || influencer.metrics_date) && (
          <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
            Data last updated:{" "}
            {new Date(
              influencer.last_updated || influencer.metrics_date
            ).toLocaleDateString()}
          </p>
        )}
      </section>

      {/* ================= AT A GLANCE ================= */}
      <section
        style={{
          background: "#f7f7f7",
          padding: 20,
          borderRadius: 16,
          marginBottom: 50,
        }}
      >
        <strong>At a glance</strong>
        <ul style={{ marginTop: 8, paddingLeft: 18, fontSize: 14 }}>
          <li>🎯 Best for: Brand awareness</li>
          <li>⚠️ Risk level: {audit?.label || "—"}</li>
          <li>
            🎯 Confidence tier:{" "}
            <strong style={{ color: confidenceColor }}>
              {influencer.confidence_tier || "—"}
            </strong>
          </li>
        </ul>
      </section>

      {/* ================= STATS ================= */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
          marginBottom: 50,
        }}
      >
        <Stat label="👥 Followers" value={influencer.followers} />
        <Stat label="👁 Avg Views" value={influencer.avg_views ?? "—"} />

        {/* ENGAGEMENT BAR */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e5ea",
            borderRadius: 20,
            padding: 28,
          }}
        >
          <p style={{ fontSize: 14, color: "#6e6e73" }}>
            📊 Engagement Rate
          </p>

          <div
            style={{
              background: "#e5e5ea",
              height: 10,
              borderRadius: 999,
              overflow: "hidden",
              marginTop: 10,
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

          <p style={{ marginTop: 8, fontSize: 14 }}>
            {influencer.engagement_rate ?? 0}%
          </p>
        </div>

        <Stat
          label="💰 Price per Post"
          value={`₹${influencer.price ?? influencer.price_per_post ?? 0}`}
        />
      </section>

      {/* ================= REQUEST COLLAB ================= */}
      <section style={{ marginBottom: 70 }}>
        <button
          onClick={handleRequest}
          disabled={ordered}
          style={{
            padding: "14px 26px",
            borderRadius: 14,
            border: "none",
            fontSize: 16,
            cursor: ordered ? "not-allowed" : "pointer",
            background: ordered ? "#e5e5ea" : "#1d1d1f",
            color: ordered ? "#888" : "#fff",
          }}
        >
          {ordered ? "Request Sent" : "Request Collaboration"}
        </button>

        {ordered && (
          <div style={{ marginTop: 16 }}>
            <strong>Status:</strong>{" "}
            <span style={{ color: "#f39c12" }}>Pending</span>
          </div>
        )}
      </section>

      {/* ================= AUDIT ================= */}
      {audit?.label && (
        <section
          style={{
            background: "#fafafa",
            borderRadius: 24,
            padding: 40,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>
            Audit Signal Summary
          </h3>

          <p style={{ fontSize: 16, color: "#555" }}>
            Final Audit Score:{" "}
            <strong>{influencer.final_audit_score ?? "—"}</strong>
          </p>

          <p style={{ marginTop: 16, fontSize: 14, color: "#777" }}>
            Audit signals are derived from publicly visible engagement
            and reach patterns only. They are indicators, not verdicts.
          </p>

          {/* DATA COVERAGE */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 12,
              borderTop: "1px solid #ddd",
              fontSize: 13,
            }}
          >
            <strong>Data Coverage</strong>
            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
              <li>✔ Followers</li>
              <li>✔ Engagement Rate</li>
              <li>✔ Reach efficiency</li>
              <li>✖ Audience Demographics</li>
              <li>✖ Private Analytics</li>
            </ul>
            <p style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
              Missing data is not inferred or estimated.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e5ea",
        borderRadius: 20,
        padding: 28,
      }}
    >
      <p style={{ fontSize: 14, color: "#6e6e73" }}>{label}</p>
      <p
        style={{
          fontSize: 26,
          fontWeight: 600,
          marginTop: 8,
          color: "#1d1d1f",
        }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function Pill({ icon, label, value, color }) {
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
        color: color || "#111",
      }}
    >
      <span>{icon}</span>
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}

export default Profile;
