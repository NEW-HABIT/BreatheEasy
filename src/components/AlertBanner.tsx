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
    <div className={`w-full rounded-3xl p-5 transition-all shadow-md ${
      isEmergency 
        ? 'glass-card border-l-4 border-l-rose-500 bg-rose-50/70 border-rose-200' 
        : 'glass-card border-l-4 border-l-amber-500 bg-amber-50/70 border-amber-200'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-2xl ${isEmergency ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'} shrink-0 mt-0.5 shadow-sm`}>
            {isEmergency ? <AlertTriangle className="h-6 w-6 animate-bounce" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isEmergency ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {isEmergency ? '⚠️ Winter Smog Notice' : '🌿 Daily Air Guide'}
              </span>
              <span className="text-xs text-slate-400">Updated {aqiData.updatedAt}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              {aqiData.city}: AQI {aqiData.aqi} — {cat.category}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {cat.advice}
            </p>
          </div>
        </div>

        {/* Ventilation Window & Fast AI Advice Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/90 border border-slate-200 text-xs shadow-sm">
            <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Best Window to Air Home</span>
              <span className="font-extrabold text-emerald-800">{aqiData.ventilationWindow.start} - {aqiData.ventilationWindow.end}</span>
            </div>
          </div>

          <button
            onClick={() => onAskAI(`What simple protective steps should I take right now in ${aqiData.city} for my family with AQI at ${aqiData.aqi}?`)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Family Action Tips</span>
          </button>
        </div>
      </div>
    </div>
  );
};
