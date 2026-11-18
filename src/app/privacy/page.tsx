'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, Lock, ShieldCheck, EyeOff, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full glass-card border-b border-white/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">BreatheEasy Privacy Policy</span>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-emerald-700 hover:underline">
            Open App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Privacy First Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Effective Date: November 18, 2026 • GDPR & CCPA Compliant</p>
        </div>

        <div className="glass-card-strong rounded-3xl p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed border border-white/80 shadow-xl">
          <section className="space-y-3">
            <div className="bg-emerald-50/90 border border-emerald-200 p-4 rounded-2xl flex items-start space-x-3 text-emerald-950">
              <ShieldCheck className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Our Core Privacy Commitment</h4>
                <p className="text-xs mt-1 text-emerald-900">
                  BreatheEasy is built with a zero-surveillance philosophy. <strong>We do NOT sell, rent, or monetize your location or sensitive family health information.</strong>
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <EyeOff className="h-5 w-5 text-emerald-600" />
              <span>1. Information We Collect</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>Location Data:</strong> When you use &ldquo;Detect My GPS Location&rdquo; or search for a city, coordinates are passed ephemerally to Open-Meteo to fetch local air quality. We do NOT track your continuous location history.
              </li>
              <li>
                <strong>Family Health Profiles:</strong> Names, ages, and medical flags (e.g. Asthma, COPD) entered into the Family Shield are saved strictly in your device&apos;s local storage (`localStorage`) and local database session. They are never shared with advertising networks.
              </li>
              <li>
                <strong>Custom API Keys:</strong> If you supply your personal Google Gemini API key, it is held strictly in your browser&apos;s local storage and transmitted over encrypted HTTPS directly to your private AI instance.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Database className="h-5 w-5 text-emerald-600" />
              <span>2. How Your Information Is Used</span>
            </h2>
            <p>We use your inputs exclusively to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Retrieve accurate real-time atmospheric readings for your specific geographic area.</li>
              <li>Generate age-appropriate and health-conscious diurnal routines and emergency smog protocols.</li>
              <li>Calculate your household&apos;s carbon offset (kg CO2) and indoor particulate (PM2.5) reduction metrics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Lock className="h-5 w-5 text-emerald-600" />
              <span>3. Third-Party API Services</span>
            </h2>
            <p>
              BreatheEasy interfaces with reputable third-party platforms to provide real-time functionalities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Open-Meteo & OpenWeatherMap:</strong> For atmospheric sensor telemetry.</li>
              <li><strong>Google Gemini API:</strong> For natural language processing and advice synthesis. Data sent to Google is governed by Google Cloud&apos;s API data privacy terms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>4. Your Data Rights & Deletion</span>
            </h2>
            <p>
              You have full control over your data at all times. You can clear your family members, saved habits, and stored API keys instantly at any time by clearing your browser&apos;s local storage or clicking &ldquo;Remove Member&rdquo; in the Family Shield modal.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Privacy inquiries: privacy@breatheasy.eco</span>
            <Link href="/terms" className="text-emerald-700 font-bold hover:underline">
              Read Terms of Service →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
