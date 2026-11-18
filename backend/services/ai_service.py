"""
BreatheEasy AI Service
Uses Google Gemini (google-genai v2.34.0) to provide contextual air quality advice.
Falls back to built-in epidemiological guidance when no API key is supplied.
"""

import json
import re
from typing import Optional

try:
    from google import genai
    _GENAI_AVAILABLE = True
except ImportError:
    _GENAI_AVAILABLE = False


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _aqi_severity_label(aqi: int) -> str:
    if aqi <= 50:
        return "Good"
    if aqi <= 100:
        return "Moderate"
    if aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    if aqi <= 200:
        return "Unhealthy"
    if aqi <= 300:
        return "Very Unhealthy"
    return "Hazardous"


def _build_system_prompt(question: str, aqi_data: dict, family_members: list) -> str:
    aqi = aqi_data.get("aqi", 150)
    city = aqi_data.get("city", "the city")
    pm25 = aqi_data.get("pollutants", {}).get("pm25", "N/A")
    pm10 = aqi_data.get("pollutants", {}).get("pm10", "N/A")
    no2 = aqi_data.get("pollutants", {}).get("no2", "N/A")
    category = aqi_data.get("category", _aqi_severity_label(aqi))

    family_desc = ""
    for m in family_members:
        conditions = m.get("health_conditions") or m.get("healthConditions") or "None"
        family_desc += (
            f"  - {m.get('name', 'Member')} ({m.get('role', 'Family')}, age {m.get('age', '?')}): "
            f"conditions={conditions}, risk={m.get('risk_level') or m.get('riskLevel', 'Moderate')}\n"
        )
    if not family_desc:
        family_desc = "  - No family members recorded.\n"

    prompt = f"""You are BreatheEasy, an expert urban air quality health assistant with deep knowledge in
epidemiology, respiratory medicine, environmental science, and sustainable living.

## Current Air Quality Data — {city}
- AQI (US): {aqi} ({category})
- PM2.5: {pm25} µg/m³  |  PM10: {pm10} µg/m³  |  NO₂: {no2} µg/m³
- Temperature: {aqi_data.get("temperature", "N/A")}°C  |  Humidity: {aqi_data.get("humidity", "N/A")}%
- Wind: {aqi_data.get("windSpeed", "N/A")} km/h
- Best ventilation window: {aqi_data.get("ventilationWindow", {}).get("start", "N/A")} – {aqi_data.get("ventilationWindow", {}).get("end", "N/A")}

## Family Members at Risk
{family_desc}

## User Question
{question}

## Instructions
Respond in 3–5 short paragraphs. Lead with actionable advice specific to the AQI level and family composition.
Cite pollutant thresholds from WHO or EPA when relevant.
At the end of your response include a JSON block (and ONLY this JSON, nothing else after it) in this exact format:
```json
{{"co2_saved_kg": <float>, "pm25_drop_percent": <float>}}
```
Where co2_saved_kg is the estimated daily CO₂ reduction (kg) achievable if the user follows your advice, and
pm25_drop_percent is the estimated PM2.5 indoor concentration reduction achievable with your advice.
Both must be realistic non-zero positive numbers.
"""
    return prompt


def _extract_metrics_from_text(text: str) -> tuple[float, float]:
    """Parse the trailing JSON block from Gemini response."""
    try:
        match = re.search(r"```json\s*(\{[^`]+\})\s*```", text, re.DOTALL)
        if match:
            data = json.loads(match.group(1))
            return float(data.get("co2_saved_kg", 0.3)), float(data.get("pm25_drop_percent", 15.0))
    except Exception:
        pass
    # Scan inline numbers as fallback
    co2 = 0.3
    pm25_drop = 15.0
    co2_match = re.search(r"co2_saved_kg[\"']?\s*:\s*([\d.]+)", text)
    pm_match = re.search(r"pm25_drop_percent[\"']?\s*:\s*([\d.]+)", text)
    if co2_match:
        co2 = float(co2_match.group(1))
    if pm_match:
        pm25_drop = float(pm_match.group(1))
    return co2, pm25_drop


def _clean_response_text(text: str) -> str:
    """Remove the trailing JSON metrics block from the user-visible text."""
    cleaned = re.sub(r"```json[\s\S]*?```", "", text).strip()
    return cleaned


# ---------------------------------------------------------------------------
# Fallback advice engine
# ---------------------------------------------------------------------------

