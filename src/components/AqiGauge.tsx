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
  
  // Calculate percentage of 500 max AQI for arc visualization
  const percentage = Math.min(Math.round((aqiData.aqi / 500) * 100), 100);
  const strokeDashoffset = 440 - (440 * (percentage * 0.75)) / 100;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
      {/* Background glow matching AQI color */}
      <div 
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: cat.color }}
      />

      <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-semibold uppercase tracking-wider text-slate-300">Air Quality Index (AQI)</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          Primary: <strong className="text-cyan-400">{aqiData.primaryPollutant}</strong>
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r="65"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-800/80"
            strokeDasharray="408"
            strokeDashoffset="102" // leaves bottom quarter open
            strokeLinecap="round"
          />
          {/* Colored active meter arc */}
          <circle
            cx="80"
            cy="80"
            r="65"
            stroke={cat.color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray="408"
            strokeDashoffset={408 - (306 * percentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center reading */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            {aqiData.aqi}
          </span>
          <span 
            className="text-xs sm:text-sm font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full mt-1"
            style={{ color: cat.color, backgroundColor: `${cat.color}20` }}
          >
            {cat.category}
          </span>
          <span className="text-[10px] text-slate-400 mt-1">Scale 0 - 500</span>
        </div>
      </div>

      {/* WHO Guideline Comparison */}
      <div className="w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4 text-xs">
        <div className="flex items-center justify-between text-slate-300 mb-1">
          <span className="flex items-center space-x-1">
            <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
            <span>WHO 24hr PM2.5 Limit: 15 µg/m³</span>
          </span>
          <span className="font-bold text-rose-400">
            {Math.round((aqiData.pollutants.pm25 / 15) * 10) / 10}x Higher
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((aqiData.pollutants.pm25 / 15) * 10, 100)}%` }}
          />
        </div>
      </div>

      {/* Weather telemetry */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Thermometer className="h-3.5 w-3.5 text-amber-400" />
            <span>Temp</span>
          </div>
          <span className="text-sm font-semibold text-slate-200 mt-0.5">{aqiData.temperature}°C</span>
        </div>

        <div className="flex flex-col items-center border-x border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Droplets className="h-3.5 w-3.5 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <span className="text-sm font-semibold text-slate-200 mt-0.5">{aqiData.humidity}%</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Wind className="h-3.5 w-3.5 text-teal-400" />
            <span>Wind</span>
          </div>
          <span className="text-sm font-semibold text-slate-200 mt-0.5">{aqiData.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};
