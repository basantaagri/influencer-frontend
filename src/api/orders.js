import { apiFetch } from "./client";

const API_BASE = "http://127.0.0.1:8002/orders";

// ----------------------------------
// Get all orders (AUTH SAFE)
// ----------------------------------
export async function fetchOrders() {
  return apiFetch(API_BASE);
}

// ----------------------------------
// Create order (AUTH SAFE)
// ----------------------------------
export async function createOrderAPI(order) {
  return apiFetch(API_BASE, {
    method: "POST",
    body: JSON.stringify(order),
  });
}

// ----------------------------------
// Update order status (AUTH SAFE)
// ----------------------------------
export async function updateOrderStatusAPI(id, status) {
  return apiFetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ----------------------------------
// Delete order (AUTH SAFE)
// ----------------------------------
export async function deleteOrderAPI(id) {
  return apiFetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
}
