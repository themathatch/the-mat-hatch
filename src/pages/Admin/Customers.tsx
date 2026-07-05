import React, { useEffect, useState } from 'react';

import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  Shield, 
   
  
  Filter,
  Loader2,
  
  ExternalLink
} from 'lucide-react';
import { db } from '@/services/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Customer {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  createdAt: any;
  photoURL?: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('role', 'asc'));
      const querySnapshot = await getDocs(q);
      const customerData = querySnapshot.docs.map(doc => ({
        ...doc.data()
      })) as Customer[];
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Gamer Database</h1>
          <p className="text-gray-500 text-sm font-heading tracking-widest uppercase">Registered Operatives Registry</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Gamers</p>
              <p className="text-xl font-black text-white">{customers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 border-white/5">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email base..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-neon-cyan outline-none transition-all"
          />
        </div>
        <button className="px-6 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center gap-2 transition-all">
          <Filter size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Sort Protocol</span>
        </button>
      </div>

      {/* Customers Table */}
      <div className="glass-panel border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-5">Operative Profile</th>
                <th className="px-6 py-5">Communication</th>
                <th className="px-6 py-5">Security Clearancce</th>
                <th className="px-6 py-5">Deployment Date</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-neon-cyan animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 uppercase tracking-widest text-xs italic">Syncing Operative Data...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-600 italic uppercase tracking-widest text-sm">
                    No matching operatives detected in system.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.uid} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-dark-card to-white/5 p-0.5 border border-white/10">
                          {customer.photoURL ? (
                            <img src={customer.photoURL} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neon-purple font-bold">
                              {customer.displayName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{customer.displayName || 'Unknown Gamer'}</p>
                          <p className="text-[9px] text-gray-500 font-mono tracking-tighter">UID: {customer.uid.slice(0, 12)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail size={14} className="text-neon-cyan" />
                        <span className="text-xs">{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border",
                        customer.role === 'admin' 
                          ? "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 shadow-[0_0_10px_rgba(0,240,255,0.1)]" 
                          : "text-neon-purple border-neon-purple/20 bg-neon-purple/5"
                      )}>
                        <Shield size={10} />
                        {customer.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar size={14} />
                        {customer.createdAt ? (
                            typeof customer.createdAt === 'string' 
                            ? format(new Date(customer.createdAt), 'dd MMM yyyy')
                            : format(customer.createdAt.toDate(), 'dd MMM yyyy')
                        ) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;