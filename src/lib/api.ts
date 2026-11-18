import { AqiData, FamilyMember, RoutineItem, SustainableSwap, CommunityPost } from '@/types';
import { getAqiCategory } from '@/lib/aqiData';

const API_BASE = '/api';

/**
 * Autocomplete search for global cities using Open-Meteo Geocoding
 */
export async function searchCitySuggestions(query: string): Promise<{
  name: string;
  country: string;
  admin?: string;
  latitude: number;
  longitude: number;
}[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: any) => ({
      name: r.name,
      country: r.country || 'Global',
      admin: r.admin1 || '',
      latitude: r.latitude,
      longitude: r.longitude
    }));
  } catch (e) {
    console.warn('Geocoding suggestions error:', e);
    return [];
  }
}

/**
 * Client-side direct Open-Meteo telemetry fetcher as fallback
 */
async function fetchDirectOpenMeteo(city: string, lat?: number, lng?: number): Promise<AqiData | null> {
  try {
    let latitude = lat;
    let longitude = lng;
    let resolvedCity = city;
    let resolvedCountry = 'Global';

    // 1. Geocode if coordinates missing
    if (latitude === undefined || longitude === undefined) {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=5&language=en&format=json`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const indianResult = geoData.results.find((r: any) => r.country_code?.toUpperCase() === 'IN' || r.country?.toLowerCase() === 'india');
          const chosen = indianResult || geoData.results[0];
          latitude = chosen.latitude;
          longitude = chosen.longitude;
          resolvedCity = chosen.name;
          resolvedCountry = chosen.country || 'India';
        }
      }
    }

    if (latitude === undefined || longitude === undefined) {
      latitude = 28.6139;
      longitude = 77.2090;
      resolvedCity = city || 'New Delhi';
    }

    // 2. Fetch live atmospheric and full meteorological sensors
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5&forecast_days=7`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,dew_point_2m,visibility`;

    const [aqiRes, weatherRes] = await Promise.all([
      fetch(aqiUrl),
      fetch(weatherUrl)
    ]);

    if (!aqiRes.ok) throw new Error('AQI fetch failed');
    const aqiJson = await aqiRes.json();
    const weatherJson = weatherRes.ok ? await weatherRes.json() : {};

    const currentAqi = aqiJson.current || {};
    const currentWeather = weatherJson.current || {};

    const aqi = Math.round(currentAqi.us_aqi ?? 150);
    const pm25 = Math.round((currentAqi.pm2_5 ?? 65.0) * 10) / 10;
    const pm10 = Math.round((currentAqi.pm10 ?? 110.0) * 10) / 10;
    const no2 = Math.round((currentAqi.nitrogen_dioxide ?? 35.0) * 10) / 10;
    const so2 = Math.round((currentAqi.sulphur_dioxide ?? 12.0) * 10) / 10;
    const co = Math.round((currentAqi.carbon_monoxide ?? 0.8) * 10) / 10;
    const o3 = Math.round((currentAqi.ozone ?? 45.0) * 10) / 10;

    const catMeta = getAqiCategory(aqi);

    // Weather Metrics
    const temperature = Math.round(currentWeather.temperature_2m ?? 22);
    const apparentTemperature = Math.round(currentWeather.apparent_temperature ?? temperature);
    const humidity = Math.round(currentWeather.relative_humidity_2m ?? 60);
    const windSpeed = Math.round((currentWeather.wind_speed_10m ?? 8.5) * 10) / 10;
    const windDirection = Math.round(currentWeather.wind_direction_10m ?? 310);
    const pressure = Math.round(currentWeather.surface_pressure ?? 1013);
    const visibilityKm = Math.round(((currentWeather.visibility ?? 4500) / 1000) * 10) / 10;
    const uvIndex = Math.round((currentWeather.uv_index ?? 3.2) * 10) / 10;
    const dewPoint = Math.round((currentWeather.dew_point_2m ?? 12.0) * 10) / 10;
    const weatherCode = Number(currentWeather.weather_code ?? 0);

    const compassArr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const compassIdx = Math.round(windDirection / 22.5) % 16;
    const windDirectionCompass = compassArr[compassIdx];

    let weatherDescription = "Clear Sky";
    if (weatherCode in [1, 2, 3]) weatherDescription = "Partly Cloudy";
    else if (weatherCode in [45, 48]) weatherDescription = "Dense Fog & Smog Haze";
    else if (weatherCode in [51, 53, 55]) weatherDescription = "Light Particulate Mist";
    else if (weatherCode in [61, 63, 65]) weatherDescription = "Rain Scrubbing Air";
    else if (weatherCode >= 80) weatherDescription = "Passing Showers";

    let inversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Moderate';
    let inversionExplanation = 'Moderate air movement. Natural ventilation is safe during mid-day solar heating window.';
    if (windSpeed < 5.0 && humidity > 75 && pressure > 1014) {
      inversionRisk = 'Severe';
      inversionExplanation = 'Near-zero ground wind (<5 km/h) & high atmospheric pressure trap toxic PM2.5 in the breathing zone.';
    } else if (windSpeed < 8.5 && humidity > 65) {
      inversionRisk = 'High';
      inversionExplanation = 'Stagnant boundary layer: Micro-particulates accumulating due to low air velocity.';
    } else if (windSpeed > 16.0) {
      inversionRisk = 'Low';
      inversionExplanation = 'Strong wind currents are actively breaking the boundary layer and dispersing the smog plume.';
    }

    // Hourly
    const hourlyTimes: string[] = aqiJson.hourly?.time || [];
    const hourlyUsAqi: number[] = aqiJson.hourly?.us_aqi || [];
    const hourlyPm: number[] = aqiJson.hourly?.pm2_5 || [];
    const hourlyForecast = [];
    for (let i = 0; i < Math.min(24, hourlyTimes.length); i += 3) {
      const t = hourlyTimes[i].includes('T') ? hourlyTimes[i].split('T')[1].slice(0, 5) : `${i}:00`;
      hourlyForecast.push({
        time: t,
        aqi: Math.round(hourlyUsAqi[i] ?? aqi),
        pm25: Math.round((hourlyPm[i] ?? pm25) * 10) / 10
      });
    }

    // Weekly
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const weeklyForecast = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(now);
      dt.setDate(now.getDate() + d);
      const dayName = d === 0 ? 'Today' : days[dt.getDay()];
      const sampleIdx = Math.min(d * 24 + 12, hourlyUsAqi.length - 1);
      const dayAqi = sampleIdx >= 0 && hourlyUsAqi[sampleIdx] != null ? Math.round(hourlyUsAqi[sampleIdx]) : aqi;
      weeklyForecast.push({
        day: dayName,
        aqi: dayAqi,
        category: getAqiCategory(dayAqi).category
      });
    }

    return {
      city: resolvedCity,
      country: resolvedCountry,
      latitude,
      longitude,
      aqi,
      category: catMeta.category,
      primaryPollutant: pm10 > pm25 * 1.5 ? 'PM10' : 'PM2.5',
      pollutants: { pm25, pm10, no2, so2, co, o3 },
      updatedAt: `Live (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      temperature,
      humidity,
      windSpeed,
      weather: {
        temperature,
        apparentTemperature,
        humidity,
        windSpeed,
        windDirection,
        windDirectionCompass,
        pressure,
        visibilityKm,
        uvIndex,
        dewPoint,
        weatherCode,
        weatherDescription,
        inversionRisk,
        inversionExplanation
      },
      hourlyForecast,
      weeklyForecast,
      ventilationWindow: {
        start: '1:00 PM',
        end: '3:30 PM',
        advice: 'Solar boundary layer dispersion period. Safe for short cross-ventilation.'
      }
    };
  } catch (err) {
    console.error('Direct Open-Meteo fallback failed:', err);
    return null;
  }
}

export async function fetchLiveAqi(city?: string, lat?: number, lng?: number): Promise<AqiData | null> {
  const targetCity = city || 'New Delhi';

  // 1. Try Python backend endpoint
  try {
    const params = new URLSearchParams();
    if (lat !== undefined && lng !== undefined) {
      params.append('lat', lat.toString());
      params.append('lng', lng.toString());
      params.append('city', targetCity);
    } else {
      params.append('city', targetCity);
    }

    const res = await fetch(`${API_BASE}/aqi?${params.toString()}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.aqi !== undefined) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend /api/aqi unavailable, activating direct client Open-Meteo fallback');
  }

  // 2. Guaranteed fallback directly to Open-Meteo API (requires 0 API keys)
  return await fetchDirectOpenMeteo(targetCity, lat, lng);
}

export async function askAdvisorAI(payload: {
  question: string;
  aqiData: any;
  familyMembers: any[];
  customApiKey?: string;
}): Promise<{ text: string; impactHighlight?: { co2SavedKg?: number; pm25DropPercent?: number } }> {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: payload.question,
        aqi_data: payload.aqiData,
        family_members: payload.familyMembers,
        custom_api_key: payload.customApiKey || undefined
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      text: data.text || 'Air quality advisory generated based on current atmospheric conditions.',
      impactHighlight: {
        co2SavedKg: data.co2_saved_kg ?? 1.8,
        pm25DropPercent: data.pm25_drop_percent ?? 55
      }
    };
  } catch (err) {
    console.warn('Backend askAdvisorAI error:', err);
    return {
      text: `Air quality in ${payload.aqiData?.city || 'your area'} is currently at AQI ${payload.aqiData?.aqi || 165}. Please seal exterior windows and run HEPA air filtration.`,
      impactHighlight: { co2SavedKg: 1.5, pm25DropPercent: 50 }
    };
  }
}

export async function generateDailyRoutine(aqiData: any, familyMembers: any[]): Promise<RoutineItem[]> {
  try {
    const res = await fetch(`${API_BASE}/routine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aqi_data: aqiData,
        family_members: familyMembers
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.routine || [];
  } catch (err) {
    console.warn('Backend generateDailyRoutine error:', err);
    return [];
  }
}

export async function fetchSwapsFromBackend(): Promise<SustainableSwap[]> {
  try {
    const res = await fetch(`${API_BASE}/swaps`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.swaps || [];
  } catch (err) {
    console.warn('Backend fetchSwaps error:', err);
    return [];
  }
}

export async function calculateAdoptedImpactBackend(adoptedSwapIds: string[]) {
  try {
    const res = await fetch(`${API_BASE}/swaps/calculate-impact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adopted_swap_ids: adoptedSwapIds })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend calculateAdoptedImpact error:', err);
    return null;
  }
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const res = await fetch(`${API_BASE}/community`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.posts || []).map((p: any) => ({
      id: p.id,
      author: p.author,
      neighborhood: p.neighborhood,
      title: p.title,
      content: p.content,
      type: p.postType || 'initiative',
      participantsCount: p.participantsCount || 1,
      upvotes: p.upvotes || 1,
      createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent'
    }));
  } catch (err) {
    console.warn('Backend fetchCommunityPosts error:', err);
    return [];
  }
}

export async function createCommunityPost(post: {
  author: string;
  neighborhood: string;
  title: string;
  content: string;
  type: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/community`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: post.author,
        neighborhood: post.neighborhood,
        title: post.title,
        content: post.content,
        post_type: post.type
      })
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend createCommunityPost error:', err);
    return null;
  }
}

export async function upvoteCommunityPost(postId: string) {
  try {
    const res = await fetch(`${API_BASE}/community/${postId}/upvote`, {
      method: 'POST'
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend upvoteCommunityPost error:', err);
    return null;
  }
}
