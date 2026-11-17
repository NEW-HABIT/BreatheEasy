'use client';

import React from 'react';
import { AlertTriangle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { AqiData } from '@/types';
import { getAqiCategory } from '@/lib/aqiData';

interface AlertBannerProps {
  aqiData: AqiData;
  onAskAI: (prompt: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ aqiData, onAskAI }) => {
  const cat = getAqiCategory(aqiData.aqi);
  const isEmergency = aqiData.aqi > 200;

  return (
    <div className={`w-full rounded-2xl border p-4 sm:p-5 transition-all ${
      isEmergency 
        ? 'bg-gradient-to-r from-red-950/60 via-slate-900 to-rose-950/40 border-rose-600/40 shadow-lg shadow-rose-950/30' 
        : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 border-amber-500/30'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-xl ${isEmergency ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'} shrink-0 mt-0.5`}>
            {isEmergency ? <AlertTriangle className="h-6 w-6 animate-bounce" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                {isEmergency ? '⚠️ Winter Smog Inversion Warning' : 'ℹ️ Air Quality Advisory'}
              </span>
              <span className="text-xs text-slate-400">Updated: {aqiData.updatedAt}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mt-1">
              {aqiData.city}: AQI is {aqiData.aqi} ({cat.category}) — PM2.5 is {Math.round(aqiData.pollutants.pm25 / 15)}x WHO Limit
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {cat.advice} Children and seniors should strictly avoid outdoors today.
            </p>
          </div>
        </div>

        {/* Ventilation Window & Fast AI Advice Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-medium">Safe Vent Window</span>
              <span className="font-semibold text-cyan-300">{aqiData.ventilationWindow.start} - {aqiData.ventilationWindow.end}</span>
            </div>
          </div>

          <button
            onClick={() => onAskAI(`What emergency steps should I take right now in ${aqiData.city} for my family with AQI at ${aqiData.aqi}?`)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Smog Action Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
