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
      title: 'DIY Corsi-Rosenthal Air Cleaner Box Fan',
      category: 'Filtration Engineering',
      cost: '₹700 - ₹1,400 ($10 - $18)',
      impact: 'Reduces room PM2.5 by 75-85% in 20 mins',
      cadr: '450 - 600 CFM (Matches $600 commercial purifiers)',
      icon: Hammer,
      summary: 'A proven, open-source air purifier built with a standard box fan and MERV-13 furnace filters.',
      steps: [
        'Obtain a 20-inch domestic box fan (or exhaust fan) and one to four 20"x20" MERV-13 (or H13 HEPA) furnace filters.',
        'Ensure the airflow indicator arrow on the filter points inward toward the intake side of the fan.',
        'Use heavy duct tape to seal all 4 outer edges, preventing any air bypass leaks around the filter perimeter.',
        'Cut a circular shroud out of cardboard and tape it to the front face of the fan to eliminate eddy-current backflow and boost throughput by 25%.',
        'Place the unit in the center of the bedroom, raised 1 foot off the ground. Run continuously on speed 2.'
      ]
    },
    {
      title: 'Damp Towel Threshold & Window Infiltration Barrier',
      category: 'Passive Sealing Hack',
      cost: '₹0 (Free household items)',
      impact: 'Blocks 45% of coarse infiltrating street soot & PM10',
      cadr: 'Electrostatic passive barrier',
      icon: Layers,
      summary: 'High-density winter smog seeps through window frame gaps and bottom door thresholds under cold negative pressure.',
      steps: [
        'Roll up standard bath towels and dampen them lightly with water (not dripping wet).',
        'Firmly wedge the rolled damp towel along the bottom gap of all exterior-facing entry doors.',
        'Use standard painter’s tape or removable masking tape to seal the hairline sash cracks around sliding glass windows.',
        'The water moisture on the towel fibers creates an electrostatic attraction zone that catches sub-micron carbon particles as air tries to seep inside.',
        'Rinse the towel in clean water once daily to wash away captured particulate crust.'
      ]
    },
    {
      title: 'Kitchen Inversion Cooking & Exhaust Protocol',
      category: 'Source Reduction',
      cost: '₹0',
      impact: 'Eliminates 90% of toxic indoor NO₂ spikes',
      cadr: 'Immediate source elimination',
      icon: Flame,
      summary: 'Gas combustion stoves and oil tempering produce indoor NO₂ and particulate spikes that frequently exceed 400 µg/m³ inside apartments.',
      steps: [
        'Never fry, temper mustard seeds, or char rotis on open gas flames during severe outdoor smog days.',
        'Switch to electric magnetic induction, electric rice cookers, or microwaves which generate zero combustion fumes.',
        'If using a gas burner, run the kitchen exhaust hood on MAXIMUM speed 2 minutes before igniting the flame and leave it running for 5 minutes after shutting it off.',
        'Keep the kitchen door closed during cooking to avoid turning the bedrooms into particulate reservoirs.'
      ]
    },
    {
      title: 'NASA-Verified IAQ Botanical Shield (Phytoremediation)',
      category: 'Natural Bio-Filtration',
      cost: '₹200 - ₹500 per plant',
      impact: 'Absorbs indoor VOCs, formaldehyde, and emits O₂ overnight',
      cadr: 'Continuous bio-absorption',
      icon: Sprout,
      summary: 'Specific indoor houseplants absorb gaseous pollutants through stomata and root-associated soil microbiomes.',
      steps: [
        'Sansevieria (Snake Plant / Mother-in-Law’s Tongue): Place 2-3 pots in the bedroom; uniquely converts CO₂ into oxygen at night via Crassulacean Acid Metabolism.',
        'Areca Palm: Acts as a natural humidifier and airborne particulate settle-down catalyst.',
        'Spider Plant & Money Plant: Excellent at trapping indoor xylene and benzene released from synthetic paints and furniture.',
        'Wipe plant leaves gently with a damp cotton cloth once weekly to remove settled particulate crust so stomata remain open.'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card-strong rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700 font-extrabold uppercase text-xs tracking-wider">Zero & Low-Cost Engineering</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Lab & Field Tested
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Indoor Air Quality (IAQ) Survival Hacks
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Practical, affordable hacks that cut personal exposure to toxic winter smog without spending thousands on commercial appliances.
          </p>
        </div>

        <button
          onClick={() => onAskAI('Can you explain the exact science and step-by-step instructions for building a DIY air purifier at home with low budget?')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition self-start md:self-auto shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI for Custom IAQ Hack</span>
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
              💨 CADR: {hacks[activeHack].cadr}
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
