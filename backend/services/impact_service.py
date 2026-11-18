"""
BreatheEasy Impact Service
Provides sustainable lifestyle swaps and calculates their environmental health impact.
CO₂ calculations follow EPA emission factor methodology (AP-42, eGRID 2023).
"""

from typing import List

# ---------------------------------------------------------------------------
# EPA Emission Factors Used
# ---------------------------------------------------------------------------
# Gasoline passenger car:          0.404 kg CO₂ per km  (EPA GHG Inventory, 2023)
# Electric grid (India avg):       0.716 kg CO₂ per kWh (IEA 2023 / CEA India)
# Natural gas cooking:             2.204 kg CO₂ per therm → ~0.185 kg CO₂ per 30-min meal
# Industrial meat (beef):          27.0  kg CO₂e per kg  (FAO 2013)
# Fast fashion garment:            ~8.0  kg CO₂e per item average lifecycle
# Plastic single-use bag:          ~0.33 kg CO₂e per bag set (lifecycle)
# Tree carbon sequestration:        21.8 kg CO₂ per tree per year (EPA urban forestry)
# Clean air hours: 1 µg/m³ PM2.5 reduction ≈ 0.6 clean-air-hours per person per day (WHO model)

SWAPS = [
    {
        "id": "swap-commute",
        "title": "Metro / E-Bus Instead of Solo Car",
        "category": "Transport",
        "currentHabit": "Daily solo petrol car commute (~14 km each way)",
        "sustainableAlternative": "Delhi Metro / electric HOHO bus or carpool",
        "co2SavedKgPerDay": 11.3,  # 28 km × 0.404 kg/km
        "pm25ReductionPercent": 42.0,  # In-cabin particulate avoided + tailpipe PM reduction
        "costImpact": "Save ₹2,800–4,200/month in fuel and parking",
        "difficulty": "Medium",
        "explanation": (
            "A solo petrol car emits ~0.404 kg CO₂ per km (EPA AP-42). "
            "A 28 km daily round-trip generates ~11.3 kg CO₂. "
            "Delhi Metro operates on a renewable-blended grid and emits ~95% less per passenger-km. "
            "Additionally, in-vehicle PM2.5 during traffic is 3–9× ambient, so skipping the car "
            "dramatically reduces your personal PM2.5 inhalation dose."
        ),
        "adopted": False,
    },
    {
        "id": "swap-cooking",
        "title": "Induction Cooking Over Gas Stove",
        "category": "Home Energy",
        "currentHabit": "LPG / PNG gas stove for all meals",
        "sustainableAlternative": "Induction cooktop for daily cooking",
        "co2SavedKgPerDay": 0.74,  # 4 meals × 0.185 kg CO₂/30-min gas session
        "pm25ReductionPercent": 68.0,  # Indoor PM2.5 from gas cooking: 50–200 µg/m³ spike eliminated
        "costImpact": "Roughly cost-neutral; gas savings offset electricity increase",
        "difficulty": "Easy",
        "explanation": (
            "Natural gas combustion during a 30-minute cooking session emits ~0.185 kg CO₂ "
            "and raises indoor PM2.5 by 50–200 µg/m³. Induction cooktops convert 85–90% of "
            "electrical energy into heat (vs. 40% for gas) and produce zero indoor combustion products. "
            "This is the single highest-impact indoor air quality intervention available."
        ),
        "adopted": False,
    },
    {
        "id": "swap-diet",
        "title": "Plant-Based Meals 4× per Week",
        "category": "Diet",
        "currentHabit": "Daily meat consumption (chicken/mutton/beef)",
        "sustainableAlternative": "Legume, lentil, and vegetable-based meals 4 days/week",
        "co2SavedKgPerDay": 3.6,  # Avg 1.8 kg CO₂e saved per meal × 2 meals avoided
        "pm25ReductionPercent": 8.0,  # Industrial livestock contributes to regional PM2.5 via NH₃ → ammonium nitrate
        "costImpact": "Save ₹600–1,200/month on grocery bills",
        "difficulty": "Medium",
        "explanation": (
            "Beef production emits ~27 kg CO₂e per kg (FAO). Even replacing 4 meat meals/week "
            "with dal, paneer, or tofu saves ~3.6 kg CO₂ daily. Livestock agriculture contributes "
            "significantly to regional PM2.5 via ammonia emissions that react to form fine particulate "
            "ammonium nitrate — responsible for 20–30% of Delhi's winter PM2.5 load."
        ),
        "adopted": False,
    },
    {
        "id": "swap-plastic",
        "title": "Reusable Bags & Stainless Bottles",
        "category": "Consumption",
        "currentHabit": "Single-use plastic bags and disposable water bottles",
        "sustainableAlternative": "Cotton tote bags + stainless steel water bottle",
        "co2SavedKgPerDay": 0.11,  # ~40 plastic bags/month lifecycle CO₂ / 30 days
        "pm25ReductionPercent": 3.5,  # Plastic burning and landfill off-gassing reduction
        "costImpact": "Save ₹300–600/month on bottled water",
        "difficulty": "Easy",
        "explanation": (
            "A single-use plastic bag has a lifecycle CO₂ footprint of ~0.33 kg CO₂e when "
            "incineration or open burning is considered (common in Indian urban areas). "
            "Open plastic burning is a significant source of ultrafine PM2.5 and dioxins. "
            "A stainless bottle replacing 2 PET bottles/day saves ~0.12 kg CO₂e per day."
        ),
        "adopted": False,
    },
    {
        "id": "swap-energy",
        "title": "LED Lighting + Smart Power Strips",
        "category": "Home Energy",
        "currentHabit": "Incandescent/CFL bulbs; devices on standby 24/7",
        "sustainableAlternative": "LED bulbs + smart power strips to eliminate phantom load",
        "co2SavedKgPerDay": 0.86,  # 1.2 kWh saved × 0.716 kg CO₂/kWh (India grid)
        "pm25ReductionPercent": 5.0,  # Reduced coal power plant output → lower regional PM2.5
        "costImpact": "Save ₹400–800/month on electricity bill",
        "difficulty": "Easy",
        "explanation": (
            "LED bulbs use 75% less energy than incandescent. Phantom loads (TVs, chargers, "
            "set-top boxes on standby) account for 5–10% of household electricity in India. "
            "India's grid emits 0.716 kg CO₂ per kWh (CEA 2023). Saving 1.2 kWh/day "
            "reduces CO₂ by ~0.86 kg and proportionally reduces coal plant PM2.5 emissions "
            "that drift into urban airsheds."
        ),
        "adopted": False,
    },
    {
        "id": "swap-fashion",
        "title": "Second-Hand & Slow Fashion",
        "category": "Consumption",
        "currentHabit": "Buying 2–3 new fast-fashion garments per month",
        "sustainableAlternative": "Thrift stores, clothing swaps, or quality long-lasting items",
        "co2SavedKgPerDay": 0.53,  # 2 garments × 8 kg CO₂e / 30 days
        "pm25ReductionPercent": 4.0,  # Textile dyeing / synthetic fiber production PM2.5 reduction
        "costImpact": "Save ₹1,500–4,000/month on clothing",
        "difficulty": "Hard",
        "explanation": (
            "A single fast-fashion garment generates ~8 kg CO₂e across its lifecycle "
            "(cotton farming, dyeing, shipping, landfill). Textile mills are significant "
            "PM2.5 emitters — India's garment industry contributes measurably to regional "
            "air pollution. Choosing second-hand or buying 2 items/year instead of 24 "
            "can reduce your personal fashion carbon footprint by over 85%."
        ),
        "adopted": False,
    },
]

