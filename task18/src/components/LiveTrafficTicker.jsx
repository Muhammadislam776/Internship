import React, { useState, useEffect } from 'react';
import { Activity, Globe, Zap, CheckCircle2 } from 'lucide-react';

export default function LiveTrafficTicker() {
  const regions = ['us-east-1 (N. Virginia)', 'eu-central-1 (Frankfurt)', 'ap-southeast-1 (Singapore)', 'us-west-2 (Oregon)'];
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % regions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#040D17] border-b border-[#22D3EE]/20 py-1.5 px-4 text-[11px] font-mono text-[#94A3B8] flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[#22C55E] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
          GLOBAL EVENT CLUSTER: ONLINE
        </span>
        <span className="hidden md:inline border-l border-white/10 pl-3 text-[#22D3EE]">
          Region: <span className="text-white font-semibold">{regions[tickerIndex]}</span>
        </span>
      </div>

      <div className="flex items-center gap-4 text-[10px]">
        <span className="hidden sm:inline text-[#CBD5E1]">
          Avg Latency: <strong className="text-[#22D3EE]">48ms</strong>
        </span>
        <span className="hidden sm:inline text-[#CBD5E1]">
          Active Edge Workers: <strong className="text-[#FF7A18]">1,420</strong>
        </span>
        <span className="bg-[#2563EB]/20 text-[#2563EB] px-2 py-0.5 rounded-full border border-[#2563EB]/40 font-bold">
          HTTP/3 QUIC
        </span>
      </div>
    </div>
  );
}
