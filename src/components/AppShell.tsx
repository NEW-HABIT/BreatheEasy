'use client';

import React from 'react';
import Link from 'next/link';
import { Wind } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  /** Optionally show AQI badge in navbar */
  aqiValue?: number;
  aqiCategory?: string;
}

function getAqiColor(aqi?: number): string {
  if (!aqi) return 'bg-gray-100 text-gray-500';
  if (aqi <= 50)  return 'bg-green-100 text-green-700';
  if (aqi <= 100) return 'bg-yellow-100 text-yellow-700';
  if (aqi <= 150) return 'bg-orange-100 text-orange-700';
  if (aqi <= 200) return 'bg-red-100 text-red-700';
  if (aqi <= 300) return 'bg-purple-100 text-purple-700';
  return 'bg-red-200 text-red-900';
}

export function AppShell({ children, aqiValue, aqiCategory }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Glassmorphism Navbar ── */}
      <header className="sticky top-0 z-40 navbar-glass">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center shadow-green-glow"
              style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
              <Wind className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">BreatheEasy</span>
          </Link>

          {/* Center nav links */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-green-600 transition-colors">Dashboard</Link>
            <Link href="/terms" className="hover:text-green-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy</Link>
          </div>

          {/* Right: AQI badge (optional) */}
          <div className="flex items-center gap-3">
            {aqiValue !== undefined && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getAqiColor(aqiValue)}`}>
                AQI {aqiValue} · {aqiCategory ?? ''}
              </span>
            )}
            <Link href="/dashboard" className="btn-green text-sm py-2 px-4">
              Open App
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Light footer ── */}
      <footer className="border-t border-green-100 bg-white/60 backdrop-blur py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-500">BreatheEasy</span>
            <span>· GenAI Urban Air Quality Shield</span>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-green-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy</Link>
            <Link href="/dashboard" className="hover:text-green-600 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
