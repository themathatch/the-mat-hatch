import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { db } from '@/services/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const LegalPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [policy, setPolicy] = useState<{ title: string; content: string; updatedAt?: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!type) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'legal', type);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPolicy(docSnap.data() as any);
        } else {
          setPolicy(null);
        }
      } catch (error) {
        console.error("Legal Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
    window.scrollTo(0, 0);
  }, [type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090514] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-[0.4em] font-black text-xs">Accessing Legal Database...</p>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <AlertCircle size={64} className="text-neon-pink mb-6" />
        <h1 className="text-4xl font-black text-white mb-4 uppercase">Document Not Found</h1>
        <p className="text-gray-500 mb-8">The requested policy document is missing from our terminal.</p>
        <Link to="/" className="btn-primary px-8">Return to Base</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{policy.title} | THE MAT HATCH</title>
      </Helmet>

      <div className="min-h-screen bg-[#090514] pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative Background Ambient */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-neon-purple/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-12">
            <Link to="/" className="hover:text-neon-cyan transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-neon-cyan">{policy.title}</span>
          </nav>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 md:p-16 border-white/5 relative overflow-hidden"
          >
            {/* Top Status Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan opacity-50"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
              <div>
                <div className="flex items-center gap-3 text-neon-cyan mb-3">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Authorized Document</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  {policy.title}
                </h1>
              </div>
              
              {policy.updatedAt && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Clock size={14} className="text-neon-purple" />
                  Last Updated: {policy.updatedAt.toDate ? format(policy.updatedAt.toDate(), 'dd MMM, yyyy') : 'Recently'}
                </div>
              )}
            </div>

            {/* Rendered Policy Content */}
            <div className="prose-container">
              <div 
                className="legal-content text-gray-300 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: policy.content }}
              />
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
               <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-neon-cyan transition-all">
                 <ArrowLeft size={16} /> Back to Gear Store
               </Link>
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                 <FileText size={14} className="text-neon-purple" />
                 TMH Security Protocol v2.4
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global Styles for Policy Content (Quill Styles) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .legal-content h1 { color: white; font-size: 2.2rem; font-weight: 800; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em; }
        .legal-content h2 { color: #00F0FF; font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; text-transform: uppercase; }
        .legal-content h3 { color: #9D00FF; font-size: 1.2rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.8rem; }
        .legal-content p { margin-bottom: 1.2rem; color: #9ca3af; line-height: 1.8; }
        .legal-content ul, .legal-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; color: #9ca3af; }
        .legal-content li { margin-bottom: 0.5rem; }
        .legal-content a { color: #00F0FF; text-decoration: underline; }
        .legal-content strong { color: white; font-weight: 700; }
        .legal-content blockquote { border-left: 4px solid #9D00FF; padding-left: 1.5rem; font-style: italic; color: #d1d5db; margin: 2rem 0; }
      `}} />
    </>
  );
};

export default LegalPage;