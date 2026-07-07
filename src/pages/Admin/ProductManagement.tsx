import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
   
  Edit3, 
  Trash2, 
  Upload, 
  X, 
  Loader2, 
  
  Zap,
  Star,
  ArrowUpAZ,
  Sparkles
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { Product, Category } from '@/types/product';
import { uploadImage } from '@/services/cloudinary/upload.service';
import { db } from '@/services/firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';


const ProductManagement: React.FC = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, ] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Gaming',
    price: 0,
    discountPrice: 0,
    description: '',
    shortDescription: '',
    stockStatus: 'In Stock',
    totalStock: 0,
    sortOrder: 1,
    images: [],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const generateSlug = (name: string) => name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), { id: Date.now().toString(), url, isMain: prev.images?.length === 0 }]
      }));
      toast.success('Artwork Linked');
    } catch (error) {
      toast.error('Upload Failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.images?.length === 0) {
      toast.error('Name, Price, and Image required!');
      return;
    }

    const toastId = toast.loading('Synchronizing with Armory...');
    try {
      const productData = {
        ...formData,
        sortOrder: Number(formData.sortOrder) || 1,
        slug: generateSlug(formData.name!),
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        await updateDoc(doc(db, 'products', isEditing), productData);
        toast.success('Equipment Updated', { id: toastId });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString(),
          averageRating: 5.0,
          totalReviews: 0,
        });
        toast.success('New Gear Deployed', { id: toastId });
      }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error('Deployment Failed', { id: toastId });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', category: 'Gaming', price: 0, discountPrice: 0,
      description: '', shortDescription: '', stockStatus: 'In Stock',
      totalStock: 0, sortOrder: 1, images: [], isFeatured: false, 
      isNewArrival: true, isBestSeller: false
    });
    setIsEditing(null);
  };

  const filteredList = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Armory Management</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Sort Protocol & Inventory Control</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="btn-solid !py-3 flex items-center gap-2 shadow-neon-cyan/20">
          <Plus size={20} /> ADD NEW GEAR
        </button>
      </div>

      <div className="glass-panel border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-5">Rank</th>
                <th className="px-6 py-5">Equipment</th>
                <th className="px-6 py-5">Sector</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center italic text-gray-500">Syncing database...</td></tr>
              ) : filteredList.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="w-8 h-8 rounded bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-black text-xs">
                        {product.sortOrder}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={product.images[0]?.url} className="w-10 h-10 rounded object-cover border border-white/10" />
                    <span className="text-sm font-bold text-white uppercase">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-black uppercase text-neon-purple tracking-widest">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-black text-white font-heading">৳{product.price}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => { setFormData(product); setIsEditing(product.id); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-neon-cyan transition-all"><Edit3 size={16} /></button>
                    <button onClick={async () => { if(window.confirm('Delete asset?')) { await deleteDoc(doc(db, 'products', product.id)); fetchProducts(); } }} className="p-2 text-gray-500 hover:text-neon-pink transition-all"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-panel bg-[#090514] p-8 md:p-10 custom-scrollbar border-white/10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">DEPLOY <span className="text-neon-cyan">PROTOCOL</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white p-2 transition-colors"><X size={28} /></button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Asset Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan outline-none" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Base Price (৳)</label>
                      <input type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Discount Price (৳)</label>
                      <input type="number" value={formData.discountPrice || ''} onChange={(e) => setFormData({...formData, discountPrice: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sector (Category)</label>
                      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan outline-none cursor-pointer">
                        <option value="Gaming">Gaming</option>
                        <option value="Nature">Nature</option>
                        <option value="Anime">Anime</option>
                        <option value="Movie">Movie</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Unit Stock</label>
                      <input type="number" value={formData.totalStock || ''} onChange={(e) => setFormData({...formData, totalStock: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan outline-none" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-neon-cyan tracking-widest flex items-center gap-2">
                        <ArrowUpAZ size={14} /> Sort Order (Rank)
                    </label>
                    <input type="number" value={formData.sortOrder || ''} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} className="w-full bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl py-3 px-4 text-white focus:border-neon-cyan outline-none" placeholder="1, 2, 3..." required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Short Description</label>
                    <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-cyan outline-none" required />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Tactical Imagery</label>
                    <div className="grid grid-cols-3 gap-4">
                      {formData.images?.map((img) => (
                        <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                          <img src={img.url} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setFormData({...formData, images: formData.images?.filter(x => x.id !== img.id)})} className="absolute top-1 right-1 p-1 bg-neon-pink text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neon-cyan bg-white/5 transition-all">
                        {isUploading ? <Loader2 className="animate-spin text-neon-cyan" /> : <Upload size={20} className="text-gray-500" />}
                        <span className="text-[9px] font-black text-gray-500 uppercase">Upload</span>
                        <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" disabled={isUploading} />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/5">
                    <label className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Zap size={16} className="text-neon-cyan" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Featured (Hero Section)</span>
                      </div>
                      <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 accent-neon-cyan" />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Star size={16} className="text-neon-purple" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Best Seller List</span>
                      </div>
                      <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})} className="w-5 h-5 accent-neon-purple" />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">New Arrival Badge</span>
                      </div>
                      <input type="checkbox" checked={formData.isNewArrival} onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})} className="w-5 h-5 accent-green-500" />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Full Technical Report</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none h-32 resize-none focus:border-neon-cyan"></textarea>
                  </div>
                </div>

                <button type="submit" className="md:col-span-2 btn-solid !py-5 font-black text-lg shadow-neon-cyan/20 uppercase tracking-widest">Sync Deployment Protocol</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;