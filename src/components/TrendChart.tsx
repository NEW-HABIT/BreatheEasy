'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { AqiData } from '@/types';
import { getAqiCategory } from '@/lib/aqiData';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  aqiData: AqiData;
}

export const TrendChart: React.FC<TrendChartProps> = ({ aqiData }) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'weekly'>('hourly');

  return (
    <div className="glass-card-strong rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full border border-white/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Today&apos;s Air Flow & Forecast
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Air is typically freshest around afternoon sunshine and hazier in late evening.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl self-start sm:self-auto border border-slate-200/70">
          <button
            onClick={() => setViewMode('hourly')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'hourly'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today&apos;s Hours
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'weekly'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7-Day Week
          </button>
        </div>
      </div>

      {viewMode === 'hourly' ? (
        <div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aqiData.hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lightAqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                  domain={[0, 'dataMax + 30']} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const cat = getAqiCategory(data.aqi);
                      return (
                        <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-xl shadow-lg text-xs">
                          <p className="font-bold text-slate-800">{data.time}</p>
                          <p className="text-emerald-700 font-extrabold mt-0.5">AQI: {data.aqi} ({cat.category})</p>
                          <p className="text-slate-500 font-medium">PM2.5: {data.pm25} µg/m³</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={100} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Moderate (100)', fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={200} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Unhealthy (200)', fill: '#EF4444', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#lightAqiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1 font-medium">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Ground Inversion Peak: 06:00 - 09:30 AM</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Safe Sun Window: {aqiData.ventilationWindow.start} - {aqiData.ventilationWindow.end}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 my-auto py-3">
          {aqiData.weeklyForecast.map((item, idx) => {
            const cat = getAqiCategory(item.aqi);
            return (
              <div
                key={idx}
                className="bg-white/80 border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-sm hover:border-emerald-300 transition"
              >
                <span className="text-xs font-bold text-slate-500">{item.day}</span>
                <span className="text-xl font-black text-slate-900 mt-1.5">{item.aqi}</span>
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 line-clamp-1 border"
                  style={{ color: cat.color, backgroundColor: `${cat.color}15`, borderColor: `${cat.color}35` }}
                >
                  {cat.category.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
