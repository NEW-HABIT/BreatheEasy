'use client';

import React from 'react';
import { FamilyMember, AqiData } from '@/types';
import { calculateFamilyRisk } from '@/lib/aqiData';
import { User, ShieldAlert, HeartPulse, Baby, UserCheck, PlusCircle } from 'lucide-react';

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

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'High':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <HeartPulse className="h-4 w-4 text-rose-400" />
            <span>Family Health Risk Assessment & Clinical Protocols</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Differentiated vulnerabilities based on age, respiratory physiology, and pre-existing medical conditions.
          </p>
        </div>

        <button
          onClick={onOpenFamilyModal}
          className="flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Edit Members</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {familyMembers.map((member) => {
          const { riskLevel, advice } = calculateFamilyRisk(member, aqiData.aqi);
          const Icon = getRoleIcon(member.role);

          return (
            <div
              key={member.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition shadow-lg relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">{member.name}</h4>
                      <p className="text-[11px] text-slate-400">{member.role} • {member.age} yrs old</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(riskLevel)}`}>
                    {riskLevel} Risk
                  </span>
                </div>

                {/* Health conditions tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {member.healthConditions.map((cond, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md"
                    >
                      {cond}
                    </span>
                  ))}
                </div>

                {/* Specific Clinical Advice */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  {advice.slice(0, 2).map((item, idx) => (
                    <p key={idx} className="text-slate-300 flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-cyan-400 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Instant AI inquiry for this specific member */}
              <button
                onClick={() => onAskAI(`What specific protective measures and routine adjustments should I take for ${member.name} (${member.role}, ${member.age} yrs, ${member.healthConditions.join(', ')}) in ${aqiData.city} with AQI ${aqiData.aqi}?`)}
                className="mt-3.5 w-full py-1.5 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 text-[11px] font-medium transition flex items-center justify-center space-x-1"
              >
                <span>Ask AI for {member.name}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
