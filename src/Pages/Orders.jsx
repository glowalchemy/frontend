import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiPackage, FiClock, FiTruck, FiCheck, FiCreditCard, FiXCircle,
    FiArrowRight, FiChevronRight, FiAlertCircle, FiShoppingBag,
} from 'react-icons/fi';
import { useContentSettings } from '../context/ContentSettingsContext';
import { useNotifications } from '../context/NotificationContext';
import { apiClient } from '../api/client';
import EmptyState from '../components/shared/EmptyState';

const FALLBACK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
];

const STATUS_META = {
    new:        { label: 'Order Placed', icon: FiPackage },
    processing: { label: 'Processing',   icon: FiClock },
    paid:       { label: 'Paid',         icon: FiCreditCard },
    shipped:    { label: 'Shipped',      icon: FiTruck },
    delivered:  { label: 'Delivered',    icon: FiCheck },
    cancelled:  { label: 'Cancelled',    icon: FiXCircle },
};

const STATUS_STYLES = {
    new:        'bg-status-info/10 text-status-info border-status-info/20',
    processing: 'bg-status-warning/15 text-[#8a6d1f] border-status-warning/40',
    paid:       'bg-status-info/10 text-status-info border-status-info/20',
    shipped:    'bg-status-info/10 text-status-info border-status-info/20',
    delivered:  'bg-status-success/10 text-status-success border-status-success/20',
    cancelled:  'bg-status-error/10 text-status-error border-status-error/20',
};

