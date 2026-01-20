function Filters({
  platform,
  setPlatform,
  niche,
  setNiche,
  engagement,
  setEngagement,
  audit,
  setAudit,
  price,
  setPrice,
  sortBy,
  setSortBy,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 40,
      }}
    >
      {/* PLATFORM */}
      <Select value={platform} onChange={setPlatform} label="Platform">
        <option value="All">All</option>
        <option value="Instagram">Instagram</option>
        <option value="YouTube">YouTube</option>
        <option value="TikTok">TikTok</option>
      </Select>

      {/* NICHE */}
      <Select value={niche} onChange={setNiche} label="Niche">
        <option value="All">All</option>
        <option value="Technology">Technology</option>
        <option value="Finance">Finance</option>
        <option value="Fitness">Fitness</option>
        <option value="Travel">Travel</option>
        <option value="Beauty">Beauty</option>
        <option value="Gaming">Gaming</option>
        <option value="Education">Education</option>
      </Select>

      {/* ENGAGEMENT (CRITICAL) */}
      <Select
        value={engagement}
        onChange={setEngagement}
        label="Engagement ≥"
        hint="Filters fake followers"
      >
        <option value="All">All</option>
        <option value="1">1%</option>
        <option value="2">2%</option>
        <option value="3">3%</option>
        <option value="5">5%</option>
      </Select>

      {/* AUDIT */}
      <Select
        value={audit}
        onChange={setAudit}
        label="Audit"
        hint="Risk protection"
      >
        <option value="All">All</option>
        <option value="Good">Good only</option>
        <option value="Exclude High Risk">Exclude High Risk</option>
        <option value="High Risk">High Risk only</option>
      </Select>

      {/* PRICE */}
      <Select value={price} onChange={setPrice} label="Price">
        <option value="All">All</option>
        <option value="10000">Under ₹10k</option>
        <option value="25000">₹10k–25k</option>
        <option value="50000">₹25k–50k</option>
        <option value="50001">₹50k+</option>
      </Select>

      {/* SORT */}
      <Select value={sortBy} onChange={setSortBy} label="Sort">
        <option value="recommended">Recommended</option>
        <option value="engagement_desc">Engagement ↓</option>
        <option value="price_asc">Price ↑</option>
        <option value="followers_desc">Followers ↓</option>
      </Select>
    </div>
  );
}

function Select({ label, hint, value, onChange, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#555" }}>
        {label}
        {hint && (
          <span
            title={hint}
            style={{ marginLeft: 6, color: "#999", cursor: "help" }}
          >
            ⓘ
          </span>
        )}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "block",
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          fontSize: 14,
          marginTop: 4,
        }}
      >
        {children}
      </select>
    </div>
  );
}

export default Filters;
