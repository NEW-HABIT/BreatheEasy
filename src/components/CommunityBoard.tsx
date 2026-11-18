'use client';

import React, { useState } from 'react';
import { CommunityPost } from '@/types';
import { HeartHandshake, ThumbsUp, Users, Plus, Award } from 'lucide-react';
import { createCommunityPost, upvoteCommunityPost } from '@/lib/api';

interface CommunityBoardProps {
  initialPosts: CommunityPost[];
}

export const CommunityBoard: React.FC<CommunityBoardProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<CommunityPost['type']>('initiative');

  const handleUpvote = async (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const voted = p.userVoted;
        return {
          ...p,
          upvotes: voted ? p.upvotes - 1 : p.upvotes + 1,
          userVoted: !voted
        };
      }
      return p;
    }));
    await upvoteCommunityPost(id);
  };

  const handleJoin = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          participantsCount: p.participantsCount + 1
        };
      }
      return p;
    }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: 'You (Verified Resident)',
      neighborhood: neighborhood.trim() || 'Dwarka, New Delhi',
      title: title.trim(),
      content: content.trim(),
      type,
      participantsCount: 1,
      upvotes: 1,
      createdAt: 'Just now',
      userVoted: true
    };

    setPosts([newPost, ...posts]);
    await createCommunityPost({
      author: newPost.author,
      neighborhood: newPost.neighborhood,
      title: newPost.title,
      content: newPost.content,
      type: newPost.type
    });

    setTitle('');
    setContent('');
    setNeighborhood('');
    setIsPosting(false);
  };

  const leaderboard = [
    { rank: 1, name: 'Dwarka Sector 9 RWA', offsetKg: 4250, participants: 180 },
    { rank: 2, name: 'South City 1 & 2 Alliance', offsetKg: 3890, participants: 142 },
    { rank: 3, name: 'Rohini Clean Air Coalition', offsetKg: 3120, participants: 120 },
    { rank: 4, name: 'Indirapuram Green Brigade', offsetKg: 2450, participants: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card-strong rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <HeartHandshake className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Grassroots Anti-Smog Network
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Community Action & Neighborhood Smog Defense Board
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Coordinate zero-burning night patrols, filter group-buys, and neighborhood carpool grids. Air is a shared commons.
          </p>
        </div>

        <button
          onClick={() => setIsPosting(!isPosting)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition self-start md:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isPosting ? 'Close Form' : 'Start Community Initiative'}</span>
        </button>
      </div>

      {/* Create Post Form */}
      {isPosting && (
        <form onSubmit={handleCreatePost} className="glass-card-strong rounded-3xl p-6 shadow-xl space-y-3.5 border border-emerald-300">
          <h3 className="text-sm font-bold text-emerald-900">Launch a Neighborhood Initiative or Report</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="init-title" className="text-[11px] text-slate-600 font-semibold block mb-1">Initiative Title</label>
              <input
                id="init-title"
                type="text"
                aria-label="Initiative Title"
                placeholder="e.g. Leaf Burning Vigilance Squad"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="init-neigh" className="text-[11px] text-slate-600 font-semibold block mb-1">Neighborhood / Sector</label>
              <input
                id="init-neigh"
                type="text"
                aria-label="Neighborhood or Sector"
                placeholder="e.g. Sector 14, Gurugram"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-semibold block mb-1">Action Description & Coordination Plan</label>
            <textarea
              rows={3}
              placeholder="Describe the initiative, meeting time, WhatsApp group link or resource sharing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
            >
              Publish to Neighborhood
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Feed + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-2xl p-5 hover:shadow-md transition border border-white/80"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{post.author}</span>
                    <span className="text-[11px] text-slate-500">• {post.neighborhood}</span>
                    <span className="text-[10px] text-slate-400">({post.createdAt})</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1.5 leading-snug">
                    {post.title}
                  </h4>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {post.type}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border transition ${
                      post.userVoted
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{post.upvotes}</span>
                  </button>

                  <span className="flex items-center space-x-1 text-slate-500 text-xs font-medium">
                    <Users className="h-3.5 w-3.5 text-teal-600" />
                    <span>{post.participantsCount} Neighbors Joined</span>
                  </span>
                </div>

                <button
                  onClick={() => handleJoin(post.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition shadow-sm"
                >
                  Join Action Pledge
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Neighborhood Leaderboard */}
        <div className="glass-card-strong rounded-3xl p-5 shadow-xl h-fit space-y-4 border border-white/80">
          <div className="flex items-center space-x-2 pb-3 border-b border-emerald-100">
            <Award className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Neighborhood Impact Leaderboard</h3>
              <p className="text-[11px] text-slate-500">Monthly community CO₂ & smog offsets</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    item.rank === 1 ? 'bg-amber-400 text-amber-950' :
                    item.rank === 2 ? 'bg-slate-300 text-slate-800' :
                    item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.rank}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h5>
                    <span className="text-[10px] text-slate-500 font-medium">{item.participants} families active</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-700">{item.offsetKg.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block font-medium">kg CO₂ saved</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 text-center">
            <span className="text-xs text-emerald-800 font-bold block">Join Your RWA Challenge</span>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Every habit logged on BreatheEasy contributes to your neighborhood’s clean air rank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
