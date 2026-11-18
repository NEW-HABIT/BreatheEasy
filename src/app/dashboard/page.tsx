'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { AlertBanner } from '@/components/AlertBanner';
import { AqiGauge } from '@/components/AqiGauge';
import { PollutantCards } from '@/components/PollutantCards';
import { TrendChart } from '@/components/TrendChart';
import { FamilyRiskCards } from '@/components/FamilyRiskCards';
import { FamilyManagerModal } from '@/components/FamilyManagerModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { RoutinePlanner } from '@/components/RoutinePlanner';
import { SustainableSwaps } from '@/components/SustainableSwaps';
import { IndoorHacks } from '@/components/IndoorHacks';
import { CommunityBoard } from '@/components/CommunityBoard';
import { AiAdvisorChat } from '@/components/AiAdvisorChat';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchLiveAqi, fetchCommunityPosts, fetchSwapsFromBackend } from '@/lib/api';
import { DEFAULT_FAMILY_MEMBERS, INITIAL_COMMUNITY_POSTS } from '@/lib/store';
import { INITIAL_SUSTAINABLE_SWAPS } from '@/lib/impactCalculator';
import { CITIES_DATA } from '@/lib/aqiData';
import { AqiData, FamilyMember, RoutineItem } from '@/types';
import { ArrowRight, Leaf } from 'lucide-react';

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [aqiData, setAqiData] = useState<AqiData>(CITIES_DATA['New Delhi']);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY_MEMBERS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [externalAiPrompt, setExternalAiPrompt] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [communityPosts, setCommunityPosts] = useState(INITIAL_COMMUNITY_POSTS);
  const [swaps, setSwaps] = useState(INITIAL_SUSTAINABLE_SWAPS);

  // Fetch live AQI on city change
  useEffect(() => {
    async function loadCityAqi() {
      setIsLoading(true);
      const data = await fetchLiveAqi(selectedCity);
      if (data) {
        setAqiData(data);
      }
      setIsLoading(false);
    }
    loadCityAqi();
  }, [selectedCity]);

  // Load saved state from localStorage & backend
  useEffect(() => {
    const savedFam = localStorage.getItem('breatheasy_family');
    if (savedFam) {
      try {
        setFamilyMembers(JSON.parse(savedFam));
      } catch (e) {
        console.error('Error parsing saved family');
      }
    }
    const savedKey = localStorage.getItem('breatheasy_gemini_key');
    if (savedKey) setCustomApiKey(savedKey);

    // Load backend community posts & swaps
    fetchCommunityPosts().then(posts => {
      if (posts && posts.length > 0) setCommunityPosts(posts);
    });
    fetchSwapsFromBackend().then(backendSwaps => {
      if (backendSwaps && backendSwaps.length > 0) setSwaps(backendSwaps);
    });
  }, []);

  const handleSaveFamily = (members: FamilyMember[]) => {
    setFamilyMembers(members);
    localStorage.setItem('breatheasy_family', JSON.stringify(members));
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('breatheasy_gemini_key', key);
  };

  // Browser GPS Geolocation
  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const data = await fetchLiveAqi('My Location', latitude, longitude);
        if (data) {
          setAqiData(data);
          setSelectedCity(data.city);
        }
        setIsLoading(false);
      },
      (err) => {
        console.warn('GPS error:', err.message);
        alert('Could not retrieve your GPS location. Please select or search your city.');
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleAskAiFromExternal = (prompt: string) => {
    setExternalAiPrompt(prompt);
    setActiveTab('advisor');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-200">
      {/* Top Navbar */}
      <Navbar
        aqiData={aqiData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
        selectedCity={selectedCity}
        onCityChange={(city) => setSelectedCity(city)}
        onGpsLocate={handleGpsLocate}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomApiKey={!!customApiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Atmospheric Warning Banner */}
        <AlertBanner
          aqiData={aqiData}
          onAskAI={handleAskAiFromExternal}
        />

        {isLoading ? (
          <div className="glass-card-strong rounded-3xl">
            <LoadingSpinner
              message={`Fetching live air quality for ${selectedCity}...`}
              submessage="Connecting to Open-Meteo satellite & ground telemetry"
            />
          </div>
        ) : (
          <>
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

                {/* Family Health Risk Assessment */}
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
                    className="glass-card p-4.5 rounded-2xl cursor-pointer hover:shadow-md transition group border border-white/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 uppercase">Phase 1</span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">Daily Diurnal Routine</h4>
                    <p className="text-xs text-slate-500 mt-1">Safe morning, commute, and ventilation hours.</p>
                  </div>

                  <div
                    onClick={() => setActiveTab('swaps')}
                    className="glass-card p-4.5 rounded-2xl cursor-pointer hover:shadow-md transition group border border-white/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-700 uppercase">Phase 2</span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">Sustainable Swaps</h4>
                    <p className="text-xs text-slate-500 mt-1">Track daily CO₂ and PM2.5 savings with instant calculations.</p>
                  </div>

                  <div
                    onClick={() => setActiveTab('hacks')}
                    className="glass-card p-4.5 rounded-2xl cursor-pointer hover:shadow-md transition group border border-white/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-green-700 uppercase">Phase 3</span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">Indoor IAQ Hacks</h4>
                    <p className="text-xs text-slate-500 mt-1">DIY Corsi-Rosenthal purifiers, door seals, and botanical filters.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Daily Routine Planner */}
            {activeTab === 'routine' && (
              <div className="animate-in fade-in duration-300">
                <RoutinePlanner
                  initialRoutine={[
                    {
                      id: 'r-1',
                      time: '06:30 AM',
                      title: 'Morning Wakeup: Seal & Filter Protocol',
                      description: 'Morning temperature inversions trap heavy smog at ground level. Keep all windows firmly sealed. Power on bedroom purifiers or DIY fan boxes.',
                      category: 'purification',
                      airSafetyRating: aqiData.aqi > 200 ? 'Dangerous' : 'Caution',
                      co2ImpactKg: 0.1,
                      isCompleted: true
                    },
                    {
                      id: 'r-2',
                      time: '07:15 AM',
                      title: 'Indoor Core & Yoga Workout (No Outdoor Jogging)',
                      description: 'Outdoor cardio during severe smog forces deep lung deposition of toxic ultrafine carbon. Replace outdoor runs with indoor calisthenics or mat yoga.',
                      category: 'exercise',
                      airSafetyRating: aqiData.aqi > 200 ? 'Dangerous' : 'Caution',
                      co2ImpactKg: 0,
                      isCompleted: true
                    },
                    {
                      id: 'r-3',
                      time: '08:00 AM',
                      title: 'Low-Emission Induction Breakfast',
                      description: 'Cook breakfast using magnetic induction or microwave instead of open flame gas burners. Eliminates 100% of indoor kitchen NO₂ emissions.',
                      category: 'cooking',
                      airSafetyRating: 'Safe',
                      co2ImpactKg: 0.8,
                      isCompleted: false
                    },
                    {
                      id: 'r-4',
                      time: '08:45 AM',
                      title: 'Commute via Metro / Filtered Cabin Transit',
                      description: 'Board electric metro transit wearing sealed N95 mask. If driving, toggle air conditioning to 100% cabin recirculation.',
                      category: 'commute',
                      airSafetyRating: 'Caution',
                      co2ImpactKg: 4.8,
                      isCompleted: false
                    },
                    {
                      id: 'r-5',
                      time: '01:30 PM',
                      title: `Optimal Ventilation Window (${aqiData.ventilationWindow.start} - ${aqiData.ventilationWindow.end})`,
                      description: aqiData.ventilationWindow.advice,
                      category: 'ventilation',
                      airSafetyRating: 'Safe',
                      co2ImpactKg: 0.1,
                      isCompleted: false
                    },
                    {
                      id: 'r-6',
                      time: '07:30 PM',
                      title: 'Evening Return & Air-Lock Transition',
                      description: 'Remove outer footwear and smog-exposed coats at the entryway. Wash face and hands with warm water to clear settled carbon dust.',
                      category: 'purification',
                      airSafetyRating: 'Caution',
                      co2ImpactKg: 0,
                      isCompleted: false
                    }
                  ]}
                  aqiData={aqiData}
                  familyMembers={familyMembers}
                />
              </div>
            )}

            {/* Tab 3: Sustainable Swaps & Impact Calculator */}
            {activeTab === 'swaps' && (
              <div className="animate-in fade-in duration-300">
                <SustainableSwaps initialSwaps={swaps} />
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
                <CommunityBoard initialPosts={communityPosts} />
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
                  customApiKey={customApiKey}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <FamilyManagerModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        familyMembers={familyMembers}
        onSaveFamily={handleSaveFamily}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={customApiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-100 glass-card-strong py-6 text-xs text-slate-500 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span className="font-bold text-slate-800">BreatheEasy</span>
            <span>• Apple Glass UI • Urban Air Quality Shield</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Challenge 6: Urban Air Quality Assistant</span>
            <span>•</span>
            <span>FastAPI Python Backend</span>
            <span>•</span>
            <span>Google Gemini 2.0 API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
