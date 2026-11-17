'use client';

import React from 'react';
import { PollutantBreakdown } from '@/types';
import { Activity, ShieldCheck, Flame, CloudFog, Factory, Sparkles } from 'lucide-react';

interface PollutantCardsProps {
  pollutants: PollutantBreakdown;
}

export const PollutantCards: React.FC<PollutantCardsProps> = ({ pollutants }) => {
  const cards = [
    {
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter (<2.5µm)',
      value: `${pollutants.pm25} µg/m³`,
      safeLimit: '15 µg/m³ (WHO)',
      status: pollutants.pm25 > 75 ? 'Critical' : pollutants.pm25 > 35 ? 'High' : 'Moderate',
      statusColor: pollutants.pm25 > 75 ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: CloudFog,
      description: 'Penetrates deep into alveolar air sacs and directly enters the bloodstream.'
    },
    {
      name: 'PM10',
      fullName: 'Coarse Particulates (<10µm)',
      value: `${pollutants.pm10} µg/m³`,
      safeLimit: '45 µg/m³ (WHO)',
      status: pollutants.pm10 > 150 ? 'Critical' : pollutants.pm10 > 100 ? 'High' : 'Moderate',
      statusColor: pollutants.pm10 > 150 ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Activity,
      description: 'Dust, construction debris, and pollen that irritate eyes, nose, and upper airways.'
    },
    {
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      value: `${pollutants.no2} ppb`,
      safeLimit: '25 ppb (WHO 24hr)',
      status: pollutants.no2 > 50 ? 'High' : 'Safe',
      statusColor: pollutants.no2 > 50 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: Flame,
      description: 'Produced from vehicle combustion & gas stoves; triggers pediatric asthma attacks.'
    },
    {
      name: 'SO₂',
      fullName: 'Sulfur Dioxide',
      value: `${pollutants.so2} ppb`,
      safeLimit: '40 ppb',
      status: pollutants.so2 > 40 ? 'High' : 'Safe',
      statusColor: pollutants.so2 > 40 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: Factory,
      description: 'Emitted from thermal coal power stations and industrial smelting.'
    },
    {
      name: 'CO',
      fullName: 'Carbon Monoxide',
      value: `${pollutants.co} ppm`,
      safeLimit: '4 ppm (WHO)',
      status: pollutants.co > 4 ? 'Warning' : 'Safe',
      statusColor: pollutants.co > 4 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: Flame,
      description: 'Colorless, odorless gas from incomplete fuel combustion; hampers oxygen transport.'
    },
    {
      name: 'O₃',
      fullName: 'Ground-Level Ozone',
      value: `${pollutants.o3} ppb`,
      safeLimit: '60 ppb',
      status: pollutants.o3 > 60 ? 'High' : 'Safe',
      statusColor: pollutants.o3 > 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: Sparkles,
      description: 'Formed when NOx and VOCs react in sunlight; causes sharp lung irritation.'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Pollutant Diagnostics & Safe Thresholds
        </h3>
        <span className="text-xs text-slate-400">WHO Guideline Benchmarked</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name} 
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white tracking-wide">{card.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.statusColor}`}>
                      {card.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{card.fullName}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-100">{card.value}</span>
                <span className="text-[11px] text-slate-400">Limit: {card.safeLimit}</span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
