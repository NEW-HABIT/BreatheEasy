'use client';

import React, { useState } from 'react';
import { SustainableSwap } from '@/types';
import { calculateAdoptedImpact } from '@/lib/impactCalculator';
import { ArrowLeftRight, Check, Trees, Wind, Award, Zap } from 'lucide-react';

interface SustainableSwapsProps {
  initialSwaps: SustainableSwap[];
}

export const SustainableSwaps: React.FC<SustainableSwapsProps> = ({ initialSwaps }) => {
  const [swaps, setSwaps] = useState<SustainableSwap[]>(initialSwaps);

  const toggleAdopt = (id: string) => {
    setSwaps(prev => prev.map(s => s.id === id ? { ...s, adopted: !s.adopted } : s));
  };

  const impact = calculateAdoptedImpact(swaps);

  return (
    <div className="space-y-6">
      {/* Cumulative Impact Metrics Board */}
      <div className="glass-card-strong rounded-3xl p-6 sm:p-7 shadow-xl border border-white/80 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-emerald-100">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Quantified Impact Engine
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              Your Household&apos;s Clean Air & Decarbonization Footprint
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Calculated using EPA emission factors and peer-reviewed indoor aerosol science. Toggle lifestyle swaps below to see your direct impact.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-2xl text-xs font-bold self-start md:self-auto shadow-sm">
            <Zap className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{swaps.filter(s => s.adopted).length} of {swaps.length} Habits Active</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
          <div className="glass-card p-4 rounded-2xl flex flex-col justify-between border border-white/80">
            <span className="text-xs font-semibold text-slate-500">Daily Carbon Offset</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-emerald-700">{impact.dailyCo2SavedKg}</span>
              <span className="text-xs text-slate-500 font-semibold">kg CO₂/day</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">({impact.monthlyCo2SavedKg} kg / month)</span>
          </div>

          <div className="glass-card p-4 rounded-2xl flex flex-col justify-between border border-white/80">
            <span className="text-xs font-semibold text-slate-500">Avg Inhaled PM2.5 Cut</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-teal-700">{impact.avgPm25ReductionPercent}%</span>
              <span className="text-xs text-slate-500 font-semibold">cleaner air</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">Across living zones</span>
          </div>

          <div className="glass-card p-4 rounded-2xl flex flex-col justify-between border border-white/80">
            <span className="text-xs font-semibold text-slate-500">Tree Carbon Absorption</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-green-700">{impact.treesEquivalent}</span>
              <span className="text-xs text-slate-500 font-semibold">mature trees</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">Absorbing CO₂ yearly</span>
          </div>

          <div className="glass-card p-4 rounded-2xl flex flex-col justify-between border border-white/80">
            <span className="text-xs font-semibold text-slate-500">Clean Air Hours</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-emerald-800">{impact.cleanAirHoursGained}</span>
              <span className="text-xs text-slate-500 font-semibold">hrs/month</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">Shielded from peak smog</span>
          </div>
        </div>
      </div>

      {/* Interactive Swaps Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Targeted Sustainable Swaps & Impact Explanations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {swaps.map((swap) => (
            <div
              key={swap.id}
              className={`rounded-3xl p-5.5 transition-all flex flex-col justify-between border ${
                swap.adopted
                  ? 'glass-card-strong border-emerald-400 shadow-md shadow-emerald-100'
                  : 'glass-card border-white/80 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {swap.category}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">
                      {swap.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleAdopt(swap.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      swap.adopted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {swap.adopted ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <span>Adopt Habit</span>
                    )}
                  </button>
                </div>

                {/* Habit comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-rose-50/80 border border-rose-200 p-3 rounded-2xl">
                    <span className="text-[10px] text-rose-700 uppercase font-bold block">Current Habit</span>
                    <p className="text-slate-800 mt-1 font-medium">{swap.currentHabit}</p>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">Sustainable Swap</span>
                    <p className="text-emerald-950 mt-1 font-bold">{swap.sustainableAlternative}</p>
                  </div>
                </div>

                {/* Quantified impact badges */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    🌱 Saves {swap.co2SavedKgPerDay} kg CO₂ / day
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-teal-100 text-teal-800 border border-teal-200 font-bold">
                    💨 Cuts PM2.5 by {swap.pm25ReductionPercent}%
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium">
                    💰 {swap.costImpact}
                  </span>
                </div>

                {/* Direct scientific explanation */}
                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  <strong className="text-slate-800">Why it matters:</strong> {swap.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
