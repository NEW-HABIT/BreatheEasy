'use client';

import React from 'react';
import { Wind } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Fetching real-time atmospheric telemetry...",
  submessage = "Connecting to live satellite sensors and EPA monitoring grid"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative flex items-center justify-center my-6">
        {/* Outer breathing ring */}
        <div className="absolute w-28 h-28 rounded-full bg-emerald-400/20 animate-breathe" />
        {/* Middle pulse ring */}
        <div className="absolute w-20 h-20 rounded-full bg-teal-400/25 animate-ping opacity-60" />
        {/* Center glass orb */}
        <div className="relative w-16 h-16 rounded-full glass-card-strong flex items-center justify-center shadow-lg border border-emerald-300/60">
          <Wind className="w-8 h-8 text-emerald-600 animate-pulse" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-800 mt-2">{message}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{submessage}</p>
    </div>
  );
};
