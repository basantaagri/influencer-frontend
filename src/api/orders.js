import { apiFetch } from "./client";

// ----------------------------------
// Get all orders (AUTH SAFE)
// ----------------------------------
export const fetchOrders = async () => {
  return apiFetch("/orders");
};

// ----------------------------------
// Create order
// ----------------------------------
export const createOrderAPI = async (order) => {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
};

// ----------------------------------
// Update order status
// ----------------------------------
export const updateOrderStatusAPI = async (id, status) => {
  return apiFetch(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ----------------------------------
// Delete order
// ----------------------------------
export const deleteOrderAPI = async (id) => {
  return apiFetch(`/orders/${id}`, {
    method: "DELETE",
  });
};
