'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AqiData, FamilyMember } from '@/types';
import { Sparkles, Send, Bot, User, ShieldCheck, Loader2 } from 'lucide-react';
import { askAdvisorAI } from '@/lib/api';

interface AiAdvisorChatProps {
  aqiData: AqiData;
  familyMembers: FamilyMember[];
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
  customApiKey?: string;
}

export const AiAdvisorChat: React.FC<AiAdvisorChatProps> = ({
  aqiData,
  familyMembers,
  externalPrompt,
  onClearExternalPrompt,
  customApiKey
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `👋 Hello! I am **BreatheEasy AI**, your personalized urban air quality & environmental epidemiology advisor.

I am actively tracking real-time conditions for **${aqiData.city}** (AQI: **${aqiData.aqi} - ${aqiData.category}**) with PM2.5 at **${aqiData.pollutants.pm25} µg/m³**, calibrated for your family members: ${familyMembers.map(m => `**${m.name}** (${m.role}, ${m.age}y)`).join(', ')}.

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
      const data = await askAdvisorAI({
        question: query,
        aqiData,
        familyMembers,
        customApiKey
      });

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
        content: `⚠️ Based on current AQI of ${aqiData.aqi} in ${aqiData.city}, avoid outdoor exercise and run indoor air cleaners immediately.`,
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
    <div className="glass-card-strong rounded-3xl flex flex-col h-[750px] shadow-2xl overflow-hidden relative border border-white/80">
      {/* Advisor Context Header */}
      <div className="p-4 bg-white/70 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-sm">
            <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">BreatheEasy GenAI Advisor</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                ● Live Context Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Injected: {aqiData.city} (AQI {aqiData.aqi}) • {familyMembers.length} Family Profiles
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Science-Backed Protocols</span>
        </div>
      </div>

      {/* Suggestion Pills */}
      <div className="px-4 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">Prompts:</span>
        {suggestionPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            className="text-xs bg-white hover:bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full whitespace-nowrap border border-emerald-200 shadow-sm transition"
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
                <div className="h-8 w-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-1 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-2xl rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'glass-card bg-white/90 border border-slate-200 text-slate-800 shadow-sm'
              }`}>
                {/* Formatted Content */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {/* Impact Highlight Card */}
                {msg.impactHighlight && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200/70 flex flex-wrap items-center gap-2 text-[11px]">
                    {msg.impactHighlight.co2SavedKg && (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 font-extrabold">
                        🌱 Impact: Saves ~{msg.impactHighlight.co2SavedKg} kg CO₂
                      </span>
                    )}
                    {msg.impactHighlight.pm25DropPercent && (
                      <span className="px-2.5 py-1 rounded-xl bg-teal-100 text-teal-900 border border-teal-200 font-extrabold">
                        💨 Cuts PM2.5 by ~{msg.impactHighlight.pm25DropPercent}%
                      </span>
                    )}
                  </div>
                )}

                <div className={`flex items-center justify-end mt-2 text-[10px] ${isUser ? 'text-emerald-100' : 'text-slate-400'}`}>
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {isUser && (
                <div className="h-8 w-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="glass-card rounded-2xl p-4 text-xs text-slate-600 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              <span>Analyzing live atmospheric sensors & calculating clinical advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white/80 border-t border-emerald-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder={`Ask BreatheEasy AI about ${aqiData.city} smog, pediatric asthma, or IAQ hacks...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            <span>Ask</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
