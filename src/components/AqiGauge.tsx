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

  const getComfortStatus = (aqi: number) => {
    if (aqi <= 50) return { title: 'Pure & Clean', advice: 'Ideal for outdoor walks, morning jogs, and open windows.', badge: 'Optimal Breathing' };
    if (aqi <= 100) return { title: 'Moderate Air', advice: 'Good for most. Sensitive individuals may prefer light exercise.', badge: 'Comfortable' };
    if (aqi <= 150) return { title: 'Mildly Hazy', advice: 'Kids and elders should avoid prolonged outdoor cardio today.', badge: 'Sensitive' };
    if (aqi <= 200) return { title: 'Smoggy Air', advice: 'Noticeable haze. Wear a comfortable mask when traveling outdoors.', badge: 'Mask Advised' };
    if (aqi <= 300) return { title: 'Heavy Smog', advice: 'Keep windows sealed. Best to rest indoors with filtered air.', badge: 'Stay Indoors' };
    return { title: 'Severe Smog', advice: 'Hazardous air outside. Stay strictly indoors with air purifiers active.', badge: 'Emergency Rest' };
  };

  const comfort = getComfortStatus(aqiData.aqi);

  return (
    <div className="glass-card-strong rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl relative overflow-hidden h-full border border-white/90">
      {/* Background soft ambient halo matching AQI color */}
      <div 
        className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: cat.color }}
      />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs mb-2">
        <span className="font-extrabold tracking-wide text-slate-800 flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: cat.color }} />
          <span>Air Freshness</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-slate-100/80 text-slate-700 font-bold text-[11px] border border-slate-200/60 shadow-sm">
          {comfort.badge}
        </span>
      </div>

      {/* Sleek Radial Gauge */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r="65"
            stroke="#f1f5f9"
            strokeWidth="10"
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
            strokeWidth="10"
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
            className="text-xs font-bold uppercase tracking-wide px-3 py-0.5 rounded-full mt-1.5 border shadow-sm"
            style={{ color: cat.color, backgroundColor: `${cat.color}15`, borderColor: `${cat.color}35` }}
          >
            {cat.category}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 font-medium">{comfort.title}</span>
        </div>
      </div>

      {/* Human-Friendly Breathing Comfort Card */}
      <div className="w-full bg-white/90 rounded-2xl p-3.5 border border-slate-200/80 mb-3 text-xs shadow-sm space-y-1.5">
        <div className="flex items-center justify-between text-slate-800 font-bold">
          <span className="flex items-center space-x-1.5">
            <span className="text-sm">🍃</span>
            <span>Breathing Comfort</span>
          </span>
          <span className="text-[11px] font-extrabold" style={{ color: cat.color }}>
            {cat.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {comfort.advice}
        </p>
      </div>

      {/* Clean Quick Metrics */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-100/80 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-medium">
            <Thermometer className="h-3 w-3 text-amber-500" />
            <span>Temp</span>
          </div>
          <span className="text-sm font-extrabold text-slate-800 mt-0.5">{aqiData.temperature}°C</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-medium">
            <Droplets className="h-3 w-3 text-blue-500" />
            <span>Humidity</span>
          </div>
          <span className="text-sm font-extrabold text-slate-800 mt-0.5">{aqiData.humidity}%</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-medium">
            <Wind className="h-3 w-3 text-teal-500" />
            <span>Breeze</span>
          </div>
          <span className="text-sm font-extrabold text-slate-800 mt-0.5">{aqiData.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};