const Orders = () => {
    const { settings } = useContentSettings();
    const { socket } = useNotifications();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [cancellingId, setCancellingId] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

    const showOrderHistory = Boolean(settings?.showOrderHistory);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!showOrderHistory) return;
            setLoading(true);
            setError('');

            try {
                const { fetchMyOrders } = await import('../api/orders');
                const data = await fetchMyOrders();
                if (!cancelled) setOrders(data);
            } catch (e) {
                const message = e?.response?.data?.message || e?.message || 'Failed to load orders';
                if (!cancelled) {
                    setError(message);
                    setOrders([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [showOrderHistory]);

    useEffect(() => {
        if (!showOrderHistory) return;
        if (!socket) return;

        const onStatusChanged = (evt) => {
            const id = String(evt?.id || '');
            const status = String(evt?.status || '').toLowerCase();
            if (!id || !status) return;

            setOrders((prev) => prev.map((o) => (String(o?.id) === id ? { ...o, status } : o)));
        };

        socket.on('order:status_changed', onStatusChanged);
        return () => {
            socket.off('order:status_changed', onStatusChanged);
        };
    }, [socket, showOrderHistory]);

    const canCancel = (status) => {
        const s = String(status || '').toLowerCase();
        return ['new', 'processing', 'paid'].includes(s);
    };

    const formatStatusLabel = (status) => {
        const s = String(status || '').trim();
        if (!s) return 'New';
        return s
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleCancelOrder = async (order) => {
        const id = String(order?.id || '');
        if (!id) return;
        if (!canCancel(order?.status)) return;

        const ok = window.confirm('Are you sure you want to cancel this order?');
        if (!ok) return;

        setCancellingId(id);
        setError('');
        try {
            const { cancelOrder, fetchMyOrders } = await import('../api/orders');
            await cancelOrder(id);
            const data = await fetchMyOrders();
            setOrders(data);
        } catch (e) {
            const message = e?.response?.data?.message || e?.message || 'Failed to cancel order';
            setError(message);
        } finally {
            setCancellingId('');
        }
    };

    const normalizedOrders = useMemo(() => {
        const allOrders = (Array.isArray(orders) ? orders : []).map((o) => {
            const items = Array.isArray(o?.itemsDetail) ? o.itemsDetail : [];
            const rawStatus = String(o?.orderStatus || o?.status || 'new').toLowerCase();
            // Hide paid_but_shipment_failed from users - show as processing
            let status = rawStatus === 'returned' ? 'cancelled' : rawStatus;
            if (status === 'paid_but_shipment_failed') {
                status = 'processing'; // Show user-friendly status
            }
            return {
                id: String(o?.id || ''),
                orderNumber: String(o?.orderNumber || ''),
                status,
                createdAtIso: String(o?.createdAtIso || o?.date || ''),
                total: Number(o?.total ?? 0) || 0,
                items,
            };
        });

        // Apply date filter
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        return allOrders.filter((order) => {
            if (!order.createdAtIso) return true; // Show orders without date

            const orderDate = new Date(order.createdAtIso);

            switch (dateFilter) {
                case 'today':
                    return orderDate >= today;
                case 'week':
                    return orderDate >= weekStart;
                case 'month':
                    return orderDate >= monthStart;
                default:
                    return true; // 'all'
            }
        }).sort((a, b) => {
            // Sort by date descending (newest first)
            const dateA = a.createdAtIso ? new Date(a.createdAtIso) : new Date(0);
            const dateB = b.createdAtIso ? new Date(b.createdAtIso) : new Date(0);
            return dateB - dateA;
        });
    }, [orders, dateFilter]);

    const formatCurrency = (value) => {
        const n = Number(value ?? 0) || 0;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
    };

    const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '';
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const openTracking = (id) => {
        navigate(`/order-tracking?id=${encodeURIComponent(id)}`);
    };

    if (!showOrderHistory) {
        return (
            <div className="min-h-screen bg-glowalchemy-ivory py-8 md:py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded-xl border border-glowalchemy-sand shadow-glowalchemy p-6">
                        <h1 className="font-serif text-2xl font-bold text-glowalchemy-charcoal mb-2">My Orders</h1>
                        <p className="text-sm text-glowalchemy-warm-gray">Order history is currently disabled.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-glowalchemy-ivory py-8 md:py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 rounded-full bg-white border border-glowalchemy-sand flex items-center justify-center flex-shrink-0">
                                <FiShoppingBag className="w-5 h-5 text-action-primary" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-serif text-2xl md:text-3xl font-bold text-glowalchemy-charcoal leading-tight">
                                    My Orders
                                </h1>
                                <p className="text-sm text-glowalchemy-warm-gray mt-0.5">
                                    {loading
                                        ? 'Loading your orders…'
                                        : `${normalizedOrders.length} order${normalizedOrders.length === 1 ? '' : 's'}`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Date filter — segmented control */}
                    <div className="inline-flex items-center gap-1 bg-white border border-glowalchemy-sand rounded-full p-1 shadow-glowalchemy">
                        {FILTERS.map((f) => {
                            const active = dateFilter === f.key;
                            return (
                                <button
                                    key={f.key}
                                    type="button"
                                    onClick={() => setDateFilter(f.key)}
                                    aria-pressed={active}
                                    className={`px-3.5 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-accent ${
                                        active
                                            ? 'bg-action-primary text-white shadow-sm'
                                            : 'text-glowalchemy-warm-gray hover:text-glowalchemy-charcoal hover:bg-glowalchemy-ivory'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error ? (
                    <div className="flex items-start gap-2.5 bg-status-error/10 border border-status-error/30 text-status-error rounded-xl p-4 mb-6 text-sm">
                        <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                ) : null}

                {loading ? (
                    /* Skeleton cards */
                    <div className="space-y-4" aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-glowalchemy-sand shadow-glowalchemy p-5 animate-pulse">
                                <div className="h-4 w-32 bg-glowalchemy-sand/60 rounded-md mb-2" />
                                <div className="h-3 w-48 bg-glowalchemy-sand/40 rounded-md mb-4" />
                                <div className="flex gap-3">
                                    <div className="h-16 w-16 rounded-lg bg-glowalchemy-sand/40" />
                                    <div className="flex-1 space-y-2 pt-1">
                                        <div className="h-3 w-3/4 bg-glowalchemy-sand/40 rounded-md" />
                                        <div className="h-3 w-1/2 bg-glowalchemy-sand/40 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : normalizedOrders.length === 0 ? (
                    <div className="bg-white rounded-xl border border-glowalchemy-sand shadow-glowalchemy">
                        <EmptyState
                            icon="package"
                            title={error ? 'Could not load orders' : 'No orders yet'}
                            description={
                                error
                                    ? 'Something went wrong while fetching your orders. Please try again.'
                                    : 'When you place an order, it will show up here with live status updates.'
                            }
                            actionText={error ? undefined : 'Start Shopping'}
                            onAction={error ? undefined : () => navigate('/ProductListing')}
                        />
                    </div>
                ) : (
                    /* Order list */
                    <div className="space-y-4">
                        {normalizedOrders.map((order) => {
                            const statusKey = STATUS_META[order.status] ? order.status : 'new';
                            const StatusIcon = STATUS_META[statusKey]?.icon || FiPackage;
                            const statusLabel = STATUS_META[statusKey]?.label || formatStatusLabel(order.status);
                            const itemCount = order.items.length;

                            return (
                                <article
                                    key={order.id}
                                    className="bg-white rounded-xl border border-glowalchemy-sand shadow-glowalchemy overflow-hidden"
                                >
                                    {/* Card header */}
                                    <div className="px-4 sm:px-5 py-3.5 flex items-start justify-between gap-3 border-b border-glowalchemy-sand">
                                        <div className="min-w-0">
                                            <p className="text-[11px] uppercase tracking-wide text-glowalchemy-warm-gray font-medium">
                                                Order
                                            </p>
                                            <p className="font-semibold text-glowalchemy-charcoal text-[15px] truncate mt-0.5">
                                                {order.orderNumber || order.id}
                                            </p>
                                            {order.createdAtIso ? (
                                                <p className="text-xs text-glowalchemy-warm-gray mt-1">
                                                    {formatDate(order.createdAtIso)}
                                                </p>
                                            ) : null}
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${STATUS_STYLES[statusKey] || STATUS_STYLES.new}`}
                                        >
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {statusLabel}
                                        </span>
                                    </div>

                                    {/* Items */}
                                    <div className="px-4 sm:px-5 py-4 space-y-3.5">
                                        {order.items.slice(0, 3).map((it, idx) => {
                                            const img = String(it?.selectedImage || '').trim() || FALLBACK_IMAGE;
                                            const name = String(it?.name || 'Product');
                                            const size = String(it?.selectedSize || '').trim();
                                            const color = String(it?.selectedColor || '').trim();
                                            const qty = Number(it?.quantity ?? 0) || 0;
                                            const price = Number(it?.price ?? 0) || 0;

                                            return (
                                                <div key={`${order.id}-${idx}`} className="flex gap-3 items-start">
                                                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-glowalchemy-ivory border border-glowalchemy-sand flex-shrink-0">
                                                        <img
                                                            src={img}
                                                            alt={name}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-glowalchemy-charcoal truncate">
                                                            {name}
                                                        </p>
                                                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-glowalchemy-warm-gray">
                                                            {size ? <span>Size: <span className="text-glowalchemy-charcoal font-medium">{size}</span></span> : null}
                                                            {color ? (
                                                                <span className="inline-flex items-center gap-1.5">
                                                                    <span className="h-2.5 w-2.5 rounded-full border border-glowalchemy-sand" style={{ backgroundColor: color }} />
                                                                    {color}
                                                                </span>
                                                            ) : null}
                                                            <span>Qty: <span className="text-glowalchemy-charcoal font-medium">{qty}</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-semibold text-glowalchemy-charcoal flex-shrink-0">
                                                        {formatCurrency(price * qty)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {itemCount > 3 ? (
                                            <button
                                                type="button"
                                                onClick={() => openTracking(order.id)}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-action-primary hover:underline"
                                            >
                                                +{itemCount - 3} more item{itemCount - 3 > 1 ? 's' : ''}
                                                <FiChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        ) : null}
                                    </div>

                                    {/* Card footer */}
                                    <div className="px-4 sm:px-5 py-3.5 bg-glowalchemy-ivory/60 border-t border-glowalchemy-sand flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[11px] uppercase tracking-wide text-glowalchemy-warm-gray font-medium">
                                                Total · {itemCount} item{itemCount === 1 ? '' : 's'}
                                            </p>
                                            <p className="text-base font-bold text-glowalchemy-charcoal mt-0.5">
                                                {formatCurrency(order.total)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {canCancel(order.status) ? (
                                                <button
                                                    type="button"
                                                    disabled={cancellingId === order.id}
                                                    onClick={() => handleCancelOrder(order)}
                                                    className="px-3.5 py-2 rounded-lg border border-status-error/40 text-status-error text-sm font-medium hover:bg-status-error/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-error/40"
                                                >
                                                    {cancellingId === order.id ? 'Cancelling…' : 'Cancel'}
                                                </button>
                                            ) : null}
                                            <button
                                                type="button"
                                                onClick={() => openTracking(order.id)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-action-primary text-white text-sm font-medium hover:bg-action-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-accent"
                                            >
                                                Track Order
                                                <FiArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
