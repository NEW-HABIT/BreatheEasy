import { SustainableSwap } from '@/types';

export const INITIAL_SUSTAINABLE_SWAPS: SustainableSwap[] = [
  {
    id: 'swap-metro',
    title: 'Switch Solo Car Commute to Metro / Electric Bus',
    category: 'Commute',
    currentHabit: 'Driving petrol/diesel car 15 km alone each way',
    sustainableAlternative: 'Rapid transit metro + electric feeder rickshaw',
    co2SavedKgPerDay: 4.8,
    pm25ReductionPercent: 65,
    costImpact: 'Saves Money',
    difficulty: 'Easy',
    explanation: 'Single-occupancy vehicles generate ~192g CO₂ per km and exhaust ultra-fine PM2.5 directly into congested city arteries. Taking mass transit removes 4.8 kg CO₂ daily and eliminates exposure to direct tailpipe fumes in traffic jams.',
    adopted: true
  },
  {
    id: 'swap-induction',
    title: 'Replace LPG Stovetop with Smart Induction Cooktop',
    category: 'Cooking',
    currentHabit: 'Gas combustion stoves producing indoor NO₂ & CO',
    sustainableAlternative: 'High-efficiency magnetic induction cooktop',
    co2SavedKgPerDay: 0.9,
    pm25ReductionPercent: 45,
    costImpact: 'One-Time Investment',
    difficulty: 'Moderate',
    explanation: 'Domestic gas stoves create indoor NO₂ peaks that often exceed outdoor safety thresholds by 300%, exacerbating child asthma. Induction generates instant thermal energy via electromagnetism with zero in-home combustion emissions.',
    adopted: true
  },
  {
    id: 'swap-diy-purifier',
    title: 'Deploy Corsi-Rosenthal DIY HEPA Box Fan',
    category: 'Home',
    currentHabit: 'Keeping indoor air unfiltered due to expensive commercial purifiers',
    sustainableAlternative: 'Box fan equipped with MERV 13 / H13 HEPA furnace filters',
    co2SavedKgPerDay: 0.2,
    pm25ReductionPercent: 78,
    costImpact: 'Low Cost (<$10)',
    difficulty: 'Easy',
    explanation: 'Peer-reviewed studies by UC Davis prove a 5-sided MERV-13 filter fan box yields Clean Air Delivery Rates (CADR) exceeding $600 commercial units at a fraction of energy and hardware cost.',
    adopted: false
  },
  {
    id: 'swap-repellent',
    title: 'Replace Smoke Mosquito Coils with Ultrasonic / Liquid Vaporizer',
    category: 'Lifestyle',
    currentHabit: 'Burning pyrethroid mosquito coils overnight',
    sustainableAlternative: 'Electric ultrasonic barrier or botanical diffuser',
    co2SavedKgPerDay: 0.4,
    pm25ReductionPercent: 90,
    costImpact: 'Low Cost (<$10)',
    difficulty: 'Easy',
    explanation: 'Burning one mosquito coil releases as much PM2.5 as smoking 75-137 cigarettes, according to respiratory research. Eliminating smoldering coils dramatically cleans bedroom night air.',
    adopted: true
  },
  {
    id: 'swap-car-recirc',
    title: 'Vehicle AC Recirculation Mode + HEPA Cabin Filter',
    category: 'Commute',
    currentHabit: 'Fresh air intake mode pulling highway exhaust directly inside car',
    sustainableAlternative: 'Cabin recirculation mode enabled + activated carbon cabin filter',
    co2SavedKgPerDay: 0.1,
    pm25ReductionPercent: 82,
    costImpact: 'Low Cost (<$10)',
    difficulty: 'Easy',
    explanation: 'Toggling cabin airflow to internal recirculation reduces particulate concentrations inside vehicles by over 80% during stop-and-go winter gridlock.',
    adopted: true
  },
  {
    id: 'swap-steamer',
    title: 'Electric Steam Inhalation & Saline Rinses over Aerosol Sprays',
    category: 'Lifestyle',
    currentHabit: 'Using chemical aerosol sprays to mask smog odor',
    sustainableAlternative: 'Natural warm mist inhalation & air-purifying plants (Snake Plant, Areca)',
    co2SavedKgPerDay: 0.15,
    pm25ReductionPercent: 30,
    costImpact: 'Low Cost (<$10)',
    difficulty: 'Easy',
    explanation: 'Aerosols emit volatile organic compounds (VOCs) that interact with outdoor NOx to produce secondary fine aerosol. Steam hydration clears the bronchial ciliary escalator naturally.',
    adopted: false
  }
];

export interface ImpactSummary {
  dailyCo2SavedKg: number;
  monthlyCo2SavedKg: number;
  yearlyCo2SavedKg: number;
  avgPm25ReductionPercent: number;
  treesEquivalent: number;
  cleanAirHoursGained: number;
}

export function calculateAdoptedImpact(swaps: SustainableSwap[]): ImpactSummary {
  const adopted = swaps.filter(s => s.adopted);
  const dailyCo2 = adopted.reduce((sum, s) => sum + s.co2SavedKgPerDay, 0);
  const monthlyCo2 = dailyCo2 * 30;
  const yearlyCo2 = dailyCo2 * 365;

  const avgPm25 = adopted.length > 0 
    ? Math.round(adopted.reduce((sum, s) => sum + s.pm25ReductionPercent, 0) / adopted.length)
    : 0;

  // 1 mature tree absorbs ~21.77 kg of CO2 per year (~0.06 kg per day)
  const treesEquivalent = Math.round((yearlyCo2 / 21.77) * 10) / 10;
  const cleanAirHoursGained = Math.round(adopted.length * 2.8 * 30);

  return {
    dailyCo2SavedKg: Math.round(dailyCo2 * 10) / 10,
    monthlyCo2SavedKg: Math.round(monthlyCo2 * 10) / 10,
    yearlyCo2SavedKg: Math.round(yearlyCo2 * 10) / 10,
    avgPm25ReductionPercent: avgPm25,
    treesEquivalent,
    cleanAirHoursGained
  };
}
