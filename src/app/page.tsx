'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { AlertBanner } from '@/components/AlertBanner';
import { AqiGauge } from '@/components/AqiGauge';
import { PollutantCards } from '@/components/PollutantCards';
import { TrendChart } from '@/components/TrendChart';
import { FamilyRiskCards } from '@/components/FamilyRiskCards';
import { FamilyManagerModal } from '@/components/FamilyManagerModal';
import { RoutinePlanner } from '@/components/RoutinePlanner';
import { SustainableSwaps } from '@/components/SustainableSwaps';
import { IndoorHacks } from '@/components/IndoorHacks';
import { CommunityBoard } from '@/components/CommunityBoard';
import { AiAdvisorChat } from '@/components/AiAdvisorChat';
import { CITIES_DATA } from '@/lib/aqiData';
import { DEFAULT_FAMILY_MEMBERS, INITIAL_COMMUNITY_POSTS } from '@/lib/store';
import { INITIAL_SUSTAINABLE_SWAPS } from '@/lib/impactCalculator';
import { AqiData, FamilyMember, RoutineItem } from '@/types';
import { Wind, Shield, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [aqiData, setAqiData] = useState<AqiData>(CITIES_DATA['New Delhi']);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY_MEMBERS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState<boolean>(false);
  const [externalAiPrompt, setExternalAiPrompt] = useState<string | undefined>(undefined);
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [isLoadingCity, setIsLoadingCity] = useState<boolean>(false);

  // Initialize or fetch city AQI
  useEffect(() => {
    async function fetchCityAqi() {
      setIsLoadingCity(true);
      try {
        const res = await fetch(`/api/aqi?city=${encodeURIComponent(selectedCity)}`);
        const data = await res.json();
        if (data && data.aqi) {
          setAqiData(data);
        }
      } catch (err) {
        console.warn('Failed to fetch city AQI, fallback to local dataset:', err);
        if (CITIES_DATA[selectedCity]) {
          setAqiData(CITIES_DATA[selectedCity]);
        }
      } finally {
        setIsLoadingCity(false);
      }
    }

    fetchCityAqi();
  }, [selectedCity]);

  // Load family profile from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem('breatheasy_family');
    if (saved) {
      try {
        setFamilyMembers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved family members');
      }
    }
  }, []);

  const handleSaveFamily = (members: FamilyMember[]) => {
    setFamilyMembers(members);
    localStorage.setItem('breatheasy_family', JSON.stringify(members));
  };

  const handleAskAiFromExternal = (prompt: string) => {
    setExternalAiPrompt(prompt);
    setActiveTab('advisor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/20">
      {/* Top Navbar */}
      <Navbar
        aqiData={aqiData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
        selectedCity={selectedCity}
        onCityChange={(city) => setSelectedCity(city)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Atmospheric Warning Banner */}
        <AlertBanner
          aqiData={aqiData}
          onAskAI={handleAskAiFromExternal}
        />

        {/* Tab 1: Real-Time AQI Overview & Diagnostics */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Row: Circular Speedometer + 24hr Inversion Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AqiGauge aqiData={aqiData} />
              </div>
              <div className="lg:col-span-2">
                <TrendChart aqiData={aqiData} />
              </div>
            </div>

            {/* Pollutants Breakdown */}
            <PollutantCards pollutants={aqiData.pollutants} />

            {/* Family Health Risk Assessment (Top Differentiator) */}
            <FamilyRiskCards
              familyMembers={familyMembers}
              aqiData={aqiData}
              onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
              onAskAI={handleAskAiFromExternal}
            />

            {/* Quick Action Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div
                onClick={() => setActiveTab('routine')}
                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase">Step 1</span>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">Daily Diurnal Routine</h4>
                <p className="text-xs text-slate-400 mt-1">View safe morning, commute, and ventilation hours.</p>
              </div>

              <div
                onClick={() => setActiveTab('swaps')}
                className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Step 2</span>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">Sustainable Swaps</h4>
                <p className="text-xs text-slate-400 mt-1">Track daily CO₂ and PM2.5 savings with instant calculations.</p>
              </div>

              <div
                onClick={() => setActiveTab('hacks')}
                className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 p-4 rounded-xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase">Step 3</span>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">Indoor Air Quality Hacks</h4>
                <p className="text-xs text-slate-400 mt-1">DIY Corsi-Rosenthal purifiers, door seals, and botanical shields.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Routine Planner */}
        {activeTab === 'routine' && (
          <div className="animate-in fade-in duration-300">
            <RoutinePlanner
              initialRoutine={aqiData ? [
                {
                  id: 'r-1',
                  time: '06:30 AM',
                  title: 'Morning Seal & Air Cleaner High Mode',
                  description: 'Ground inversion traps night soot. Seal exterior doors and run air purifiers on high.',
                  category: 'purification',
                  airSafetyRating: 'Dangerous',
                  co2ImpactKg: 0.1,
                  isCompleted: true
                },
                {
                  id: 'r-2',
                  time: '07:15 AM',
                  title: 'Indoor Mat Yoga & Breathing Exercises',
                  description: 'Replace outdoor jogging with indoor stretching to avoid deep alveolar particulate intake.',
                  category: 'exercise',
                  airSafetyRating: 'Dangerous',
                  co2ImpactKg: 0,
                  isCompleted: true
                },
                {
                  id: 'r-3',
                  time: '08:00 AM',
                  title: 'Induction Low-Emission Breakfast Prep',
                  description: 'Use electric kettle & induction cooktop. Avoid frying spices on LPG open flame.',
                  category: 'cooking',
                  airSafetyRating: 'Safe',
                  co2ImpactKg: 0.8,
                  isCompleted: false
                },
                {
                  id: 'r-4',
                  time: '08:45 AM',
                  title: 'Metro / Filtered Mass Transit Commute',
                  description: 'Take rapid transit with an N95 mask. Saves 4.8 kg CO₂ compared to solo driving.',
                  category: 'commute',
                  airSafetyRating: 'Caution',
                  co2ImpactKg: 4.8,
                  isCompleted: false
                },
                {
                  id: 'r-5',
                  time: '01:30 PM',
                  title: `Optimal Solar Ventilation Window (${aqiData.ventilationWindow.start} - ${aqiData.ventilationWindow.end})`,
                  description: aqiData.ventilationWindow.advice,
                  category: 'ventilation',
                  airSafetyRating: 'Safe',
                  co2ImpactKg: 0.1,
                  isCompleted: false
                },
                {
                  id: 'r-6',
                  time: '08:00 PM',
                  title: 'Evening Air-Lock & Clean Zone Setup',
                  description: 'Roll damp towels along entry threshold. Set bedroom purifier on whisper mode.',
                  category: 'purification',
                  airSafetyRating: 'Caution',
                  co2ImpactKg: 0.3,
                  isCompleted: false
                }
              ] : []}
              aqiData={aqiData}
              familyMembers={familyMembers}
            />
          </div>
        )}

        {/* Tab 3: Sustainable Swaps & Impact Calculator */}
        {activeTab === 'swaps' && (
          <div className="animate-in fade-in duration-300">
            <SustainableSwaps initialSwaps={INITIAL_SUSTAINABLE_SWAPS} />
          </div>
        )}

        {/* Tab 4: Indoor Air Quality Hacks */}
        {activeTab === 'hacks' && (
          <div className="animate-in fade-in duration-300">
            <IndoorHacks onAskAI={handleAskAiFromExternal} />
          </div>
        )}

        {/* Tab 5: Community Action Board */}
        {activeTab === 'community' && (
          <div className="animate-in fade-in duration-300">
            <CommunityBoard initialPosts={INITIAL_COMMUNITY_POSTS} />
          </div>
        )}

        {/* Tab 6: Conversational GenAI Advisor */}
        {activeTab === 'advisor' && (
          <div className="animate-in fade-in duration-300">
            <AiAdvisorChat
              aqiData={aqiData}
              familyMembers={familyMembers}
              externalPrompt={externalAiPrompt}
              onClearExternalPrompt={() => setExternalAiPrompt(undefined)}
            />
          </div>
        )}
      </main>

      {/* Family Manager Modal */}
      <FamilyManagerModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        familyMembers={familyMembers}
        onSaveFamily={handleSaveFamily}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-300">BreatheEasy</span>
            <span>• GenAI Urban Air Quality Shield</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Challenge 6: Urban Air Quality Assistant</span>
            <span>•</span>
            <span>Google Gemini 2.0 API</span>
            <span>•</span>
            <span>WHO AQG Benchmarked</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
