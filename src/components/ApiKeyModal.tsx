'use client';

import React, { useState } from 'react';
import { X, Key, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-modal-title"
        className="glass-card-strong rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden border border-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-100 bg-white/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 id="api-key-modal-title" className="text-base font-bold text-slate-900">Google Gemini API Key</h3>
              <p className="text-xs text-slate-500">Enable live Google Gemini 2.0 Flash engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close API key modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="glass-card bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Real-Time Air Quality & GenAI</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Air quality data is fetched <strong>100% live in real-time</strong> from Open-Meteo&apos;s global satellite and ground monitoring network for any city on Earth.
            </p>
            <p className="text-slate-600 leading-relaxed">
              To power the conversational advisor with live <strong>Google Gemini 2.0 Flash</strong>, enter your free API key below. If left blank, the built-in expert epidemiological engine handles all responses with full local context.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Gemini API Key</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              type="password"
              aria-label="Google Gemini API key input"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
            />
          </div>

          {savedSuccess && (
            <div className="flex items-center space-x-2 text-emerald-800 text-xs bg-emerald-100 p-2.5 rounded-xl border border-emerald-300 font-semibold">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>API Key saved! Live Gemini 2.0 active.</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-md transition"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
