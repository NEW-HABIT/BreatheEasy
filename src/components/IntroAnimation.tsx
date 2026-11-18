'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, ArrowRight, Sparkles } from 'lucide-react';

interface IntroAnimationProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, forceShow = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<1 | 2>(1);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user already saw intro in this session
    const hasSeen = sessionStorage.getItem('breatheasy_intro_seen');
    if (hasSeen && !forceShow) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Phase 1 -> Phase 2 at 1.2s
    const timerPhase = setTimeout(() => {
      setPhase(2);
    }, 1200);

    // Fade out at 2.6s
    const timerFade = setTimeout(() => {
      handleDismiss();
    }, 2800);

    return () => {
      clearTimeout(timerPhase);
      clearTimeout(timerFade);
    };
  }, [forceShow]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    sessionStorage.setItem('breatheasy_intro_seen', 'true');
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #ecfdf5 0%, #f6fbf7 50%, #ffffff 100%)'
      }}
    >
      {/* Ambient ambient glow orbs */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-300/30 blur-[130px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-teal-200/40 blur-[100px] rounded-full pointer-events-none" />

      {/* Center Breathing Emblem */}
      <div className="relative flex flex-col items-center justify-center text-center p-8 z-10 max-w-md w-full">
        {/* Concentric Breathing Rings */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute h-36 w-36 rounded-full border border-emerald-300/50 animate-pulse-ring pointer-events-none" />
          <div className="absolute h-28 w-28 rounded-full border border-teal-200/60 animate-ping opacity-30 pointer-events-none" />

          {/* Central Glass Disc with Leaf */}
          <div className="relative h-20 w-20 rounded-3xl bg-white/90 backdrop-blur-2xl shadow-xl shadow-emerald-500/15 border border-white flex items-center justify-center transform transition-transform duration-1000 ease-out hover:scale-105">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Leaf className="h-7 w-7 text-white animate-breathe" />
            </div>
          </div>
        </div>

        {/* Dynamic Text with Gentle Transition */}
        <div className="space-y-2 h-24">
          {phase === 1 ? (
            <div className="space-y-1 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 block">
                Inhale Calmly
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Take a deep breath...
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Sensing real-time air around you
              </p>
            </div>
          ) : (
            <div className="space-y-1 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 block">
                Welcome To
              </span>
              <h2 className="text-3xl sm:text-4xl font-black gradient-text-green tracking-tight">
                BreatheEasy
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Fresh Air, Health & Peace of Mind for Your Family
              </p>
            </div>
          )}
        </div>

        {/* Minimal Progress Line */}
        <div className="w-48 bg-emerald-100/80 rounded-full h-1 mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-[shimmer_2.5s_ease-out_forwards] w-full" />
        </div>

        {/* Instant Skip / Enter Button */}
        <button
          onClick={handleDismiss}
          className="mt-8 flex items-center space-x-1.5 px-4 py-2 rounded-full glass-card hover:bg-white text-slate-600 hover:text-emerald-700 text-xs font-semibold border border-slate-200/80 shadow-sm transition hover:scale-105"
        >
          <span>Enter Now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
