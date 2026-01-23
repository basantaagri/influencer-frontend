import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInfluencers } from "../api/influencers";
import InfluencerCard from "../components/InfluencerCard";
import Filters from "../components/Filters";

// --------------------------------------------------
// NORMALIZATION MAPS
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
// ⭐ RECOMMENDED SCORE (UNCHANGED)
// --------------------------------------------------
function recommendedScore(inf) {
  let score = 10;

  const engagement = inf.engagement_rate ?? 0;
  score += Math.min(engagement * 10, 30);

  const views = inf.avg_views ?? 0;
  if (views > 10000) score += 20;
  else if (views > 5000) score += 12;
  else if (views > 1000) score += 6;

  const price = inf.price ?? 0;
  if (price > 50000) score -= 10;
  else if (price > 25000) score -= 5;

  return score;
}

function Discover() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // CORE DATA
  // --------------------------------------------------
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // --------------------------------------------------
  // FILTER STATES
  // --------------------------------------------------
  const [platform, setPlatform] = useState("All");
  const [niche, setNiche] = useState("All");
  const [engagement, setEngagement] = useState("All");
  const [audit, setAudit] = useState("All");
  const [price, setPrice] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  // --------------------------------------------------
  // COMPARE (PERSISTED)
  // --------------------------------------------------
  const [compareList, setCompareList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("compare_items")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("compare_items", JSON.stringify(compareList));
  }, [compareList]);

  const toggleCompare = (influencer) => {
    setCompareList((prev) => {
      const exists = prev.find((i) => i.id === influencer.id);
      if (exists) return prev.filter((i) => i.id !== influencer.id);
      if (prev.length >= 3) {
        alert("You can compare maximum 3 influencers");
        return prev;
      }
      return [...prev, influencer];
    });
  };

  // --------------------------------------------------
  // FETCH INFLUENCERS (SAFE)
  // --------------------------------------------------
  useEffect(() => {
    setLoading(true);

    fetchInfluencers(page, PER_PAGE)
      .then((data) => {
        setInfluencers(Array.isArray(data) ? data : []);
      })
      .catch(() => setInfluencers([]))
      .finally(() => setLoading(false));
  }, [page]);

  // --------------------------------------------------
  // ✅ NORMALIZE (FIXED — NO NaN)
  // --------------------------------------------------
  const normalized = influencers.map((inf) => ({
    ...inf,
    platform_normalized: PLATFORM_MAP[inf.platform] || inf.platform,
    niche_normalized: NICHE_MAP[inf.niche] || inf.niche,
    engagement_rate: Number.isFinite(inf.engagement_rate)
      ? inf.engagement_rate
      : 0,
    price: inf.price ?? inf.price_per_post ?? 0,
  }));

  // --------------------------------------------------
  // FILTERS
  // --------------------------------------------------
  let filtered = [...normalized];

  if (platform !== "All")
    filtered = filtered.filter((i) => i.platform_normalized === platform);

  if (niche !== "All")
    filtered = filtered.filter((i) => i.niche_normalized === niche);

  if (engagement !== "All")
    filtered = filtered.filter(
      (i) => (i.engagement_rate ?? 0) >= Number(engagement)
    );

  if (price !== "All") {
    filtered = filtered.filter((i) => {
      if (price === "10000") return i.price < 10000;
      if (price === "25000") return i.price >= 10000 && i.price <= 25000;
      if (price === "50000") return i.price > 25000 && i.price <= 50000;
      if (price === "50001") return i.price > 50000;
      return true;
    });
  }

  // --------------------------------------------------
  // SORTING
  // --------------------------------------------------
  if (sortBy === "recommended")
    filtered.sort((a, b) => recommendedScore(b) - recommendedScore(a));

  if (sortBy === "engagement_desc")
    filtered.sort((a, b) => b.engagement_rate - a.engagement_rate);

  if (sortBy === "price_asc")
    filtered.sort((a, b) => a.price - b.price);

  if (sortBy === "followers_desc")
    filtered.sort((a, b) => b.followers - a.followers);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
      <h1>Influencer Discovery</h1>
      <p style={{ fontSize: 18, marginBottom: 32 }}>
        Brand protection + decision intelligence
      </p>

      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "#fafafa",
          marginBottom: 30,
        }}
      >
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
      </div>

      {loading && <p>Loading influencers…</p>}

      {!loading && filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            border: "1px dashed #ddd",
            borderRadius: 12,
            color: "#666",
          }}
        >
          <p style={{ fontSize: 16, marginBottom: 8 }}>
            No influencers match your filters
          </p>
          <p style={{ fontSize: 14 }}>
            Try changing niche, platform, or engagement range
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {filtered.map((inf) => (
            <InfluencerCard
              key={inf.id}
              influencer={inf}
              selected={compareList.some((i) => i.id === inf.id)}
              toggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 30,
        }}
      >
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ← Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={influencers.length < PER_PAGE}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>

      {compareList.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 14,
            display: "flex",
            gap: 14,
            zIndex: 999,
          }}
        >
          <span>{compareList.length} selected</span>
          <button onClick={() => navigate("/compare")}>Compare</button>
        </div>
      )}
    </div>
  );
}

export default Discover;
