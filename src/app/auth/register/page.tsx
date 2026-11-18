'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, Mail, User, MapPin, Home, Flame, Car, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [homeType, setHomeType] = useState('Apartment');
  const [cookingFuel, setCookingFuel] = useState('Induction');
  const [commuteMode, setCommuteMode] = useState('Metro/Train');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await register({
      name,
      email,
      password,
      city,
      homeType,
      cookingFuel,
      commuteMode
    });

    setIsSubmitting(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 py-12 selection:bg-emerald-200">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Glass Card */}
      <div className="w-full max-w-lg glass-card-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <span className="text-2xl font-black gradient-text-green tracking-tight">BreatheEasy</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Create Your Family Shield</h2>
          <p className="text-xs text-slate-500">
            Tell us about your home and lifestyle to calibrate real-time smog recommendations
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center space-x-2 text-rose-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
                <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">City / Region</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full glass-input rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
                <MapPin className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* Lifestyle Parameters */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Household Lifestyle Calibration
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Home Type</label>
                <select
                  value={homeType}
                  onChange={(e) => setHomeType(e.target.value)}
                  className="w-full glass-input rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Cooking Fuel</label>
                <select
                  value={cookingFuel}
                  onChange={(e) => setCookingFuel(e.target.value)}
                  className="w-full glass-input rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Induction">Induction (Clean)</option>
                  <option value="LPG">LPG Stove</option>
                  <option value="Piped Gas">Piped Natural Gas</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Primary Commute</label>
                <select
                  value={commuteMode}
                  onChange={(e) => setCommuteMode(e.target.value)}
                  className="w-full glass-input rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Metro/Train">Metro / Transit</option>
                  <option value="Electric Vehicle">Electric Vehicle</option>
                  <option value="Carpool">Carpool</option>
                  <option value="Car (Solo)">Car (Solo)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Creating Shield...' : 'Complete Registration & Open Dashboard'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="text-emerald-700 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
