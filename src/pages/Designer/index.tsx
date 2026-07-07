import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion,  } from 'framer-motion';
import { 
  Upload, 
  Move, 
  Maximize, 
  ShoppingCart, 
  ShieldCheck, 
  
  Trash2,
  Terminal,
  Loader2,
  
  ImagePlus
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { uploadImage } from '@/services/cloudinary/upload.service';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const CustomDesigner: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Adjust
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  const customMatProduct: any = {
    id: `custom-${Date.now()}`,
    name: 'Custom Printed Tactical Mat',
    price: 1490,
    category: 'Custom',
    shortDescription: '900x400mm Extended XL Custom Mat',
    stockStatus: 'In Stock',
    totalStock: 999,
    slug: 'custom-printed-mat'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error("File size exceeds 15MB limit!");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setCurrentStep(2);
        toast.success("New Artwork Linked!");
      };
      reader.readAsDataURL(file);
    }
  };

  const resetDesign = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setZoom(100);
    setPosX(50);
    setPosY(50);
    setNotes('');
    setCurrentStep(1);
    toast.error("Design Reset. Terminal Clear.");
  };

  const handleAddToCart = async () => {
    if (!imageFile) return;
    
    setIsProcessing(true);
    const toastId = toast.loading('Uploading artwork...');

    try {
      const cloudinaryUrl = await uploadImage(imageFile);
      const finalCustomProduct = {
        ...customMatProduct,
        images: [{ id: 'custom', url: cloudinaryUrl, isMain: true }],
        description: `Notes: ${notes} | Config: Zoom ${zoom}%, X:${posX}%, Y:${posY}%`
      };
      addItem(finalCustomProduct);
      toast.success("Design secured in cart!", { id: toastId });
      setIsProcessing(false);
      resetDesign();
    } catch (error) {
      toast.error("Upload failed.", { id: toastId });
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Custom Designer | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#06040C] pt-24 pb-10 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all", currentStep === 1 ? "bg-neon-cyan text-dark border-neon-cyan shadow-neon-cyan" : "bg-white/5 text-gray-500 border-white/5")}>
              01 Upload
            </div>
            <div className="w-8 h-px bg-white/10"></div>
            <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all", currentStep === 2 ? "bg-neon-purple text-white border-neon-purple shadow-neon-purple" : "bg-white/5 text-gray-500 border-white/5")}>
              02 Tactical Adjust
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: DESIGN TERMINAL */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* PREVIEW BOX */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-[30px] blur-lg opacity-30"></div>
                <div className="relative aspect-[9/4] w-full bg-[#0D0B14] rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
                  {previewUrl ? (
                    <motion.div 
                      className="w-full h-full"
                      style={{ 
                        backgroundImage: `url(${previewUrl})`,
                        backgroundSize: `${zoom}%`,
                        backgroundPosition: `${posX}% ${posY}%`,
                        backgroundRepeat: 'no-repeat'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-600">
                        <Upload size={28} />
                      </div>
                      <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">Awaiting Signal (Upload Image)</p>
                    </div>
                  )}
                  <div className="absolute top-4 left-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Live_Tactical_Preview</span>
                  </div>
                </div>
              </div>

              {/* STEP 1: UPLOAD BUTTON */}
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-16 rounded-3xl border-2 border-dashed border-white/10 hover:border-neon-cyan bg-[#130C25]/50 flex flex-col items-center gap-4 transition-all group"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform shadow-lg">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black uppercase tracking-widest text-white">SELECT ARTWORK</p>
                      <p className="text-[10px] text-gray-500 uppercase mt-2">Maximum File Size: 15MB</p>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* STEP 2: ADJUST CONTROLS + RE-UPLOAD OPTION */}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 md:p-8 border-white/10 relative overflow-hidden bg-white/[0.02]">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Terminal size={16} className="text-neon-cyan" /> Adjust Layout
                    </h3>
                    
                    <div className="flex gap-4">
                        {/* RE-UPLOAD BUTTON */}
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="text-[10px] font-black text-neon-cyan flex items-center gap-1.5 uppercase hover:underline"
                        >
                            <ImagePlus size={14} /> Change Art
                        </button>
                        <button 
                            onClick={resetDesign} 
                            className="text-[10px] font-black text-neon-pink flex items-center gap-1.5 uppercase hover:underline"
                        >
                            <Trash2 size={14} /> Reset
                        </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                        <label className="flex items-center gap-2"><Maximize size={12} className="text-neon-cyan" /> Magnification</label>
                        <span className="text-neon-cyan">{zoom}%</span>
                      </div>
                      <input type="range" min="50" max="300" value={zoom} onChange={(e) => setZoom(parseInt(e.target.value))} className="w-full accent-neon-cyan h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                          <label className="flex items-center gap-2"><Move size={12} className="text-neon-purple" /> X-Axis</label>
                          <span className="text-neon-purple">{posX}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full accent-neon-purple h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                          <label className="flex items-center gap-2"><Move size={12} className="text-neon-pink" /> Y-Axis</label>
                          <span className="text-neon-pink">{posY}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full accent-neon-pink h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Tactical Notes</label>
                        <textarea 
                            value={notes} onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add print instructions (optional)..."
                            className="w-full bg-dark border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:border-neon-cyan outline-none resize-none h-20"
                        />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            {/* RIGHT SIDE: FINALIZATION */}
            <div className="lg:col-span-5">
                <div className="glass-panel p-8 border-white/10 bg-[#090514] sticky top-24">
                    <div className="mb-8">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Operational Cost</p>
                        <h2 className="text-5xl font-black text-white font-heading">৳1,490</h2>
                        <p className="text-[9px] text-neon-cyan font-bold uppercase tracking-widest mt-2">Free Delivery Applied</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={handleAddToCart}
                            disabled={!previewUrl || isProcessing}
                            className={cn(
                                "w-full btn-solid !py-5 flex items-center justify-center gap-3 shadow-neon-cyan/20 uppercase font-black tracking-widest transition-all",
                                (!previewUrl || isProcessing) && "opacity-30 cursor-not-allowed grayscale"
                            )}
                        >
                            {isProcessing ? <Loader2 size={24} className="animate-spin text-dark" /> : <><ShoppingCart size={22} /> Deploy To Cart</>}
                        </button>
                        
                        <div className="flex items-center justify-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                            <ShieldCheck size={18} className="text-neon-cyan" />
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">End-to-End High-Res Print Protocol</span>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CustomDesigner;