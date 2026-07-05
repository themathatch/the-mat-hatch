import React, { useEffect, useState } from 'react';

import { 
  Save, 
  Layout, 
  Image as ImageIcon, 
  ShoppingCart, 
   
  Loader2,
  AlertCircle,
  Zap,
  MousePointer2
} from 'lucide-react';
import { db } from '@/services/firebase/config';
import { doc, getDoc, setDoc,  } from 'firebase/firestore';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/types/product';
import { toast } from 'react-hot-toast';

const Settings: React.FC = () => {
  const { products, fetchProducts } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const initSettings = async () => {
      setLoading(true);
      await fetchProducts(); // সব প্রোডাক্ট লোড করা

      // বর্তমানে সেভ করা হিরো সেটিংস নিয়ে আসা
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'hero'));
        if (settingsDoc.exists()) {
          setSelectedProductId(settingsDoc.data().productId);
        }
      } catch (error) {
        console.error("Settings Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initSettings();
  }, [fetchProducts]);

  // যখন ড্রপডাউন থেকে প্রোডাক্ট চেঞ্জ হবে, তখন প্রিভিউ আপডেট করা
  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      setSelectedProduct(product || null);
    }
  }, [selectedProductId, products]);

  const handleSaveSettings = async () => {
    if (!selectedProductId) {
      toast.error('Please select a tactical asset first!');
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'hero'), {
        productId: selectedProductId,
        updatedAt: new Date().toISOString()
      });
      toast.success('Hero Protocol Updated Successfully!');
    } catch (error) {
      toast.error('Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-neon-cyan animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs">Accessing System Config...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">System Settings</h1>
        <p className="text-gray-500 text-sm font-heading tracking-widest uppercase">Frontend UI Configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Configuration Form */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-panel p-8 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-transparent"></div>
            
            <h3 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
              <Layout size={24} className="text-neon-cyan" />
              Hero Banner Control
            </h3>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Featured Hero Product</label>
                <select 
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#130C25] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-neon-cyan outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select tactical gear...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name.toUpperCase()} (৳{product.price})
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-relaxed">
                  Choose which product will be showcased in the primary hero section on the landing page.
                </p>
              </div>

              <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full btn-solid !py-4 flex items-center justify-center gap-3 shadow-neon-cyan/20 group"
              >
                {saving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    DEPLOY UI CHANGES
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 border-[#E74C3C]/20 bg-[#E74C3C]/5">
            <div className="flex gap-4">
              <AlertCircle className="text-[#E74C3C] flex-shrink-0" size={24} />
              <div>
                <h4 className="text-sm font-black text-white uppercase mb-1">Global Broadcast</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  UI changes will reflect globally for all users immediately after successful deployment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 border-white/5 bg-[#090514]">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
              <ImageIcon size={18} />
              Real-time Preview
            </h3>

            {selectedProduct ? (
              <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10"></div>
                <img 
                  src={selectedProduct.images[0]?.url} 
                  alt="Preview" 
                  className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Floating Content Preview */}
                <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black bg-neon-cyan text-dark px-3 py-1 rounded uppercase tracking-[0.2em]">Featured Asset</span>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{selectedProduct.name}</h4>
                    </div>
                    <div className="bg-dark/80 backdrop-blur-md border border-neon-cyan/30 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                        <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Pricing</p>
                            <p className="text-xl font-black text-white font-heading">৳{selectedProduct.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-gray-700">
                <Zap size={48} className="mb-4 opacity-20" />
                <p className="font-heading uppercase tracking-widest text-sm">Target selection required for preview</p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
              <span className="flex items-center gap-2"><MousePointer2 size={12} /> Interactive Element</span>
              <span>The Mat Hatch UI v1.0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;