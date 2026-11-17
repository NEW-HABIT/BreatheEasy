import { NextRequest, NextResponse } from 'next/server';
import { generateAqiRoutine } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aqiData, familyMembers } = body;

    if (!aqiData) {
      return NextResponse.json({ error: 'AQI data required' }, { status: 400 });
    }

    const routine = await generateAqiRoutine(aqiData, familyMembers || []);
    return NextResponse.json({ routine });
  } catch (error: any) {
    console.error('Routine API error:', error);
    return NextResponse.json({ error: 'Failed to generate routine' }, { status: 500 });
  }
}
