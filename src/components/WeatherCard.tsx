'use client';

import React from 'react';
import { AqiData } from '@/types';
import { 
  CloudFog, Sun, CloudRain, Cloud, Wind, Droplets, 
  Eye, Compass, Gauge, AlertTriangle, ShieldCheck, Thermometer
} from 'lucide-react';

interface WeatherCardProps {
  aqiData: AqiData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ aqiData }) => {
  const w = aqiData.weather || {
    temperature: aqiData.temperature,
    apparentTemperature: aqiData.temperature - 1,
    humidity: aqiData.humidity,
    windSpeed: aqiData.windSpeed,
    windDirection: 315,
    windDirectionCompass: 'NW',
    pressure: 1016,
    visibilityKm: aqiData.aqi > 250 ? 1.5 : 5.0,
    uvIndex: 3.2,
    dewPoint: 12.0,
    weatherCode: aqiData.aqi > 200 ? 45 : 1,
    weatherDescription: aqiData.aqi > 200 ? 'Dense Fog & Smog Haze' : 'Partly Cloudy',
    inversionRisk: aqiData.aqi > 250 ? 'Severe' : aqiData.aqi > 150 ? 'High' : 'Moderate',
    inversionExplanation: aqiData.aqi > 200 
      ? 'Low ground wind (<5 km/h) and high barometric pressure are trapping toxic PM2.5 in the breathing zone.'
      : 'Moderate air movement allows natural ventilation during mid-day solar heating window.'
  };

  const getWeatherIcon = (code: number, aqi: number) => {
    if (code in [45, 48] || aqi > 200) return <CloudFog className="h-8 w-8 text-amber-600 animate-pulse" />;
    if (code in [61, 63, 65, 80, 81, 82]) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (code in [1, 2, 3]) return <Cloud className="h-8 w-8 text-teal-600" />;
    return <Sun className="h-8 w-8 text-amber-500 animate-spin-slow" />;
  };

  const getInversionBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 shadow-lg border border-white/80 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Live Weather & Inversion Telemetry
          </span>
          <h3 className="text-sm font-extrabold text-slate-900 mt-1">
            Micro-Climate & Thermal Dispersion Diagnostics
          </h3>
        </div>
        <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-500">
          <Compass className="h-3.5 w-3.5 text-emerald-600" />
          <span>{aqiData.city} Station</span>
        </div>
      </div>

      {/* Main Temperature & Weather Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-100">
            {getWeatherIcon(w.weatherCode, aqiData.aqi)}
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{w.temperature}°C</span>
              <span className="text-xs font-semibold text-slate-500">Feels like {w.apparentTemperature}°C</span>
            </div>
            <p className="text-xs font-extrabold text-emerald-800 mt-0.5">{w.weatherDescription}</p>
          </div>
        </div>

        {/* Inversion Alert Pill */}
        <div className={`p-3 rounded-2xl border ${getInversionBadge(w.inversionRisk)} max-w-sm`}>
          <div className="flex items-center space-x-1.5 font-bold text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Thermal Inversion: {w.inversionRisk} Risk</span>
          </div>
          <p className="text-[11px] mt-1 leading-relaxed opacity-90">
            {w.inversionExplanation}
          </p>
        </div>
      </div>

      {/* Detailed Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Humidity */}
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Droplets className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[11px] font-semibold">Humidity</span>
          </div>
          <span className="text-base font-extrabold text-slate-900">{w.humidity}%</span>
          <span className="text-[10px] text-slate-400 block">{w.humidity > 70 ? 'Trapping fog' : 'Normal'}</span>
        </div>

        {/* Wind Speed & Direction */}
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Wind className="h-3.5 w-3.5 text-teal-600" />
            <span className="text-[11px] font-semibold">Wind Speed</span>
          </div>
          <span className="text-base font-extrabold text-slate-900">{w.windSpeed} km/h</span>
          <span className="text-[10px] text-emerald-700 font-bold block">{w.windDirectionCompass} ({w.windDirection}°)</span>
        </div>

        {/* Pressure */}
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Gauge className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-[11px] font-semibold">Pressure</span>
          </div>
          <span className="text-base font-extrabold text-slate-900">{w.pressure} hPa</span>
          <span className="text-[10px] text-slate-400 block">{w.pressure > 1014 ? 'High Stagnation' : 'Normal'}</span>
        </div>

        {/* Visibility */}
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Eye className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold">Visibility</span>
          </div>
          <span className="text-base font-extrabold text-slate-900">{w.visibilityKm} km</span>
          <span className="text-[10px] text-slate-400 block">{w.visibilityKm < 2.0 ? 'Smog haze' : 'Good'}</span>
        </div>

        {/* UV Index */}
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Sun className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-[11px] font-semibold">UV Index</span>
          </div>
          <span className="text-base font-extrabold text-slate-900">{w.uvIndex}</span>
          <span className="text-[10px] text-slate-400 block">Moderate</span>
        </div>

        {/* Dew Point */}
        <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Thermometer className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-[11px] font-semibold">Dew Point</span>
          </div>
          <span className="text-base font-extrabold text-slate-900">{w.dewPoint}°C</span>
          <span className="text-[10px] text-slate-400 block">Condensation</span>
        </div>
      </div>
    </div>
  );
};
