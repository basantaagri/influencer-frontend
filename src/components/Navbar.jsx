import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCredits } from "../api/credits";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [credits, setCredits] = useState(null);
  const [compareCount, setCompareCount] = useState(0);

  // ----------------------------------
  // SCROLL TO TOP ON DISCOVER
  // ----------------------------------
  const handleDiscoverClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ----------------------------------
  // FETCH CREDITS (JWT PROTECTED)
  // ----------------------------------
  useEffect(() => {
    fetchCredits()
      .then((res) => setCredits(res.credits))
      .catch(() => setCredits(null));
  }, []);

  // ----------------------------------
  // LISTEN FOR CREDIT UPDATES
  // ----------------------------------
  useEffect(() => {
    const refreshCredits = () => {
      fetchCredits()
        .then((res) => setCredits(res.credits))
        .catch(() => setCredits(null));
    };

    window.addEventListener("credits:update", refreshCredits);
    return () =>
      window.removeEventListener("credits:update", refreshCredits);
  }, []);

  // ----------------------------------
  // LOAD + LISTEN COMPARE COUNT (SAFE)
  // ----------------------------------
  useEffect(() => {
    const loadCompareCount = () => {
      try {
        const items = JSON.parse(
          localStorage.getItem("compare_items") || "[]"
        );
        setCompareCount(Array.isArray(items) ? items.length : 0);
      } catch {
        setCompareCount(0);
      }
    };

    loadCompareCount();

    window.addEventListener("storage", loadCompareCount);
    window.addEventListener("compare:update", loadCompareCount);

    return () => {
      window.removeEventListener("storage", loadCompareCount);
      window.removeEventListener("compare:update", loadCompareCount);
    };
  }, []);

  return (
    <nav
      style={{
        padding: "14px 28px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {/* LOGO */}
        <Link
          to="/"
          onClick={handleDiscoverClick}
          style={{
            fontWeight: 600,
            textDecoration: "none",
            color: "#111",
            fontSize: 18,
          }}
        >
          Book Influencer
        </Link>

        {/* DISCOVER */}
        <Link to="/" onClick={handleDiscoverClick} style={linkStyle}>
          Discover
        </Link>

        {/* SAVED */}
        <Link to="/saved" style={linkStyle}>
          Saved
        </Link>

        {/* ORDERS */}
        <Link to="/orders" style={linkStyle}>
          Orders
        </Link>

        {/* COMPARE */}
        <button
          onClick={() => navigate("/compare")}
          style={{
            ...linkStyle,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Compare
          {compareCount > 0 && (
            <span
              style={{
                background: "#111",
                color: "#fff",
                fontSize: 11,
                padding: "2px 6px",
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              {compareCount}
            </span>
          )}
        </button>

        {/* AUTH */}
        <Link to="/login" style={linkStyle}>
          Login
        </Link>

        <Link to="/signup" style={linkStyle}>
          Signup
        </Link>
      </div>

      {/* RIGHT SIDE — CREDITS */}
      {credits !== null && (
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            background: "#111",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Credits: {credits}
        </div>
      )}
    </nav>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: 15,
};

export default Navbar;
