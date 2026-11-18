'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { AlertBanner } from '@/components/AlertBanner';
import { AqiGauge } from '@/components/AqiGauge';
import { PollutantCards } from '@/components/PollutantCards';
import { TrendChart } from '@/components/TrendChart';
import { WeatherCard } from '@/components/WeatherCard';
import { FamilyRiskCards } from '@/components/FamilyRiskCards';
import { FamilyManagerModal } from '@/components/FamilyManagerModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { RoutinePlanner } from '@/components/RoutinePlanner';
import { SustainableSwaps } from '@/components/SustainableSwaps';
import { IndoorHacks } from '@/components/IndoorHacks';
import { CommunityBoard } from '@/components/CommunityBoard';
import { AiAdvisorChat } from '@/components/AiAdvisorChat';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GpsLocatingModal } from '@/components/GpsLocatingModal';
import { fetchLiveAqi, fetchCommunityPosts, fetchSwapsFromBackend } from '@/lib/api';
import { DEFAULT_FAMILY_MEMBERS, INITIAL_COMMUNITY_POSTS } from '@/lib/store';
import { INITIAL_SUSTAINABLE_SWAPS } from '@/lib/impactCalculator';
import { CITIES_DATA } from '@/lib/aqiData';
import { AqiData, FamilyMember } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Leaf, Lock, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';

