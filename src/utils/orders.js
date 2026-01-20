import {
  fetchOrders,
  createOrderAPI,
  updateOrderStatusAPI,
  deleteOrderAPI,
} from "../api/orders";

// -------------------------------------------------
// Get all orders (API — SAFE)
// -------------------------------------------------
export async function getOrders() {
  try {
    const orders = await fetchOrders();
    return Array.isArray(orders) ? orders : [];
  } catch (err) {
    console.error("getOrders failed", err);
    return [];
  }
}

// -------------------------------------------------
// Create new order (API — SAFE)
// -------------------------------------------------
export async function createOrder(influencer) {
  if (!influencer?.id) {
    console.warn("createOrder: invalid influencer");
    return null;
  }

  try {
    const payload = {
      influencer_id: influencer.id,
      influencer_name: influencer.name ?? "",
      price: influencer.price ?? influencer.price_per_post ?? 0,
    };

    return await createOrderAPI(payload);
  } catch (err) {
    console.error("createOrder failed", err);
    return null;
  }
}

// -------------------------------------------------
// Remove order (API — SAFE)
// -------------------------------------------------
export async function removeOrder(order_id) {
  if (!order_id) return [];

  try {
    await deleteOrderAPI(order_id);
    return await getOrders();
  } catch (err) {
    console.error("removeOrder failed", err);
    return [];
  }
}

// -------------------------------------------------
// Update order status (API — SAFE)
// -------------------------------------------------
export async function updateOrderStatus(order_id, status) {
  if (!order_id || !status) return [];

  try {
    await updateOrderStatusAPI(order_id, status);
    return await getOrders();
  } catch (err) {
    console.error("updateOrderStatus failed", err);
    return [];
  }
}

// -------------------------------------------------
// Export orders as CSV (API — SAFE)
// -------------------------------------------------
export async function exportOrdersCSV() {
  try {
    const orders = await getOrders();
    if (!orders.length) return;

    const headers = [
      "Influencer Name",
      "Price",
      "Status",
      "Created At",
    ];

    const rows = orders.map((o) => [
      o.influencer_name ?? "",
      o.price ?? 0,
      o.status ?? "",
      o.created_at
        ? new Date(o.created_at).toLocaleString()
        : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("exportOrdersCSV failed", err);
  }
}
