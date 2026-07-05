import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Move, 
  Maximize, 
   
  ShoppingCart, 
  ShieldCheck, 
  Zap,
  Info,
  CheckCircle2,
  Trash2,
  Terminal,
  Loader2,
  
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const CustomDesigner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Custom Product Blueprint
  const customMatProduct: any = {
    id: 'custom-mat-900x400',
    name: 'Custom Printed Tactical Mat',
    price: 1490,
    category: 'Custom',
    images: [{ id: 'custom-preview', url: '', isMain: true }],
    shortDescription: 'Personalized 900x400mm extended desk mat.',
    stockStatus: 'In Stock',
    totalStock: 999,
    averageRating: 5.0,
    totalReviews: 0,
    slug: 'custom-printed-mat'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast.success("Artwork Uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const resetDesign = () => {
    setImage(null);
    setZoom(100);
    setPosX(50);
    setPosY(50);
    setNotes('');
  };

  const handleAddToCart = () => {
    if (!image) {
      toast.error("Please upload your artwork first.");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      const finalCustomProduct = {
        ...customMatProduct,
        images: [{ id: 'custom', url: image, isMain: true }],
        description: `Customization Notes: ${notes} | Config: Zoom ${zoom}%, X:${posX}%, Y:${posY}%`
      };
      
      addItem(finalCustomProduct);
      toast.success("Custom design added to cart!", {
          icon: <CheckCircle2 className="text-neon-cyan" />
      });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Custom Tactical Designer | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Section Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan mb-6">
              <Zap size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Customization Lab</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
              DESIGN YOUR <span className="text-transparent bg-clip-text bg-purple-gradient">LEGACY</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* PREVIEW WINDOW */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-[40px] blur-xl opacity-30"></div>
                
                <div className="relative aspect-[9/4] w-full bg-[#0D0B14] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {image ? (
                      <motion.div 
                        className="w-full h-full"
                        style={{ 
                          backgroundImage: `url(${image})`,
                          backgroundSize: `${zoom}%`,
                          backgroundPosition: `${posX}% ${posY}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    ) : (
                      <div className="text-center flex flex-col items-center gap-4">
                        <Upload size={32} className="text-gray-700" />
                        <p className="text-gray-600 font-black uppercase tracking-widest text-[10px]">Awaiting Artwork Signal</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-[#090514]/40 rounded-[32px] shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]"></div>
                  <div className="absolute top-6 left-8 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Live_Interface_v1.0</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <Info size={18} className="text-neon-cyan" />
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-tight">High-Resolution Images Only</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <Move size={18} className="text-neon-purple" />
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-tight">Adjust Axis For Best Look</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <ShieldCheck size={18} className="text-green-500" />
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-tight">900x400mm Surface Verified</p>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-8 border-white/10 relative overflow-hidden bg-white/[0.02]">
                <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan"></div>
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                  <Terminal size={20} className="text-neon-cyan" />
                  Terminal Controls
                </h3>

                <div className="space-y-6">
                  {!image ? (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-12 rounded-2xl border-2 border-dashed border-white/10 hover:border-neon-cyan bg-white/5 transition-all group flex flex-col items-center gap-4"
                    >
                      <Upload size={32} className="text-gray-500 group-hover:text-neon-cyan group-hover:scale-110 transition-all" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Upload Artwork</span>
                    </button>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                      {/* Zoom */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <label className="flex items-center gap-2"><Maximize size={14} className="text-neon-cyan" /> Magnification</label>
                          <span className="text-neon-cyan">{zoom}%</span>
                        </div>
                        <input type="range" min="50" max="300" value={zoom} onChange={(e) => setZoom(parseInt(e.target.value))} className="w-full accent-neon-cyan h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      {/* X Pos */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <label className="flex items-center gap-2"><Move size={14} className="text-neon-purple" /> X-Axis</label>
                          <span className="text-neon-purple">{posX}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full accent-neon-purple h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      {/* Y Pos */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <label className="flex items-center gap-2"><Move size={14} className="text-neon-pink" /> Y-Axis</label>
                          <span className="text-neon-pink">{posY}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full accent-neon-pink h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Print Instructions</label>
                        <textarea 
                          value={notes} onChange={(e) => setNotes(e.target.value)}
                          placeholder="Positioning details..."
                          className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:border-neon-cyan outline-none resize-none h-24"
                        />
                      </div>

                      <button onClick={resetDesign} className="w-full py-3 rounded-xl border border-neon-pink/20 bg-neon-pink/5 text-neon-pink text-[10px] font-black uppercase tracking-widest hover:bg-neon-pink hover:text-white transition-all flex items-center justify-center gap-2">
                        <Trash2 size={14} /> Clear Terminal
                      </button>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
              </div>

              {/* ACTION BOX */}
              <div className="glass-panel p-8 border-white/10">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Protocol Cost</p>
                    <p className="text-4xl font-black text-white font-heading">৳1,490</p>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={!image || isProcessing}
                  className={cn(
                    "w-full btn-solid !py-5 flex items-center justify-center gap-3 shadow-neon-cyan/20 uppercase font-black tracking-widest",
                    (!image || isProcessing) && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <><ShoppingCart size={20} /> Deploy To Cart</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomDesigner;