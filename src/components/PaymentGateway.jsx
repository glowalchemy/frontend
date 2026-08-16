import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import {
    FiCreditCard,
    FiSmartphone,
    FiDollarSign,
    FiX,
    FiCheck,
    FiAlertCircle,
} from 'react-icons/fi';

/**
 * PaymentGateway
 *
 * All providers go through the backend POST /api/payments/create-order.
 * The backend is the single source of truth for which providers are
 * integrated; if a provider responds with a mock/placeholder flow, we
 * surface an honest error instead of fabricating a successful payment.
 */
const INTEGRATED_PROVIDERS = ['phonepe'];

const PaymentGateway = ({
    amount,
    orderId,
    customerInfo,
    onPaymentSuccess,
    onPaymentFailure,
    onCancel
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const resolved = useMemo(() => {
        const state = (location && location.state) ? location.state : {};
        const resolvedAmount = Number(amount ?? state.amount ?? state.totalAmount ?? state.total ?? 0) || 0;
        const resolvedOrderId = String(orderId ?? state.orderId ?? state.order?.id ?? state.order?._id ?? '') || '';
        const resolvedCustomerInfo = customerInfo ?? state.customerInfo ?? state.customer ?? null;
        return {
            amount: resolvedAmount,
            orderId: resolvedOrderId,
            customerInfo: resolvedCustomerInfo,
        };
    }, [amount, orderId, customerInfo, location]);

    const safeOnPaymentSuccess = typeof onPaymentSuccess === 'function'
        ? onPaymentSuccess
        : (result) => {
            const state = (location && location.state) ? location.state : {};
            navigate('/summary', {
                replace: true,
                state: {
                    ...state,
                    paymentResult: result,
                }
            });
        };
    const safeOnPaymentFailure = typeof onPaymentFailure === 'function' ? onPaymentFailure : () => {};
    const safeOnCancel = typeof onCancel === 'function' ? onCancel : () => navigate(-1);

    const [selectedMethod, setSelectedMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const paymentMethods = [
        {
            id: 'phonepe',
            name: 'PhonePe',
            icon: <FiSmartphone className="w-6 h-6" />,
            badgeClass: 'bg-page-secondary text-charcoal',
            description: 'Pay using PhonePe UPI'
        },
        {
            id: 'paytm',
            name: 'Paytm',
            icon: <FiDollarSign className="w-6 h-6" />,
            badgeClass: 'bg-page-secondary text-charcoal',
            description: 'Pay using Paytm Wallet or UPI'
        },
        {
            id: 'googlepay',
            name: 'Google Pay',
            icon: <FiCreditCard className="w-6 h-6" />,
            badgeClass: 'bg-page-secondary text-charcoal',
            description: 'Pay using Google Pay UPI'
        },
        {
            id: 'upi',
            name: 'UPI',
            icon: <FiSmartphone className="w-6 h-6" />,
            badgeClass: 'bg-page-secondary text-charcoal',
            description: 'Pay using any UPI app'
        }
    ];

    const startRedirectPayment = async (provider) => {
        const state = (location && location.state) ? location.state : {};

        const normalizedItems = Array.isArray(state.items)
            ? state.items
                .map((it) => {
                    const p = it?.product || {};
                    const productId = it?.productId || p?._id || it?.product || it?._id;
                    const name = it?.name || p?.name;
                    const price = Number(it?.price ?? p?.price ?? 0) || 0;
                    const quantity = Number(it?.quantity ?? 0) || 0;
                    if (!productId || !name || !price || !quantity) return null;
                    return {
                        productId: String(productId),
                        name: String(name),
                        price,
                        quantity,
                        size: it?.size || it?.selectedSize,
                        color: it?.color || it?.selectedColor,
                    };
                })
                .filter(Boolean)
            : [];

        const orderData = {
            currency: 'INR',
            subtotal: Number(state.subtotal ?? 0) || 0,
            shipping: Number(state.shipping ?? 0) || 0,
            tax: Number(state.tax ?? 0) || 0,
            codCharge: Number(state.codCharge ?? 0) || 0,
            total: Number(state.total ?? resolved.amount ?? 0) || 0,
            paymentMethod: provider,
            items: normalizedItems,
            customer: state.customer ?? resolved.customerInfo ?? null,
            address: state.address ?? null,
        };

        const amountRupees = Math.round(Number(resolved.amount ?? orderData.total ?? 0) || 0);
        if (!amountRupees || amountRupees <= 0) {
            throw new Error('Invalid amount');
        }

        const returnUrl = `${window.location.origin}/summary`;

        const resp = await apiClient.post('/payments/create-order', {
            amount: amountRupees,
            currency: 'INR',
            provider,
            orderData,
            returnUrl,
        });

        const data = resp?.data;

        // The backend may respond with a placeholder/mocked nextAction for
        // providers that are not integrated yet. Never follow it — surface an
        // honest error instead.
        const nextUrl = data?.nextAction?.url;
        const isMocked = Boolean(data?.message) || String(nextUrl || '').includes('example.invalid');
        if (isMocked) {
            throw new Error('This payment method is not available yet. Please choose PhonePe.');
        }
        if (!nextUrl) {
            throw new Error(data?.message || data?.error || 'Payment initiation failed');
        }

        try {
            localStorage.setItem('lastPaymentProviderOrderId', String(data?.providerOrderId || ''));
            localStorage.setItem('lastPaymentId', String(data?.paymentId || ''));
            localStorage.setItem('lastOrderId', String(data?.orderId || ''));
            // Store full order data for retrieval after redirect
            localStorage.setItem('lastOrderData', JSON.stringify({
                items: normalizedItems,
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                tax: orderData.tax,
                codCharge: orderData.codCharge,
                total: orderData.total,
                customer: orderData.customer,
                address: orderData.address,
                currency: orderData.currency,
                paymentMethod: provider
            }));
        } catch (_e) {
            // ignore
        }

        window.location.assign(String(nextUrl));
    };

    const handlePayment = async () => {
        if (!selectedMethod) {
            return;
        }

        if (!resolved.amount) {
            setPaymentError('Missing amount. Please go back and try again.');
            return;
        }

        setIsProcessing(true);
        setPaymentError('');

        try {
            if (!INTEGRATED_PROVIDERS.includes(selectedMethod)) {
                throw new Error('This payment method is not available yet. Please choose PhonePe.');
            }
            await startRedirectPayment(selectedMethod);
            // On success the page redirects to the payment provider; do not
            // call onPaymentSuccess here — the /summary page verifies.
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Payment failed';
            setPaymentError(String(msg));
            safeOnPaymentFailure(String(msg));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 space-y-4 pb-24 sm:pb-0">
            <div className="sm:hidden flex items-center justify-between mb-2">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-default"
                >
                    <FiX className="text-charcoal" />
                </button>
                <div className="text-[18px] font-bold text-charcoal">Payment</div>
                <div className="w-10" />
            </div>

            <div className="sm:hidden mb-3">
                <div className="bg-surface border border-default rounded-lg px-3 py-2.5">
                    <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2 text-status-success">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-status-success text-white">
                                <FiCheck className="w-4 h-4" />
                            </div>
                            <span className="font-semibold">Cart</span>
                        </div>
                        <div className="flex-1 h-[2px] mx-1.5 bg-action-accent-soft" />
                        <div className="flex items-center gap-1.5 text-status-success">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-status-success text-white">
                                <FiCheck className="w-4 h-4" />
                            </div>
                            <span className="font-semibold">Address</span>
                        </div>
                        <div className="flex-1 h-[2px] mx-1.5 bg-border-default" />
                        <div className="flex items-center gap-1.5 text-action-primary">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-action-primary text-white">3</div>
                            <span className="font-semibold">Payment</span>
                        </div>
                        <div className="flex-1 h-[2px] mx-1.5 bg-border-default" />
                        <div className="flex items-center gap-1.5 text-muted">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-border-default">4</div>
                            <span className="font-semibold">Summary</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden sm:block bg-surface rounded-2xl p-5 border border-default shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-charcoal">Payment</div>
                        <div className="text-xs text-muted mt-0.5">Order {resolved.orderId ? `#${resolved.orderId}` : ''}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-muted">Amount</div>
                        <div className="text-lg font-extrabold text-charcoal">₹{Number(resolved.amount || 0).toLocaleString()}</div>
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={safeOnCancel}
                        className="text-sm font-semibold text-muted hover:text-charcoal"
                    >
                        Cancel
                    </button>
                    <div className="text-xs text-muted">Secure payment</div>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-surface rounded-2xl p-5 border border-default shadow-sm">
                <h3 className="text-base font-extrabold text-charcoal">Choose Payment Method</h3>
                <div className="mt-3 space-y-3">
                    {paymentMethods.map((method) => {
                        const active = selectedMethod === method.id;
                        const available = INTEGRATED_PROVIDERS.includes(method.id);
                        return (
                            <button
                                key={method.id}
                                type="button"
                                disabled={!available}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition ${active ? 'border-action-primary bg-page-secondary' : 'border-default bg-surface'} ${available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'border-action-primary bg-action-primary' : 'border-default bg-surface'}`}>
                                    <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-transparent'}`} />
                                </div>
                                <div className={`w-10 h-10 rounded-xl ${method.badgeClass} flex items-center justify-center`}>{method.icon}</div>
                                <div className="flex-1 text-left">
                                    <div className="text-[14px] font-semibold text-charcoal">{method.name}</div>
                                    {!available && (
                                        <div className="text-[11px] text-muted mt-0.5">Coming soon</div>
                                    )}
                                </div>
                                <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-page-secondary text-muted">
                                    {available ? 'Available' : 'Not integrated'}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Error Display */}
                {paymentError && (
                    <div className="mt-4 p-3 bg-status-error/10 border border-status-error/40 rounded-xl">
                        <div className="flex items-center gap-2">
                            <FiAlertCircle className="w-5 h-5 text-status-error" />
                            <p className="text-sm text-status-error">{paymentError}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={!selectedMethod || isProcessing}
                    className="hidden sm:flex w-full mt-4 bg-action-primary hover:bg-action-primary-hover disabled:bg-border-default text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:cursor-not-allowed items-center justify-center"
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Processing...
                        </div>
                    ) : (
                        `Pay ₹${Number(resolved.amount || 0).toLocaleString()}`
                    )}
                </button>
            </div>

            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-sticky bg-surface border-t border-default px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-[16px] font-extrabold text-charcoal truncate">₹{Number(resolved.amount || 0).toFixed(2)}</div>
                        <div className="text-[12px] text-muted">Inclusive of all taxes</div>
                    </div>
                    <button
                        type="button"
                        onClick={handlePayment}
                        disabled={!selectedMethod || isProcessing}
                        className="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-action-primary hover:bg-action-primary-hover disabled:bg-border-default text-white text-sm font-extrabold shadow-sm flex-1"
                    >
                        {isProcessing ? 'Processing...' : `Pay ₹${Number(resolved.amount || 0).toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
