export const AQI_LEVELS = {
  good: { min: 0, max: 50, label: 'Good', color: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
  moderate: { min: 51, max: 100, label: 'Moderate', color: '#FBBF24', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  sensitive: { min: 101, max: 150, label: 'Unhealthy for Sensitive Groups', color: '#F97316', bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
  unhealthy: { min: 151, max: 200, label: 'Unhealthy', color: '#EF4444', bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30' },
  veryUnhealthy: { min: 201, max: 300, label: 'Very Unhealthy', color: '#8B5CF6', bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
  hazardous: { min: 301, max: 500, label: 'Hazardous', color: '#7F1D1D', bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-600/50' },
};

export function getAqiCategory(aqi) {
  const safeAqi = typeof aqi === 'number' && !isNaN(aqi) ? aqi : 150;
  if (safeAqi <= 50) return { category: 'Good', ...AQI_LEVELS.good, advice: 'Air quality is satisfactory. Enjoy regular outdoor activities and natural ventilation.' };
  if (safeAqi <= 100) return { category: 'Moderate', ...AQI_LEVELS.moderate, advice: 'Air quality is acceptable. Exceptionally sensitive people should consider limiting prolonged outdoor exertion.' };
  if (safeAqi <= 150) return { category: 'Unhealthy for Sensitive Groups', ...AQI_LEVELS.sensitive, advice: 'Children, older adults, and individuals with respiratory issues should reduce outdoor exertion.' };
  if (safeAqi <= 200) return { category: 'Unhealthy', ...AQI_LEVELS.unhealthy, advice: 'Everyone may begin to experience health effects. Wear N95 masks outside and run indoor HEPA filtration.' };
  if (safeAqi <= 300) return { category: 'Very Unhealthy', ...AQI_LEVELS.veryUnhealthy, advice: 'Health alert: risk of health effects is increased for everyone. Keep all windows sealed.' };
  return { category: 'Hazardous', ...AQI_LEVELS.hazardous, advice: 'Emergency conditions: severe winter smog. Avoid all outdoor physical activity. Seal entry gaps with damp towels.' };
}

export function getPollutantSeverity(pollutant, value) {
  const whoThresholds = {
    pm25: 15,
    pm10: 45,
    no2: 25,
    so2: 40,
    co: 4,
    o3: 100
  };
  const threshold = whoThresholds[String(pollutant).toLowerCase()] || 25;
  const ratio = value / threshold;
  if (ratio <= 1.0) return 'safe';
  if (ratio <= 2.0) return 'moderate';
  if (ratio <= 4.0) return 'high';
  return 'severe';
}

export function getWhoExceedanceRatio(pm25) {
  const whoDailyLimit = 15;
  if (pm25 <= 0) return 0;
  return Number((pm25 / whoDailyLimit).toFixed(1));
}

export function calculateFamilyRisk(member, aqi) {
  const safeAqi = typeof aqi === 'number' && !isNaN(aqi) ? aqi : 150;
  const memberAge = typeof member.age === 'number' ? member.age : 30;
  const isVulnerableAge = memberAge < 12 || memberAge > 60;

  const conditions = Array.isArray(member.healthConditions)
    ? member.healthConditions
    : typeof member.healthConditions === 'string'
    ? member.healthConditions.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const hasRespiratoryIssues = conditions.some(c => 
    typeof c === 'string' && ['asthma', 'bronchitis', 'allergies', 'cardiovascular', 'copd', 'wheezing', 'hypertension', 'sensitivity'].some(term => c.toLowerCase().includes(term))
  );

  if (safeAqi > 250) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return {
        riskLevel: 'Severe',
        hasAlert: true,
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
      hasAlert: true,
      advice: [
        'Avoid outdoor runs or cardio workouts completely.',
        'Wear certified tight-fitting N95/FFP2 mask if commuting.',
        'Keep vehicle AC strictly on recirculate mode.'
      ]
    };
  } else if (safeAqi > 150) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return {
        riskLevel: 'High',
        hasAlert: true,
        advice: [
          'Stay indoors during early morning and late evening inversion layers.',
          'Run DIY or HEPA filtration in main living area.',
          'Hydrate frequently to support bronchial mucus clearance.'
        ]
      };
    }
    return {
      riskLevel: 'Moderate',
      hasAlert: false,
      advice: [
        'Limit prolonged outdoor heavy labor or strenuous jogging.',
        'Close road-facing windows between 7 AM - 10 AM.'
      ]
    };
  } else if (safeAqi > 100) {
    if (hasRespiratoryIssues || isVulnerableAge) {
      return {
        riskLevel: 'Moderate',
        hasAlert: false,
        advice: [
          'Monitor mild coughing or eye irritation symptoms.',
          'Avoid lingering near heavy-traffic corridors.'
        ]
      };
    }
    return {
      riskLevel: 'Low',
      hasAlert: false,
      advice: ['Normal activities permitted with mindful ventilation timing.']
    };
  }

  return {
    riskLevel: 'Low',
    hasAlert: false,
    advice: ['Air conditions are optimal. Safe for all family activities.']
  };
}

export const INDIAN_METROS = [
  { name: 'New Delhi', state: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Chandigarh', state: 'Punjab/Haryana', lat: 30.7333, lng: 76.7794 }
];

export const CITIES_DATA = {
  'New Delhi': {
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    aqi: 348,
    category: 'Hazardous',
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 295.4,
      pm10: 412.0,
      no2: 68.2,
      so2: 18.4,
      co: 2.8,
      o3: 34.0
    },
    weather: {
      temperature: 14.5,
      humidity: 82,
      windSpeed: 3.2,
      windDirection: 315,
      windDirectionCompass: 'NW',
      pressure: 1018,
      visibilityKm: 1.2,
      weatherCode: 45,
      weatherDescription: 'Dense Fog & Toxic Ground Inversion',
      inversionRisk: 'Severe',
      inversionExplanation: 'Near-zero ground wind (<4 km/h) and high barometric pressure have trapped dense PM2.5 in the surface breathing zone.'
    },
    ventilationWindow: {
      start: '01:30 PM',
      end: '03:15 PM',
      isCurrentlyOpen: false,
      reason: 'Solar heating window provides temporary boundary layer mixing.'
    },
    historical24h: [
      { time: '00:00', aqi: 310, pm25: 260 },
      { time: '04:00', aqi: 365, pm25: 310 },
      { time: '08:00', aqi: 410, pm25: 350 },
      { time: '12:00', aqi: 320, pm25: 270 },
      { time: '16:00', aqi: 290, pm25: 240 },
      { time: '20:00', aqi: 380, pm25: 320 }
    ],
    lastUpdated: new Date().toISOString()
  }
};
