'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
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
            <span className="font-bold text-slate-900 text-sm">BreatheEasy Terms of Service</span>
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
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Effective Date: November 18, 2026 • Version 1.0.0</p>
        </div>

        <div className="glass-card-strong rounded-3xl p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed border border-white/80 shadow-xl">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p>
              By accessing or using <strong>BreatheEasy</strong> (&ldquo;the Application&rdquo;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Application. BreatheEasy provides urban air quality tracking, diurnal routine planning, indoor air quality suggestions, and community coordination tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <span>2. Medical & Health Advice Disclaimer</span>
            </h2>
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-amber-950 space-y-2 text-xs">
              <p className="font-bold">IMPORTANT CLINICAL NOTICE:</p>
              <p>
                BreatheEasy is an educational and lifestyle decision-support tool powered by Generative AI and environmental data feeds. <strong>The Application does NOT provide medical advice, diagnosis, or treatment.</strong>
              </p>
              <p>
                Information provided regarding pediatric asthma, cardiovascular conditions, medication reminders, or mask usage is for informational purposes only. Always consult a qualified physician or healthcare provider regarding medical conditions, acute respiratory symptoms, or emergencies.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>3. Air Quality Sensor Data Accuracy</span>
            </h2>
            <p>
              Real-time Air Quality Index (AQI), PM2.5, PM10, NO₂, and atmospheric metrics are sourced from publicly available satellite data, European Copernicus, and local monitoring stations via Open-Meteo and OpenWeatherMap APIs. While we strive for high precision, local microclimates, thermal inversions, sensor calibration lags, and sudden street-level emission events may cause local variations. BreatheEasy cannot guarantee 100% continuous sensor uptime or micro-geographic precision.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>4. Indoor IAQ Hacks & DIY Air Purifier Safety</span>
            </h2>
            <p>
              Guidance for DIY Corsi-Rosenthal boxes, damp towel seals, and kitchen ventilation are open-source engineering hacks derived from peer-reviewed aerosol research (e.g., UC Davis). Users are responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Ensuring electrical safety of fans, box fans, and cords without overloading sockets.</li>
              <li>Regularly replacing dirty furnace filters to prevent motor overheating.</li>
              <li>Ensuring adequate indoor oxygenation and following fire safety rules.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>5. Community Action Board & User Submissions</span>
            </h2>
            <p>
              Users may post neighborhood alerts, anti-burning initiatives, and group buy notices. Users agree not to post defamatory, harassing, or fraudulent content. BreatheEasy reserves the right to remove any post that violates community safety.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>6. Limitation of Liability</span>
            </h2>
            <p>
              In no event shall BreatheEasy, its developers, or contributors be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, reliance on air quality metrics, or actions taken during smog emergencies.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Questions regarding our terms? Email: legal@breatheasy.eco</span>
            <Link href="/privacy" className="text-emerald-700 font-bold hover:underline">
              Read Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
