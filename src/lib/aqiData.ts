import { AqiCategory, AqiData, FamilyMember } from '@/types';

export const AQI_LEVELS = {
  good: { min: 0, max: 50, label: 'Good' as AqiCategory, color: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
  moderate: { min: 51, max: 100, label: 'Moderate' as AqiCategory, color: '#FBBF24', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  sensitive: { min: 101, max: 150, label: 'Unhealthy for Sensitive Groups' as AqiCategory, color: '#F97316', bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
  unhealthy: { min: 151, max: 200, label: 'Unhealthy' as AqiCategory, color: '#EF4444', bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30' },
  veryUnhealthy: { min: 201, max: 300, label: 'Very Unhealthy' as AqiCategory, color: '#8B5CF6', bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
  hazardous: { min: 301, max: 500, label: 'Hazardous' as AqiCategory, color: '#7F1D1D', bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-600/50' },
};

export function getAqiCategory(aqi: number): {
  category: AqiCategory;
  color: string;
  bg: string;
  text: string;
  border: string;
  advice: string;
} {
  const safeAqi = typeof aqi === 'number' && !isNaN(aqi) ? aqi : 150;
  if (safeAqi <= 50) return { category: 'Good', ...AQI_LEVELS.good, advice: 'Air quality is satisfactory. Enjoy regular outdoor activities and natural ventilation.' };
  if (safeAqi <= 100) return { category: 'Moderate', ...AQI_LEVELS.moderate, advice: 'Air quality is acceptable. Exceptionally sensitive people should consider limiting prolonged outdoor exertion.' };
  if (safeAqi <= 150) return { category: 'Unhealthy for Sensitive Groups', ...AQI_LEVELS.sensitive, advice: 'Children, older adults, and individuals with respiratory issues should reduce outdoor exertion.' };
  if (safeAqi <= 200) return { category: 'Unhealthy', ...AQI_LEVELS.unhealthy, advice: 'Everyone may begin to experience health effects. Wear N95 masks outside and run indoor HEPA filtration.' };
  if (safeAqi <= 300) return { category: 'Very Unhealthy', ...AQI_LEVELS.veryUnhealthy, advice: 'Health alert: risk of health effects is increased for everyone. Keep all windows sealed.' };
  return { category: 'Hazardous', ...AQI_LEVELS.hazardous, advice: 'Emergency conditions: severe winter smog. Avoid all outdoor physical activity. Seal entry gaps with damp towels.' };
}

export function calculateFamilyRisk(member: FamilyMember, aqi: number): {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  advice: string[];
} {
  const safeAqi = typeof aqi === 'number' && !isNaN(aqi) ? aqi : 150;
  const memberAge = typeof member.age === 'number' ? member.age : 30;
  const isVulnerableAge = memberAge < 12 || memberAge > 60;

  const conditions = Array.isArray(member.healthConditions)
    ? member.healthConditions
    : typeof member.healthConditions === 'string'
    ? (member.healthConditions as string).split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const hasRespiratoryIssues = conditions.some(c => 
    typeof c === 'string' && ['asthma', 'bronchitis', 'allergies', 'cardiovascular', 'copd', 'wheezing', 'hypertension', 'sensitivity'].some(term => c.toLowerCase().includes(term))
  );

  if (safeAqi > 250) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return {
        riskLevel: 'Severe',
        advice: [
          'Strictly no outdoor exposure. Peak winter smog will trigger acute airway inflammation.',
          'Keep rescue inhaler / prescribed medications immediately accessible.',
          'Operate bedroom HEPA purifier on maximum throughput 24/7.',
          'Keep room door closed and tape window seam perimeter.'
        ]
      };
    }
    return {
      riskLevel: 'High',
      advice: [
        'Avoid outdoor runs or cardio workouts completely.',
        'Wear certified tight-fitting N95/FFP2 mask if commuting.',
        'Keep vehicle AC strictly on recirculate mode.'
      ]
    };
  } else if (aqi > 150) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return {
        riskLevel: 'High',
        advice: [
          'Stay indoors during early morning and late evening inversion layers.',
          'Run DIY or HEPA filtration in main living area.',
          'Hydrate frequently to support bronchial mucus clearance.'
        ]
      };
    }
    return {
      riskLevel: 'Moderate',
      advice: [
        'Limit prolonged outdoor heavy labor or strenuous jogging.',
        'Close road-facing windows between 7 AM - 10 AM.'
      ]
    };
  } else if (aqi > 100) {
    if (hasRespiratoryIssues) {
      return {
        riskLevel: 'Moderate',
        advice: [
          'Monitor mild coughing or eye irritation symptoms.',
          'Avoid lingering near heavy-traffic corridors.'
        ]
      };
    }
    return {
      riskLevel: 'Low',
      advice: ['Normal activities permitted with mindful ventilation timing.']
    };
  }

  return {
    riskLevel: 'Low',
    advice: ['Air conditions are optimal. Safe for all family activities.']
  };
}

export const CITIES_DATA: Record<string, AqiData> = {
  'New Delhi': {
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    aqi: 348,
    category: 'Hazardous',
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 298.5,
      pm10: 412.0,
      no2: 68.4,
      so2: 24.1,
      co: 3.2,
      o3: 28.6
    },
    updatedAt: 'Just now',
    temperature: 16,
    humidity: 78,
    windSpeed: 3.2,
    hourlyForecast: [
      { time: '06:00', aqi: 365, pm25: 315 },
      { time: '09:00', aqi: 380, pm25: 330 },
      { time: '12:00', aqi: 295, pm25: 240 },
      { time: '15:00', aqi: 240, pm25: 190 },
      { time: '18:00', aqi: 320, pm25: 275 },
      { time: '21:00', aqi: 355, pm25: 310 },
      { time: '00:00', aqi: 370, pm25: 325 },
    ],
    weeklyForecast: [
      { day: 'Mon', aqi: 348, category: 'Hazardous' },
      { day: 'Tue', aqi: 320, category: 'Hazardous' },
      { day: 'Wed', aqi: 280, category: 'Very Unhealthy' },
      { day: 'Thu', aqi: 260, category: 'Very Unhealthy' },
      { day: 'Fri', aqi: 310, category: 'Hazardous' },
      { day: 'Sat', aqi: 290, category: 'Very Unhealthy' },
      { day: 'Sun', aqi: 250, category: 'Very Unhealthy' },
    ],
    ventilationWindow: {
      start: '1:30 PM',
      end: '3:30 PM',
      advice: 'Sunlight breaks the thermal inversion layer slightly. 15-minute cross-breeze permissible with exhaust fan.'
    }
  },
  'Lahore': {
    city: 'Lahore',
    country: 'Pakistan',
    latitude: 31.5497,
    longitude: 74.3436,
    aqi: 385,
    category: 'Hazardous',
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 335.0,
      pm10: 460.0,
      no2: 74.0,
      so2: 31.0,
      co: 4.1,
      o3: 22.0
    },
    updatedAt: '10 mins ago',
    temperature: 15,
    humidity: 82,
    windSpeed: 2.1,
    hourlyForecast: [
      { time: '06:00', aqi: 410, pm25: 360 },
      { time: '09:00', aqi: 430, pm25: 380 },
      { time: '12:00', aqi: 340, pm25: 290 },
      { time: '15:00', aqi: 310, pm25: 260 },
      { time: '18:00', aqi: 390, pm25: 340 },
      { time: '21:00', aqi: 415, pm25: 365 },
      { time: '00:00', aqi: 420, pm25: 370 },
    ],
    weeklyForecast: [
      { day: 'Mon', aqi: 385, category: 'Hazardous' },
      { day: 'Tue', aqi: 395, category: 'Hazardous' },
      { day: 'Wed', aqi: 340, category: 'Hazardous' },
      { day: 'Thu', aqi: 320, category: 'Hazardous' },
      { day: 'Fri', aqi: 350, category: 'Hazardous' },
      { day: 'Sat', aqi: 330, category: 'Hazardous' },
      { day: 'Sun', aqi: 300, category: 'Very Unhealthy' },
    ],
    ventilationWindow: {
      start: '2:00 PM',
      end: '3:00 PM',
      advice: 'Severe smog inversion. Avoid opening exterior doors unless running mechanical filtered air.'
    }
  },
  'Mumbai': {
    city: 'Mumbai',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    aqi: 168,
    category: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 88.0,
      pm10: 160.0,
      no2: 45.0,
      so2: 15.0,
      co: 1.8,
      o3: 35.0
    },
    updatedAt: '5 mins ago',
    temperature: 28,
    humidity: 65,
    windSpeed: 8.5,
    hourlyForecast: [
      { time: '06:00', aqi: 180, pm25: 98 },
      { time: '09:00', aqi: 195, pm25: 110 },
      { time: '12:00', aqi: 150, pm25: 75 },
      { time: '15:00', aqi: 135, pm25: 65 },
      { time: '18:00', aqi: 170, pm25: 90 },
      { time: '21:00', aqi: 165, pm25: 85 },
      { time: '00:00', aqi: 160, pm25: 80 },
    ],
    weeklyForecast: [
      { day: 'Mon', aqi: 168, category: 'Unhealthy' },
      { day: 'Tue', aqi: 155, category: 'Unhealthy' },
      { day: 'Wed', aqi: 140, category: 'Unhealthy for Sensitive Groups' },
      { day: 'Thu', aqi: 150, category: 'Unhealthy for Sensitive Groups' },
      { day: 'Fri', aqi: 165, category: 'Unhealthy' },
      { day: 'Sat', aqi: 160, category: 'Unhealthy' },
      { day: 'Sun', aqi: 145, category: 'Unhealthy for Sensitive Groups' },
    ],
    ventilationWindow: {
      start: '11:00 AM',
      end: '3:00 PM',
      advice: 'Coastal sea breeze disperses localized street particulates. Good window for window ventilation.'
    }
  },
  'Beijing': {
    city: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    aqi: 142,
    category: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 52.4,
      pm10: 95.0,
      no2: 38.0,
      so2: 8.0,
      co: 1.1,
      o3: 42.0
    },
    updatedAt: '15 mins ago',
    temperature: 4,
    humidity: 45,
    windSpeed: 5.4,
    hourlyForecast: [
      { time: '06:00', aqi: 160, pm25: 65 },
      { time: '09:00', aqi: 175, pm25: 75 },
      { time: '12:00', aqi: 130, pm25: 45 },
      { time: '15:00', aqi: 110, pm25: 38 },
      { time: '18:00', aqi: 145, pm25: 55 },
      { time: '21:00', aqi: 150, pm25: 58 },
      { time: '00:00', aqi: 155, pm25: 60 },
    ],
    weeklyForecast: [
      { day: 'Mon', aqi: 142, category: 'Unhealthy for Sensitive Groups' },
      { day: 'Tue', aqi: 130, category: 'Unhealthy for Sensitive Groups' },
      { day: 'Wed', aqi: 95, category: 'Moderate' },
      { day: 'Thu', aqi: 80, category: 'Moderate' },
      { day: 'Fri', aqi: 120, category: 'Unhealthy for Sensitive Groups' },
      { day: 'Sat', aqi: 140, category: 'Unhealthy for Sensitive Groups' },
      { day: 'Sun', aqi: 110, category: 'Unhealthy for Sensitive Groups' },
    ],
    ventilationWindow: {
      start: '12:30 PM',
      end: '2:30 PM',
      advice: 'Northwesterly breeze clears ground pollutants. Recommended 20 min fresh air replenishment.'
    }
  },
  'London': {
    city: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    aqi: 45,
    category: 'Good',
    primaryPollutant: 'NO2',
    pollutants: {
      pm25: 8.5,
      pm10: 16.0,
      no2: 24.0,
      so2: 4.0,
      co: 0.4,
      o3: 31.0
    },
    updatedAt: '2 mins ago',
    temperature: 9,
    humidity: 80,
    windSpeed: 14.2,
    hourlyForecast: [
      { time: '06:00', aqi: 40, pm25: 7 },
      { time: '09:00', aqi: 52, pm25: 11 },
      { time: '12:00', aqi: 45, pm25: 8 },
      { time: '15:00', aqi: 42, pm25: 7 },
      { time: '18:00', aqi: 48, pm25: 10 },
      { time: '21:00', aqi: 44, pm25: 8 },
      { time: '00:00', aqi: 38, pm25: 6 },
    ],
    weeklyForecast: [
      { day: 'Mon', aqi: 45, category: 'Good' },
      { day: 'Tue', aqi: 42, category: 'Good' },
      { day: 'Wed', aqi: 55, category: 'Moderate' },
      { day: 'Thu', aqi: 48, category: 'Good' },
      { day: 'Fri', aqi: 38, category: 'Good' },
      { day: 'Sat', aqi: 35, category: 'Good' },
      { day: 'Sun', aqi: 40, category: 'Good' },
    ],
    ventilationWindow: {
      start: 'All Day',
      end: 'All Day',
      advice: 'Clean maritime airflow. Safe for continuous natural ventilation.'
    }
  }
};
