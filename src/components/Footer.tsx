import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Code2, Globe } from 'lucide-react';

interface FooterProps {
  onOpenArchInfo: () => void;
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchInfo, onNavigate }) => {
  return (
    <footer className="w-full border-t border-[#E7E5E4] bg-white text-stone-600 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#12141D] flex items-center justify-center text-white">
                <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
              </div>
              <span className="font-semibold text-base tracking-tight text-[#12141D]">
                LECTURA AI
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Transforming authorized educational lectures into structured, masterclass-level study material.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strictly authorized educational use</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-stone-950 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-stone-950 transition-colors">
                  Product Overview
                </button>
              </li>
              <li>
                <span className="text-stone-400">Study Kit Generator</span>
              </li>
              <li>
                <span className="text-stone-400">Flashcards & Quizzes</span>
              </li>
            </ul>
          </div>

          {/* AI Stack */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              AI Infrastructure
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-indigo-500" />
                <span>NVIDIA GPT-OSS 20B (NIM)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Code2 className="w-3 h-3 text-indigo-500" />
                <span>AssemblyAI Speech Pipeline</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-indigo-500" />
                <span>Supabase Auth & Database</span>
              </li>
              <li>
                <button
                  onClick={onOpenArchInfo}
                  className="text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2"
                >
                  View Deployment Spec &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Ethical Disclaimer */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Academic Integrity
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              LECTURA AI does not substitute the teacher or claim infallible transcription. It functions as an analytical study aid synthesizing student-provided and authorized educational content.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>&copy; {new Date().getFullYear()} LECTURA AI. Built for serious students and educators.</p>
          <div className="flex items-center gap-4 text-stone-500">
            <span>English</span>
            <span>&bull;</span>
            <span>Hindi</span>
            <span>&bull;</span>
            <span>Hinglish</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
