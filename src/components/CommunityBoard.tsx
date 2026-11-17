'use client';

import React, { useState } from 'react';
import { CommunityPost } from '@/types';
import { HeartHandshake, ThumbsUp, Users, Plus, ShieldAlert, Award, MessageSquare } from 'lucide-react';

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

  const handleUpvote = (id: string) => {
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

  const handleCreatePost = (e: React.FormEvent) => {
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
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HeartHandshake className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Grassroots Anti-Smog Network
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Community Action & Neighborhood Smog Defense Board
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Coordinate zero-burning night patrols, filter group-buys, and neighborhood carpool grids. Air is a shared commons.
          </p>
        </div>

        <button
          onClick={() => setIsPosting(!isPosting)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 text-slate-950 font-bold text-xs shadow-md transition self-start md:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isPosting ? 'Close Form' : 'Start Community Initiative'}</span>
        </button>
      </div>

      {/* Create Post Form */}
      {isPosting && (
        <form onSubmit={handleCreatePost} className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in">
          <h3 className="text-sm font-bold text-cyan-300">Launch a Neighborhood Initiative or Report</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Initiative Title</label>
              <input
                type="text"
                placeholder="e.g. Leaf Burning Vigilance Squad"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Neighborhood / Sector</label>
              <input
                type="text"
                placeholder="e.g. Sector 14, Gurugram"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Action Description & Coordination Plan</label>
            <textarea
              rows={3}
              placeholder="Describe the initiative, meeting time, WhatsApp group link or resource sharing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
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
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{post.author}</span>
                    <span className="text-[11px] text-slate-400">• {post.neighborhood}</span>
                    <span className="text-[10px] text-slate-500">({post.createdAt})</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mt-1.5 leading-snug">
                    {post.title}
                  </h4>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {post.type}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition ${
                      post.userVoted
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{post.upvotes}</span>
                  </button>

                  <span className="flex items-center space-x-1 text-slate-400 text-xs">
                    <Users className="h-3.5 w-3.5 text-teal-400" />
                    <span>{post.participantsCount} Neighbors Joined</span>
                  </span>
                </div>

                <button
                  onClick={() => handleJoin(post.id)}
                  className="px-3 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition"
                >
                  Join Action Pledge
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Neighborhood Leaderboard */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl h-fit space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Award className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Neighborhood Impact Leaderboard</h3>
              <p className="text-[11px] text-slate-400">Monthly community CO₂ & smog offsets</p>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80"
              >
                <div className="flex items-center space-x-3">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    item.rank === 1 ? 'bg-amber-500 text-slate-950' :
                    item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.rank}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white line-clamp-1">{item.name}</h5>
                    <span className="text-[10px] text-slate-400">{item.participants} families active</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">{item.offsetKg.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">kg CO₂ saved</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-950/40 to-teal-950/40 border border-cyan-800/30 rounded-xl p-3 text-center">
            <span className="text-xs text-cyan-300 font-semibold block">Join Your RWA Challenge</span>
            <p className="text-[10px] text-slate-400 mt-1">
              Every habit logged on BreatheEasy contributes to your neighborhood’s clean air rank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
