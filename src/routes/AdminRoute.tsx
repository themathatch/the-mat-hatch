import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2,  } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, loading, initialized } = useAuthStore();
  const location = useLocation();

  // ১. যদি সিস্টেম এখনও চেক করছে (Loading State)
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-[#090514] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-[0.4em] font-black text-xs">Verifying Admin Clearance...</p>
      </div>
    );
  }

  // ২. যদি ইউজার লগইন না থাকে অথবা ইউজারের রোল 'admin' না হয়
  if (!user || profile?.role !== 'admin') {
    console.warn("Unauthorized Access Attempt Detected. Security Protocol Initialized.");
    
    // তাকে লগইন পেজে পাঠিয়ে দেওয়া হবে
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ৩. শুধুমাত্র মাস্টার অ্যাডমিন হলেই এই অংশটি দেখতে পাবে
  return (
    <>
      {children}
    </>
  );
};

export default AdminRoute;