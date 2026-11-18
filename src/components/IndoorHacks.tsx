'use client';

import React, { useState } from 'react';
import { Hammer, Layers, Flame, Sprout, Sparkles } from 'lucide-react';

interface IndoorHacksProps {
  onAskAI: (prompt: string) => void;
}

export const IndoorHacks: React.FC<IndoorHacksProps> = ({ onAskAI }) => {
  const [activeHack, setActiveHack] = useState<number>(0);

  const hacks = [
    {
      title: 'DIY Bedroom Air Cleaner Box Fan',
      category: 'Home Air Purifier',
      cost: '₹700 - ₹1,400 (Budget Friendly)',
      impact: 'Freshens 80% of room air within 20 mins',
      benefit: 'Equivalent to high-end purifiers',
      icon: Hammer,
      summary: 'A simple, proven air filter made with a basic box fan and an air filter.',
      steps: [
        'Get an inexpensive 20-inch box fan (or table fan) and a clean air filter (MERV-13 or HEPA grade).',
        'Check the little arrow on the filter edge: make sure it points inward towards the fan intake.',
        'Use ordinary tape to seal the edges snugly so all incoming air passes through the filter.',
        'Cut a simple circular ring from cardboard and tape it to the front face to blow air forward smoothly.',
        'Place it slightly elevated in your bedroom or living room on low or medium speed for silent, pure airflow.'
      ]
    },
    {
      title: 'Damp Towel Door & Window Fresh Air Barrier',
      category: 'Dust & Draft Seal',
      cost: 'Free (Household Items)',
      impact: 'Stops fine outdoor dust and soot from entering',
      benefit: 'Keeps bedroom floors & air pristine',
      icon: Layers,
      summary: 'During hazy or smoggy evenings, outdoor dust creeps in through door thresholds and window gaps.',
      steps: [
        'Take regular bath towels and dampen them lightly with tap water (not soaking wet).',
        'Roll the damp towel snugly against the bottom crack of your main entry doors and balcony doors.',
        'Use removable paper masking tape on any loose window frames with visible gaps.',
        'The light moisture traps airborne dust particles as air tries to seep in, keeping your room air calm and pure.',
        'Simply rinse and wash the towel every few days to keep it fresh.'
      ]
    },
    {
      title: 'Smart Kitchen Fume & Cooking Shield',
      category: 'Kitchen Fresh Air',
      cost: 'Free Habit',
      impact: 'Prevents indoor fumes and oil smoke from spreading',
      benefit: 'Protects kids and elders from coughing',
      icon: Flame,
      summary: 'Cooking with hot oil or direct gas flames can quickly fill living rooms with heavy smoke and odors.',
      steps: [
        'Turn on the kitchen exhaust or chimney fan 1 minute before lighting the stove, and let it run for a few minutes after.',
        'Keep the kitchen door closed and kitchen window slightly cracked open so cooking steam escapes outside immediately.',
        'Cover pots with lids while simmering to reduce steam and oil droplets in the air.',
        'When possible, enjoy steaming, baking, or electric kettle cooking on high smog days.'
      ]
    },
    {
      title: 'Fresh Living Houseplants (Green Air Filters)',
      category: 'Natural Greenery',
      cost: '₹150 - ₹350 per plant',
      impact: 'Naturally purifies air and adds gentle room humidity',
      benefit: 'Produces fresh oxygen day & night',
      icon: Sprout,
      summary: 'Hardy indoor plants gently filter room air and bring calming greenery into your living space.',
      steps: [
        'Snake Plant (Sansevieria): Perfect for bedside tables. One of the rare plants that releases pure oxygen throughout the night.',
        'Areca Palm: Beautiful lush leaves that naturally balance dry indoor air and settle ambient dust.',
        'Money Plant & Spider Plant: Easy to maintain and helps remove subtle paint and synthetic odors.',
        'Gently wipe the leaves with a damp cloth once a week so the plant can breathe and thrive.'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card-strong rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700 font-extrabold uppercase text-xs tracking-wider">Home Care & Comfort</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Simple & Budget-Friendly
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Easy Ways to Keep Your Home Air Clean & Fresh
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Practical, low-cost methods to block dust and smoke, freshen bedroom air, and keep your family breathing comfortably.
          </p>
        </div>

        <button
          onClick={() => onAskAI('Can you explain simple and low-budget ways to keep indoor air clean and healthy for my family?')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition self-start md:self-auto shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI for Home Tips</span>
        </button>
      </div>

      {/* Grid of Hacks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {hacks.map((hack, idx) => {
          const Icon = hack.icon;
          const isSelected = activeHack === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveHack(idx)}
              className={`p-4.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'glass-card-strong border-emerald-500 shadow-md shadow-emerald-100'
                  : 'glass-card border-white/80 hover:bg-emerald-50/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{hack.cost}</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-3 leading-snug">{hack.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{hack.summary}</p>
              </div>

              <span className={`text-[10px] font-extrabold mt-3 block ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                {isSelected ? 'Viewing Instructions ↓' : 'Click to View Guide →'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Hack Detailed Instructions */}
      <div className="glass-card-strong rounded-3xl p-6 sm:p-7 shadow-xl border border-white/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {hacks[activeHack].category}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {hacks[activeHack].title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
              ✨ {hacks[activeHack].impact}
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm">
              🍃 {hacks[activeHack].benefit}
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Step-by-Step Implementation Guide:
          </h4>
          <ol className="space-y-3">
            {hacks[activeHack].steps.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="h-6 w-6 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-extrabold text-xs shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
