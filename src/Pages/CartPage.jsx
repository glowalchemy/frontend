import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { FiShoppingCart as LineCart, FiUser, FiPackage } from 'react-icons/fi';
import OptimizedImage from '../components/shared/OptimizedImage';

const CartPage = () => {
    const {
        items,
        loading,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const roundMoney = (v) => Math.round((Number(v ?? 0) || 0) * 100) / 100;
    const subtotal = roundMoney(items.reduce((sum, item) => {
        const qty = Number(item?.quantity ?? 0) || 0;
        const price = Number(item?.price ?? item?.product?.price ?? 0) || 0;
        return sum + price * qty;
    }, 0));
    const shipping = 0;
    const total = roundMoney(subtotal + shipping);

    const handleQuantityChange = (productId, newQuantity, variant) => {
        if (newQuantity === 0) {
            removeFromCart(productId, variant);
        } else if (newQuantity > 0) {
            updateQuantity(productId, newQuantity, variant);
        }
    };

    const handleRemoveItem = (productId, variant) => {
        removeFromCart(productId, variant);
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your entire cart?')) {
            clearCart();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trozzi-terracotta mx-auto"></div>
                    <p className="mt-4 text-trozzi-warm-gray">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-trozzi-ivory">
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <FiPackage className="mx-auto h-24 w-24 text-trozzi-sand" />
                        <h2 className="mt-4 text-3xl font-extrabold text-trozzi-charcoal">Your cart is empty</h2>
                        <p className="mt-2 text-trozzi-warm-gray">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/ProductListing"
                                className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-trozzi-terracotta hover:bg-trozzi-charcoal transition-colors"
                            >
                                <FaArrowLeft className="mr-2" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-trozzi-ivory pb-24 sm:pb-0">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="sm:hidden flex items-center justify-between mb-3">
                    <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-trozzi-white border border-trozzi-sand">
                        <FaArrowLeft className="text-trozzi-charcoal" />
                    </Link>
                    <div className="text-[18px] font-bold text-trozzi-charcoal">Cart</div>
                    <div className="flex items-center gap-2">
                        <Link to="/profile" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-trozzi-white border border-trozzi-sand">
                            <FiUser className="text-trozzi-charcoal" />
                        </Link>
                        <Link to="/cart" className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-trozzi-white border border-trozzi-sand">
                            <LineCart className="text-trozzi-charcoal" />
                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-trozzi-terracotta text-white text-[11px] font-bold flex items-center justify-center">
                                {items.reduce((sum, item) => sum + (Number(item?.quantity ?? 0) || 0), 0)}
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="sm:hidden mb-3">
                    <div className="bg-trozzi-white border border-trozzi-sand rounded-lg px-3 py-2.5">
                        <div className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-2 text-trozzi-terracotta">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-trozzi-terracotta text-white">1</div>
                                <span className="font-semibold">Cart</span>
                            </div>
                            <div className="flex-1 h-[2px] mx-1.5 bg-trozzi-sand" />
                            <div className="flex items-center gap-1.5 text-trozzi-warm-gray">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-trozzi-sand">2</div>
                                <span className="font-semibold">Address</span>
                            </div>
                            <div className="flex-1 h-[2px] mx-1.5 bg-trozzi-sand" />
                            <div className="flex items-center gap-1.5 text-trozzi-warm-gray">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-trozzi-sand">3</div>
                                <span className="font-semibold">Payment</span>
                            </div>
                            <div className="flex-1 h-[2px] mx-1.5 bg-trozzi-sand" />
                            <div className="flex items-center gap-1.5 text-trozzi-warm-gray">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-trozzi-sand">4</div>
                                <span className="font-semibold">Summary</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center justify-between mb-5 sm:mb-8">
                    <h1 className="text-xl sm:text-3xl font-bold text-trozzi-charcoal">Shopping Cart</h1>
                    <button
                        onClick={handleClearCart}
                        className="text-trozzi-terracotta hover:text-trozzi-charcoal text-sm font-medium"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="sm:hidden space-y-3">
                    {items.map((item) => (
                        <div key={`${item.product?._id || item.product}-${item.size || ''}-${item.color || ''}`} className="bg-trozzi-white rounded-xl border border-trozzi-sand shadow-sm p-3">
                            <div className="flex gap-3">
                                <div className="w-20 h-20 rounded-lg bg-trozzi-ivory border border-trozzi-sand overflow-hidden">
                                    <OptimizedImage
                                        src={item.image || item.product?.image || item.product?.galleryImages?.[0]}
                                        alt={item.product?.name || item.name}
                                        className="w-full h-full object-contain"
                                        wrapperClassName="w-full h-full"
                                        fallbackType="thumbnail"
                                        sizes="80px"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="text-[13px] font-semibold text-trozzi-charcoal line-clamp-2">
                                        {item.product?.name || item.name}
                                    </div>
                                    <div className="mt-1 text-[15px] font-bold text-trozzi-terracotta">₹{(Number(item.price ?? item.product?.price ?? 0) || 0).toFixed(0)}</div>
                                </div>

                                <button
                                    onClick={() => handleRemoveItem(item.product?._id || item.product, { size: item?.size || '', color: item?.color || '' })}
                                    className="w-10 h-10 inline-flex items-center justify-center text-trozzi-terracotta"
                                >
                                    <FaTrash className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-3 flex items-center justify-center">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity - 1, { size: item?.size || '', color: item?.color || '' })}
                                        className="w-9 h-9 rounded-full border border-trozzi-sand bg-trozzi-white text-trozzi-terracotta font-bold"
                                    >
                                        −
                                    </button>
                                    <div className="w-10 text-center text-[14px] font-bold text-trozzi-charcoal">{item.quantity}</div>
                                    <button
                                        onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity + 1, { size: item?.size || '', color: item?.color || '' })}
                                        className="w-9 h-9 rounded-full border border-trozzi-sand bg-trozzi-white text-trozzi-terracotta font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-trozzi-ivory border border-trozzi-sand rounded-xl p-3 flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-trozzi-white/60 border border-trozzi-white/50 flex items-center justify-center">
                            <span className="text-trozzi-terracotta text-[12px] font-bold">i</span>
                        </div>
                        <div className="min-w-0">
                            <div className="text-[13px] font-bold text-trozzi-charcoal">Your Safety, Our Priority</div>
                            <div className="text-[12px] text-trozzi-warm-gray mt-0.5">We make sure that your package is safe at every point of contact</div>
                        </div>
                    </div>

                    <div className="bg-trozzi-white rounded-xl border border-trozzi-sand p-4">
                        <div className="flex justify-between text-[13px] text-trozzi-charcoal">
                            <span>Shipping:</span>
                            <span className="font-bold text-trozzi-charcoal">FREE</span>
                        </div>
                        <div className="flex justify-between text-[13px] text-trozzi-charcoal mt-2">
                            <span>Total Product Price:</span>
                            <span className="font-bold">₹{subtotal.toFixed(0)}</span>
                        </div>
                        <div className="border-t border-trozzi-sand mt-3 pt-3 flex justify-between items-center">
                            <span className="text-[14px] font-extrabold text-trozzi-charcoal">Order Total:</span>
                            <span className="text-[14px] font-extrabold text-trozzi-terracotta">₹{total.toFixed(0)}</span>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Cart Items */}
                    <div className="divide-y divide-trozzi-sand">
                        {items.map((item) => (
                            <div key={`${item.product?._id || item.product}-${item.size || ''}-${item.color || ''}`} className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0 w-full sm:w-24 h-40 sm:h-24 bg-trozzi-ivory rounded-md overflow-hidden">
                                        <OptimizedImage
                                            src={item.image || item.product?.image || item.product?.galleryImages?.[0]}
                                            alt={item.product?.name || item.name}
                                            className="w-full h-full object-contain"
                                            wrapperClassName="w-full h-full"
                                            fallbackType="thumbnail"
                                            sizes="96px"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="sm:ml-2 flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="text-base sm:text-lg font-medium text-trozzi-charcoal truncate">
                                                    {item.product?.name || item.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-trozzi-warm-gray">
                                                    {item.product?.category}
                                                </p>
                                                {(item?.size || item?.color) ? (
                                                    <p className="mt-1 text-sm text-trozzi-warm-gray">
                                                        {item?.size ? `Size: ${item.size}` : ''}{item?.size && item?.color ? ' | ' : ''}{item?.color ? `Color: ${item.color}` : ''}
                                                    </p>
                                                ) : null}
                                                <p className="mt-2 text-base sm:text-lg font-semibold text-trozzi-charcoal">
                                                    ₹{(item.price ?? item.product?.price ?? 0).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                                <div className="flex items-center border border-trozzi-sand rounded-md overflow-hidden">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity - 1, { size: item?.size || '', color: item?.color || '' })}
                                                        className="w-10 h-10 flex items-center justify-center text-trozzi-charcoal hover:text-trozzi-terracotta"
                                                    >
                                                        <FaMinus className="h-3 w-3" />
                                                    </button>
                                                    <span className="min-w-[44px] text-center px-3 py-1 text-trozzi-charcoal font-semibold">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity + 1, { size: item?.size || '', color: item?.color || '' })}
                                                        className="w-10 h-10 flex items-center justify-center text-trozzi-charcoal hover:text-trozzi-terracotta"
                                                    >
                                                        <FaPlus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.product?._id || item.product, { size: item?.size || '', color: item?.color || '' })}
                                                    className="w-10 h-10 inline-flex items-center justify-center text-trozzi-terracotta hover:text-trozzi-charcoal"
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-sm text-trozzi-warm-gray">
                                                Subtotal ({item.quantity} items)
                                            </span>
                                            <span className="text-base sm:text-lg font-semibold text-trozzi-charcoal">
                                                ₹{((item.price ?? item.product?.price ?? 0) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="border-t border-trozzi-sand p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <p className="text-sm text-trozzi-warm-gray">Total ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</p>
                                <p className="text-2xl sm:text-3xl font-bold text-trozzi-charcoal">₹{total.toFixed(2)}</p>
                                <div className="mt-2 space-y-1 text-sm text-trozzi-warm-gray">
                                    <div className="flex justify-between gap-6">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between gap-6">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:flex items-center gap-4">
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-4 py-2 border border-trozzi-sand rounded-md shadow-sm text-sm font-medium text-trozzi-charcoal bg-trozzi-white hover:bg-trozzi-ivory"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Continue Shopping
                                </Link>
                                <Link
                                    to="/checkout"
                                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-trozzi-terracotta hover:bg-trozzi-charcoal"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm:hidden fixed bottom-0 left-0 right-0 z-sticky bg-trozzi-white border-t border-trozzi-sand px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-[16px] font-extrabold text-trozzi-terracotta truncate">₹{total.toFixed(0)}</div>
                            <div className="text-[12px] text-trozzi-warm-gray">Inclusive of all taxes</div>
                        </div>
                        <Link
                            to="/checkout"
                            className="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-trozzi-terracotta text-white text-sm font-extrabold shadow-sm flex-1"
                        >
                            Continue to Address
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
