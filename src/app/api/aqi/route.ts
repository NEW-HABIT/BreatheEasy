import { NextRequest, NextResponse } from 'next/server';
import { CITIES_DATA, getAqiCategory } from '@/lib/aqiData';
import { AqiData } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || 'New Delhi';

  // Check if predefined dataset has exact or partial match
  const cityKeys = Object.keys(CITIES_DATA);
  const matchedKey = cityKeys.find(k => k.toLowerCase() === city.toLowerCase()) || 
                     cityKeys.find(k => k.toLowerCase().includes(city.toLowerCase()));

  if (matchedKey) {
    return NextResponse.json(CITIES_DATA[matchedKey]);
  }

  // If unknown city requested, generate realistic dynamic response based on query
  const defaultAqi = 185;
  const categoryInfo = getAqiCategory(defaultAqi);

  const dynamicData: AqiData = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'Global',
    aqi: defaultAqi,
    category: categoryInfo.category,
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 112.4,
      pm10: 178.0,
      no2: 42.1,
      so2: 12.0,
      co: 1.6,
      o3: 31.5
    },
    updatedAt: 'Live',
    temperature: 20,
    humidity: 65,
    windSpeed: 6.2,
    hourlyForecast: [
      { time: '06:00', aqi: 210, pm25: 135 },
      { time: '09:00', aqi: 230, pm25: 150 },
      { time: '12:00', aqi: 170, pm25: 98 },
      { time: '15:00', aqi: 145, pm25: 80 },
      { time: '18:00', aqi: 190, pm25: 118 },
      { time: '21:00', aqi: 205, pm25: 130 },
      { time: '00:00', aqi: 215, pm25: 140 }
    ],
    weeklyForecast: [
      { day: 'Mon', aqi: 185, category: 'Unhealthy' },
      { day: 'Tue', aqi: 175, category: 'Unhealthy' },
      { day: 'Wed', aqi: 160, category: 'Unhealthy' },
      { day: 'Thu', aqi: 140, category: 'Unhealthy for Sensitive Groups' },
      { day: 'Fri', aqi: 155, category: 'Unhealthy' },
      { day: 'Sat', aqi: 165, category: 'Unhealthy' },
      { day: 'Sun', aqi: 150, category: 'Unhealthy for Sensitive Groups' }
    ],
    ventilationWindow: {
      start: '12:00 PM',
      end: '2:30 PM',
      advice: 'Midday sunlight provides the safest outdoor dispersion window.'
    }
  };

  return NextResponse.json(dynamicData);
}
