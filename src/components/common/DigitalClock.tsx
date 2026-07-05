import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DigitalClockProps {
  className?: string;
  showIcon?: boolean;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ className, showIcon = true }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner group overflow-hidden max-w-full",
      className
    )}>
      {showIcon && (
        <div className="relative flex-shrink-0">
          <Clock size={16} className="text-neon-cyan animate-pulse" />
          <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full"></div>
        </div>
      )}
      
      <div className="flex flex-col items-start leading-none truncate">
        {/* Responsive Text Size for Time */}
        <span className="text-[11px] sm:text-xs md:text-sm font-black font-mono tracking-[0.15em] text-white drop-shadow-[0_0_8px_rgba(0,240,255,0.3)] truncate">
          {formatTime(time)}
        </span>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-1 mt-1 truncate">
          <Zap size={8} className="text-neon-purple fill-neon-purple animate-bounce flex-shrink-0" />
          <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-neon-cyan transition-colors truncate">
            Neural_Link_Live
          </span>
        </div>
      </div>

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