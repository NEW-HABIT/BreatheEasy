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
      name: 'Fine Smog & Smoke',
      tag: 'PM2.5',
      value: `${pollutants.pm25}`,
      unit: 'µg',
      status: pollutants.pm25 > 75 ? 'Heavy Haze' : pollutants.pm25 > 35 ? 'Moderate' : 'Clean & Safe',
      statusColor: pollutants.pm25 > 75 ? 'text-rose-700 border-rose-200 bg-rose-50/80' : pollutants.pm25 > 35 ? 'text-amber-700 border-amber-200 bg-amber-50/80' : 'text-emerald-700 border-emerald-200 bg-emerald-50/80',
      icon: CloudFog,
      description: 'Microscopic winter particles. Indoor air purifiers easily filter these out.'
    },
    {
      name: 'Road & Street Dust',
      tag: 'PM10',
      value: `${pollutants.pm10}`,
      unit: 'µg',
      status: pollutants.pm10 > 150 ? 'Dusty' : pollutants.pm10 > 100 ? 'Moderate' : 'Clear',
      statusColor: pollutants.pm10 > 150 ? 'text-rose-700 border-rose-200 bg-rose-50/80' : pollutants.pm10 > 100 ? 'text-amber-700 border-amber-200 bg-amber-50/80' : 'text-emerald-700 border-emerald-200 bg-emerald-50/80',
      icon: Activity,
      description: 'Larger dust particles from traffic and construction. Kept out by closed windows.'
    },
    {
      name: 'Traffic Exhaust',
      tag: 'NO₂',
      value: `${pollutants.no2}`,
      unit: 'ppb',
      status: pollutants.no2 > 50 ? 'Elevated' : 'Low',
      statusColor: pollutants.no2 > 50 ? 'text-amber-700 border-amber-200 bg-amber-50/80' : 'text-emerald-700 border-emerald-200 bg-emerald-50/80',
      icon: Flame,
      description: 'Fumes from vehicle tailpipes and open flame cooking stoves.'
    },
    {
      name: 'Industrial Smoke',
      tag: 'SO₂',
      value: `${pollutants.so2}`,
      unit: 'ppb',
      status: pollutants.so2 > 40 ? 'Noticeable' : 'Fresh',
      statusColor: pollutants.so2 > 40 ? 'text-amber-700 border-amber-200 bg-amber-50/80' : 'text-emerald-700 border-emerald-200 bg-emerald-50/80',
      icon: Factory,
      description: 'Emissions from regional power plants and heavy diesel transport.'
    },
    {
      name: 'Heating & Stove Fumes',
      tag: 'CO',
      value: `${pollutants.co}`,
      unit: 'ppm',
      status: pollutants.co > 4 ? 'Caution' : 'Safe',
      statusColor: pollutants.co > 4 ? 'text-amber-700 border-amber-200 bg-amber-50/80' : 'text-emerald-700 border-emerald-200 bg-emerald-50/80',
      icon: Flame,
      description: 'Combustion gases. Cooking with induction keeps indoor air 100% clean.'
    },
    {
      name: 'Sunlight Haze',
      tag: 'Ozone',
      value: `${pollutants.o3}`,
      unit: 'ppb',
      status: pollutants.o3 > 60 ? 'Active' : 'Minimal',
      statusColor: pollutants.o3 > 60 ? 'text-amber-700 border-amber-200 bg-amber-50/80' : 'text-emerald-700 border-emerald-200 bg-emerald-50/80',
      icon: Sparkles,
      description: 'Formed on hot sunny afternoons. Drops to near-zero in early mornings.'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Air Elements & Purity Check
          </h3>
          <p className="text-xs text-slate-500">Key particles and air purity factors around your neighborhood</p>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Real-Time Sensors
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name} 
              className="glass-card rounded-2xl p-4.5 hover:shadow-md transition relative border border-white/90"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-slate-900 tracking-tight">{card.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                      {card.tag}
                    </span>
                  </div>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.statusColor}`}>
                    {card.status}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-emerald-700">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900">{card.value}</span>
                <span className="text-xs font-medium text-slate-400">{card.unit}</span>
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
