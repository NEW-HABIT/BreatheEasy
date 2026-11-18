'use client';

import React, { useState } from 'react';
import { RoutineItem, AqiData, FamilyMember } from '@/types';
import { CheckCircle2, Circle, RefreshCw, Clock, Flame, Wind, Dumbbell, ShieldAlert, Sparkles } from 'lucide-react';
import { generateDailyRoutine } from '@/lib/api';

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
    const newRoutine = await generateDailyRoutine(aqiData, familyMembers);
    if (newRoutine && newRoutine.length > 0) {
      setRoutine(newRoutine);
    }
    setIsGenerating(false);
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
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Caution':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const completedCount = routine.filter(r => r.isCompleted).length;
  const progressPercent = routine.length > 0 ? Math.round((completedCount / routine.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="glass-card-strong rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700 font-extrabold uppercase text-xs tracking-wider">AI Diurnal Schedule</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Calibrated for {aqiData.city} (AQI {aqiData.aqi})
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Smog-Resilient & Low-Emission Daily Routine
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Synchronized with solar boundary layer atmospheric mixing. Shifts exposure chores away from high ground-level pollution spikes.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-medium">Daily Completion</span>
            <span className="text-sm font-extrabold text-emerald-800">{completedCount} of {routine.length} Actions</span>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Re-optimize with AI'}</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 rounded-full"
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
              className={`rounded-2xl p-4.5 transition cursor-pointer flex items-start space-x-3.5 border ${
                item.isCompleted
                  ? 'bg-slate-50/70 border-slate-200 opacity-70'
                  : 'glass-card border-white/80 hover:shadow-md'
              }`}
            >
              <button className="mt-0.5 text-emerald-600 transition shrink-0">
                {item.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{item.time}</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.co2ImpactKg ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Saves {item.co2ImpactKg} kg CO₂
                      </span>
                    ) : null}
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getSafetyBadge(item.airSafetyRating)}`}>
                      {item.airSafetyRating} Outdoor Risk
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
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
