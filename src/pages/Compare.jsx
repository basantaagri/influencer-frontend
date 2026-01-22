import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Compare() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // ----------------------------------
  // LOAD COMPARE ITEMS (SAFE)
  // ----------------------------------
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("compare_items") || "[]"
      );
      setItems(Array.isArray(stored) ? stored : []);
    } catch {
      setItems([]);
    }

    // ✅ AUTO-CLEAR WHEN USER LEAVES COMPARE PAGE
    return () => {
      localStorage.removeItem("compare_items");
      window.dispatchEvent(new Event("compare:update"));
    };
  }, []);

  // ----------------------------------
  // GUARD: NEED AT LEAST 2
  // ----------------------------------
  if (items.length < 2) {
    return (
      <div
        style={{
          padding: 40,
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2>Compare Influencers</h2>

        <p style={{ color: "#666", marginTop: 6 }}>
          Compare influencers side-by-side to make faster decisions
        </p>

        <p style={{ marginTop: 20 }}>
          Select at least 2 influencers to compare.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 20,
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Back to Discover
        </button>
      </div>
    );
  }

  // ----------------------------------
  // VALUE FOR MONEY (SAFE CALC)
  // ----------------------------------
  const valueForMoney = (i) => {
    const views = i.avg_views ?? 0;
    const price = i.price ?? 0;
    if (!views || !price) return 0;
    return views / price;
  };

  const bestValue = Math.max(...items.map(valueForMoney));

  // ----------------------------------
  // RENDER
  // ----------------------------------
  return (
    <div
      style={{
        padding: 40,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <h2>Compare Influencers</h2>

      <p style={{ color: "#666", marginTop: 6 }}>
        Compare influencers side-by-side to make faster decisions
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 24,
        }}
      >
        <thead>
          <tr>
            <th
              align="left"
              style={{
                padding: 12,
                borderBottom: "1px solid #ddd",
              }}
            >
              Metric
            </th>

            {items.map((i) => (
              <th
                key={i.id}
                style={{
                  padding: 12,
                  borderBottom: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                @{i.username}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {[
            ["Platform", (i) => i.platform],
            ["Followers", (i) => i.followers?.toLocaleString()],
            ["Engagement %", (i) => `${i.engagement_rate ?? 0}%`],
            ["Avg Views", (i) => i.avg_views?.toLocaleString()],
            [
              "Price",
              (i) =>
                i.price !== undefined
                  ? `₹${i.price.toLocaleString()}`
                  : "—",
            ],
            [
              "Value for Money (Views / ₹)",
              (i) =>
                valueForMoney(i)
                  ? valueForMoney(i).toFixed(2)
                  : "—",
            ],
          ].map(([label, fn]) => (
            <tr key={label}>
              <td
                style={{
                  padding: 12,
                  fontWeight: 600,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {label}
              </td>

              {items.map((i) => {
                const isBest =
                  label === "Value for Money (Views / ₹)" &&
                  valueForMoney(i) === bestValue &&
                  bestValue > 0;

                return (
                  <td
                    key={i.id}
                    style={{
                      padding: 12,
                      borderBottom: "1px solid #f0f0f0",
                      background: isBest ? "#e8fff0" : "transparent",
                      fontWeight: isBest ? 600 : 400,
                    }}
                  >
                    {fn(i) || "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Back to Discover
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("compare_items");
            window.dispatchEvent(new Event("compare:update"));
            navigate("/");
          }}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Clear Compare
        </button>
      </div>
    </div>
  );
}

export default Compare;
