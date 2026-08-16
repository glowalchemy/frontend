import { api } from "./client";

import { applyManagementToProduct } from "./catalog";

// Questions & Answers API
export async function fetchProductQuestions(productId, { page = 1, limit = 10 } = {}) {
    const params = { page, limit };
    const res = await api.get(`/product-details/${productId}/questions`, { params });
    return res.data;
}

export async function askQuestion(productId, questionData) {
    const res = await api.post(`/product-details/${productId}/questions`, questionData);
    return res.data;
}

export async function answerQuestion(questionId, answerData) {
    const res = await api.post(`/product-details/questions/${questionId}/answers`, answerData);
    return res.data;
}

export async function upvoteQuestion(questionId) {
    const res = await api.post(`/product-details/questions/${questionId}/upvote`);
    return res.data;
}

export async function upvoteAnswer(answerId) {
    const res = await api.post(`/product-details/answers/${answerId}/upvote`);
    return res.data;
}

// Product Details API
//
// Single request: /product-details/:id/details now returns everything the PDP
// needs (media variants, management with real specs/shipping/returns, stock),
// so the page no longer fires a second /products/:id catalog request. The
// catalog normalizer is applied for consistent management-derived fields
// (brand, descriptionHtml, sizes, price, stock precedence).
export async function fetchProductDetails(productId) {
    const res = await api.get(`/product-details/${productId}/details`);
    const details = res.data;
    if (!details) return details;
    return applyManagementToProduct(details);
}

export async function fetchProductReviews(productId, { page = 1, limit = 10, sort = 'recent' } = {}) {
    const params = { page, limit, sort };
    const res = await api.get(`/product-details/${productId}/reviews`, { params });
    return res.data;
}

export async function submitProductReview(productId, reviewData) {
    const res = await api.post(`/product-details/${productId}/reviews`, reviewData);
    return res.data;
}

export async function helpfulReview(reviewId) {
    const res = await api.post(`/product-details/reviews/${reviewId}/helpful`);
    return res.data;
}
