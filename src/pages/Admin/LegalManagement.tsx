import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { 
  FileText, 
  Save, 
  RefreshCcw, 
  Loader2,
  AlertTriangle,
  History
} from 'lucide-react';
import { db } from '@/services/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const POLICIES = [
  { id: 'privacy-policy', title: 'Privacy Policy' },
  { id: 'terms-conditions', title: 'Terms & Conditions' },
  { id: 'refund-policy', title: 'Refund Policy' },
  { id: 'shipping-policy', title: 'Shipping Policy' },
  { id: 'about-us', title: 'About Us' }
];

const LegalManagement: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(POLICIES[0].id);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'legal', selectedPolicy);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent(docSnap.data().content);
          if (docSnap.data().updatedAt) {
              const date = docSnap.data().updatedAt.toDate();
              setLastUpdated(date.toLocaleString());
          }
        } else {
          setContent('<h1>New Policy</h1><p>Initiating tactical documentation...</p>');
          setLastUpdated(null);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Database link failed");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [selectedPolicy]);

  const handleSave = async () => {
    if (!content.trim() || content === '<p><br></p>') {
      toast.error("Command Refused: Empty content detected.");
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'legal', selectedPolicy), {
        content,
        updatedAt: serverTimestamp(),
        title: POLICIES.find(p => p.id === selectedPolicy)?.title
      });
      toast.success(`${POLICIES.find(p => p.id === selectedPolicy)?.title} Deployed!`);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      toast.error("Deployment to server failed");
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'clean']
    ],
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Legal Control</h1>
          <p className="text-gray-500 text-sm font-heading tracking-widest uppercase">Policy Documentation Hub</p>
        </div>
        
        {lastUpdated && (
            <div className="flex items-center gap-2 text-[10px] font-black text-neon-purple uppercase tracking-widest bg-neon-purple/5 px-4 py-2 rounded-lg border border-neon-purple/20">
                <History size={14} />
                Sync: {lastUpdated}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-6 border-white/5 bg-dark-card/40">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                <FileText size={14} /> Documentation
            </h3>
            <div className="flex flex-col gap-2">
              {POLICIES.map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedPolicy === policy.id 
                    ? "bg-neon-cyan text-dark shadow-neon-cyan" 
                    : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {policy.title}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 border-neon-pink/20 bg-neon-pink/5">
            <div className="flex gap-4">
              <AlertTriangle className="text-neon-pink flex-shrink-0" size={20} />
              <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold">
                Deploying changes will overwrite global policy data instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="glass-panel p-1 border-white/5 bg-white overflow-hidden rounded-2xl">
            {loading ? (
              <div className="h-[500px] flex flex-col items-center justify-center bg-dark">
                <Loader2 className="w-10 h-10 text-neon-cyan animate-spin mb-4" />
                <p className="text-gray-500 uppercase tracking-widest text-xs">Accessing Signal...</p>
              </div>
            ) : (
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                className="text-dark h-[450px]"
              />
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
             <button 
                onClick={() => setContent('')}
                className="px-8 py-4 rounded-xl border border-white/10 text-gray-500 hover:text-neon-pink transition-all font-black text-[10px] uppercase tracking-widest"
             >
               <RefreshCcw size={16} className="inline mr-2" /> Reset
             </button>
             <button 
                onClick={handleSave}
                disabled={saving || loading}
                className="btn-solid !py-4 !px-12 shadow-neon-cyan/20 flex items-center gap-3 group"
             >
               {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> DEPLOY POLICY</>}
             </button>
          </div>
        </div>
      </div>

      {/* Editor Custom Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ql-toolbar.ql-snow { border: none !important; background: #f8fafc !important; border-bottom: 1px solid #e2e8f0 !important; }
        .ql-container.ql-snow { border: none !important; font-family: 'Inter', sans-serif !important; }
        .ql-editor { min-height: 400px !important; font-size: 16px !important; }
      `}} />
    </div>
  );
};

export default LegalManagement;