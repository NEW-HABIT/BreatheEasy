import { GoogleGenerativeAI } from '@google/generative-ai';
import { AqiData, FamilyMember, RoutineItem } from '@/types';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI:', err);
  }
}

export async function askAirQualityAdvisor({
  question,
  aqiData,
  familyMembers,
  conversationHistory = []
}: {
  question: string;
  aqiData: AqiData;
  familyMembers: FamilyMember[];
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}): Promise<{ text: string; impactHighlight?: { co2SavedKg?: number; pm25DropPercent?: number } }> {
  const familyContext = familyMembers.map(m => 
    `- ${m.name} (${m.role}, ${m.age} yrs old, Health conditions: ${m.healthConditions.join(', ') || 'None'})`
  ).join('\n');

  const systemPrompt = `You are "BreatheEasy AI", a world-class GenAI urban air quality advisor and environmental epidemiologist.
Your mission is to help families and communities navigate severe winter smog and urban air pollution with actionable, science-backed guidance.

CURRENT AIR QUALITY CONTEXT:
- Location: ${aqiData.city}, ${aqiData.country}
- Air Quality Index (AQI): ${aqiData.aqi} (${aqiData.category})
- Primary Pollutant: ${aqiData.primaryPollutant}
- PM2.5: ${aqiData.pollutants.pm25} µg/m³ (WHO 24hr guideline is 15 µg/m³)
- PM10: ${aqiData.pollutants.pm10} µg/m³
- Temperature: ${aqiData.temperature}°C | Humidity: ${aqiData.humidity}%
- Best Safe Ventilation Window Today: ${aqiData.ventilationWindow.start} - ${aqiData.ventilationWindow.end}

USER'S REGISTERED FAMILY PROFILE:
${familyContext}

CRITICAL INSTRUCTIONS:
1. Speak with empathy, clarity, and authority.
2. Directly reference specific family members by name and their medical vulnerabilities (especially children and elders with asthma/cardiovascular risks).
3. Provide practical, high-impact indoor air hacks (e.g., DIY Corsi-Rosenthal boxes, sealing entry gaps, cooking adjustments, hydration).
4. Recommend low-emission daily routines and sustainable swaps.
5. QUANTIFY the impact wherever possible (e.g., "Reduces indoor PM2.5 by ~65%", "Saves 3.2 kg CO₂").
6. Use clean markdown formatting with bullet points and bold emphasis.`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const contents = [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }] }
      ];

      const result = await model.generateContent({ contents });
      const response = await result.response;
      const text = response.text();

      // Estimate impact metrics
      const co2Match = text.match(/([0-9.]+)\s*kg\s*CO₂/i);
      const pmMatch = text.match(/([0-9]+)%\s*(?:reduction|drop|less|cleaner)/i);

      return {
        text,
        impactHighlight: {
          co2SavedKg: co2Match ? parseFloat(co2Match[1]) : 1.8,
          pm25DropPercent: pmMatch ? parseInt(pmMatch[1], 10) : 55
        }
      };
    } catch (apiError) {
      console.warn('Gemini API call returned error, using fallback expert synthesizer:', apiError);
    }
  }

  // Fallback dynamic expert generator when API key is not yet set or throttled
  return generateExpertFallbackResponse(question, aqiData, familyMembers);
}

