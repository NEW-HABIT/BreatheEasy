'use client';

import React, { useState } from 'react';
import { FamilyMember } from '@/types';
import { X, Plus, Trash2, ShieldCheck, Heart } from 'lucide-react';

interface FamilyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
  onSaveFamily: (members: FamilyMember[]) => void;
}

export const FamilyManagerModal: React.FC<FamilyManagerModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  onSaveFamily
}) => {
  const [members, setMembers] = useState<FamilyMember[]>(familyMembers);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<FamilyMember['role']>('Child');
  const [newAge, setNewAge] = useState<number>(5);
  const [newCondition, setNewCondition] = useState('Asthma');

  if (!isOpen) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newName.trim(),
      role: newRole,
      age: Number(newAge) || 10,
      healthConditions: newCondition.trim() ? [newCondition.trim()] : ['None'],
      riskLevel: 'Moderate'
    };

    const updated = [...members, newMember];
    setMembers(updated);
    onSaveFamily(updated);

    setNewName('');
    setNewCondition('');
  };

  const handleRemoveMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    onSaveFamily(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card-strong rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-100 bg-white/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Family Health Shield Profiles</h3>
              <p className="text-xs text-slate-500">Configure members to calibrate GenAI smog protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Configured Members ({members.length})</span>
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold">
                      {m.role} • {m.age} yrs
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-500">
                    <Heart className="h-3 w-3 text-rose-500" />
                    <span>Conditions: <strong className="text-slate-700">{Array.isArray(m.healthConditions) ? (m.healthConditions.join(', ') || 'None') : (m.healthConditions || 'None')}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveMember(m.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add member form */}
          <form onSubmit={handleAddMember} className="glass-card bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-emerald-800 block">Add New Family Member</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Child">Child (High Risk)</option>
                  <option value="Elderly">Elderly (High Risk)</option>
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(parseInt(e.target.value) || 0)}
                  className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Health Conditions (e.g., Asthma, Bronchitis, Allergies)</label>
              <input
                type="text"
                placeholder="Asthma, pollen allergy, cardiac sensitivity, None"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Health Shield</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-white/60">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
