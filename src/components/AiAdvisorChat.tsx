'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AqiData, FamilyMember } from '@/types';
import { Sparkles, Send, Bot, User, ShieldCheck, Flame, Loader2, ArrowRight } from 'lucide-react';

interface AiAdvisorChatProps {
  aqiData: AqiData;
  familyMembers: FamilyMember[];
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const AiAdvisorChat: React.FC<AiAdvisorChatProps> = ({
  aqiData,
  familyMembers,
  externalPrompt,
  onClearExternalPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `👋 Hello! I am **BreatheEasy AI**, your personalized urban air quality & environmental epidemiology advisor.

I am actively tracking conditions for **${aqiData.city}** (AQI: **${aqiData.aqi} - ${aqiData.category}**) and calibrated for your family members: ${familyMembers.map(m => `**${m.name}** (${m.role}, ${m.age}y)`).join(', ')}.

Ask me anything about:
- **Emergency protocols** for children or seniors with respiratory symptoms
- **Low-cost DIY indoor air purification hacks** (e.g., Corsi-Rosenthal boxes)
- **Low-emission commute alternatives** and their exact carbon & PM2.5 savings
- **Safe outdoor & ventilation windows** today`,
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          aqiData,
          familyMembers,
          conversationHistory: messages.slice(-4).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'I analyzed your query based on current PM2.5 levels. Keep windows sealed and prioritize HEPA filtration.',
        timestamp: 'Just now',
        impactHighlight: data.impactHighlight
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Could not connect to the real-time AI engine. Based on current AQI of ${aqiData.aqi} in ${aqiData.city}, avoid outdoor exercise and run indoor air cleaners immediately.`,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (externalPrompt) {
      handleSend(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const suggestionPills = [
    `Child asthma plan for ${aqiData.city} smog`,
    'Step-by-step DIY box fan air purifier hack',
    'Low-emission commute & carbon impact',
    'Is it safe to jog outside today?'
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col h-[750px] shadow-2xl overflow-hidden relative">
      {/* Advisor Context Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">BreatheEasy GenAI Advisor</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                ● Live Context Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Injected: {aqiData.city} (AQI {aqiData.aqi}) • {familyMembers.length} Family Profiles
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>Science-Backed IAQ Protocols</span>
        </div>
      </div>

      {/* Suggestion Pills */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-semibold shrink-0">Prompts:</span>
        {suggestionPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 hover:text-white px-3 py-1 rounded-full whitespace-nowrap border border-slate-700/60 transition"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-lg'
              }`}>
                {/* Formatted Markdown rendering */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {/* Impact Highlight Card */}
                {msg.impactHighlight && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px]">
                    {msg.impactHighlight.co2SavedKg && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        🌱 Quantified Impact: Saves ~{msg.impactHighlight.co2SavedKg} kg CO₂
                      </span>
                    )}
                    {msg.impactHighlight.pm25DropPercent && (
                      <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                        💨 Cuts Inhaled PM2.5 by ~{msg.impactHighlight.pm25DropPercent}%
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end mt-2 text-[10px] text-slate-500">
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {isUser && (
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Synthesizing air quality advice & calculating impact metrics...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder={`Ask BreatheEasy AI about ${aqiData.city} smog, hacks, or family protocols...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <span>Ask</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