_KEYWORD_ADVICE = {
    "child": (
        "Children are particularly vulnerable to PM2.5 because their lungs are still developing. "
        "With an AQI above 150, reduce outdoor playtime to under 30 minutes and ensure they wear "
        "properly fitted N95 masks if they must go outside. Indoors, maintain a HEPA purifier running "
        "continuously in bedrooms and living spaces. Keep windows and doors sealed with draft stoppers. "
        "Increase hydration and avoid vigorous indoor activities that elevate breathing rates. "
        "Long-term PM2.5 exposure in children is associated with a 4–8% reduction in lung function "
        "growth per 10 µg/m³ increase above WHO guidelines (WHO 2021 Global Air Quality Guidelines). "
        "Consider homeschooling or activity shifting on Hazardous days."
    ),
    "elderly": (
        "Elderly adults, especially those with pre-existing cardiac or pulmonary conditions, face the "
        "highest mortality risk during high-AQI episodes. The EPA estimates a 0.6% increase in "
        "cardiovascular mortality per 10 µg/m³ increase in PM2.5. Keep all outdoor exposure below "
        "15 minutes when AQI > 150. Ensure prescribed inhalers or cardiac medications are accessible. "
        "Monitor oxygen saturation with a pulse oximeter; readings below 95% warrant medical attention. "
        "Indoor filtration with a CADR-rated purifier can reduce indoor PM2.5 by 60–85%."
    ),
    "exercise": (
        "Exercising outdoors during elevated AQI is counterproductive — deeper, faster breathing "
        "increases inhaled particle deposition by up to 4–fold. Shift workouts indoors to a "
        "HEPA-filtered space. If outdoor exercise is unavoidable, limit intensity to 60% max heart rate, "
        "choose early afternoon (1–3 PM) when solar convection cleans the lower atmosphere, "
        "and wear an N95 or higher-rated mask. Post-exercise shower removes surface-deposited particles."
    ),
    "purifier": (
        "HEPA air purifiers with a CADR (Clean Air Delivery Rate) matched to room size (CFM ≈ room area × 0.75) "
        "can reduce indoor PM2.5 by 60–90%. Place units away from walls (≥ 18 inches), "
        "never in a corner, and keep doors/windows closed. Replace filters every 6–12 months or "
        "when the pressure-drop indicator triggers. Running two purifiers in a 400 sq ft space "
        "achieves faster air exchanges (target: ≥ 5 ACH for high AQI days). "
        "DIY Corsi-Rosenthal box filters (4 × MERV-13 furnace filters + a box fan) deliver comparable "
        "performance at 10% of commercial purifier cost."
    ),
    "mask": (
        "N95 and KN95 respirators filter ≥95% of particles ≥0.3 µm when properly sealed. "
        "Surgical masks reduce PM2.5 inhalation by only 10–30%. For children, use child-sized "
        "FFP2/N95 masks and check the nose-bridge seal. Avoid masks with exhalation valves for "
        "asthmatic family members as they can disrupt breathing rhythm. Replace masks after "
        "8 hours of cumulative wear or when breathing resistance noticeably increases."
    ),
    "ventilation": (
        "Indoor-outdoor air exchange should be timed to daily AQI minima. Midday (1–3 PM) solar "
        "heating disperses ground-level particulates via thermal convection — typically the cleanest "
        "2-hour window in urban India. Limit cross-ventilation to 10–15 minutes. Use exhaust fans "
        "in bathrooms and kitchens to maintain slight positive pressure, preventing infiltration. "
        "Avoid cooking on gas or biomass stoves during high-AQI days — LPG combustion adds "
        "50–200 µg/m³ PM2.5 to indoor air within 30 minutes of cooking."
    ),
    "cooking": (
        "Gas and biomass cooking are major sources of indoor air pollution. A 30-minute gas cooking session "
        "can raise indoor PM2.5 by 50–200 µg/m³. Switch to induction or electric cooking on bad air days. "
        "If gas is unavoidable, use a range hood exhausting outdoors (not recirculating), cook on back burners "
        "to maximize hood capture efficiency, and open a window for 10 minutes immediately after cooking. "
        "Pressure cookers significantly reduce cooking time and thus total pollutant exposure."
    ),
    "commute": (
        "Metro and electric public transit reduce personal PM2.5 exposure by 50–70% compared to "
        "driving in city traffic. Inside a vehicle in traffic, occupant-level PM2.5 can be 3–9× "
        "higher than ambient due to brake dust and re-entrained road dust. If driving, recirculate "
        "cabin air via the A/C, install a cabin HEPA filter, and avoid opening windows at intersections. "
        "Consider shifting commute timing to 10 AM–12 PM when urban mixing heights are higher."
    ),
}

