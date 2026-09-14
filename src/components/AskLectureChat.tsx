import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  Clock,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  ChevronDown,
  Info
} from 'lucide-react';
import { ChatMessage, Lecture, StudyLanguage } from '../types';
import { sendChatMessage, fetchChatMessages } from '../lib/api';

interface AskLectureChatProps {
  lecture: Lecture;
  onClose?: () => void;
}

export const AskLectureChat: React.FC<AskLectureChatProps> = ({ lecture, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [lecture.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadChatHistory = async () => {
    try {
      const history = await fetchChatMessages(lecture.id);
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Welcome message
        setMessages([
          {
            id: `seed-${lecture.id}`,
            lecture_id: lecture.id,
            sender: 'assistant',
            content: `Hello! I am your AI study assistant for **"${lecture.title}"**. I answer questions using only what was taught in this lecture. Ask me to clarify derivations, explain in simple terms, or quiz you in English, Hindi, or Hinglish!`,
            timestamp: new Date().toISOString(),
            cited_sections: ['Lecture Overview'],
          }
        ]);
      }
    } catch {
      // Fallback initial greeting
      setMessages([
        {
          id: `seed-${lecture.id}`,
          lecture_id: lecture.id,
          sender: 'assistant',
          content: `Hello! I am your AI study companion for **"${lecture.title}"**. Ask me anything taught in this lecture.`,
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  };

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || loading) return;

    setErrorMsg(null);
    setInputQuestion('');

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      lecture_id: lecture.id,
      sender: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        content: m.content,
      }));

      const res = await sendChatMessage(lecture.id, q, historyPayload);
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), res.userMessage, res.assistantMessage]);
    } catch (err: any) {
      console.error('[Chat Error]:', err);
      setErrorMsg(err.message || 'Failed to generate answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `fresh-${Date.now()}`,
        lecture_id: lecture.id,
        sender: 'assistant',
        content: `Chat session refreshed. How can I help you master "${lecture.title}"?`,
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const suggestedPrompts = [
    'Explain this concept in simple language',
    'What did the lecture say about this topic?',
    'Give me an example from the lecture',
    'Quiz me on this chapter',
    'What should I revise first?',
    'Explain this in Hinglish',
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-3.5 bg-[#FAF9F6] border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#12141D] text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900 leading-tight">
              Ask Your Lecture
            </h3>
            <p className="text-[11px] text-stone-500 font-mono truncate max-w-[200px]">
              {lecture.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            title="Clear Chat"
            className="p-1.5 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Grounding Context Banner */}
      <div className="px-3 py-1.5 bg-indigo-50/70 border-b border-indigo-100 flex items-center gap-1.5 text-[11px] text-indigo-950">
        <Info className="w-3 h-3 text-indigo-600 shrink-0" />
        <span className="truncate">Grounded in lecture transcript &bull; Cites sections &amp; timestamps</span>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#12141D] text-white rounded-br-xs'
                    : 'bg-[#FAF9F6] border border-stone-200 text-stone-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Citations and Timestamps */}
                {!isUser && ((msg.cited_timestamps && msg.cited_timestamps.length > 0) || (msg.cited_sections && msg.cited_sections.length > 0)) && (
                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-2 text-[10px] text-stone-500 font-mono">
                    {msg.cited_timestamps?.map((ts, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-stone-200 text-indigo-700">
                        <Clock className="w-2.5 h-2.5" />
                        <span>[{ts}]</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Message sub-bar */}
              {!isUser && (
                <div className="mt-1 flex items-center gap-2 text-[10px] text-stone-400 pl-1">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>&bull;</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-stone-700 inline-flex items-center gap-1"
                  >
                    {copiedId === msg.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-stone-500 p-2 bg-stone-50 rounded-lg w-fit border border-stone-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Consulting lecture material via NVIDIA GPT-OSS 20B...</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 border-t border-stone-100 bg-[#FAF9F6]/50 overflow-x-auto">
        <div className="flex items-center gap-1.5 w-max">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-stone-300 text-[11px] text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap shadow-2xs disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={`Ask about ${lecture.title}...`}
          disabled={loading}
          className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-900 bg-stone-50/50"
        />
        <button
          type="submit"
          disabled={loading || !inputQuestion.trim()}
          className="p-2 rounded-lg bg-[#12141D] text-white hover:bg-stone-800 disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