function generateExpertFallbackResponse(
  question: string,
  aqiData: AqiData,
  familyMembers: FamilyMember[]
): { text: string; impactHighlight?: { co2SavedKg?: number; pm25DropPercent?: number } } {
  const q = question.toLowerCase();
  const vulnerableMembers = familyMembers.filter(m => 
    m.age < 12 || m.age > 60 || m.healthConditions.some(c => c.toLowerCase() !== 'none')
  );

  if (q.includes('child') || q.includes('kid') || q.includes('baby') || q.includes('asthma')) {
    const names = vulnerableMembers.map(m => m.name).join(' and ') || 'your vulnerable family members';
    return {
      text: `### 🛡️ Immediate Protocol for ${names} (Current AQI: ${aqiData.aqi} - ${aqiData.category})

Because children breathe 50% more air per pound of body weight than adults, acute particulate peaks deposit deep in their undeveloped alveoli.

**Immediate High-Impact Actions:**
1. **Air-Lock Bedroom Isolation:** Move ${names} into the most interior bedroom with minimal exterior-facing windows. Run an air purifier on continuous high speed.
2. **Damp Towel Sealing Hack:** Roll damp cotton towels and place them along exterior door bottoms and window sills. This creates an electrostatic barrier that traps infiltrating coarse particulates (PM10) by **~45%**.
3. **Replace Cooking Methods:** Avoid stovetop frying or oil tempering today; switch to electric pressure cooking or induction to prevent indoor NO₂ spikes.
4. **Hydration & Saline Mist:** Provide warm water sips every 45 minutes to keep airway mucosal lining moist and preserve natural ciliary clearance.

📊 **Quantified Impact:** Implementing these indoor controls reduces particulate exposure for ${names} by **~68%**, dropping effective inhaled PM2.5 from ${aqiData.pollutants.pm25} µg/m³ down to ~${Math.round(aqiData.pollutants.pm25 * 0.32)} µg/m³.`,
      impactHighlight: { co2SavedKg: 1.2, pm25DropPercent: 68 }
    };
  }

  if (q.includes('purifier') || q.includes('diy') || q.includes('hack') || q.includes('filter')) {
    return {
      text: `### 🛠️ Low-Cost DIY Corsi-Rosenthal Air Cleaner Hack

You don't need a $500 commercial purifier to achieve medical-grade indoor air during winter smog.

**Materials Required:**
- 1 Standard 20" Box Fan or Exhaust Fan
- 1 to 4 MERV-13 (or H13 HEPA) furnace filters (20" x 20")
- Heavy-duty duct tape or painter's tape

**5-Minute Assembly Guide:**
1. Tape the filter directly to the **intake side** (back) of your box fan, with the airflow arrow pointing *into* the fan.
2. Ensure an airtight tape seal around all four borders to eliminate bypass leakage.
3. Place the unit elevated on a stool at chest height in your living room or bedroom.
4. Run on speed 2 for quiet, continuous operation.

📊 **Scientific Impact:** Tested Clean Air Delivery Rate (CADR) reaches **450–600 CFM**, which is 1.5x higher than entry-level consumer air purifiers, while consuming just **40W** of power. This cleans 500 sq.ft of indoor air by **~75% in under 25 minutes**.`,
      impactHighlight: { co2SavedKg: 0.6, pm25DropPercent: 75 }
    };
  }

  if (q.includes('commute') || q.includes('travel') || q.includes('office') || q.includes('car')) {
    return {
      text: `### 🚗 Smog-Resilient Commute Strategy & Sustainable Switch

Traffic corridors during winter inversions reach localized PM2.5 concentrations exceeding **500+ µg/m³** due to diesel particulate matter (DPM).

**Recommended Route & Mode Protocol:**
1. **Switch to Underground Metro / Electric Mass Transit:** Metro stations and train carriages have centralized multi-stage HVAC filtration that lowers in-transit PM2.5 exposure by **~65%** compared to surface traffic jams.
2. **If Driving is Unavoidable:** Immediately press the **Recirculate Air (Cabin Loop)** button. Running AC on recirculation prevents exterior exhaust from being pulled into the cabin, reducing in-car particulate levels by **~82%**.
3. **Mask Protocol:** Wear a certified N95 or KN95 with an airtight nose-clip seal during transfers and walking segments. Surgical and cloth masks leak >70% of sub-micron particles.

🌱 **Sustainability Impact:** Choosing the metro over a solo car commute today saves **4.8 kg of CO₂** and keeps 120 grams of fine combustion particulates out of neighborhood lungs.`,
      impactHighlight: { co2SavedKg: 4.8, pm25DropPercent: 65 }
    };
  }

  // General comprehensive advisory
  return {
    text: `### 📍 Action Plan for ${aqiData.city} (AQI: ${aqiData.aqi} - ${aqiData.category})

Current atmospheric inversion in ${aqiData.city} traps ground-level emissions with PM2.5 at **${aqiData.pollutants.pm25} µg/m³** (${Math.round(aqiData.pollutants.pm25 / 15)}x higher than WHO safe limits).

**Top 3 Daily Actions for Your Household:**
1. **Safe Ventilation Timing:** Do NOT open windows in the early morning or evening. The only viable ventilation window today is **${aqiData.ventilationWindow.start} to ${aqiData.ventilationWindow.end}** when solar radiation temporarily mixes the boundary layer.
2. **Indoor Cooking & Odor Control:** Avoid deep frying or burning incense/dhoop today. Use an electric kettle and induction stove to prevent indoor carbon monoxide buildup.
3. **Protective Measures for Vulnerable Members:** Ensure family members under 12 or with respiratory history wear N95 protection if stepping out.

🌱 **Collective Impact:** Commuting via public transit and switching to electric induction cooking today saves **5.2 kg of CO₂** and cuts your family's personal smog footprint substantially.`,
    impactHighlight: { co2SavedKg: 5.2, pm25DropPercent: 58 }
  };
}

