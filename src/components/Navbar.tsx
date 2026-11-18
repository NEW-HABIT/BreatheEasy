'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Wind, Users, ShieldAlert, Sparkles, Calendar, ArrowLeftRight, 
  HeartHandshake, MapPin, Key, Leaf, Home, LogOut, LogIn, User,
  Search, X, Check
} from 'lucide-react';
import { AqiData } from '@/types';
import { getAqiCategory } from '@/lib/aqiData';
import { useAuth } from '@/context/AuthContext';
import { searchCitySuggestions } from '@/lib/api';

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
  const [suggestions, setSuggestions] = useState<{ name: string; country: string; admin?: string; latitude: number; longitude: number }[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Wind },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'routine', label: 'Diurnal Routine', icon: Calendar },
    { id: 'swaps', label: 'Eco Swaps', icon: ArrowLeftRight },
    { id: 'hacks', label: 'IAQ Hacks', icon: ShieldAlert },
    { id: 'community', label: 'Community', icon: HeartHandshake },
    { id: 'advisor', label: 'GenAI Shield', icon: Sparkles },
  ];

  const popularCities = ['New Delhi', 'Lahore', 'Mumbai', 'Beijing', 'London', 'New York', 'Dhaka', 'Kolkata', 'Paris', 'Tokyo'];

  // Live autocomplete search query
  useEffect(() => {
    if (!searchInput.trim() || searchInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggestionsLoading(true);
      const results = await searchCitySuggestions(searchInput.trim());
      setSuggestions(results);
      setIsSuggestionsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Click outside to close suggestions dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearching(false);
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: string) => {
    onCityChange(city);
    setIsSearching(false);
    setSearchInput('');
    setSuggestions([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      handleSelectCity(searchInput.trim());
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

          {/* Controls: City search & Autocomplete, GPS, AQI badge, Auth User */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div ref={searchContainerRef} className="relative">
              {isSearching ? (
                <div className="relative flex items-center">
                  <form onSubmit={handleSearchSubmit} className="flex items-center space-x-1">
                    <div className="relative flex items-center">
                      <Search className="absolute left-2.5 h-3.5 w-3.5 text-emerald-600 pointer-events-none" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search any global city..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="glass-input text-xs sm:text-sm text-slate-800 rounded-xl pl-8 pr-7 py-1.5 focus:outline-none w-44 sm:w-60 shadow-sm"
                      />
                      {searchInput && (
                        <button
                          type="button"
                          onClick={() => { setSearchInput(''); setSuggestions([]); }}
                          className="absolute right-2 text-slate-400 hover:text-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Go
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsSearching(false); setSuggestions([]); }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>

                  {/* Autocomplete Suggestions Dropdown */}
                  <div className="absolute top-full left-0 mt-1.5 w-72 bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span>{isSuggestionsLoading ? 'Searching global stations...' : 'Live City Search'}</span>
                      <span className="text-emerald-600 font-bold">Open-Meteo</span>
                    </div>

                    {suggestions.length > 0 ? (
                      <div className="space-y-1 mt-1 max-h-52 overflow-y-auto">
                        {suggestions.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectCity(item.name)}
                            className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-emerald-50 transition flex items-center justify-between text-xs group"
                          >
                            <div>
                              <span className="font-bold text-slate-900 group-hover:text-emerald-800 block">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {item.admin ? `${item.admin}, ` : ''}{item.country}
                              </span>
                            </div>
                            <MapPin className="h-3.5 w-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition" />
                          </button>
                        ))}
                      </div>
                    ) : searchInput.trim().length >= 2 && !isSuggestionsLoading ? (
                      <div className="px-2.5 py-3 text-center text-xs text-slate-500">
                        No exact match found. Press <strong>Go</strong> to query regional sensor grid.
                      </div>
                    ) : (
                      <div className="pt-1 border-t border-slate-100 mt-1">
                        <span className="text-[10px] text-slate-400 block px-2 mb-1.5 font-bold uppercase">Popular Metros</span>
                        <div className="flex flex-wrap gap-1 px-1">
                          {popularCities.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => handleSelectCity(c)}
                              className="px-2 py-1 bg-slate-50 hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 transition"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setIsSearching(true)}
                    className="flex items-center space-x-1.5 glass-card hover:bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200/60 transition group shadow-sm text-xs font-bold text-slate-800"
                    title="Click to search any global city"
                  >
                    <Search className="h-3.5 w-3.5 text-emerald-600 group-hover:scale-110 transition" />
                    <span className="max-w-[100px] sm:max-w-[150px] truncate">{selectedCity}</span>
                    <span className="text-[10px] font-normal text-slate-400 hidden sm:inline">Change</span>
                  </button>

                  {/* GPS Current Location Button */}
                  <button
                    onClick={onGpsLocate}
                    className="p-1.5 glass-card hover:bg-emerald-50 text-emerald-700 rounded-xl transition border border-emerald-200/60 shadow-sm"
                    title="Detect GPS Location"
                  >
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

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

            {/* User Account / Auth Status */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-1.5 bg-emerald-50/80 border border-emerald-200 py-1 px-2.5 rounded-xl text-xs">
                <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block text-left">
                  <span className="font-bold text-slate-800 text-[11px] block leading-tight">{user.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-emerald-700 block font-semibold leading-none">{user.homeType}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}

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
