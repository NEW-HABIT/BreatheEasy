'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wind, Shield, Sparkles, ArrowRight, Activity, Users, 
  Leaf, MapPin, CheckCircle, Clock, HeartHandshake, ChevronRight, BarChart3
} from 'lucide-react';
import { fetchLiveAqi } from '@/lib/api';
import { getAqiCategory } from '@/lib/aqiData';
import { AqiData } from '@/types';

export default function LandingPage() {
  const [sampleCity, setSampleCity] = useState('New Delhi');
  const [liveData, setLiveData] = useState<AqiData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadSample() {
      setIsLoading(true);
      const data = await fetchLiveAqi(sampleCity);
      if (data) setLiveData(data);
      setIsLoading(false);
    }
    loadSample();
  }, [sampleCity]);

  const cat = liveData ? getAqiCategory(liveData.aqi) : null;

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-200">
      {/* Top Glass Header */}
      <header className="sticky top-0 z-40 w-full glass-card border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight gradient-text-green">
                BreatheEasy
              </span>
              <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200/60">
                Eco Shield
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5 text-sm font-medium">
            <Link href="#features" className="text-slate-600 hover:text-emerald-700 transition hidden sm:inline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-emerald-700 transition hidden sm:inline">
              How It Works
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-emerald-700 text-xs transition hidden md:inline">
              Terms
            </Link>
            <Link href="/privacy" className="text-slate-500 hover:text-emerald-700 text-xs transition hidden md:inline">
              Privacy
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Soft background ambient green orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-sm animate-float">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Challenge 6: Urban Air Quality Assistant • Live Real-Time Sensors</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Breathe Clean, Live Green. <br />
            <span className="gradient-text-green">Protecting Families from Winter Smog</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Real-time urban pollution telemetry meets Google Gemini GenAI. Personalized daily schedules, clinical family health shields, low-cost indoor hacks, and quantified carbon & particulate reductions.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Protect My Family Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#live-preview"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card hover:bg-white text-slate-700 font-semibold text-sm sm:text-base border border-slate-200 transition flex items-center justify-center space-x-2"
            >
              <span>Explore Live Telemetry</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </a>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">100M+</span>
              <p className="text-xs text-slate-500 mt-0.5">Citizens in Smog Inversions</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-700">Zero Demo Data</span>
              <p className="text-xs text-slate-500 mt-0.5">100% Live Open-Meteo Satellite Feed</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">75% Cut</span>
              <p className="text-xs text-slate-500 mt-0.5">Inhaled PM2.5 via DIY IAQ Hacks</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-700">Gemini 2.0</span>
              <p className="text-xs text-slate-500 mt-0.5">Clinical Epidemiological AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Atmospheric Preview Card */}
      <section id="live-preview" className="max-w-5xl mx-auto px-4 sm:px-6 w-full -mt-6 pb-20">
        <div className="glass-card-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Live Sensor Snapshot
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Real-Time Atmospheric Diagnostics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch location below to see live readings from international monitoring stations.
              </p>
            </div>

            {/* City pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['New Delhi', 'Lahore', 'Mumbai', 'Beijing', 'London', 'New York'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSampleCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    sampleCity === city
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'glass-card hover:bg-emerald-50 text-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {liveData && cat ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* AQI Meter Glass Tile */}
              <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Air Quality</span>
                  <div className="flex items-baseline space-x-3 mt-3">
                    <span className="text-5xl font-black text-slate-900">{liveData.aqi}</span>
                    <span 
                      className="text-xs font-bold px-2.5 py-1 rounded-full border"
                      style={{ color: cat.color, backgroundColor: `${cat.color}15`, borderColor: `${cat.color}40` }}
                    >
                      {cat.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">{cat.advice}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                  Primary Pollutant: <strong className="text-slate-700">{liveData.primaryPollutant}</strong>
                </div>
              </div>

              {/* Pollutants Breakdown */}
              <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Pollutants</span>
                <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">PM2.5</span>
                    <span className="text-base font-bold text-slate-800">{liveData.pollutants.pm25} µg/m³</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">PM10</span>
                    <span className="text-base font-bold text-slate-800">{liveData.pollutants.pm10} µg/m³</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">NO₂</span>
                    <span className="text-base font-bold text-slate-800">{liveData.pollutants.no2} ppb</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Ozone</span>
                    <span className="text-base font-bold text-slate-800">{liveData.pollutants.o3} ppb</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  WHO 24h Threshold: 15 µg/m³
                </div>
              </div>

              {/* Weather & Solar Window */}
              <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inversion Ventilation</span>
                <div className="my-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-slate-100">
                    <span className="text-slate-500">Safe Window</span>
                    <span className="font-bold text-emerald-700">{liveData.ventilationWindow.start} - {liveData.ventilationWindow.end}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-slate-100">
                    <span className="text-slate-500">Temperature</span>
                    <span className="font-bold text-slate-800">{liveData.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-slate-100">
                    <span className="text-slate-500">Humidity</span>
                    <span className="font-bold text-slate-800">{liveData.humidity}%</span>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="text-xs text-center py-2 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold transition"
                >
                  Open Full Diagnostic Dashboard →
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              Connecting to atmospheric telemetry...
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Comprehensive Anti-Smog Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered for Real-World Smog Defense
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Every feature is backed by environmental epidemiological data and indoor air aerosol physics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Family Health Shield</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Personalized clinical guidance per family member based on age, asthma, heart conditions, and respiratory history. Children and elderly receive tailored airway protocols.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Quantified Impact Engine</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Toggle sustainable daily habits (metro commute, induction cooking, electric vaporizers) and watch your family&apos;s real-time kg CO2 savings and % PM2.5 reduction update dynamically.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 text-green-700 flex items-center justify-center font-bold">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">GenAI Conversational Advisor</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Powered by Google Gemini with live atmospheric context injection. Ask about DIY Corsi-Rosenthal box purifiers, damp towel seals, or pediatric symptom relief.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-100 glass-card-strong py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span className="font-bold text-slate-800">BreatheEasy</span>
            <span>• Urban Air Quality Assistant</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/terms" className="hover:text-emerald-700 transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-emerald-700 transition">Privacy Policy</Link>
            <Link href="/dashboard" className="hover:text-emerald-700 font-semibold text-emerald-700 transition">Launch App</Link>
          </div>

          <span className="text-[11px] text-slate-400">Challenge 6: Urban Air Quality Assistant • Google Gemini API</span>
        </div>
      </footer>
    </div>
  );
}
