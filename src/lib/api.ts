import { AqiData, FamilyMember, RoutineItem, SustainableSwap, CommunityPost } from '@/types';

const API_BASE = '/api';

export async function fetchLiveAqi(city?: string, lat?: number, lng?: number): Promise<AqiData | null> {
  try {
    const params = new URLSearchParams();
    if (lat !== undefined && lng !== undefined) {
      params.append('lat', lat.toString());
      params.append('lng', lng.toString());
      if (city) params.append('city', city);
    } else if (city) {
      params.append('city', city);
    } else {
      params.append('city', 'New Delhi');
    }

    const res = await fetch(`${API_BASE}/aqi?${params.toString()}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchLiveAqi error:', err);
    return null;
  }
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
