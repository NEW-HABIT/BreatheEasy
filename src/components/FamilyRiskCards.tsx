'use client';

import React from 'react';
import { FamilyMember, AqiData } from '@/types';
import { calculateFamilyRisk } from '@/lib/aqiData';
import { User, HeartPulse, Baby, PlusCircle, Sparkles } from 'lucide-react';

interface FamilyRiskCardsProps {
  familyMembers: FamilyMember[];
  aqiData: AqiData;
  onOpenFamilyModal: () => void;
  onAskAI: (prompt: string) => void;
}

export const FamilyRiskCards: React.FC<FamilyRiskCardsProps> = ({
  familyMembers,
  aqiData,
  onOpenFamilyModal,
  onAskAI
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Child': return Baby;
      case 'Elderly': return HeartPulse;
      default: return User;
    }
  };

  const getRiskBorder = (level: string) => {
    switch (level) {
      case 'Severe': return 'border-l-4 border-l-rose-500 bg-rose-50/40';
      case 'High': return 'border-l-4 border-l-orange-500 bg-orange-50/40';
      case 'Moderate': return 'border-l-4 border-l-amber-500 bg-amber-50/40';
      default: return 'border-l-4 border-l-emerald-500 bg-emerald-50/40';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Severe': return 'text-rose-700 bg-rose-100 border-rose-200';
      case 'High': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Moderate': return 'text-amber-700 bg-amber-100 border-amber-200';
      default: return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <HeartPulse className="h-4 w-4 text-emerald-600" />
            <span>Family Care & Daily Health Safety</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized guidance calibrated for everyone in your household today.
          </p>
        </div>

        <button
          onClick={onOpenFamilyModal}
          className="flex items-center space-x-1.5 text-xs text-emerald-800 hover:text-emerald-900 font-bold bg-emerald-100/80 hover:bg-emerald-200/80 px-3 py-1.5 rounded-xl border border-emerald-200 transition shadow-sm"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Edit Household</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {familyMembers.map((member) => {
          const { riskLevel, advice } = calculateFamilyRisk(member, aqiData.aqi);
          const Icon = getRoleIcon(member.role);
          const condList: string[] = Array.isArray(member.healthConditions)
            ? member.healthConditions
            : typeof member.healthConditions === 'string'
            ? (member.healthConditions as string).split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];

          return (
            <div
              key={member.id}
              className={`glass-card rounded-2xl p-4.5 flex flex-col justify-between hover:shadow-md transition shadow-sm ${getRiskBorder(riskLevel)}`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-emerald-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{member.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{member.role} • {member.age} yrs old</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getRiskBadge(riskLevel)}`}>
                    {riskLevel}
                  </span>
                </div>

                {/* Health conditions pills */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {condList.map((cond, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-white/90 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-lg"
                    >
                      {cond}
                    </span>
                  ))}
                </div>

                {/* Specific Clinical Advice */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  {advice.slice(0, 2).map((item, idx) => (
                    <p key={idx} className="text-slate-600 flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Instant AI inquiry for this specific member */}
              <button
                onClick={() => onAskAI(`What specific protective measures and routine adjustments should I take for ${member.name} (${member.role}, ${member.age} yrs, ${condList.join(', ') || 'None'}) in ${aqiData.city} with AQI ${aqiData.aqi}?`)}
                className="mt-3.5 w-full py-1.5 px-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition flex items-center justify-center space-x-1 shadow-sm"
              >
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>Personal Care for {member.name}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
