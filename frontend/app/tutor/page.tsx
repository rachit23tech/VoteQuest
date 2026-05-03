'use client';

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { useGameStore } from "@/src/store/gameStore";
import { useApi } from "@/src/hooks/useApi";
import { Header } from "@/src/components/Layout/Header";

const SUGGESTIONS = [
  "What is the Election Commission of India?",
  "How does an EVM work?",
  "What is NOTA?",
  "Explain the Model Code of Conduct",
  "How do I register as a voter?",
  "What is VVPAT?",
  "Types of elections in India",
  "What is the 4/5ths rule?",
];

function markdownToHtml(md: string) {
  if (!md) return "";
  return md
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function AiTutor() {
  const [messages, setMessages] = useState<any[]>([
    { role: "model", content: "🗳️ **Hello! I'm ElectoBot**, your AI election tutor powered by Google Gemini!\n\nAsk me anything about the Indian election process — from voter registration to government formation. Every conversation earns you knowledge XP! 🎮\n\nTry one of the suggestions below, or type your own question!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { totalScore } = useGameStore();
  const { chatWithTutor } = useApi();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const data = await chatWithTutor(msg, history);
      setMessages((m) => [...m, { role: "model", content: data.response, model: data.model, status: data.status }]);
    } catch {
      setMessages((m) => [...m, {
        role: "model",
        content: "I'm having trouble connecting to the AI service right now. Here's what I can tell you:\n\n🗳️ The Indian election process involves several key stages: Election Announcement → Nominations → Campaigning → Polling → Counting → Results → Government Formation.\n\nTry again in a moment!",
        status: "fallback",
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E1A]">
      <Header />
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 md:p-6 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-4 mb-6 pt-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <MessageCircle className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">AI Election Tutor</h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400" /> Powered by Google Gemini AI
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-[0_20px_40px_-15px_rgba(0,102,204,0.3)] relative z-10">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-gradient-to-br from-blue-500 to-blue-700" : "bg-gradient-to-br from-indigo-500 to-purple-600"}`}>
                  {msg.role === "user" ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                </div>
                
                <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-lg ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/20" 
                      : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md"
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.content) }} />
                  </div>
                  
                  {msg.status === "fallback" && (
                    <div className="text-[11px] text-amber-500/80 font-medium flex items-center gap-1 mt-1 px-1">
                      <Sparkles size={10} /> Rule-based response (Check GEMINI_API_KEY)
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%] mr-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-400 rounded-tl-none flex items-center gap-3 shadow-lg">
                  <Loader2 size={16} className="animate-spin text-indigo-400" /> 
                  <span className="text-sm font-medium">ElectoBot is thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="p-4 border-t border-slate-800 bg-[#1A2235]/50 backdrop-blur-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Try asking about:</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => sendMessage(s)}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold hover:bg-white/10 hover:text-white transition-all shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-5 bg-black/20 border-t border-white/10 backdrop-blur-md">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-3 relative group"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about elections, voting, or democracy..."
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-slate-500 shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 bottom-2 w-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white disabled:opacity-50 disabled:from-slate-700 disabled:to-slate-800 transition-all hover:brightness-110 shadow-lg"
              >
                <Send size={18} className={input.trim() && !loading ? "translate-x-0.5" : ""} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
