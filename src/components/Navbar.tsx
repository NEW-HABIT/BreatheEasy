'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wind, Users, ShieldAlert, Sparkles, Calendar, ArrowLeftRight, 
  HeartHandshake, MapPin, Key, Leaf, Home, Search
} from 'lucide-react';
import { AqiData } from '@/types';
import { getAqiCategory } from '@/lib/aqiData';

interface NavbarProps {
  aqiData: AqiData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenFamilyModal: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onGpsLocate: () => void;
  onOpenApiKeyModal: () => void;
  hasCustomApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  aqiData,
  activeTab,
  setActiveTab,
  onOpenFamilyModal,
  selectedCity,
  onCityChange,
  onGpsLocate,
  onOpenApiKeyModal,
  hasCustomApiKey
}) => {
  const cat = getAqiCategory(aqiData.aqi);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Wind },
    { id: 'routine', label: 'Diurnal Routine', icon: Calendar },
    { id: 'swaps', label: 'Eco Swaps', icon: ArrowLeftRight },
    { id: 'hacks', label: 'IAQ Hacks', icon: ShieldAlert },
    { id: 'community', label: 'Community', icon: HeartHandshake },
    { id: 'advisor', label: 'GenAI Shield', icon: Sparkles },
  ];

  const popularCities = ['New Delhi', 'Lahore', 'Mumbai', 'Beijing', 'London', 'New York', 'Dhaka', 'Kolkata'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onCityChange(searchInput.trim());
      setIsSearching(false);
      setSearchInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight gradient-text-green">
                  BreatheEasy
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold hidden sm:inline">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">Apple Glass • Urban Smog Navigator</p>
            </div>
          </div>

          {/* City Search, GPS & Live Telemetry Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {isSearching ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-1">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter any city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="glass-input text-xs sm:text-sm text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none w-32 sm:w-44"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Go
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearching(false)}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </form>
            ) : (
              <div className="flex items-center space-x-1">
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsSearching(true);
                    } else {
                      onCityChange(e.target.value);
                    }
                  }}
                  className="glass-input text-xs sm:text-sm text-slate-700 font-medium rounded-xl px-2.5 py-1.5 focus:outline-none max-w-[125px] sm:max-w-[160px] truncate"
                >
                  <optgroup label="Current Selection">
                    <option value={selectedCity}>{selectedCity}</option>
                  </optgroup>
                  <optgroup label="Popular Global Metros">
                    {popularCities.filter(c => c !== selectedCity).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Search Anywhere">
                    <option value="custom">🔍 Search city...</option>
                  </optgroup>
                </select>

                {/* GPS Current Location Button */}
                <button
                  onClick={onGpsLocate}
                  className="p-1.5 glass-card hover:bg-emerald-50 text-emerald-700 rounded-xl transition border border-emerald-200/60"
                  title="Detect GPS Location"
                >
                  <MapPin className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Live AQI Badge */}
            <div 
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border glass-pill shadow-sm"
              style={{ borderColor: `${cat.color}40`, backgroundColor: `${cat.color}15` }}
            >
              <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: cat.color }} />
              <span className="text-xs font-bold text-slate-900">AQI {aqiData.aqi}</span>
              <span className="text-[11px] font-bold hidden lg:inline" style={{ color: cat.color }}>
                {cat.category}
              </span>
            </div>

            {/* Gemini Key Config */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                hasCustomApiKey
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'glass-card text-slate-600 hover:text-slate-900'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{hasCustomApiKey ? 'Gemini 2.0' : 'API Key'}</span>
            </button>

            {/* Family Shield */}
            <button
              onClick={onOpenFamilyModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              title="Manage Family Health Profiles"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Family Shield</span>
            </button>

            {/* Return to Home Landing */}
            <Link
              href="/"
              className="p-1.5 glass-card text-slate-500 hover:text-emerald-700 rounded-xl transition"
              title="Landing Home"
            >
              <Home className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/70'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
