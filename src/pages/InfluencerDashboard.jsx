import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "../utils/orders";

function InfluencerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // ROLE GUARD (SAFE, FRONTEND ONLY)
  // --------------------------------------------------
  const role = localStorage.getItem("auth_role");

  if (role !== "influencer") {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        Access denied.
      </div>
    );
  }

  // --------------------------------------------------
  // LOAD ORDERS (ASYNC SAFE, AS SPECIFIED)
  // --------------------------------------------------
  useEffect(() => {
    let mounted = true;

    getOrders()
      .then((data) => {
        if (!mounted) return;
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setOrders([]);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // ACCEPT / REJECT HANDLERS (AS SPECIFIED)
  // --------------------------------------------------
  const onAccept = (id) => {
    updateOrderStatus(id, "accepted").then(
      (updated) => {
        setOrders(Array.isArray(updated) ? updated : []);
      }
    );
  };

  const onReject = (id) => {
    updateOrderStatus(id, "rejected").then(
      (updated) => {
        setOrders(Array.isArray(updated) ? updated : []);
      }
    );
  };

  // --------------------------------------------------
  // FILTER: ONLY PENDING REQUESTS
  // --------------------------------------------------
  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  );

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------
  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        Loading collaboration requests…
      </div>
    );
  }

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------
  if (pendingOrders.length === 0) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        No pending collaboration requests.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      <h1 style={{ marginBottom: 40 }}>
        Influencer Dashboard
      </h1>

      {/* ================= REQUESTS LIST ================= */}
      {pendingOrders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "24px 28px",
            marginBottom: 20,
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {/* LEFT */}
          <div>
            <h3 style={{ margin: 0 }}>
              {order.influencer_name ?? "—"}
            </h3>

            <p style={{ fontSize: 14, color: "#666" }}>
              Price: ₹
              {(order.price ?? 0).toLocaleString()}
            </p>

            <p style={{ fontSize: 14, color: "#666" }}>
              Requested on{" "}
              {order.created_at
                ? new Date(
                    order.created_at
                  ).toLocaleString()
                : "—"}
            </p>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => onAccept(order.id)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Accept
            </button>

            <button
              onClick={() => onReject(order.id)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InfluencerDashboard;
