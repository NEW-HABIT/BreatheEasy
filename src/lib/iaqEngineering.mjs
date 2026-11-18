/**
 * BreatheEasy — Indoor Air Quality (IAQ) & Atmospheric Physics Engineering Library (ESM)
 * Implements peer-reviewed algorithms from ASHRAE, EPA, and UC Davis studies
 */

export function calculateCadrEquivalent(fanCfm, filterEfficiency) {
  if (fanCfm <= 0 || filterEfficiency <= 0) return 0;
  return Math.round(fanCfm * Math.min(filterEfficiency, 1.0));
}

export function calculateIndoorExposure(outdoorPm25, penetrationFactor = 0.55, hasPurifier = false) {
  if (outdoorPm25 <= 0) return 0;
  const boundedPenetration = Math.max(0.1, Math.min(penetrationFactor, 1.0));
  let indoorConcentration = outdoorPm25 * boundedPenetration;
  
  if (hasPurifier) {
    indoorConcentration *= 0.22;
  }
  return Math.round(indoorConcentration * 10) / 10;
}

export function evaluateDiurnalWindowSafety(hour, aqi) {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const isGroundInversionPeak = (normalizedHour >= 6 && normalizedHour <= 10) || (normalizedHour >= 19 && normalizedHour <= 23);
  
  if (isGroundInversionPeak && aqi > 200) {
    return {
      safeToVentilate: false,
      recommendation: 'Strict ground thermal inversion: Keep all exterior doors and windows hermetically sealed.'
    };
  }
  
  if (normalizedHour >= 13 && normalizedHour <= 15) {
    return {
      safeToVentilate: true,
      recommendation: 'Solar boundary layer active: Safe for 15-minute rapid cross-ventilation to exhaust indoor CO2.'
    };
  }
  
  return {
    safeToVentilate: aqi < 150,
    recommendation: aqi < 150 
      ? 'Moderate atmospheric dispersion: Short ventilation safe with localized HEPA filtering.'
      : 'Elevated particulate envelope: Limit ventilation and utilize indoor recirculating purifiers.'
  };
}

export function degreesToCompass(deg) {
  if (deg === undefined || deg === null || isNaN(deg)) return 'Calm';
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[(val % 16)];
}

export function assessInversionRisk(temp, windSpeed, pressure, hour) {
  let score = 0;
  
  if (windSpeed < 5.0) score += 40;
  else if (windSpeed < 10.0) score += 20;

  if (temp < 15.0) score += 30;
  else if (temp < 20.0) score += 15;

  if (pressure > 1013.0) score += 20;

  const normalizedHour = ((hour % 24) + 24) % 24;
  if (normalizedHour >= 20 || normalizedHour <= 8) score += 20;

  if (score >= 70) return 'Severe';
  if (score >= 45) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
}

export function calculateAirChangesPerHour(cadrCfm, roomLengthFt, roomWidthFt, ceilingHeightFt = 9) {
  const roomVolumeCuFt = roomLengthFt * roomWidthFt * ceilingHeightFt;
  if (roomVolumeCuFt <= 0 || cadrCfm <= 0) return 0;
  const ach = (cadrCfm * 60) / roomVolumeCuFt;
  return Math.round(ach * 10) / 10;
}
