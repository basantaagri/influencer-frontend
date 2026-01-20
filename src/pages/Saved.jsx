import { useEffect, useState } from "react";
import { fetchInfluencers } from "../api/influencers";
import InfluencerCard from "../components/InfluencerCard";
import { getShortlist } from "../utils/shortlist";

function Saved() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD SAVED INFLUENCERS (ASYNC SAFE)
  // --------------------------------------------------
  useEffect(() => {
    Promise.all([fetchInfluencers(), getShortlist()])
      .then(([allInfluencers, savedIds]) => {
        // Safety: shortlist may be empty or invalid
        if (!Array.isArray(savedIds) || savedIds.length === 0) {
          setInfluencers([]);
          setLoading(false);
          return;
        }

        const filtered = allInfluencers.filter((inf) =>
          savedIds.includes(inf.id)
        );

        setInfluencers(filtered);
        setLoading(false);
      })
      .catch(() => {
        setInfluencers([]);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <h1>Saved Influencers</h1>
      <p style={{ fontSize: 18, marginBottom: 40 }}>
        Influencers you’ve shortlisted.
      </p>

      {loading && <p>Loading saved influencers...</p>}

      {!loading && influencers.length === 0 && (
        <p>No influencers saved yet.</p>
      )}

      {!loading &&
        influencers.map((inf) => (
          <InfluencerCard
            key={inf.id}
            influencer={inf}
          />
        ))}
    </div>
  );
}

export default Saved;
