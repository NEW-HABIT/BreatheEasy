import type { FamilyMember, UserProfile, SustainableSwap, CommunityPost, RoutineItem } from '../types';

export const DEFAULT_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Rajesh',
    role: 'Self',
    age: 38,
    healthConditions: ['None'],
    riskLevel: 'Moderate'
  },
  {
    id: 'fam-2',
    name: 'Priya',
    role: 'Spouse',
    age: 35,
    healthConditions: ['None'],
    riskLevel: 'Moderate'
  },
  {
    id: 'fam-3',
    name: 'Arya',
    role: 'Child',
    age: 6,
    healthConditions: ['Asthma', 'Seasonal Wheezing'],
    riskLevel: 'Severe'
  },
  {
    id: 'fam-4',
    name: 'Sushila',
    role: 'Elderly',
    age: 68,
    healthConditions: ['Hypertension', 'Cardiovascular sensitivity'],
    riskLevel: 'Severe'
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  city: 'New Delhi',
  homeType: 'Apartment',
  hasPurifier: true,
  cookingFuel: 'LPG',
  commuteMode: 'Metro/Train',
  commuteDistanceKm: 14,
  familyMembers: DEFAULT_FAMILY_MEMBERS
};

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Dwarka Sector 9 RWA',
    neighborhood: 'Dwarka, New Delhi',
    title: '🚫 Zero Stubble & Biomass Burning Patrol',
    content: 'Our resident volunteer brigade will patrol the surrounding green belt at 6 AM and 9 PM to prevent dry leaf and waste incineration. Join our WhatsApp alert grid!',
    type: 'initiative',
    participantsCount: 84,
    upvotes: 142,
    createdAt: '2 hours ago'
  },
  {
    id: 'post-2',
    author: 'Kavita Verma (Community Lead)',
    neighborhood: 'South City, Gurugram',
    title: '🌱 Group Buy: MERV-13 Filters & DIY Purifier Workshop',
    content: 'We negotiated bulk pricing for 20" MERV-13 filters at ₹450 each. Hosting a 30-min assembly workshop in Community Hall B this Saturday for all families.',
    type: 'event',
    participantsCount: 56,
    upvotes: 98,
    createdAt: '5 hours ago'
  },
  {
    id: 'post-3',
    author: 'Dr. Amit Sen (Pulmonologist)',
    neighborhood: 'Indirapuram, Ghaziabad',
    title: '💡 Clinical Tip: Nebulizer vs Air Purifier Placement',
    content: 'During PM2.5 > 250 days, never place air purifiers facing directly toward the sleeping child’s head (creates draft). Keep it 6 feet away directed at 45 degrees towards the ceiling.',
    type: 'tip',
    participantsCount: 110,
    upvotes: 215,
    createdAt: 'Yesterday'
  },
  {
    id: 'post-4',
    author: 'Rohini Greens Alliance',
    neighborhood: 'Rohini, Delhi',
    title: '🚲 Car-Free Friday Challenge: Metro & E-Bus Pledge',
    content: '42 residential societies pledging zero solo-driver trips this coming Friday. Track your individual carbon offset here on BreatheEasy!',
    type: 'initiative',
    participantsCount: 230,
    upvotes: 310,
    createdAt: '2 days ago'
  }
];
