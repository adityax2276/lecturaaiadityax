import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Sparkles,
  Layers,
  HelpCircle,
  Network,
  Clock,
  Shield,
  UploadCloud,
  Youtube,
  Mic,
  Cpu,
  Search,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { SAMPLE_LECTURE } from '../data/sampleLectures';

interface LandingPageProps {
  onStartLearning: () => void;
  onOpenSampleLecture: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onOpenSampleLecture,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'notes' | 'flashcards' | 'quiz' | 'mindmap'>('notes');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does LECTURA AI differ from standard AI summarizers?',
      a: 'Basic AI tools collapse a 2-hour lecture into 5 generic bullet points, losing the actual derivations, teacher examples, counter-arguments, and formulas. LECTURA AI treats lectures as comprehensive learning artifacts: it synthesizes topic-wise structured notes, step-by-step concept explanations, formulas, interactive flashcards, practice questions, and mind maps without omitting critical subject matter.'
    },
    {
      q: 'How are YouTube lecture URLs handled?',
      a: 'In accordance with intellectual property laws and platform policies, LECTURA AI processes authorized educational URLs with available user-provided captions or transcripts. We do not download or bypass copyrighted videos without authorization.'
    },
    {
      q: 'What languages are supported?',
      a: 'You can study in English, Hindi, or Hinglish (conversational Hindi-English blend). Technical terms and mathematical formulas remain intact while explanations adapt to your chosen learning language.'
    },
    {
      q: 'What AI models power the intelligence pipeline?',
      a: 'Speech transcription is handled asynchronously by AssemblyAI, capturing audio timestamps with precision. Synthesis and curriculum extraction are powered by the NVIDIA GPT-OSS 20B engine via NVIDIA NIM, specifically tuned for long-form reasoning and educational structuring.'
    },
    {
      q: 'Can the AI replace my classroom professor?',
      a: 'No. LECTURA AI is an analytical study accelerator, not an instructor replacement. It helps you prepare, revise, and test yourself on lecture content, and explicitly flags any ambiguous or missing details.'
    }
  ];

  return (
    <div className="w-full bg-[#FAF9F6] text-[#12141D] flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>NVIDIA NIM &amp; AssemblyAI Educational Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#12141D] leading-[1.15]">
              Turn hours of lectures <br />
              <span className="font-editorial italic font-normal text-indigo-950">
                into structured clarity.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              LECTURA AI transforms authorized educational YouTube lectures, user-provided recordings, and transcripts into complete, masterclass-level study kits. Understand the entire lecture without repeatedly scrubbing through two hours of video.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="hero-cta-start"
                onClick={onStartLearning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#12141D] text-white text-sm font-medium hover:bg-[#202434] transition-all shadow-sm active:scale-[0.98]"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-cta-preview"
                onClick={onOpenSampleLecture}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-sm font-medium hover:bg-stone-50 transition-colors shadow-xs"
              >
                <span>Explore Interactive Sample (MIT Algorithms)</span>
              </button>
            </div>
          </div>

          {/* Abstract Educational Transformation Visual */}
          <div className="mt-14 max-w-5xl mx-auto relative">
            <div className="rounded-xl border border-stone-200 bg-white p-6 md:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-stone-400 pl-2 font-mono">LECTURA AI Transformation Engine</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pipeline Live</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Stage 1: Raw Unstructured Lecture */}
                <div className="p-4 rounded-lg bg-[#FAF9F6] border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                    <span>1. RAW LECTURE</span>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-stone-800 font-medium truncate">
                    MIT 6.006: Dynamic Programming
                  </div>
                  <div className="space-y-1.5 text-[11px] text-stone-500 font-mono bg-white p-2.5 rounded border border-stone-100">
                    <p className="line-clamp-2">"Today we begin dynamic programming... fibonacci numbers... naive recursion is O(2^(n/2))..."</p>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-3/4" />
                    </div>
                    <span className="text-[10px] text-stone-400">Duration: 52m 18s</span>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex flex-col items-center justify-center py-2 text-center text-xs text-stone-500">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[11px]">NVIDIA GPT-OSS 20B</span>
                  <span className="text-[10px] text-stone-400">Structured Synthesis</span>
                </div>

                {/* Stage 2: Masterclass Study Kit */}
                <div className="p-4 rounded-lg bg-indigo-50/40 border border-indigo-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                    <span>2. STRUCTURED STUDY KIT</span>
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="space-y-1.5 text-xs text-stone-700">
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded border border-indigo-100 text-[11px]">
                      <FileText className="w-3 h-3 text-indigo-600" />
                      <span>5-Step MIT DP Recipe &amp; Proofs</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded border border-indigo-100 text-[11px]">
                      <Network className="w-3 h-3 text-indigo-600" />
                      <span>DAG Subproblem Hierarchy Map</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded border border-indigo-100 text-[11px]">
                      <HelpCircle className="w-3 h-3 text-indigo-600" />
                      <span>4 Practice Quizzes + 5 Flashcards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Systematic Workflow
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              From continuous speech to coherent knowledge
            </h2>
            <p className="text-sm text-stone-600">
              Three transparent steps that preserve academic rigor without overwhelming you with noise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-stone-200 bg-[#FAF9F6] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-semibold text-stone-900">
                Input Authorized Source
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Paste an educational YouTube lecture URL with captions, upload an audio recording (.mp3, .m4a), or submit a transcript file (.txt, .srt).
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-stone-200 text-stone-600">YouTube Captions</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-stone-200 text-stone-600">AssemblyAI Audio</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-stone-200 text-stone-600">Transcripts</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-[#FAF9F6] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-semibold text-stone-900">
                Deep Structural Synthesis
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                NVIDIA GPT-OSS 20B analyzes the transcript in pedagogical segments, extracting central axioms, mathematical definitions, teacher examples, and core relationships.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700">No Fluff</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700">Preserves Formulas</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700">Flags Missing Info</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-[#FAF9F6] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-semibold text-stone-900">
                Multi-Format Study Kit
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Study in whatever medium suits your workflow: read in-depth topic notes, review flashcards, test yourself with practice questions, or inspect the mind map.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-stone-200 text-stone-600">Interactive Quiz</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-stone-200 text-stone-600">3D Flashcards</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-white border border-stone-200 text-stone-600">Grounded AI Chat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STUDY MATERIAL FORMATS */}
      <section className="py-20 bg-[#FAF9F6] border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Complete Educational Artifacts
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Engineered for genuine academic retention
            </h2>
            <p className="text-sm text-stone-600">
              Each study kit provides multiple angles of comprehension so you can master the lecture independently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Topic-Wise Complete Notes</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Headings, subheadings, teacher's precise analogies, mathematical definitions, and conceptual dependencies structured logically.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Deep Concept Explanations</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated teardowns explaining what it means, why it matters, step-by-step breakdown, and common student confusion points.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Quick Revision Sheet</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                High-value takeaways, formula lists, essential definitions, and a last-minute pre-exam review checklist.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Practice Questions &amp; MCQs</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Instant interactive scoring with detailed rationales, conceptual questions, and application exercises grounded in source material.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Interactive 3D Flashcards</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Flip cards with topic tagging, difficulty tiers, keyboard shortcuts (Space to flip, Arrows to advance), and shuffle.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <Network className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-stone-900 text-base">Visual Mind Map</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Interactive node hierarchy showing concept relations, zoomable tree view, and an accessible text outline alternative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PRODUCT PREVIEW */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Live Artifact Preview
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Inspect a real synthesized study kit
            </h2>
            <p className="text-sm text-stone-600">
              Preview how MIT 6.006 Lecture 19 on Dynamic Programming is organized inside LECTURA AI.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-[#FAF9F6] shadow-xs overflow-hidden">
            {/* Header bar */}
            <div className="p-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-indigo-700 font-mono">MIT 6.006</span>
                <h3 className="text-sm font-bold text-stone-900">{SAMPLE_LECTURE.title}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePreviewTab('notes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activePreviewTab === 'notes' ? 'bg-[#12141D] text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActivePreviewTab('flashcards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activePreviewTab === 'flashcards' ? 'bg-[#12141D] text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Flashcards
                </button>
                <button
                  onClick={() => setActivePreviewTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activePreviewTab === 'quiz' ? 'bg-[#12141D] text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Practice Quiz
                </button>
                <button
                  onClick={() => setActivePreviewTab('mindmap')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activePreviewTab === 'mindmap' ? 'bg-[#12141D] text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Mind Map
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 md:p-8 min-h-[320px]">
              {activePreviewTab === 'notes' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="p-4 rounded-lg bg-white border border-stone-200">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-stone-900">The 5-Step MIT DP Recipe</span>
                      <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-700">[08:11]</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3">
                      Every dynamic programming problem decomposes cleanly into five standardized execution steps:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs text-stone-700">
                      <li><strong>Define Subproblems:</strong> Identify state parameters (prefixes, suffixes, substrings) and calculate total subproblems |S|.</li>
                      <li><strong>Guess the Choice:</strong> Determine the transition choice to make at each subproblem.</li>
                      <li><strong>Relate Subproblems:</strong> Formulate the mathematical recurrence relation.</li>
                      <li><strong>Recurse &amp; Memoize / Tabulate:</strong> Ensure subproblem dependencies form a DAG.</li>
                      <li><strong>Solve Original Problem:</strong> Extract the target answer from table or memo cache.</li>
                    </ol>
                  </div>
                  <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-950 font-mono">
                    <strong>Master Running Time:</strong> Total Time = (Number of Subproblems |S|) × (Time per subproblem excluding recursive calls)
                  </div>
                </div>
              )}

              {activePreviewTab === 'flashcards' && (
                <div className="max-w-md mx-auto p-6 rounded-xl bg-white border border-stone-200 shadow-sm text-center space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600">DP Fundamentals</span>
                    <span>Card 1 of 5</span>
                  </div>
                  <div className="py-6">
                    <p className="text-sm font-semibold text-stone-900">
                      What are the two core prerequisites for a problem to be solvable via Dynamic Programming?
                    </p>
                    <p className="text-xs text-stone-400 mt-2 font-mono">Click card or spacebar to flip</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-700 text-left border border-stone-100">
                    <strong>Answer:</strong> 1. Optimal Substructure (optimal solution contains optimal sub-solutions). 2. Overlapping Subproblems (subproblems are repeated rather than always distinct).
                  </div>
                </div>
              )}

              {activePreviewTab === 'quiz' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-stone-900">Question 1 &bull; MCQ</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">Easy</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 font-medium">
                      What is the exact time complexity of computing the n-th Fibonacci number using naive recursion without memoization?
                    </p>
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="p-2.5 rounded border border-stone-200 bg-stone-50 text-stone-600">A. O(n)</div>
                      <div className="p-2.5 rounded border border-emerald-400 bg-emerald-50 text-emerald-900 font-medium flex items-center justify-between">
                        <span>B. O(2^(n/2)) or Θ(φ^n) where φ is the golden ratio</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="p-2.5 rounded border border-stone-200 bg-stone-50 text-stone-600">C. O(n²)</div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'mindmap' && (
                <div className="max-w-2xl mx-auto p-5 rounded-xl bg-white border border-stone-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                    <Network className="w-4 h-4 text-indigo-600" />
                    <span>Dynamic Programming Hierarchy</span>
                  </div>
                  <div className="pl-4 border-l-2 border-indigo-200 space-y-2 pt-2">
                    <div>
                      <span className="font-medium text-stone-900">&bull; Core Principles</span>
                      <p className="text-[11px] text-stone-500 pl-3">Optimal Substructure &bull; Overlapping Subproblems</p>
                    </div>
                    <div>
                      <span className="font-medium text-stone-900">&bull; MIT 5-Step Recipe</span>
                      <p className="text-[11px] text-stone-500 pl-3">1. Subproblems &rarr; 2. Guess &rarr; 3. Recurrence &rarr; 4. Recurse/Memoize &rarr; 5. Solve Original</p>
                    </div>
                    <div>
                      <span className="font-medium text-stone-900">&bull; DAG Dependency Verification</span>
                      <p className="text-[11px] text-stone-500 pl-3">Vertices = Subproblems &bull; Edges = Dependencies &bull; Acyclic check</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-100/70 border-t border-stone-200 text-center">
              <button
                onClick={onOpenSampleLecture}
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-900 hover:text-indigo-950 underline underline-offset-4"
              >
                Launch full interactive study cockpit with AI Chat &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & PRIVACY */}
      <section className="py-20 bg-[#FAF9F6] border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Engineered with integrity and privacy
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            We adhere strictly to authorized content workflows. Each student's notes, uploaded transcripts, and chat queries are isolated through Supabase Row-Level Security (RLS) policies. No secret keys or credentials are ever exposed to the client.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-left">
            <div className="p-4 rounded-lg bg-white border border-stone-200">
              <h5 className="font-semibold text-stone-900 mb-1">Strict User Isolation</h5>
              <p className="text-stone-500">Row-Level Security guarantees only you can query and access your personal study kits.</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-stone-200">
              <h5 className="font-semibold text-stone-900 mb-1">Zero Video Scraping</h5>
              <p className="text-stone-500">We do not bypass DRM or scrape restricted video feeds. Authorized transcripts and audio only.</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-stone-200">
              <h5 className="font-semibold text-stone-900 mb-1">Uncertainty Transparency</h5>
              <p className="text-stone-500">The AI explicitly highlights any missing or ambiguous sections rather than inventing claims.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Common Questions
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-stone-200 bg-[#FAF9F6] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-medium text-sm text-stone-900 hover:bg-stone-100/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 bg-[#12141D] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to reclaim your study hours?
          </h2>
          <p className="text-sm text-stone-400 max-w-xl mx-auto">
            Experience genuine lecture comprehension. Transform your next video lecture or transcript into an exhaustive study kit right now.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white text-[#12141D] text-sm font-semibold hover:bg-stone-100 transition-colors shadow-sm"
            >
              Start Learning Now
            </button>
            <button
              onClick={onOpenSampleLecture}
              className="w-full sm:w-auto px-5 py-3 rounded-lg border border-stone-700 text-stone-300 text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Open MIT Dynamic Programming Kit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
