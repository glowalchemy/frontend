import { api } from "./client";

// Orders APIs are user-specific - no application-level caching
// Freshness required after: order creation, cancellation, status updates
export async function fetchMyOrders() {
    const res = await api.get("/orders/my");
    const payload = res?.data;
    return Array.isArray(payload?.data) ? payload.data : [];
}

export async function fetchOrdersStats() {
    const res = await api.get("/orders/stats");
    const payload = res?.data;
    return payload;
}

export async function cancelOrder(orderId) {
    const res = await api.post(`/orders/${orderId}/cancel`);
    return res.data;
}

export async function fetchOrderDetail(orderId) {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
}

export async function fetchShipmentTimeline(orderId) {
    const res = await api.get(`/orders/${orderId}/shipment-timeline`);
    return res.data;
}
