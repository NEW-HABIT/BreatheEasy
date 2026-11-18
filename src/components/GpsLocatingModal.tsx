'use client';

import React from 'react';
import { Compass, Satellite, MapPin, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface GpsLocatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusStep: number; // 1: GPS, 2: Geocoding, 3: Atmospheric API, 4: Complete
  coords?: { lat: number; lng: number } | null;
  detectedCity?: string | null;
}

export const GpsLocatingModal: React.FC<GpsLocatingModalProps> = ({
  isOpen,
  onClose,
  statusStep,
  coords,
  detectedCity
}) => {
  if (!isOpen) return null;

  const steps = [
    { title: 'GPS Triangulation', desc: 'Acquiring high-accuracy browser satellite coordinates' },
    { title: 'Locality Resolution', desc: 'Reverse-geocoding street and municipal district' },
    { title: 'Atmospheric Sensor Sync', desc: 'Querying Open-Meteo real-time AQI & meteorological sensors' },
    { title: 'Health Matrix Calibration', desc: 'Re-centering real-time map and updating pediatric shield' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card-strong rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-white relative overflow-hidden text-center space-y-6">
        
        {/* Soft background glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-300/30 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Radar Scanner Animation */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
          {/* Concentric rings */}
          <div className="absolute inset-0 rounded-full border border-emerald-300/40" />
          <div className="absolute inset-3 rounded-full border border-emerald-400/50" />
          <div className="absolute inset-7 rounded-full border border-emerald-500/60" />

          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping-slow" />

          {/* Rotating radar sweep */}
          <div className="absolute inset-0 rounded-full overflow-hidden animate-radar">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-500/40 to-transparent origin-bottom-right" />
          </div>

          {/* Center Pin Icon */}
          <div className="relative z-10 p-3 rounded-2xl bg-white shadow-lg border border-emerald-200 text-emerald-600">
            {statusStep >= 4 ? (
              <ShieldCheck className="h-7 w-7 text-emerald-600 animate-bounce" />
            ) : (
              <MapPin className="h-7 w-7 text-emerald-600 animate-pulse" />
            )}
          </div>
        </div>

        {/* Header Title */}
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-2">
            <Satellite className="h-3.5 w-3.5 animate-spin" />
            <span>Real-Time GPS Telemetry</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {statusStep >= 4 ? 'Location Calibrated!' : 'Detecting Your Location...'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {detectedCity ? `Connected to ${detectedCity}` : 'Synchronizing local micro-climate and smog telemetry'}
          </p>

          {coords && (
            <div className="mt-2 text-[11px] font-mono text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg inline-block border border-emerald-200/60">
              📍 {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
            </div>
          )}
        </div>

        {/* Step Progress Checklist */}
        <div className="space-y-2.5 text-left bg-white/70 border border-slate-100 rounded-2xl p-3.5 shadow-sm">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isDone = statusStep > stepNum;
            const isCurrent = statusStep === stepNum;

            return (
              <div key={idx} className="flex items-start space-x-2.5 text-xs">
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <div className="h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-300" />
                  )}
                </div>
                <div>
                  <p className={`font-bold ${isCurrent ? 'text-emerald-800 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                    {s.title}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {statusStep >= 4 ? (
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            Explore Local Air Shield & Map
          </button>
        ) : (
          <p className="text-[11px] text-slate-400 animate-pulse">
            Please allow browser GPS permission if prompted
          </p>
        )}

      </div>
    </div>
  );
};
