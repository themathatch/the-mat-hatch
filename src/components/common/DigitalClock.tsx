import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DigitalClockProps {
  className?: string;
  showIcon?: boolean;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ className, showIcon = true }) => {
  const [time, setTime] = useState(new Date());

  // ঘড়ি আপডেট করার লজিক (প্রতি সেকেন্ডে)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // সময় ফরম্যাট করা (HH:MM:SS)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner group",
      className
    )}>
      {showIcon && (
        <div className="relative">
          <Clock size={16} className="text-neon-cyan animate-pulse" />
          <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full"></div>
        </div>
      )}
      
      <div className="flex flex-col items-start leading-none">
        {/* মেইন ডিজিটাল ডিসপ্লে */}
        <span className="text-sm font-black font-mono tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
          {formatTime(time)}
        </span>
        
        {/* স্ট্যাটাস ইন্ডিকেটর */}
        <div className="flex items-center gap-1 mt-1">
          <Zap size={8} className="text-neon-purple fill-neon-purple animate-bounce" />
          <span className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-600 group-hover:text-neon-cyan transition-colors">
            Neural_Link_Live
          </span>
        </div>
      </div>

      {/* ডেকোরেটিভ স্ক্যানিং লাইন ইফেক্ট */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-10">
          <div className="w-full h-[1px] bg-neon-cyan animate-[clock-scan_4s_linear_infinite]"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes clock-scan {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(40px); }
        }
      `}} />
    </div>
  );
};

export default DigitalClock;