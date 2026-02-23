import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
// Lazy loading public routes
const Home = lazy(() => import('./pages/public/Home'));
const Features = lazy(() => import('./pages/public/Features'));
const Purchase = lazy(() => import('./pages/public/Purchase'));
const Cart = lazy(() => import('./pages/public/Cart'));
const Services = lazy(() => import('./pages/public/Services'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/public/Login'));
const Projects = lazy(() => import('./pages/public/Projects'));
const Invoice = lazy(() => import('./pages/public/Invoice'));
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { useAuthStore } from './store/authStore';

// Lazy loading admin routes
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Quotes = lazy(() => import('./pages/admin/Quotes'));
const Contracts = lazy(() => import('./pages/admin/Contracts'));
const Tickets = lazy(() => import('./pages/admin/Tickets'));
const Products = lazy(() => import('./pages/admin/Products'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Team = lazy(() => import('./pages/admin/Team'));

// Lazy loading portal routes
const PortalLogin = lazy(() => import('./pages/public/portal/PortalLogin'));
const PortalRegister = lazy(() => import('./pages/public/portal/PortalRegister'));
const PortalDashboard = lazy(() => import('./pages/public/portal/PortalDashboard'));
const NewTicketPortal = lazy(() => import('./pages/public/portal/NewTicketPortal'));
const TicketDetailsPortal = lazy(() => import('./pages/public/portal/TicketDetailsPortal'));
const CustomerProtectedRoute = lazy(() => import('./components/CustomerProtectedRoute'));

// View routes (Printable/PDF)
const ContractView = lazy(() => import('./pages/public/ContractView.jsx'));

interface PlaceholderProps {
    title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => (
    <div className="min-h-screen grid place-items-center bg-base-200">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p>Em desenvolvimento...</p>
        </div>
    </div>
);

const PageLoader = () => (
    <div className="min-h-screen grid place-items-center bg-base-200">
        <span className="loading loading-spinner text-primary loading-lg"></span>
    </div>
);

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(this: unknown, ...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function AppContent() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' ||
        location.pathname.startsWith('/invoice') ||
        location.pathname.startsWith('/portal');

    const { isAuthenticated, logout } = useAuthStore();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleActivity = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                logout();
                window.location.href = '/login';
            }, 5 * 60 * 1000);
        };

        const resetTimer = debounce(handleActivity, 1000) as unknown as EventListener;
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));

        handleActivity();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [isAuthenticated, logout]);

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            {!hideNavbar && <Navbar />}
            <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/purchase" element={<Purchase />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/invoice/:orderId" element={<Invoice />} />
                        <Route path="/contract/:contractId" element={<ContractView />} />

                        {/* Portal do Cliente */}
                        <Route path="/portal/login" element={<PortalLogin />} />
                        <Route path="/portal/register" element={<PortalRegister />} />
                        <Route element={<CustomerProtectedRoute />}>
                            <Route path="/portal" element={<PortalDashboard />} />
                            <Route path="/portal/new-ticket" element={<NewTicketPortal />} />
                            <Route path="/portal/ticket/:ticketId" element={<TicketDetailsPortal />} />
                        </Route>

                        {/* Protected Admin Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="quotes" element={<Quotes />} />
                                <Route path="contracts" element={<Contracts />} />
                                <Route path="tickets" element={<Tickets />} />
                                <Route path="products" element={<Products />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="customers" element={<Customers />} />
                                <Route path="team" element={<Team />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="*" element={<Placeholder title="Em Construção" />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<Placeholder title="Página não encontrada" />} />
                    </Routes>
                </Suspense>
            </main>
            {!hideNavbar && <Footer />}
        </div>
    );
}

import SplashScreen from './components/SplashScreen';

function App() {
    return (
        <Router>
            <SplashScreen />
            <AppContent />
        </Router>
    );
}

export default App;

