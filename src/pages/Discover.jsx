import { useEffect, useState } from "react";
import { fetchInfluencers } from "../api/influencers";
import InfluencerCard from "../components/InfluencerCard";
import Filters from "../components/Filters";

// --------------------------------------------------
// NORMALIZATION MAPS (SAFE, FRONTEND ONLY)
// --------------------------------------------------
const NICHE_MAP = {
  Tech: "Technology",
  Technology: "Technology",
  Fitness: "Fitness",
  Finance: "Finance",
  Travel: "Travel",
  Beauty: "Beauty",
  Gaming: "Gaming",
  Education: "Education",
};

const PLATFORM_MAP = {
  Instagram: "Instagram",
  YouTube: "YouTube",
  TikTok: "TikTok",
};

// --------------------------------------------------
// ⭐ RECOMMENDED SCORE (AUDIT DISABLED — SAFE MODE)
// --------------------------------------------------
function recommendedScore(inf) {
  let score = 0;

  // Neutral audit weight (audit temporarily disabled)
  score += 10;

  // Engagement rate (0–30)
  const engagement = inf.engagement_rate ?? 0;
  score += Math.min(engagement * 10, 30);

  // Avg views sanity (0–20)
  const views = inf.avg_views ?? 0;
  if (views > 10000) score += 20;
  else if (views > 5000) score += 12;
  else if (views > 1000) score += 6;

  // Price penalty (0 to -10)
  const price = inf.price ?? 0;
  if (price > 50000) score -= 10;
  else if (price > 25000) score -= 5;

  return score;
}

function Discover() {
  // --------------------------------------------------
  // CORE DATA
  // --------------------------------------------------
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // FILTER STATES
  // --------------------------------------------------
  const [platform, setPlatform] = useState("All");
  const [niche, setNiche] = useState("All");
  const [engagement, setEngagement] = useState("All");
  const [audit, setAudit] = useState("All"); // kept for UI compatibility
  const [price, setPrice] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  // --------------------------------------------------
  // FETCH INFLUENCERS
  // --------------------------------------------------
  useEffect(() => {
    fetchInfluencers()
      .then((data) => {
        setInfluencers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // --------------------------------------------------
  // NORMALIZE DATA
  // --------------------------------------------------
  const normalized = influencers.map((inf) => ({
    ...inf,
    platform_normalized:
      PLATFORM_MAP[inf.platform] || inf.platform,
    niche_normalized:
      NICHE_MAP[inf.niche] || inf.niche,
    engagement_rate:
      inf.engagement_rate ??
      Math.round((inf.audit_score ?? 0) / 20),
    price:
      inf.price ??
      inf.price_per_post ??
      0,
  }));

  // --------------------------------------------------
  // APPLY FILTERS
  // --------------------------------------------------
  let filtered = [...normalized];

  // Platform
  if (platform !== "All") {
    filtered = filtered.filter(
      (i) => i.platform_normalized === platform
    );
  }

  // Niche
  if (niche !== "All") {
    filtered = filtered.filter(
      (i) => i.niche_normalized === niche
    );
  }

  // Engagement
  if (engagement !== "All") {
    filtered = filtered.filter(
      (i) =>
        (i.engagement_rate ?? 0) >= Number(engagement)
    );
  }

  // Price
  if (price !== "All") {
    filtered = filtered.filter((i) => {
      if (price === "10000") return i.price < 10000;
      if (price === "25000")
        return i.price >= 10000 && i.price <= 25000;
      if (price === "50000")
        return i.price > 25000 && i.price <= 50000;
      if (price === "50001") return i.price > 50000;
      return true;
    });
  }

  // --------------------------------------------------
  // SORTING
  // --------------------------------------------------
  if (sortBy === "recommended") {
    filtered.sort(
      (a, b) =>
        recommendedScore(b) - recommendedScore(a)
    );
  }

  if (sortBy === "engagement_desc") {
    filtered.sort(
      (a, b) =>
        (b.engagement_rate ?? 0) -
        (a.engagement_rate ?? 0)
    );
  }

  if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "followers_desc") {
    filtered.sort(
      (a, b) =>
        (b.followers ?? 0) - (a.followers ?? 0)
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <h1>Influencer Discovery</h1>
      <p style={{ fontSize: 18, marginBottom: 32 }}>
        Brand protection + decision intelligence
      </p>

      <Filters
        platform={platform}
        setPlatform={setPlatform}
        niche={niche}
        setNiche={setNiche}
        engagement={engagement}
        setEngagement={setEngagement}
        audit={audit}
        setAudit={setAudit}
        price={price}
        setPrice={setPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading && <p>Loading influencers…</p>}
      {!loading && filtered.length === 0 && (
        <p>No influencers found.</p>
      )}

      {!loading &&
        filtered.map((inf) => (
          <InfluencerCard
            key={inf.id}
            influencer={inf}
          />
        ))}
    </div>
  );
}

export default Discover;