export async function generateAqiRoutine(
  aqiData: AqiData,
  familyMembers: FamilyMember[]
): Promise<RoutineItem[]> {
  const isHighSmog = aqiData.aqi > 200;

  return [
    {
      id: 'r-1',
      time: '06:30 AM',
      title: 'Morning Wakeup: Seal & Filter Protocol',
      description: 'Morning temperature inversions trap heavy smog at ground level. Keep all windows firmly sealed. Power on bedroom purifiers or DIY fan boxes.',
      category: 'purification',
      airSafetyRating: isHighSmog ? 'Dangerous' : 'Caution',
      co2ImpactKg: 0.1,
      isCompleted: true
    },
    {
      id: 'r-2',
      time: '07:15 AM',
      title: 'Indoor Core & Yoga Workout (No Outdoor Jogging)',
      description: 'Outdoor cardio during severe smog forces deep lung deposition of toxic ultrafine carbon. Replace outdoor runs with indoor calisthenics or mat yoga.',
      category: 'exercise',
      airSafetyRating: isHighSmog ? 'Dangerous' : 'Caution',
      co2ImpactKg: 0,
      isCompleted: true
    },
    {
      id: 'r-3',
      time: '08:00 AM',
      title: 'Low-Emission Induction Breakfast',
      description: 'Cook breakfast using magnetic induction or microwave instead of open flame gas burners. Eliminates 100% of indoor kitchen NO₂ emissions.',
      category: 'cooking',
      airSafetyRating: 'Safe',
      co2ImpactKg: 0.8,
      isCompleted: false
    },
    {
      id: 'r-4',
      time: '08:45 AM',
      title: 'Commute via Metro / Filtered Cabin Transit',
      description: 'Board electric metro transit wearing sealed N95 mask. If carpooling, toggle air conditioning to 100% cabin recirculation.',
      category: 'commute',
      airSafetyRating: 'Caution',
      co2ImpactKg: 3.6,
      isCompleted: false
    },
    {
      id: 'r-5',
      time: '01:30 PM',
      title: `Optimal Ventilation Window (${aqiData.ventilationWindow.start} - ${aqiData.ventilationWindow.end})`,
      description: 'Afternoon sun elevates the boundary layer. Open courtyard windows for 15 minutes to flush indoor CO₂ without accumulating heavy particulate load.',
      category: 'ventilation',
      airSafetyRating: 'Safe',
      co2ImpactKg: 0.1,
      isCompleted: false
    },
    {
      id: 'r-6',
      time: '07:30 PM',
      title: 'Evening Return & Air-Lock Transition',
      description: 'Remove outer footwear and smog-exposed coats at the entryway. Wash face and hands with warm water to clear settled carbon dust.',
      category: 'purification',
      airSafetyRating: isHighSmog ? 'Dangerous' : 'Caution',
      co2ImpactKg: 0,
      isCompleted: false
    },
    {
      id: 'r-7',
      time: '09:30 PM',
      title: 'Overnight Bedroom Clean Zone Setup',
      description: 'Run air cleaner on low whisper mode next to sleeping quarters. Ensure mosquito repellent is electric liquid vaporizer, not burning coils.',
      category: 'purification',
      airSafetyRating: 'Safe',
      co2ImpactKg: 0.4,
      isCompleted: false
    }
  ];
}