_DEFAULT_FALLBACK_ADVICE = (
    "Based on the current air quality data, here are your personalized health recommendations:\n\n"
    "**Immediate Actions:** Keep all windows and doors sealed. Run HEPA air purifiers continuously in "
    "bedrooms and living areas. Avoid all strenuous outdoor activity until AQI drops below 100.\n\n"
    "**Protective Measures:** Wear properly fitted N95 masks for any unavoidable outdoor exposure. "
    "Rinse nasal passages with saline spray upon returning indoors to clear deposited particles.\n\n"
    "**Vulnerable Family Members:** Children and elderly members with respiratory or cardiac conditions "
    "face the highest risk. The EPA estimates a 1.5% increase in respiratory hospital admissions per "
    "10 µg/m³ rise in PM2.5. Monitor symptoms like persistent cough, chest tightness, or shortness "
    "of breath, and seek medical attention promptly.\n\n"
    "**Indoor Air Quality:** Avoid gas cooking, candles, and incense on high-AQI days. These sources "
    "can double indoor PM2.5 concentrations. Keep indoor humidity between 40–60% to minimize "
    "secondary particle formation. Houseplants alone are insufficient — prioritize mechanical filtration.\n\n"
    "**Recovery Window:** Plan activities around the daily ventilation window (typically 1–3 PM) "
    "when solar heating provides maximum atmospheric dispersion."
)


def _smart_fallback(question: str, aqi_data: dict, family_members: list) -> dict:
    aqi = aqi_data.get("aqi", 150)
    q_lower = question.lower()

    matched_advice = []
    for keyword, advice in _KEYWORD_ADVICE.items():
        if keyword in q_lower:
            matched_advice.append(advice)

    if not matched_advice:
        advice_text = _DEFAULT_FALLBACK_ADVICE
    else:
        advice_text = "\n\n".join(matched_advice)

    # Add severity header
    severity = _aqi_severity_label(aqi)
    city = aqi_data.get("city", "your area")
    header = (
        f"**Air Quality Alert — {city}: AQI {aqi} ({severity})**\n\n"
    )

    # Add family-specific note if vulnerable members present
    has_vulnerable = any(
        (m.get("role") in ("Child", "Elderly") or
         m.get("risk_level") in ("High", "Severe") or
         (m.get("riskLevel") in ("High", "Severe")))
        for m in family_members
    )
    family_note = ""
    if has_vulnerable:
        names = [m.get("name", "family member") for m in family_members
                 if m.get("role") in ("Child", "Elderly") or
                 m.get("risk_level") in ("High", "Severe") or
                 m.get("riskLevel") in ("High", "Severe")]
        family_note = (
            f"\n\n**⚠️ Vulnerable Members:** {', '.join(names)} require extra protection. "
            "Keep them indoors with continuous air filtration and monitor for symptoms every 2 hours."
        )

    full_text = header + advice_text + family_note

    # Estimate metrics based on AQI severity
    pm25_drop = min(85.0, 30.0 + (aqi / 300.0) * 55.0)
    co2_saved = 0.2 + len(matched_advice) * 0.15

    return {
        "text": full_text,
        "co2_saved_kg": round(co2_saved, 2),
        "pm25_drop_percent": round(pm25_drop, 1),
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def ask_ai(
    question: str,
    aqi_data: dict,
    family_members: list,
    custom_api_key: Optional[str] = None,
) -> dict:
    """
    Returns: {"text": str, "co2_saved_kg": float, "pm25_drop_percent": float}
    """
    if custom_api_key and _GENAI_AVAILABLE:
        try:
            client = genai.Client(api_key=custom_api_key)
            prompt = _build_system_prompt(question, aqi_data, family_members)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
            )
            raw_text = response.text or ""
            co2, pm25_drop = _extract_metrics_from_text(raw_text)
            clean_text = _clean_response_text(raw_text)
            return {
                "text": clean_text,
                "co2_saved_kg": round(co2, 2),
                "pm25_drop_percent": round(pm25_drop, 1),
            }
        except Exception as e:
            # Fall through to smart fallback
            pass

    return _smart_fallback(question, aqi_data, family_members)


