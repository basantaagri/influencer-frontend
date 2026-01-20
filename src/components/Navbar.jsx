import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrders } from "../utils/orders";
import { logout } from "../utils/auth"; // ✅ NEW (SAFE)

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ NEW
  const role = localStorage.getItem("auth_role");
  const [pendingCount, setPendingCount] = useState(0);

  // ----------------------------------
  // Load pending orders (influencer only)
  // ----------------------------------
  useEffect(() => {
    if (role === "influencer") {
      getOrders()
        .then((orders) => {
          const pending = Array.isArray(orders)
            ? orders.filter((o) => o.status === "pending")
            : [];
          setPendingCount(pending.length);
        })
        .catch(() => {
          setPendingCount(0);
        });
    } else {
      setPendingCount(0);
    }
  }, [role]);

  // ----------------------------------
  // LOGOUT HANDLER (SAFE)
  // ----------------------------------
  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 500,
    color: location.pathname === path ? "#000" : "#6e6e73",
    position: "relative",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <strong style={{ fontSize: 16 }}>Influencer</strong>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link to="/" style={linkStyle("/")}>
            Discover
          </Link>

          {/* BRAND NAV */}
          {role === "brand" && (
            <>
              <Link to="/saved" style={linkStyle("/saved")}>
                Saved
              </Link>

              <Link to="/orders" style={linkStyle("/orders")}>
                Orders
              </Link>
            </>
          )}

          {/* INFLUENCER NAV */}
          {role === "influencer" && (
            <Link to="/influencer" style={linkStyle("/influencer")}>
              Influencer Dashboard
              {pendingCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -14,
                    background: "#e11d48",
                    color: "#fff",
                    fontSize: 11,
                    padding: "2px 6px",
                    borderRadius: 10,
                    lineHeight: 1,
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          )}

          {/* ✅ LOGOUT (ONLY WHEN LOGGED IN) */}
          {role && (
            <span
              onClick={onLogout}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#e11d48",
                cursor: "pointer",
              }}
            >
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
