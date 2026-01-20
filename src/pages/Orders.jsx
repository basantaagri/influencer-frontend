import { useEffect, useState } from "react";
import {
  getOrders,
  removeOrder,
  exportOrdersCSV,
} from "../utils/orders";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD ORDERS (ASYNC SAFE)
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
  // LOADING STATE
  // --------------------------------------------------
  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        Loading collaboration requests...
      </div>
    );
  }

  // --------------------------------------------------
  // EMPTY STATE (UNCHANGED UX)
  // --------------------------------------------------
  if (!orders.length) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        No collaboration requests yet.
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
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>
          Collaboration Requests
        </h1>

        <button
          onClick={exportOrdersCSV}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Export CSV
        </button>
      </div>

      {/* ================= ORDERS LIST ================= */}
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "24px 28px",
            marginBottom: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
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
              Status:{" "}
              <strong>{order.status ?? "pending"}</strong>
            </p>

            <p style={{ fontSize: 14, color: "#666" }}>
              Created:{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "—"}
            </p>
          </div>

          {/* RIGHT */}
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              ₹{(order.price ?? 0).toLocaleString()}
            </p>

            <button
              onClick={() => {
                removeOrder(order.id).then(setOrders);
              }}
              style={{
                background: "#f5f5f7",
                border: "1px solid #ddd",
                padding: "8px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
