export type AqiCategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface PollutantBreakdown {
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number;  // ppb
  so2: number;  // ppb
  co: number;   // ppm
  o3: number;   // ppb
}

export interface AqiData {
  city: string;
  country: string;
  aqi: number;
  category: AqiCategory;
  primaryPollutant: string;
  pollutants: PollutantBreakdown;
  updatedAt: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  hourlyForecast: { time: string; aqi: number; pm25: number }[];
  weeklyForecast: { day: string; aqi: number; category: AqiCategory }[];
  ventilationWindow: { start: string; end: string; advice: string };
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Self' | 'Spouse' | 'Child' | 'Elderly' | 'Pet' | 'Other';
  age: number;
  healthConditions: string[]; // e.g. "Asthma", "Allergies", "Cardiovascular", "None"
  riskLevel?: 'Low' | 'Moderate' | 'High' | 'Severe';
  personalizedAdvice?: string[];
}

export interface UserProfile {
  city: string;
  homeType: 'Apartment' | 'Independent House' | 'Villa';
  hasPurifier: boolean;
  cookingFuel: 'LPG' | 'Induction' | 'Piped Gas' | 'Traditional';
  commuteMode: 'Metro/Train' | 'Car (Solo)' | 'Carpool' | 'Electric Vehicle' | 'Bus' | 'Bike/Walk';
  commuteDistanceKm: number;
  familyMembers: FamilyMember[];
}

export interface SustainableSwap {
  id: string;
  title: string;
  category: 'Commute' | 'Cooking' | 'Home' | 'Lifestyle';
  currentHabit: string;
  sustainableAlternative: string;
  co2SavedKgPerDay: number;
  pm25ReductionPercent: number;
  costImpact: 'Saves Money' | 'Low Cost (<$10)' | 'Moderate' | 'One-Time Investment';
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  explanation: string;
  adopted: boolean;
}

export interface RoutineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'exercise' | 'ventilation' | 'commute' | 'cooking' | 'purification';
  airSafetyRating: 'Safe' | 'Caution' | 'Dangerous';
  co2ImpactKg?: number;
  isCompleted?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  neighborhood: string;
  title: string;
  content: string;
  type: 'initiative' | 'tip' | 'alert' | 'event';
  participantsCount: number;
  upvotes: number;
  createdAt: string;
  userVoted?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  impactHighlight?: {
    co2SavedKg?: number;
    pm25DropPercent?: number;
  };
}
