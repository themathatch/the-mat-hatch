import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layout & Global Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/routes/AdminRoute'; // Security bodyguard import

// Stores
import { useAuthStore } from '@/store/authStore';

// Lazy loading Customer Pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/Product'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const CustomDesigner = lazy(() => import('./pages/Designer'));
const Login = lazy(() => import('./pages/Authentication/Login'));
const Register = lazy(() => import('./pages/Authentication/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const LegalPage = lazy(() => import('./pages/Legal'));

// Lazy loading Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const ProductManagement = lazy(() => import('./pages/Admin/ProductManagement'));
const OrderLogs = lazy(() => import('./pages/Admin/OrderLogs'));
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));
const AdminCustomers = lazy(() => import('./pages/Admin/Customers'));
const AdminLegal = lazy(() => import('./pages/Admin/LegalManagement'));

const PageLoader = () => (
  <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#090514]">
    <div className="relative">
      <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
      <div className="absolute inset-0 blur-xl bg-neon-cyan/20 animate-pulse"></div>
    </div>
    <p className="mt-4 font-heading text-lg font-semibold tracking-widest text-neon-cyan animate-pulse uppercase text-center">
      THE MAT HATCH <br />
      <span className="text-xs text-gray-500 tracking-[0.3em]">Syncing Battlestation...</span>
    </p>
  </div>
);

const App: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-[#090514] text-white selection:bg-neon-cyan selection:text-dark flex flex-col">
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Header />} />
      </Routes>

      <CartDrawer />

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* PUBLIC SECTOR */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/designer" element={<CustomDesigner />} />
            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* --- LOCKED ADMIN SECTOR --- */}
            {/* Everything inside AdminRoute is now 100% secure */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderLogs />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="legal" element={<AdminLegal />} />
            </Route>
            
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <h1 className="text-8xl md:text-9xl font-black text-[#E74C3C] mb-4 drop-shadow-[0_0_20px_rgba(231,76,60,0.4)]">404</h1>
                <p className="text-gray-400 text-xl md:text-2xl font-heading uppercase tracking-[0.2em] mb-8">Navigation Error: Sector Not Found</p>
                <a href="/" className="py-3 px-8 rounded-lg border border-[#E74C3C] text-[#E74C3C] font-bold uppercase tracking-widest hover:bg-[#E74C3C] hover:text-white transition-all duration-300">Back to Home Base</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
};

export default App;