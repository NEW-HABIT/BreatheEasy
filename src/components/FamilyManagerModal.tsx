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

    // Reset inputs
    setNewName('');
    setNewCondition('');
  };

  const handleRemoveMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    onSaveFamily(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Family Health Shield Profiles</h3>
              <p className="text-xs text-slate-400">Configure members to personalize GenAI air safety protocols</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Members ({members.length})</span>
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-xl p-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">{m.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {m.role} • {m.age} yrs
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-400">
                    <Heart className="h-3 w-3 text-rose-400" />
                    <span>Conditions: <strong className="text-slate-300">{m.healthConditions.join(', ') || 'None'}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveMember(m.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  title="Remove member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add member form */}
          <form onSubmit={handleAddMember} className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold text-cyan-300 block">Add New Family Member</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Child">Child (High Risk)</option>
                  <option value="Elderly">Elderly (High Risk)</option>
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Health Conditions (e.g., Asthma, Bronchitis, Allergies, Heart)</label>
              <input
                type="text"
                placeholder="Asthma, pollen allergy, COPD, None"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs shadow-md transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member to Health Shield</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
