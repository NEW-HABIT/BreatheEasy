'use client';

import React, { useState } from 'react';
import { SustainableSwap } from '@/types';
import { calculateAdoptedImpact } from '@/lib/impactCalculator';
import { ArrowLeftRight, Check, Trees, Wind, Award, Zap, HelpCircle } from 'lucide-react';

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
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-teal-950/40 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Quantified Impact Engine
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Your Household&apos;s Clean Air & Decarbonization Footprint
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Calculated using EPA emission factors and peer-reviewed indoor aerosol science. Toggle lifestyle swaps below to see your direct impact.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-emerald-300 text-xs self-start md:self-auto">
            <Zap className="h-4 w-4 shrink-0" />
            <span>{swaps.filter(s => s.adopted).length} of {swaps.length} Habits Active</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400">Daily Carbon Offset</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-cyan-400">{impact.dailyCo2SavedKg}</span>
              <span className="text-xs text-slate-400">kg CO₂/day</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">({impact.monthlyCo2SavedKg} kg / month)</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400">Avg Indoor PM2.5 Cut</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-emerald-400">{impact.avgPm25ReductionPercent}%</span>
              <span className="text-xs text-slate-400">cleaner air</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Across living zones</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400">Tree Carbon Equivalent</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-teal-400">{impact.treesEquivalent}</span>
              <span className="text-xs text-slate-400">mature trees</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Absorbing CO₂ yearly</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400">Clean Air Hours</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-purple-400">{impact.cleanAirHoursGained}</span>
              <span className="text-xs text-slate-400">hrs/month</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Shielded from peak smog</span>
          </div>
        </div>
      </div>

      {/* Interactive Swaps Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Targeted Sustainable Swaps & Impact Explanations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {swaps.map((swap) => (
            <div
              key={swap.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                swap.adopted
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {swap.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2 leading-snug">
                      {swap.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleAdopt(swap.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      swap.adopted
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {swap.adopted ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Adopted</span>
                      </>
                    ) : (
                      <span>Adopt Habit</span>
                    )}
                  </button>
                </div>

                {/* Habit comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                    <span className="text-[10px] text-rose-400 uppercase font-semibold block">Current Habit</span>
                    <p className="text-slate-300 mt-1">{swap.currentHabit}</p>
                  </div>

                  <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-3">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold block">Sustainable Swap</span>
                    <p className="text-cyan-200 mt-1 font-medium">{swap.sustainableAlternative}</p>
                  </div>
                </div>

                {/* Quantified impact badges */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    🌱 Saves {swap.co2SavedKgPerDay} kg CO₂ / day
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    💨 Cuts PM2.5 by {swap.pm25ReductionPercent}%
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300">
                    💰 {swap.costImpact}
                  </span>
                </div>

                {/* Direct scientific explanation */}
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800 leading-relaxed">
                  <strong className="text-slate-200">Why it matters:</strong> {swap.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
