import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/shared/EmptyState';
import ImageWithFallback from '../components/shared/ImageWithFallback';
import { toast } from 'react-toastify';

const WishlistPage = () => {
    const { items, removeFromWishlist, loading, fetchWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const handleAddToCart = async (productId) => {
        try {
            const result = await addToCart(productId, 1);
            if (result.success) {
                toast.success('Added to cart from wishlist!');
            } else {
                toast.error(result.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const result = await removeFromWishlist(productId);
            if (result) {
                toast.success('Removed from wishlist!');
            }
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            toast.error('Failed to remove from wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-trozzi-ivory py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trozzi-terracotta"></div>
                        <p className="mt-2 text-trozzi-warm-gray">Loading wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-trozzi-ivory py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-trozzi-charcoal mb-4">My Wishlist</h1>
                    <p className="text-lg text-trozzi-warm-gray">
                        {items.length === 0
                            ? "Your wishlist is empty"
                            : `You have ${items.length} item${items.length !== 1 ? 's' : ''} in your wishlist`
                        }
                    </p>
                </div>

                {/* Wishlist Items */}
                {items.length === 0 ? (
                    <EmptyState
                        icon="heart"
                        title="Your wishlist is empty"
                        description="Start adding items to your wishlist to keep track of products you love."
                        actionText="Continue Shopping"
                        onAction={() => window.location.href = '/ProductListing'}
                    />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => {
                            const product = item.product || item;
                            const productId = product._id || product.id;
                            const image = product.image || product.img;
                            const name = product.name || product.title;
                            const price = product.price || 0;
                            const oldPrice = product.oldPrice;
                            const discount = product.discount || 0;

                            return (
                                <div key={productId} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-trozzi-sand">
                                    {/* Product Image */}
                                    <div className="relative">
                                        <Link to={`/product/${productId}`}>
                                            <ImageWithFallback
                                                src={image}
                                                alt={name}
                                                className="w-full h-48 object-cover"
                                                fallbackType="thumbnail"
                                            />
                                        </Link>

                                        {/* Discount Badge */}
                                        {discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-trozzi-terracotta text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                -{discount}%
                                            </span>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveFromWishlist(productId)}
                                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-trozzi-ivory transition-colors border border-trozzi-sand"
                                        >
                                            <FiTrash className="h-4 w-4 text-trozzi-terracotta" />
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <Link to={`/product/${productId}`}>
                                            <h3 className="text-lg font-semibold text-trozzi-charcoal mb-2 hover:text-trozzi-terracotta line-clamp-2 transition-colors">
                                                {name}
                                            </h3>
                                        </Link>

                                        {/* Price */}
                                        <div className="mb-4">
                                            {oldPrice && (
                                                <span className="text-trozzi-warm-gray line-through mr-2">₹{oldPrice}</span>
                                            )}
                                            <span className="text-xl font-bold text-trozzi-terracotta">₹{price}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(productId)}
                                                className="flex-1 bg-trozzi-terracotta text-white py-2 px-4 rounded-xl hover:bg-trozzi-charcoal transition-colors flex items-center justify-center gap-2 font-medium"
                                            >
                                                <FiShoppingCart className="h-4 w-4" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Continue Shopping Link */}
                {items.length > 0 && (
                    <div className="text-center mt-12">
                        <Link
                            to="/ProductListing"
                            className="inline-flex items-center px-6 py-3 border border-trozzi-sand text-base font-medium rounded-xl text-trozzi-charcoal bg-white hover:bg-trozzi-ivory transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
