import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchInfluencerById } from "../api/influencers";
import { fetchAudit } from "../api/audit";
import { createOrder, getOrders } from "../utils/orders";
import AuditBadge from "../components/AuditBadge";
import TrustBadge from "../components/TrustBadge";

function Profile() {
  const { id } = useParams();

  const [influencer, setInfluencer] = useState(null);
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordered, setOrdered] = useState(false);

  // -----------------------------
  // Fetch influencer (by ID)
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

  // -----------------------------
  // Request collaboration
  // -----------------------------
  function handleRequest() {
    createOrder(influencer);
    setOrdered(true);
  }

  // -----------------------------
  // Loading / Error states
  // -----------------------------
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

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      {/* ================= HERO ================= */}
      <section style={{ marginBottom: 60 }}>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 600,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {influencer.name}

          {audit?.label && (
            <AuditBadge
              label={audit.label}
              score={audit.score}
            />
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
      </section>

      {/* ================= STATS ================= */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
          marginBottom: 50,
        }}
      >
        <Stat label="Followers" value={influencer.followers} />
        <Stat label="Avg Views" value={influencer.avg_views ?? "—"} />
        <Stat
          label="Engagement Rate"
          value={`${influencer.engagement_rate ?? 0}%`}
        />
        <Stat
          label="Price per Post"
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
            <span style={{ color: "#f39c12" }}>
              Pending
            </span>
          </div>
        )}
      </section>

      {/* ================= AUDIT ================= */}
      {audit?.score != null && (
        <section
          style={{
            background: "#f5f5f7",
            borderRadius: 24,
            padding: 40,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>
            Audit Summary
          </h3>

          <p style={{ fontSize: 16, color: "#555" }}>
            Audit Label:{" "}
            <strong>{audit.label ?? "—"}</strong>
          </p>

          <p style={{ fontSize: 16, color: "#555" }}>
            Audit Score:{" "}
            <strong>{audit.score}/100</strong>
          </p>

          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              color: "#777",
            }}
          >
            Audit and trust scores are calculated using
            engagement patterns and quality signals.
            Always review before collaboration.
          </p>
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
      <p style={{ fontSize: 14, color: "#6e6e73" }}>
        {label}
      </p>
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

export default Profile;
