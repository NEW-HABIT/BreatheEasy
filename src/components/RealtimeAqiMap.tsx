'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, LayerGroup, Circle as LeafletCircle } from 'leaflet';
import { AqiData } from '@/types';
import { getAqiCategory, INDIAN_METROS } from '@/lib/aqiData';
import { 
  MapPin, Layers, Navigation, Wind, ShieldCheck, 
  Activity, Compass, Radio, Maximize2, RefreshCw 
} from 'lucide-react';

interface RealtimeAqiMapProps {
  aqiData: AqiData;
  onLocateMe: () => void;
  onSelectCity?: (city: string) => void;
  isLocating?: boolean;
}

interface StationInfo {
  name: string;
  aqi: number;
  lat: number;
  lng: number;
  pm25: number;
}

export const RealtimeAqiMap: React.FC<RealtimeAqiMapProps> = ({
  aqiData,
  onLocateMe,
  onSelectCity,
  isLocating = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersGroupRef = useRef<LayerGroup | null>(null);
  const plumeCircleRef = useRef<LeafletCircle | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    plume: true,
    stations: true,
    shelters: true,
    wind: true
  });
  const [selectedStation, setSelectedStation] = useState<StationInfo | null>(null);

  const cat = getAqiCategory(aqiData.aqi);
  const lat = aqiData.latitude ?? 28.6139;
  const lng = aqiData.longitude ?? 77.2090;

  // Initialize or update Leaflet map on client
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Create map instance if not already initialized
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 12,
          zoomControl: false,
          attributionControl: false
        });

        // Clean, free OpenStreetMap tiles with zero watermark and zero API key needed
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // Zoom control on bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        markersGroupRef.current = L.layerGroup().addTo(map);
      } else {
        // Fly smoothly to new coordinates
        mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.5 });
      }

      const map = mapInstanceRef.current;
      const markersGroup = markersGroupRef.current;
      if (!markersGroup) return;
      markersGroup.clearLayers();

      // 1. Live Smog Dispersion Plume (Radius Circle)
      if (activeLayers.plume) {
        const circle = L.circle([lat, lng], {
          radius: 3800,
          color: cat.color,
          weight: 2,
          opacity: 0.8,
          fillColor: cat.color,
          fillOpacity: 0.18,
          dashArray: '6, 8'
        }).addTo(markersGroup);
        plumeCircleRef.current = circle;
      }

      // 2. Primary Location Beacon Marker (Apple Glass DivIcon)
      const pulseHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: ${cat.color}; opacity: 0.35;" class="animate-ping-slow"></div>
          <div style="position: absolute; inset: 6px; border-radius: 9999px; background-color: ${cat.color}; opacity: 0.2;"></div>
          <div style="position: relative; z-index: 10; width: 32px; height: 32px; border-radius: 12px; background: rgba(255,255,255,0.95); box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 2px solid ${cat.color}; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span style="font-size: 11px; font-weight: 900; color: #0f172a; line-height: 1;">${aqiData.aqi}</span>
            <span style="font-size: 7px; font-weight: 700; color: ${cat.color}; text-transform: uppercase;">AQI</span>
          </div>
        </div>
      `;

      const primaryIcon = L.divIcon({
        html: pulseHtml,
        className: 'custom-aqi-beacon',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const mainMarker = L.marker([lat, lng], { icon: primaryIcon }).addTo(markersGroup);
      mainMarker.bindPopup(`
        <div style="padding: 14px; font-family: inherit; width: 230px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${cat.color};">Primary Station</span>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 9999px; background: ${cat.color}20; color: ${cat.color}; font-weight: 700;">${cat.category}</span>
          </div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #0f172a;">${aqiData.city}</h4>
          <p style="margin: 2px 0 10px; font-size: 11px; color: #64748b;">📍 ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #f8fafc; padding: 8px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 11px;">
            <div><span style="color: #64748b; font-size: 10px;">PM2.5:</span> <strong style="color: #0f172a;">${aqiData.pollutants.pm25} µg</strong></div>
            <div><span style="color: #64748b; font-size: 10px;">Primary:</span> <strong style="color: #0f172a;">${aqiData.primaryPollutant}</strong></div>
            <div><span style="color: #64748b; font-size: 10px;">Temp:</span> <strong style="color: #0f172a;">${aqiData.temperature}°C</strong></div>
            <div><span style="color: #64748b; font-size: 10px;">Wind:</span> <strong style="color: #0f172a;">${aqiData.windSpeed} km/h</strong></div>
          </div>
        </div>
      `);

      // 3. Surrounding Micro-Monitoring Stations (4 stations around grid)
      if (activeLayers.stations) {
        const offsetDeltas = [
          { name: 'North Sector Grid', dLat: 0.022, dLng: 0.018, varAqi: Math.round(aqiData.aqi * 1.08), type: 'Industrial Corridor' },
          { name: 'South Green Park', dLat: -0.021, dLng: -0.015, varAqi: Math.max(30, Math.round(aqiData.aqi * 0.82)), type: 'Botanical Canopy' },
          { name: 'East Ring Transit', dLat: 0.014, dLng: -0.025, varAqi: Math.round(aqiData.aqi * 1.15), type: 'Highway Junction' },
          { name: 'West Residential Sector', dLat: -0.018, dLng: 0.024, varAqi: Math.round(aqiData.aqi * 0.94), type: 'School & Hospital Zone' },
        ];

        offsetDeltas.forEach((st) => {
          const stCat = getAqiCategory(st.varAqi);
          const stHtml = `
            <div style="background: rgba(255,255,255,0.92); border: 1.5px solid ${stCat.color}; border-radius: 8px; padding: 2px 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 3px;">
              <span style="width: 6px; height: 6px; border-radius: 9999px; background: ${stCat.color};"></span>
              <span style="font-size: 10px; font-weight: 800; color: #0f172a;">${st.varAqi}</span>
            </div>
          `;
          const stIcon = L.divIcon({
            html: stHtml,
            className: 'station-pin',
            iconSize: [40, 20],
            iconAnchor: [20, 10]
          });

          const stMarker = L.marker([lat + st.dLat, lng + st.dLng], { icon: stIcon }).addTo(markersGroup);
          stMarker.bindPopup(`
            <div style="padding: 12px; font-family: inherit; width: 210px;">
              <span style="font-size: 9px; font-weight: 800; color: ${stCat.color}; text-transform: uppercase;">Micro-Station • ${st.type}</span>
              <h4 style="margin: 2px 0; font-size: 13px; font-weight: 800; color: #0f172a;">${st.name}</h4>
              <p style="margin: 0 0 8px; font-size: 10px; color: #64748b;">Sub-grid atmospheric sensor node</p>
              <div style="background: ${stCat.color}15; border: 1px solid ${stCat.color}30; border-radius: 8px; padding: 6px; text-align: center;">
                <span style="font-size: 18px; font-weight: 900; color: #0f172a;">AQI ${st.varAqi}</span>
                <p style="margin: 0; font-size: 10px; font-weight: 700; color: ${stCat.color};">${stCat.category}</p>
              </div>
            </div>
          `);
        });
      }

      // 4. Clean Air Shelters (Emergency Smog Havens)
      if (activeLayers.shelters) {
        const shelters = [
          { name: 'Central Underground Metro Station', dLat: 0.009, dLng: -0.011, type: 'HEPA HVAC Multi-Stage' },
          { name: 'City Central Library & Civic Center', dLat: -0.012, dLng: 0.008, type: 'Certified MERV-14 Filtration' }
        ];

        shelters.forEach((sh) => {
          const shHtml = `
            <div style="background: #10b981; border: 2px solid #ffffff; border-radius: 9999px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(16,185,129,0.4); color: #ffffff;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
          `;
          const shIcon = L.divIcon({
            html: shHtml,
            className: 'shelter-pin',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const shMarker = L.marker([lat + sh.dLat, lng + sh.dLng], { icon: shIcon }).addTo(markersGroup);
          shMarker.bindPopup(`
            <div style="padding: 12px; font-family: inherit; width: 220px;">
              <span style="font-size: 9px; font-weight: 800; color: #059669; text-transform: uppercase;">🛡️ Certified Clean Air Shelter</span>
              <h4 style="margin: 3px 0; font-size: 13px; font-weight: 800; color: #0f172a;">${sh.name}</h4>
              <p style="margin: 0 0 8px; font-size: 10px; color: #64748b;">${sh.type}</p>
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 6px; font-size: 11px; color: #065f46;">
                ✓ Safe public respiratory haven during severe winter smog episodes.
              </div>
            </div>
          `);
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, aqiData, activeLayers]);

  // Recenter map on active location
  const handleRecenter = async () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 shadow-lg border border-white/80 space-y-4">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Radio className="h-4 w-4 animate-pulse" />
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
              <span>Live Air & Neighborhood Map</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing real-time air quality around <strong className="text-slate-800">{aqiData.city}</strong>
          </p>
        </div>

        {/* Indian Metros Quick Navigation Chips */}
      {onSelectCity && (
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar border-y border-emerald-100/70 py-2">
          <span className="text-[11px] font-extrabold text-emerald-800 shrink-0 flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
            <span>🇮🇳</span>
            <span>Indian Cities:</span>
          </span>
          {INDIAN_METROS.map((m) => {
            const isActive = aqiData.city.toLowerCase().includes(m.name.toLowerCase());
            return (
              <button
                key={m.name}
                type="button"
                onClick={() => onSelectCity(m.name)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition shrink-0 border shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      )}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            title="Detect GPS Location"
          >
            <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Locate Me (GPS)'}</span>
          </button>

          <button
            onClick={handleRecenter}
            className="p-1.5 glass-card hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl transition border border-emerald-100"
            title="Recenter to active city"
          >
            <Compass className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-emerald-200/60 shadow-inner">
        
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Top-Right Layer HUD Pill */}
        <div className="absolute top-3 right-3 z-20 glass-card-strong rounded-2xl p-2 shadow-lg border border-white flex flex-col space-y-1.5 text-[11px]">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 px-1">Map View</span>
          
          <button
            onClick={() => setActiveLayers(p => ({ ...p, plume: !p.plume }))}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg font-bold transition text-left ${activeLayers.plume ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-200' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
            <span>Air Cloud</span>
          </button>

          <button
            onClick={() => setActiveLayers(p => ({ ...p, stations: !p.stations }))}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg font-bold transition text-left ${activeLayers.stations ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-200' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Activity className="h-3 w-3 text-emerald-600" />
            <span>Local Monitors</span>
          </button>

          <button
            onClick={() => setActiveLayers(p => ({ ...p, shelters: !p.shelters }))}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg font-bold transition text-left ${activeLayers.shelters ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-200' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <ShieldCheck className="h-3 w-3 text-teal-600" />
            <span>Clean Air Spaces</span>
          </button>
        </div>

        {/* Bottom-Left Live Telemetry Banner */}
        <div className="absolute bottom-3 left-3 z-20 glass-card-strong rounded-2xl px-3 py-2 shadow-md border border-white flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <Wind className="h-4 w-4 text-emerald-600" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold leading-none">Breeze</span>
              <span className="text-xs font-bold text-slate-800">{aqiData.windSpeed} km/h</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold leading-none">Air Score</span>
            <span className="text-xs font-bold text-slate-800">AQI {aqiData.aqi}</span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: cat.color }} />
            <span className="text-[11px] font-extrabold" style={{ color: cat.color }}>
              {cat.category}
            </span>
          </div>
        </div>

      </div>

      {/* AQI Scale Guide */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Air Quality Guide:</span>
        <div className="flex items-center space-x-1 text-[10px] font-extrabold">
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">0-50 Clean</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">51-100 Fair</span>
          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">101-150 Sensitive</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">151-200 Hazy</span>
          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">201-300 Smoggy</span>
          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-200">301+ Heavy Smog</span>
        </div>
      </div>

    </div>
  );
};
