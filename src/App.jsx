import React, { createContext, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, NavLink, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ContentSettingsProvider } from './context/ContentSettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { CategoryProvider } from './context/CategoryContext';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';

import { FiArrowUp, FiHome, FiGrid, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';

import { initMetaPixel, trackPageView } from './utils/metaPixelSdk';

import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./Pages/Home'));
const ProductListing = lazy(() => import('./Pages/ProductListing'));
const ProductDetailModern = lazy(() => import('./Pages/ProductDetail/ProductDetailModern'));
const CartPage = lazy(() => import('./Pages/CartPage'));
const CheckoutPage = lazy(() => import('./Pages/CheckoutPage'));
const WishlistPage = lazy(() => import('./Pages/WishlistPage'));
const LoginPage = lazy(() => import('./Pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./Pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./Pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./Pages/auth/ResetPasswordPage'));
const PrivacyPolicy = lazy(() => import('./Pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./Pages/TermsOfService'));
const Policies = lazy(() => import('./Pages/Policies'));
const ShippingPolicy = lazy(() => import('./Pages/ShippingPolicy'));
const ContactUs = lazy(() => import('./Pages/ContactUs'));
const AboutUs = lazy(() => import('./Pages/AboutUs'));
const HelpCenter = lazy(() => import('./Pages/HelpCenter'));
const OrderTracking = lazy(() => import('./Pages/OrderTracking'));
const PaymentGateway = lazy(() => import('./components/PaymentGateway'));
const SummaryPage = lazy(() => import('./Pages/SummaryPage'));
const Profile = lazy(() => import('./Pages/Profile'));
const Orders = lazy(() => import('./Pages/Orders'));
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'));
const AdminReviews = lazy(() => import('./Pages/AdminReviews'));
const AdminSettings = lazy(() => import('./Pages/AdminSettings'));
const Services = lazy(() => import('./Pages/Services'));
const PrivateLabeling = lazy(() => import('./Pages/Services/PrivateLabeling'));
const ThirdPartyManufacturing = lazy(() => import('./Pages/Services/ThirdPartyManufacturing'));
const ContractManufacturing = lazy(() => import('./Pages/Services/ContractManufacturing'));
const Blog = lazy(() => import('./Pages/Blog'));
const CompanyProfile = lazy(() => import('./Pages/CompanyProfile'));
const ManufacturingCapabilities = lazy(() => import('./Pages/ManufacturingCapabilities'));

// Create MyContext for backward compatibility
export const MyContext = createContext();

// Module-level flags - survive React StrictMode double-mount
let pixelInitDone = false;
let initialPageViewFired = false;

const MetaPixelRouteTracker = () => {
    const location = useLocation();

    // Initialize Meta Pixel and track PageView ONCE
    useEffect(() => {
        if (pixelInitDone) return;
        pixelInitDone = true;
        
        // Initialize pixel
        initMetaPixel();
        
        // Track PageView after pixel loads (only once)
        const pageViewTimer = window.setTimeout(() => {
            if (!initialPageViewFired) {
                initialPageViewFired = true;
                trackPageView(location.pathname);
            }
        }, 100);

        return () => window.clearTimeout(pageViewTimer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Track on route changes only (NOT initial render)
    const lastPathRef = useRef(location.pathname);
    
    useEffect(() => {
        const currentPath = location.pathname;
        
        // Only track if:
        // 1. Initial PageView has already fired
        // 2. Path has actually changed
        if (initialPageViewFired && lastPathRef.current !== currentPath) {
            lastPathRef.current = currentPath;
            trackPageView(currentPath);
        }
    }, [location.pathname]);

    return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) return null;
    const redirectTo = `${location.pathname}${location.search || ''}`;
    return isAuthenticated
        ? children
        : <Navigate to={`/login?redirect=${encodeURIComponent(redirectTo)}`} replace />;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();
    if (loading) return null;
    const redirectTo = `${location.pathname}${location.search || ''}`;

    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTo)}`} replace />;
    }

    return String(user?.role || '').toLowerCase() === 'admin'
        ? children
        : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const ScrollToTopButton = ({ show, mainScrollRef }) => {
    const location = useLocation();
    const pathname = String(location?.pathname || '');
    const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
    if (!show || isAdminRoute) return null;

    const handleScrollTop = () => {
        const el = mainScrollRef?.current;
        if (el && typeof el.scrollTo === 'function') {
            el.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // On product detail pages the sticky purchase bar (Add to Cart / Buy Now)
    // is pinned to the very bottom of the mobile viewport — lift the FAB above
    // it so it never overlaps the Buy Now button.
    const isProductPage = /^\/product\/[^/]+/.test(pathname);
    const mobileFabBottom = isProductPage
        ? 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]'
        : 'bottom-20';

    const button = (
        <>
            <button
                type="button"
                onClick={handleScrollTop}
                className={`fixed md:hidden right-4 z-toast h-12 w-12 rounded-full bg-glowalchemy-terracotta text-white shadow-lg ring-1 ring-black/10 flex items-center justify-center hover:shadow-xl transition ${mobileFabBottom}`}
                aria-label="Scroll to top"
            >
                <FiArrowUp className="text-xl" />
            </button>

            <button
                type="button"
                onClick={handleScrollTop}
                className="hidden md:flex fixed bottom-8 right-6 z-toast h-11 w-11 rounded-full bg-glowalchemy-terracotta text-white shadow-lg ring-1 ring-black/10 items-center justify-center hover:shadow-xl transition"
                aria-label="Scroll to top"
            >
                <FiArrowUp className="text-lg" />
            </button>
        </>
    );

    if (typeof document !== 'undefined' && document?.body) {
        return createPortal(button, document.body);
    }

    return button;
};

const MobileBottomNav = () => {
    const location = useLocation();
    const { itemCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();
    const { isAuthenticated } = useAuth();

    const pathname = String(location?.pathname || '');
    const hideOn = (
        pathname.startsWith('/product/') ||
        pathname === '/checkout' ||
        pathname === '/payment' ||
        pathname === '/summary' ||
        pathname === '/cart' ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/forgot-password' ||
        pathname === '/reset-password'
    );

    if (hideOn) return null;

    const linkBase = 'flex flex-col items-center justify-center flex-1 min-w-0 h-full';

    const linkActive = 'text-glowalchemy-terracotta';
    const linkInactive = 'text-glowalchemy-warm-gray';

    const Badge = ({ value }) => {
        const v = Number(value || 0);
        if (!v) return null;
        return (
            <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-glowalchemy-terracotta text-white text-[10px] leading-[16px] text-center font-medium">
                {v > 99 ? '99+' : v}
            </span>
        );
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-mobile-nav bg-glowalchemy-white border-t border-glowalchemy-sand pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex items-center justify-around h-16 px-2">
                <NavLink
                    to="/"
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <div className="relative">
                        <FiHome className="text-xl" />
                    </div>
                    <span className="text-[10px] mt-1 font-medium">Home</span>
                </NavLink>

                <NavLink
                    to="/ProductListing"
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <FiGrid className="text-xl" />
                    <span className="text-[10px] mt-1 font-medium">Shop</span>
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <span className="relative">
                        <FiShoppingCart className="text-xl" />
                        <Badge value={itemCount} />
                    </span>
                    <span className="text-[10px] mt-1 font-medium">Cart</span>
                </NavLink>

                <NavLink
                    to="/wishlist"
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <span className="relative">
                        <FiHeart className="text-xl" />
                        <Badge value={wishlistCount} />
                    </span>
                    <span className="text-[10px] mt-1 font-medium">Wishlist</span>
                </NavLink>

                <NavLink
                    to={isAuthenticated ? '/profile' : '/login'}
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <FiUser className="text-xl" />
                    <span className="text-[10px] mt-1 font-medium">Account</span>
                </NavLink>
            </div>
        </nav>
    );
};

import { fetchProductBySlug } from './api/catalog';
const ProductDetailsRoute = () => {
    const { id } = useParams();
    return <ProductDetailModern key={id} />;
};

// SEO-friendly product URL: /vitamin-c-face-serum
// Resolves the slug via the indexed backend lookup, then renders the PDP.
// Static routes always win over this param route in React Router ranking.
const ProductSlugRoute = () => {
    const { productSlug } = useParams();
    const [resolved, setResolved] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setResolved(null);
        setFailed(false);
        if (!productSlug) return;
        fetchProductBySlug(productSlug)
            .then((p) => {
                if (cancelled) return;
                const pid = p?._id || p?.id;
                if (pid) setResolved(String(pid));
                else setFailed(true);
            })
            .catch(() => { if (!cancelled) setFailed(true); });
        return () => { cancelled = true; };
    }, [productSlug]);

    if (failed) return <Navigate to="/" replace />;
    if (!resolved) return <div className="min-h-[60vh] flex items-center justify-center text-glowalchemy-warm-gray">Loading…</div>;
    return <ProductDetailModern key={resolved} productIdOverride={resolved} />;
};

function App() {
    // Basic MyContext functionality for backward compatibility
    const [isCartPanelOpen, setIsCartPanelOpen] = React.useState(false);

    const headerRef = useRef(null);
    const mainScrollRef = useRef(null);
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const [isHeaderElevated, setIsHeaderElevated] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useLayoutEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const measure = () => {
            const h = el.offsetHeight || 0;
            setHeaderHeight(h);
        };

        measure();

        let ro;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(() => measure());
            ro.observe(el);
        } else {
            window.addEventListener('resize', measure);
        }

        return () => {
            if (ro) ro.disconnect();
            else window.removeEventListener('resize', measure);
        };
    }, []);

    useEffect(() => {
        const el = mainScrollRef.current;
        const hasEl = Boolean(el);

        let ticking = false;
        let lastScrollTop = 0;

        const getWindowScrollTop = () => {
            if (typeof window === 'undefined') return 0;
            return (window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0);
        };

        const computeTriggerPassed = (extraScrollTop = 0) => {
            const currentPath = (typeof window !== 'undefined' && window?.location?.pathname)
                ? String(window.location.pathname)
                : '';

            const marker = typeof document !== 'undefined'
                ? document.querySelector('[data-scroll-top-trigger="1"]')
                : null;

            const containerScrollTop = el?.scrollTop || 0;
            const windowScrollTop = getWindowScrollTop();
            const inferredScrollTop = Math.max(containerScrollTop, windowScrollTop, Number(extraScrollTop || 0));

            if (currentPath !== '/') {
                return {
                    passedContainer: inferredScrollTop > 200,
                    passedWindow: inferredScrollTop > 200,
                };
            }

            if (!marker || typeof marker.getBoundingClientRect !== 'function') {
                return {
                    passedContainer: containerScrollTop > 320,
                    passedWindow: windowScrollTop > 320,
                };
            }

            const markerRect = marker.getBoundingClientRect();
            const passedWindow = markerRect.top < 0;

            let passedContainer = false;
            if (el) {
                const containerRect = el.getBoundingClientRect();
                passedContainer = markerRect.top < containerRect.top;
            }

            return { passedContainer, passedWindow };
        };

        const onScroll = (evt) => {
            const containerScrollTop = el?.scrollTop || 0;
            const windowScrollTop = getWindowScrollTop();
            const targetScrollTop = (evt && evt.target && typeof evt.target.scrollTop === 'number') ? evt.target.scrollTop : 0;
            const currentScrollTop = Math.max(containerScrollTop, windowScrollTop, targetScrollTop);
            if (ticking) return;
            ticking = true;

            window.requestAnimationFrame(() => {
                setIsHeaderElevated(currentScrollTop > 4);
                const passed = computeTriggerPassed(targetScrollTop);
                setShowScrollToTop(Boolean(passed.passedContainer || passed.passedWindow));

                setIsHeaderHidden(false);

                lastScrollTop = currentScrollTop;
                ticking = false;
            });
        };

        if (hasEl) {
            el.addEventListener('scroll', onScroll, { passive: true });
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', onScroll, { passive: true });
        }
        if (typeof document !== 'undefined') {
            document.addEventListener('scroll', onScroll, { passive: true, capture: true });
        }

        const initialPassed = computeTriggerPassed();
        setShowScrollToTop(Boolean(initialPassed.passedContainer || initialPassed.passedWindow));
        return () => {
            if (hasEl) el.removeEventListener('scroll', onScroll);
            if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll);
            if (typeof document !== 'undefined') document.removeEventListener('scroll', onScroll, { capture: true });
        };
    }, []);

    const toggleCartPanel = (open) => {
        setIsCartPanelOpen(open);
    };

    const myContextValue = {
        isCartPanelOpen,
        toggleCartPanel,
    };

    return (
        <AuthProvider>
            <ContentSettingsProvider>
                <CartProvider>
                    <WishlistProvider>
                        <NotificationProvider>
                            <CategoryProvider>
                                <MyContext.Provider value={myContextValue}>
                                    <Router
                                    future={{
                                        v7_startTransition: true,
                                        v7_relativeSplatPath: true,
                                    }}
                                >
                                    <MetaPixelRouteTracker />
                                    <div className="App flex h-screen overflow-hidden">
                                        {/* Right Content Area */}
                                        <div className="flex-1 flex flex-col overflow-hidden">
                                            {/* Header - Sticky */}
                                            <Header ref={headerRef} hidden={isHeaderHidden} elevated={isHeaderElevated} />

                                            {/* Main Content - Scrollable */}
                                            <main
                                                ref={mainScrollRef}
                                                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-glowalchemy-ivory pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0 relative"
                                            >
                                                <Suspense fallback={
                                                    <div className="flex items-center justify-center h-64">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glowalchemy-terracotta"></div>
                                                    </div>
                                                }>
                                                    <Routes>
                                                        {/* Public Routes */}
                                                        <Route path="/" element={<Home />} />
                                                        <Route path="/ProductListing" element={<ProductListing />} />
                                                        <Route path="/ProductListing/:category" element={<ProductListing />} />
                                                        <Route path="/product/:id" element={<ProductDetailsRoute />} />
                                                        <Route path="/:productSlug" element={<ProductSlugRoute />} />
                                                        <Route path="/policies" element={<Policies />} />
                                                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                                        <Route path="/terms-of-service" element={<TermsOfService />} />
                                                        <Route path="/shipping-policy" element={<ShippingPolicy />} />
                                                        <Route path="/contact" element={<ContactUs />} />
                                                        <Route path="/about" element={<AboutUs />} />
                                                        <Route path="/help-center" element={<HelpCenter />} />
                                                        <Route path="/order-tracking" element={<OrderTracking />} />

                                                        {/* Auth Routes */}
                                                        <Route
                                                            path="/login"
                                                            element={
                                                                <PublicRoute>
                                                                    <LoginPage />
                                                                </PublicRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/register"
                                                            element={
                                                                <PublicRoute>
                                                                    <RegisterPage />
                                                                </PublicRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/forgot-password"
                                                            element={
                                                                <PublicRoute>
                                                                    <ForgotPasswordPage />
                                                                </PublicRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/reset-password"
                                                            element={
                                                                <PublicRoute>
                                                                    <ResetPasswordPage />
                                                                </PublicRoute>
                                                            }
                                                        />

                                                        {/* Protected Routes */}
                                                        <Route
                                                            path="/cart"
                                                            element={
                                                                <ProtectedRoute>
                                                                    <CartPage />
                                                                </ProtectedRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/wishlist"
                                                            element={
                                                                <ProtectedRoute>
                                                                    <WishlistPage />
                                                                </ProtectedRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/profile"
                                                            element={
                                                                <ProtectedRoute>
                                                                    <Profile />
                                                                </ProtectedRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/orders"
                                                            element={
                                                                <ProtectedRoute>
                                                                    <Orders />
                                                                </ProtectedRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/checkout"
                                                            element={
                                                                <ProtectedRoute>
                                                                    <CheckoutPage />
                                                                </ProtectedRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/payment"
                                                            element={
                                                                <ProtectedRoute>
                                                                    <PaymentGateway />
                                                                </ProtectedRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/summary"
                                                            element={
                                                                <ProtectedRoute>
                                                                    <SummaryPage />
                                                                </ProtectedRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/admin"
                                                            element={
                                                                <AdminRoute>
                                                                    <AdminDashboard />
                                                                </AdminRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/admin/reviews"
                                                            element={
                                                                <AdminRoute>
                                                                    <AdminReviews />
                                                                </AdminRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/admin/settings"
                                                            element={
                                                                <AdminRoute>
                                                                    <AdminSettings />
                                                                </AdminRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/admin/products"
                                                            element={
                                                                <AdminRoute>
                                                                    <Navigate to="/admin" replace />
                                                                </AdminRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/admin/orders"
                                                            element={
                                                                <AdminRoute>
                                                                    <Navigate to="/admin" replace />
                                                                </AdminRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/admin/users"
                                                            element={
                                                                <AdminRoute>
                                                                    <Navigate to="/admin" replace />
                                                                </AdminRoute>
                                                            }
                                                        />
                                                        <Route
                                                            path="/admin/analytics"
                                                            element={
                                                                <AdminRoute>
                                                                    <Navigate to="/admin" replace />
                                                                </AdminRoute>
                                                            }
                                                        />

                                                        {/* Services Routes */}
                                                        <Route path="/services" element={<Services />} />
                                                        <Route path="/services/private-labeling" element={<PrivateLabeling />} />
                                                        <Route path="/services/third-party-manufacturing" element={<ThirdPartyManufacturing />} />
                                                        <Route path="/services/contract-manufacturing" element={<ContractManufacturing />} />

                                                        {/* Other Routes */}
                                                        <Route path="/blog" element={<Blog />} />
                                                        <Route path="/company-profile" element={<CompanyProfile />} />
                                                        <Route path="/manufacturing-capabilities" element={<ManufacturingCapabilities />} />

                                                        {/* Fallback */}
                                                        <Route path="*" element={<Navigate to="/" replace />} />
                                                    </Routes>
                                                </Suspense>
                                                {/* Footer */}
                                                <Footer />
                                            </main>

                                            <ScrollToTopButton show={showScrollToTop} mainScrollRef={mainScrollRef} />

                                            <MobileBottomNav />

                                        </div>
                                    </div>
                                </Router>
                            </MyContext.Provider>
                        </CategoryProvider>
                        </NotificationProvider>
                    </WishlistProvider>
                </CartProvider>
            </ContentSettingsProvider>
        </AuthProvider>
    );
}

export default App;