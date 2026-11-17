'use client';

import React, { useState } from 'react';
import { RoutineItem, AqiData, FamilyMember } from '@/types';
import { CheckCircle2, Circle, Sparkles, RefreshCw, Clock, Flame, Wind, Dumbbell, ShieldAlert } from 'lucide-react';

interface RoutinePlannerProps {
  initialRoutine: RoutineItem[];
  aqiData: AqiData;
  familyMembers: FamilyMember[];
}

export const RoutinePlanner: React.FC<RoutinePlannerProps> = ({
  initialRoutine,
  aqiData,
  familyMembers
}) => {
  const [routine, setRoutine] = useState<RoutineItem[]>(initialRoutine);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleComplete = (id: string) => {
    setRoutine(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqiData, familyMembers })
      });
      const data = await res.json();
      if (data.routine) {
        setRoutine(data.routine);
      }
    } catch (e) {
      console.error('Failed to regenerate routine', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return Dumbbell;
      case 'cooking': return Flame;
      case 'ventilation': return Wind;
      case 'commute': return Clock;
      default: return ShieldAlert;
    }
  };

  const getSafetyBadge = (rating: string) => {
    switch (rating) {
      case 'Dangerous':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Caution':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const completedCount = routine.filter(r => r.isCompleted).length;
  const progressPercent = Math.round((completedCount / routine.length) * 100);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-bold uppercase text-xs tracking-wider">AI Diurnal Schedule</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Personalized for {aqiData.city} (AQI: {aqiData.aqi})
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Smog-Resilient & Low-Emission Daily Routine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Synchronized with boundary-layer atmospheric dispersion. Shifts high-exposure chores away from smog peaks.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Day Completion</span>
            <span className="text-sm font-bold text-cyan-300">{completedCount} of {routine.length} Actions</span>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Re-optimize with AI'}</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timeline items */}
      <div className="space-y-3">
        {routine.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              onClick={() => toggleComplete(item.id)}
              className={`border rounded-xl p-4 transition cursor-pointer flex items-start space-x-3.5 ${
                item.isCompleted
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-75'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              <button className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition shrink-0">
                {item.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/10" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-cyan-400">{item.time}</span>
                    <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.co2ImpactKg ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Saves {item.co2ImpactKg} kg CO₂
                      </span>
                    ) : null}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSafetyBadge(item.airSafetyRating)}`}>
                      {item.airSafetyRating} Outdoor Risk
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
