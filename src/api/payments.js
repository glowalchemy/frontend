import { api } from "./client";

export async function fetchPaymentStatus(merchantOrderId) {
    const res = await api.get(`/payments/phonepe/status/${encodeURIComponent(merchantOrderId)}`);
    return res.data;
}

export async function verifyPayment(data) {
    const res = await api.post("/payments/verify", data);
    return res.data;
}

export async function createPaymentOrder(data) {
    const res = await api.post("/payments/create-order", data);
    return res.data;
}
