'use client';

import React from 'react';
import { PollutantBreakdown } from '@/types';
import { Activity, Flame, CloudFog, Factory, Sparkles } from 'lucide-react';

interface PollutantCardsProps {
  pollutants: PollutantBreakdown;
}

export const PollutantCards: React.FC<PollutantCardsProps> = ({ pollutants }) => {
  const cards = [
    {
      name: 'PM2.5',
      fullName: 'Fine Particulates (<2.5µm)',
      value: `${pollutants.pm25} µg/m³`,
      safeLimit: '15 µg/m³ (WHO)',
      status: pollutants.pm25 > 75 ? 'Critical' : pollutants.pm25 > 35 ? 'Elevated' : 'Safe',
      statusColor: pollutants.pm25 > 75 ? 'text-rose-700 border-rose-300 bg-rose-50' : pollutants.pm25 > 35 ? 'text-amber-700 border-amber-300 bg-amber-50' : 'text-emerald-700 border-emerald-300 bg-emerald-50',
      icon: CloudFog,
      description: 'Penetrates deep into alveolar air sacs and crosses into the bloodstream.'
    },
    {
      name: 'PM10',
      fullName: 'Coarse Dust (<10µm)',
      value: `${pollutants.pm10} µg/m³`,
      safeLimit: '45 µg/m³ (WHO)',
      status: pollutants.pm10 > 150 ? 'Critical' : pollutants.pm10 > 100 ? 'Elevated' : 'Safe',
      statusColor: pollutants.pm10 > 150 ? 'text-rose-700 border-rose-300 bg-rose-50' : pollutants.pm10 > 100 ? 'text-amber-700 border-amber-300 bg-amber-50' : 'text-emerald-700 border-emerald-300 bg-emerald-50',
      icon: Activity,
      description: 'Road dust, construction soot, and pollen causing upper airway and eye irritation.'
    },
    {
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      value: `${pollutants.no2} ppb`,
      safeLimit: '25 ppb (WHO 24h)',
      status: pollutants.no2 > 50 ? 'High' : 'Safe',
      statusColor: pollutants.no2 > 50 ? 'text-amber-700 border-amber-300 bg-amber-50' : 'text-emerald-700 border-emerald-300 bg-emerald-50',
      icon: Flame,
      description: 'From vehicle tailpipes and gas stoves; major trigger of pediatric asthma attacks.'
    },
    {
      name: 'SO₂',
      fullName: 'Sulfur Dioxide',
      value: `${pollutants.so2} ppb`,
      safeLimit: '40 ppb',
      status: pollutants.so2 > 40 ? 'High' : 'Safe',
      statusColor: pollutants.so2 > 40 ? 'text-amber-700 border-amber-300 bg-amber-50' : 'text-emerald-700 border-emerald-300 bg-emerald-50',
      icon: Factory,
      description: 'Emitted from industrial coal power generation and diesel combustion.'
    },
    {
      name: 'CO',
      fullName: 'Carbon Monoxide',
      value: `${pollutants.co} ppm`,
      safeLimit: '4 ppm (WHO)',
      status: pollutants.co > 4 ? 'Warning' : 'Safe',
      statusColor: pollutants.co > 4 ? 'text-amber-700 border-amber-300 bg-amber-50' : 'text-emerald-700 border-emerald-300 bg-emerald-50',
      icon: Flame,
      description: 'Colorless, odorless gas from incomplete combustion; hampers oxygen transport.'
    },
    {
      name: 'O₃',
      fullName: 'Ground-Level Ozone',
      value: `${pollutants.o3} ppb`,
      safeLimit: '60 ppb',
      status: pollutants.o3 > 60 ? 'High' : 'Safe',
      statusColor: pollutants.o3 > 60 ? 'text-amber-700 border-amber-300 bg-amber-50' : 'text-emerald-700 border-emerald-300 bg-emerald-50',
      icon: Sparkles,
      description: 'Secondary pollutant formed under intense sunlight; causes acute lung constriction.'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Pollutant Diagnostics & Clinical Limits
        </h3>
        <span className="text-[11px] font-semibold text-emerald-700">WHO 24h Benchmarked</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name} 
              className="glass-card rounded-2xl p-4.5 hover:shadow-md transition relative border border-white/80"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-slate-900 tracking-wide">{card.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.statusColor}`}>
                      {card.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{card.fullName}</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">{card.value}</span>
                <span className="text-[11px] text-slate-400 font-medium">Limit: {card.safeLimit}</span>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