const RealtimeAqiMap = dynamic(
  () => import('@/components/RealtimeAqiMap').then((mod) => mod.RealtimeAqiMap),
  {
    ssr: false,
    loading: () => (
      <div className="glass-card rounded-3xl p-6 h-[400px] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-600">Loading Real-Time Atmospheric Satellite Map...</p>
      </div>
    )
  }
);

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, login } = useAuth();
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

  // GPS Locating Modal & Radar Animation State
  const [isLocatingModalOpen, setIsLocatingModalOpen] = useState<boolean>(false);
  const [locatingStep, setLocatingStep] = useState<number>(1);
  const [locatingCoords, setLocatingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingCity, setLocatingCity] = useState<string | null>(null);

  // Sync user profile city and family members when user logs in
  useEffect(() => {
    if (user) {
      if (user.city) setSelectedCity(user.city);
      if (user.familyMembers && user.familyMembers.length > 0) {
        setFamilyMembers(user.familyMembers);
      }
    }
  }, [user]);

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
    if (savedFam && !user?.familyMembers) {
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
  }, [user]);

  const handleSaveFamily = (members: FamilyMember[]) => {
    setFamilyMembers(members);
    localStorage.setItem('breatheasy_family', JSON.stringify(members));
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('breatheasy_gemini_key', key);
  };

  // Browser GPS Geolocation with Radar Loading Animation & Reverse Geocoding
  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingModalOpen(true);
    setLocatingStep(1);
    setLocatingCoords(null);
    setLocatingCity(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let finalLat = latitude;
        let finalLng = longitude;
        let resolvedCityName = `Location (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`;

        // Check if browser coordinates are within India (Lat 6.0 to 37.5, Lng 68.0 to 97.5)
        const isWithinIndia = latitude >= 6.0 && latitude <= 37.5 && longitude >= 68.0 && longitude <= 97.5;

        setLocatingCoords({ lat: isWithinIndia ? finalLat : 28.6139, lng: isWithinIndia ? finalLng : 77.2090 });
        setLocatingStep(2);

        if (isWithinIndia) {
          try {
            const revRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            if (revRes.ok) {
              const revData = await revRes.json();
              const addr = revData.address;
              const place = addr?.city || addr?.town || addr?.suburb || addr?.village || addr?.county || addr?.state_district || addr?.state;
              if (place) {
                resolvedCityName = place;
              }
            }
          } catch (e) {
            console.log('Reverse geocoding client fallback:', e);
          }
        } else {
          // If desktop browser reported foreign/default coordinates (VPN or Windows desktop default), calibrate to Indian region
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.country_code === 'IN' && ipData.latitude && ipData.longitude) {
                finalLat = ipData.latitude;
                finalLng = ipData.longitude;
                resolvedCityName = ipData.city || 'New Delhi';
              } else {
                finalLat = 28.6139;
                finalLng = 77.2090;
                resolvedCityName = 'New Delhi';
              }
            } else {
              finalLat = 28.6139;
              finalLng = 77.2090;
              resolvedCityName = 'New Delhi';
            }
          } catch (e) {
            finalLat = 28.6139;
            finalLng = 77.2090;
            resolvedCityName = 'New Delhi';
          }
        }

        setLocatingCoords({ lat: finalLat, lng: finalLng });
        setLocatingCity(resolvedCityName);
        setLocatingStep(3);

        // Step 3: Fetch Open-Meteo telemetry from backend
        const data = await fetchLiveAqi(resolvedCityName, finalLat, finalLng);
        if (data) {
          const finalData = {
            ...data,
            city: resolvedCityName,
            latitude: finalLat,
            longitude: finalLng
          };
          setAqiData(finalData);
          setSelectedCity(resolvedCityName);
        }

        setLocatingStep(4);
        setTimeout(() => {
          setIsLocatingModalOpen(false);
        }, 1500);
      },
      (err) => {
        console.warn('GPS error:', err.message);
        alert('Could not retrieve GPS coordinates. Please ensure location permissions are enabled in your browser.');
        setIsLocatingModalOpen(false);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const handleAskAiFromExternal = (prompt: string) => {
    setExternalAiPrompt(prompt);
    setActiveTab('advisor');
  };

  // ── Authentication Gate (Protected Route) ──
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner
          message="Checking household authorization..."
          submessage="Connecting to BreatheEasy secure user session"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 selection:bg-emerald-200">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-md glass-card-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 space-y-6 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Lock className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Protected Family Shield</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Air quality protocols, pediatric asthma reminders, and home emission profiles are calibrated to registered household accounts.
            </p>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl text-xs space-y-2 text-left">
            <span className="font-bold text-emerald-900 block flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Instant Access Options:</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              Sign in with your email or use the 1-click evaluator demo account to test all features instantly.
            </p>
            <button
              onClick={() => login('rajesh.sharma@example.com', 'password123')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>1-Click Evaluator Demo Sign In</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/auth/login"
              className="py-3 rounded-2xl glass-card hover:bg-white text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center justify-center space-x-1.5"
            >
              <LogIn className="h-4 w-4 text-emerald-600" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/auth/register"
              className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </Link>
          </div>

          <Link href="/" className="text-xs text-slate-400 hover:text-emerald-700 block transition font-medium">
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    );
  }

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

                {/* Live Weather & Atmospheric Inversion Telemetry */}
                <WeatherCard aqiData={aqiData} />

                {/* Real-Time Atmospheric Satellite & Dispersion Map */}
                <RealtimeAqiMap
                  aqiData={aqiData}
                  onLocateMe={handleGpsLocate}
                  onSelectCity={(city) => setSelectedCity(city)}
                  isLocating={isLocatingModalOpen}
                />

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

            {/* Tab 7: Dedicated Full-Screen Live Atmospheric Map */}
            {activeTab === 'map' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <RealtimeAqiMap
                  aqiData={aqiData}
                  onLocateMe={handleGpsLocate}
                  onSelectCity={(city) => setSelectedCity(city)}
                  isLocating={isLocatingModalOpen}
                />
                <WeatherCard aqiData={aqiData} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AqiGauge aqiData={aqiData} />
                  <PollutantCards pollutants={aqiData.pollutants} />
                </div>
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

      <GpsLocatingModal
        isOpen={isLocatingModalOpen}
        onClose={() => setIsLocatingModalOpen(false)}
        statusStep={locatingStep}
        coords={locatingCoords}
        detectedCity={locatingCity}
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
