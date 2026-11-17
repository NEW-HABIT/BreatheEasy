import { NextRequest, NextResponse } from 'next/server';
import { askAirQualityAdvisor } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, aqiData, familyMembers, conversationHistory } = body;

    if (!question || !aqiData) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const response = await askAirQualityAdvisor({
      question,
      aqiData,
      familyMembers: familyMembers || [],
      conversationHistory: conversationHistory || []
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate advisory' }, { status: 500 });
  }
}