# ---------------------------------------------------------------------------
# EPA-based calculation constants
# ---------------------------------------------------------------------------
_TREE_SEQUESTRATION_KG_PER_YEAR = 21.8   # EPA urban forestry estimate
_CLEAN_AIR_HOURS_PER_UG_M3_REDUCTION = 0.6  # per person per day (WHO risk model)
_AVG_FAMILY_SIZE = 4  # used for clean-air-hours scaling


def calculate_impact(adopted_swap_ids: List[str]) -> dict:
    """
    Given a list of adopted swap IDs, calculate aggregate environmental impact.

    Returns:
        {
            dailyCo2SavedKg: float,
            monthlyCo2SavedKg: float,
            yearlyCo2SavedKg: float,
            avgPm25ReductionPercent: float,
            treesEquivalent: float,
            cleanAirHoursGained: float,
        }
    """
    if not adopted_swap_ids:
        return {
            "dailyCo2SavedKg": 0.0,
            "monthlyCo2SavedKg": 0.0,
            "yearlyCo2SavedKg": 0.0,
            "avgPm25ReductionPercent": 0.0,
            "treesEquivalent": 0.0,
            "cleanAirHoursGained": 0.0,
        }

    swap_map = {s["id"]: s for s in SWAPS}
    adopted = [swap_map[sid] for sid in adopted_swap_ids if sid in swap_map]

    if not adopted:
        return {
            "dailyCo2SavedKg": 0.0,
            "monthlyCo2SavedKg": 0.0,
            "yearlyCo2SavedKg": 0.0,
            "avgPm25ReductionPercent": 0.0,
            "treesEquivalent": 0.0,
            "cleanAirHoursGained": 0.0,
        }

    daily_co2 = sum(s["co2SavedKgPerDay"] for s in adopted)
    monthly_co2 = daily_co2 * 30
    yearly_co2 = daily_co2 * 365

    # Weighted average PM2.5 reduction (not additive — they overlap)
    # Use diminishing returns model: each additional swap adds less
    pm25_values = sorted([s["pm25ReductionPercent"] for s in adopted], reverse=True)
    combined_pm25 = 0.0
    remaining = 100.0
    for pct in pm25_values:
        contribution = pct * (remaining / 100.0)
        combined_pm25 += contribution
        remaining -= contribution
    combined_pm25 = min(combined_pm25, 95.0)  # cap at 95%

    # Trees equivalent: yearly CO₂ / sequestration per tree per year
    trees_equivalent = round(yearly_co2 / _TREE_SEQUESTRATION_KG_PER_YEAR, 1)

    # Clean air hours: PM2.5 reduction × WHO model × family size
    clean_air_hours = round(
        (combined_pm25 / 100.0) * _CLEAN_AIR_HOURS_PER_UG_M3_REDUCTION * _AVG_FAMILY_SIZE * 365,
        1,
    )

    return {
        "dailyCo2SavedKg": round(daily_co2, 2),
        "monthlyCo2SavedKg": round(monthly_co2, 2),
        "yearlyCo2SavedKg": round(yearly_co2, 2),
        "avgPm25ReductionPercent": round(combined_pm25, 1),
        "treesEquivalent": trees_equivalent,
        "cleanAirHoursGained": clean_air_hours,
    }
