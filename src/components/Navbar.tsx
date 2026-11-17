'use client';

import React from 'react';
import { Wind, Users, ShieldAlert, Sparkles, Calendar, ArrowLeftRight, HeartHandshake } from 'lucide-react';
import { AqiData } from '@/types';
import { getAqiCategory } from '@/lib/aqiData';

interface NavbarProps {
  aqiData: AqiData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenFamilyModal: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  aqiData,
  activeTab,
  setActiveTab,
  onOpenFamilyModal,
  selectedCity,
  onCityChange
}) => {
  const cat = getAqiCategory(aqiData.aqi);

  const navItems = [
    { id: 'dashboard', label: 'AQI Overview', icon: Wind },
    { id: 'routine', label: 'Daily Routine', icon: Calendar },
    { id: 'swaps', label: 'Eco Swaps & Impact', icon: ArrowLeftRight },
    { id: 'hacks', label: 'Indoor IAQ Hacks', icon: ShieldAlert },
    { id: 'community', label: 'Community Board', icon: HeartHandshake },
    { id: 'advisor', label: 'GenAI Advisor', icon: Sparkles },
  ];

  const cities = ['New Delhi', 'Lahore', 'Mumbai', 'Beijing', 'London'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wind className="h-5 w-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                  BreatheEasy
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  GenAI Urban Shield
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Winter Smog & Clean Air Navigator</p>
            </div>
          </div>

          {/* City Selector & Live AQI badge */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${cat.border} ${cat.bg}`}>
              <span className="h-2.5 w-2.5 rounded-full animate-ping" style={{ backgroundColor: cat.color }} />
              <span className="text-xs font-semibold text-slate-200">AQI {aqiData.aqi}</span>
              <span className={`text-[11px] font-bold ${cat.text} hidden md:inline`}>{cat.category}</span>
            </div>

            {/* Family Profile Button */}
            <button
              onClick={onOpenFamilyModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm border border-slate-700/60 transition"
              title="Manage Family Health Profiles"
            >
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Family Shield</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-900/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
