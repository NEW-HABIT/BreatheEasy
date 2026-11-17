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
import { Calendar, TrendingUp } from 'lucide-react';

interface TrendChartProps {
  aqiData: AqiData;
}

export const TrendChart: React.FC<TrendChartProps> = ({ aqiData }) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'weekly'>('hourly');

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Atmospheric Trend & Smog Inversion
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Diurnal peaks typically occur at dawn and dusk due to shallow thermal boundary layers.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('hourly')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              viewMode === 'hourly'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24-Hour Curve
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              viewMode === 'weekly'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7-Day Outlook
          </button>
        </div>
      </div>

      {viewMode === 'hourly' ? (
        <div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aqiData.hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                  domain={[0, 'dataMax + 40']} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const cat = getAqiCategory(data.aqi);
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs">
                          <p className="font-semibold text-white">{data.time}</p>
                          <p className="text-cyan-400 font-bold mt-1">AQI: {data.aqi} ({cat.category})</p>
                          <p className="text-slate-400">PM2.5: {data.pm25} µg/m³</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={100} stroke="#FBBF24" strokeDasharray="3 3" label={{ value: 'Moderate (100)', fill: '#FBBF24', fontSize: 10 }} />
                <ReferenceLine y={200} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Unhealthy (200)', fill: '#EF4444', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#aqiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Inversion Peak: 06:00 - 09:30 AM</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Sun Window: 01:00 - 03:30 PM</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 my-auto py-4">
          {aqiData.weeklyForecast.map((item, idx) => {
            const cat = getAqiCategory(item.aqi);
            return (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center hover:border-slate-700 transition"
              >
                <span className="text-xs font-semibold text-slate-400">{item.day}</span>
                <span className="text-xl font-bold text-white mt-1.5">{item.aqi}</span>
                <span 
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 line-clamp-1"
                  style={{ color: cat.color, backgroundColor: `${cat.color}20` }}
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
