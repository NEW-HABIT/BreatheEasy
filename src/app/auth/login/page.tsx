'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('rajesh.sharma@example.com');
    setPassword('password123');
    setError(null);
    setIsSubmitting(true);

    const result = await login('rajesh.sharma@example.com', 'password123');
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Demo login failed');
    }
  };

  return (
    <div className="w-full max-w-md glass-card-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 space-y-6">
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
        <h2 className="text-xl font-bold text-slate-900 mt-2">Sign in to your Shield</h2>
        <p className="text-xs text-slate-500">
          Access personalized family health risk profiles and real-time smog alerts
        </p>
      </div>

      {/* Demo Fast Login Pill */}
      <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-emerald-900 block">Evaluator / Judge Quick Access:</span>
          <span className="text-[11px] text-emerald-700">Pre-loaded with 4 family members</span>
        </div>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition shrink-0"
        >
          1-Click Demo
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center space-x-2 text-rose-800 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
            />
            <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
          </div>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500">
        <span>Don&apos;t have an account? </span>
        <Link href="/auth/register" className="text-emerald-700 font-bold hover:underline">
          Create Free Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 selection:bg-emerald-200">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />
      <Suspense fallback={<div className="glass-card-strong p-8 rounded-3xl text-slate-500 text-sm">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