def generate_routine(aqi_data: dict, family_members: list) -> list:
    """
    Returns a list of RoutineItem dicts tailored to current AQI and family composition.
    Each dict: {time, activity, icon, priority, reason}
    """
    aqi = aqi_data.get("aqi", 150)
    has_child = any(m.get("role") == "Child" for m in family_members)
    has_elderly = any(m.get("role") == "Elderly" for m in family_members)
    has_asthma = any(
        "asthma" in (m.get("health_conditions") or m.get("healthConditions") or "").lower()
        for m in family_members
    )
    vent_start = aqi_data.get("ventilationWindow", {}).get("start", "1:00 PM")
    vent_end = aqi_data.get("ventilationWindow", {}).get("end", "3:00 PM")

    routine = []

    # Morning
    if aqi > 150:
        routine.append({
            "time": "6:00 AM",
            "activity": "Check AQI before opening any windows",
            "icon": "🌅",
            "priority": "high",
            "reason": f"AQI is {aqi} ({_aqi_severity_label(aqi)}). Morning rush-hour traffic peaks particulate levels.",
        })
    else:
        routine.append({
            "time": "6:30 AM",
            "activity": "10-minute morning walk — windows open briefly for fresh air",
            "icon": "🚶",
            "priority": "low",
            "reason": f"AQI {aqi} is acceptable for brief outdoor activity.",
        })

    routine.append({
        "time": "7:00 AM",
        "activity": "Switch to induction cooking for breakfast",
        "icon": "🍳",
        "priority": "medium" if aqi <= 150 else "high",
        "reason": "Gas cooking adds 50–200 µg/m³ PM2.5 indoors. Use induction or exhaust fan at max speed.",
    })

    if has_child or has_asthma:
        routine.append({
            "time": "7:30 AM",
            "activity": "Check children's inhaler / medication before school",
            "icon": "💊",
            "priority": "high",
            "reason": "Pre-medicating asthmatic children reduces exacerbation risk during outdoor school transitions.",
        })

    routine.append({
        "time": "8:00 AM",
        "activity": "Wear N95 mask for commute" if aqi > 100 else "Normal commute — keep car windows closed in traffic",
        "icon": "😷" if aqi > 100 else "🚇",
        "priority": "high" if aqi > 150 else "medium",
        "reason": "In-vehicle PM2.5 during traffic can be 3–9× ambient. Use cabin recirculation.",
    })

    # Midday
    routine.append({
        "time": "12:00 PM",
        "activity": f"Open windows for 10–15 minutes ({vent_start}–{vent_end} is the cleanest window)",
        "icon": "🪟",
        "priority": "medium",
        "reason": "Solar heating at midday disperses ground-level PM2.5 — optimal natural ventilation window.",
    })

    if aqi <= 100:
        routine.append({
            "time": "1:00 PM",
            "activity": "Outdoor lunch break or walk (15–30 min)",
            "icon": "☀️",
            "priority": "low",
            "reason": "Midday offers the lowest AQI of the day. Brief outdoor exposure is beneficial.",
        })
    else:
        routine.append({
            "time": "1:00 PM",
            "activity": "Keep all outdoor activities under 15 minutes; mask required",
            "icon": "⚠️",
            "priority": "high",
            "reason": f"AQI {aqi} — elevated particulate exposure increases oxidative stress in lungs.",
        })

    # Afternoon
    routine.append({
        "time": "3:30 PM",
        "activity": "Replace purifier pre-filter / check filter indicator",
        "icon": "🌀",
        "priority": "medium",
        "reason": "High-AQI days clog filters faster. A saturated filter reduces CADR by up to 50%.",
    })

    if has_elderly:
        routine.append({
            "time": "4:00 PM",
            "activity": "Check elderly member's blood pressure and O₂ saturation",
            "icon": "❤️",
            "priority": "high",
            "reason": "PM2.5 spikes cardiovascular inflammatory markers. SpO₂ < 95% warrants immediate medical attention.",
        })

    # Evening
    routine.append({
        "time": "6:00 PM",
        "activity": "Close all windows before evening rush-hour spike",
        "icon": "🌆",
        "priority": "high" if aqi > 100 else "medium",
        "reason": "Evening traffic causes secondary PM2.5 peaks, often worse than morning rush in calm weather.",
    })

    routine.append({
        "time": "7:00 PM",
        "activity": "Cook with exhaust fan; prefer induction over gas",
        "icon": "🍲",
        "priority": "medium",
        "reason": "Evening is the highest indoor pollution risk period — traffic + cooking sources combine.",
    })

    # Night
    routine.append({
        "time": "9:00 PM",
        "activity": "Run HEPA purifier on high in all bedrooms for 30 minutes before sleep",
        "icon": "😴",
        "priority": "high" if aqi > 150 else "medium",
        "reason": "Sleep (8 hours) is the longest continuous inhalation period. Clean bedroom air reduces overnight PM2.5 dose by 60–85%.",
    })

    if has_child:
        routine.append({
            "time": "9:30 PM",
            "activity": "Rinse children's nasal passages with saline spray",
            "icon": "🧴",
            "priority": "medium",
            "reason": "Nasal irrigation removes deposited PM2.5 and allergens, reducing overnight respiratory inflammation.",
        })

    return routine
