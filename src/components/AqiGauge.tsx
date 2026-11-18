'use client';

import React from 'react';
import { AqiData } from '@/types';
import { getAqiCategory } from '@/lib/aqiData';
import { Thermometer, Droplets, Wind, AlertCircle } from 'lucide-react';

interface AqiGaugeProps {
  aqiData: AqiData;
}

export const AqiGauge: React.FC<AqiGaugeProps> = ({ aqiData }) => {
  const cat = getAqiCategory(aqiData.aqi);
  const percentage = Math.min(Math.round((aqiData.aqi / 500) * 100), 100);

  return (
    <div className="glass-card-strong rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl relative overflow-hidden h-full border border-white/80">
      {/* Background soft glow matching AQI color */}
      <div 
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: cat.color }}
      />

      <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2">
        <span className="font-bold uppercase tracking-wider text-slate-700">Air Quality Index</span>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px]">
          Dominant: <strong className="text-emerald-700">{aqiData.primaryPollutant}</strong>
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r="65"
            stroke="#e2e8f0"
            strokeWidth="11"
            fill="transparent"
            strokeDasharray="408"
            strokeDashoffset="102"
            strokeLinecap="round"
          />
          {/* Colored active meter arc */}
          <circle
            cx="80"
            cy="80"
            r="65"
            stroke={cat.color}
            strokeWidth="11"
            fill="transparent"
            strokeDasharray="408"
            strokeDashoffset={408 - (306 * percentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center reading */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 drop-shadow-sm">
            {aqiData.aqi}
          </span>
          <span 
            className="text-xs sm:text-sm font-extrabold uppercase tracking-wide px-3 py-0.5 rounded-full mt-1 border"
            style={{ color: cat.color, backgroundColor: `${cat.color}15`, borderColor: `${cat.color}35` }}
          >
            {cat.category}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Standard 0 - 500</span>
        </div>
      </div>

      {/* WHO Guideline Exceedance Box */}
      <div className="w-full bg-white/85 rounded-2xl p-3.5 border border-slate-200/80 mb-4 text-xs shadow-sm">
        <div className="flex items-center justify-between text-slate-700 mb-1.5 font-medium">
          <span className="flex items-center space-x-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
            <span>WHO 24h PM2.5 Limit: 15 µg/m³</span>
          </span>
          <span className="font-extrabold text-rose-600">
            {Math.round((aqiData.pollutants.pm25 / 15) * 10) / 10}x Higher
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((aqiData.pollutants.pm25 / 15) * 10, 100)}%` }}
          />
        </div>
      </div>

      {/* Weather telemetry */}
      <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 text-slate-500 text-xs font-medium">
            <Thermometer className="h-3.5 w-3.5 text-amber-500" />
            <span>Temp</span>
          </div>
          <span className="text-sm font-bold text-slate-800 mt-0.5">{aqiData.temperature}°C</span>
        </div>

        <div className="flex flex-col items-center border-x border-slate-200">
          <div className="flex items-center space-x-1 text-slate-500 text-xs font-medium">
            <Droplets className="h-3.5 w-3.5 text-cyan-600" />
            <span>Humidity</span>
          </div>
          <span className="text-sm font-bold text-slate-800 mt-0.5">{aqiData.humidity}%</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 text-slate-500 text-xs font-medium">
            <Wind className="h-3.5 w-3.5 text-teal-600" />
            <span>Wind</span>
          </div>
          <span className="text-sm font-bold text-slate-800 mt-0.5">{aqiData.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};
