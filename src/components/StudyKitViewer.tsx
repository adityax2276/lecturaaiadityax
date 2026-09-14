import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  FileText,
  HelpCircle,
  Network,
  Clock,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Check,
  Layers,
  Code2
} from 'lucide-react';
import { Lecture, StudyKitTab, TranscriptSegment } from '../types';
import { FlashcardDeck } from './FlashcardDeck';
import { QuizView } from './QuizView';
import { MindMapCanvas } from './MindMapCanvas';
import { AskLectureChat } from './AskLectureChat';

interface StudyKitViewerProps {
  lecture: Lecture;
  onBack: () => void;
}

export const StudyKitViewer: React.FC<StudyKitViewerProps> = ({ lecture, onBack }) => {
  const [activeTab, setActiveTab] = useState<StudyKitTab>('notes');
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const kit = lecture.study_kit;

  // Handle Export Markdown
  const handleExportMarkdown = () => {
    if (!kit) return;
    let md = `# ${lecture.title}\n`;
    md += `**Subject:** ${lecture.subject} | **Language:** ${lecture.preferred_language} | **Level:** ${lecture.exam_level || 'N/A'}\n\n`;
    md += `---\n\n## Overview\n${kit.overview}\n\n`;

    md += `## Topic Notes\n\n`;
    kit.notes.forEach((t) => {
      md += `### ${t.title} ${t.timestamp_ref ? `[${t.timestamp_ref}]` : ''}\n`;
      md += `${t.summary}\n\n`;
      if (t.key_points && t.key_points.length > 0) {
        md += `**Key Points:**\n`;
        t.key_points.forEach((kp) => (md += `- ${kp}\n`));
        md += `\n`;
      }
      if (t.important_definitions && t.important_definitions.length > 0) {
        md += `**Definitions:**\n`;
        t.important_definitions.forEach((d) => (md += `- **${d.term}**: ${d.definition}\n`));
        md += `\n`;
      }
    });

    md += `## Quick Revision Takeaways\n`;
    kit.revision_sheet.high_value_points.forEach((k) => (md += `- ${k}\n`));
    md += `\n`;

    md += `## Critical Formulas\n`;
    kit.revision_sheet.formula_list.forEach((f) => {
      md += `### ${f.name}\n\`${f.formula}\`\n${f.note ? `Note: ${f.note}\n` : ''}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${lecture.title.replace(/\s+/g, '_')}_StudyKit.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  if (!kit) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Study Kit In Progress</h2>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          {lecture.status_message || 'The AI synthesizer is currently constructing this study kit. Please check back shortly.'}
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono">
                  {lecture.subject}
                </span>
                <span className="text-[11px] text-stone-400">&bull;</span>
                <span className="text-[11px] text-stone-500">{lecture.preferred_language}</span>
                {lecture.duration_formatted && (
                  <>
                    <span className="text-[11px] text-stone-400">&bull;</span>
                    <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lecture.duration_formatted}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                {lecture.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportMarkdown}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors"
              title="Export formatted Markdown for Notion or Obsidian"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors"
              title="Print study sheet"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
              title="Copy shareable link"
            >
              {copiedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowChatPanel(!showChatPanel)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                showChatPanel
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-[#12141D] text-white hover:bg-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>{showChatPanel ? 'Hide AI Assistant' : 'Ask Lecture'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-stone-100">
          {[
            { id: 'notes', label: 'Structured Notes', icon: FileText, count: kit.notes.length },
            { id: 'concepts', label: 'Concept Teardown', icon: Sparkles, count: kit.concept_explanations.length },
            { id: 'revision', label: 'Revision Sheet', icon: Layers },
            { id: 'questions', label: 'Practice Questions', icon: HelpCircle, count: kit.practice_questions.length },
            { id: 'flashcards', label: 'Flashcards', icon: BookOpen, count: kit.flashcards.length },
            { id: 'mindmap', label: 'Visual Mind Map', icon: Network },
            { id: 'transcript', label: 'Transcript & Timestamps', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudyKitTab)}
                className={`inline-flex items-center gap-2 py-3 px-3.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-stone-950 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-indigo-100 text-indigo-900' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area + Optional AI Chat Split View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8 w-full">
        {/* Left/Main Study Pane */}
        <div className={`flex-1 transition-all ${showChatPanel ? 'lg:max-w-[62%]' : 'w-full'}`}>
          {/* Missing Information Callout (Explicit Integrity Policy) */}
          {kit.missing_or_uncertain_info && kit.missing_or_uncertain_info.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pedagogical Integrity Notice (Missing or Incomplete Content)</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-amber-900 text-[11px] leading-relaxed">
                {kit.missing_or_uncertain_info.map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ================= TAB: NOTES ================= */}
          {activeTab === 'notes' && (
            <div className="space-y-8 max-w-3xl">
              {/* Executive Summary */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Executive Lecture Summary
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed font-serif">
                  {kit.overview}
                </p>
              </div>

              {/* Topic-Wise Structured Sections */}
              <div className="space-y-6">
                {kit.notes.map((topic) => (
                  <article
                    key={topic.id}
                    className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <h3 className="text-base sm:text-lg font-bold text-stone-900">
                        {topic.title}
                      </h3>
                      {topic.timestamp_ref && (
                        <span className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>[{topic.timestamp_ref}]</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line font-sans">
                      {topic.summary}
                    </div>

                    {/* Key points */}
                    {topic.key_points && topic.key_points.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-semibold text-stone-900 block mb-1">
                          Core Takeaways &amp; Concepts:
                        </span>
                        <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                          {topic.key_points.map((k, kIdx) => (
                            <li key={kIdx}>{k}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Important Definitions */}
                    {topic.important_definitions && topic.important_definitions.length > 0 && (
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <span className="text-xs font-semibold text-stone-900 block">
                          Formal Definitions:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {topic.important_definitions.map((def, dIdx) => (
                            <div key={dIdx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                              <strong className="text-stone-900 block mb-0.5">{def.term}</strong>
                              <span className="text-stone-600">{def.definition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Teacher's Real Analogies or Examples */}
                    {topic.teacher_examples && topic.teacher_examples.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">
                          Instructor's Key Analogy &amp; Example:
                        </span>
                        {topic.teacher_examples.map((ex, exIdx) => (
                          <p key={exIdx} className="text-xs text-indigo-950 italic leading-relaxed">
                            "{ex}"
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Formula or Code */}
                    {topic.formula_or_code && topic.formula_or_code.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {topic.formula_or_code.map((fc, fcIdx) => (
                          <div key={fcIdx} className="p-3.5 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs space-y-1">
                            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-sans uppercase">
                              <Code2 className="w-3 h-3 text-indigo-400" />
                              <span>{fc.title}</span>
                            </div>
                            <pre className="overflow-x-auto whitespace-pre-wrap">{fc.content}</pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Relationships */}
                    {topic.relationships && topic.relationships.length > 0 && (
                      <div className="pt-2 text-xs text-stone-500 font-mono">
                        <span className="font-semibold text-stone-700">Dependency Links: </span>
                        {topic.relationships.join(' &bull; ')}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: CONCEPTS ================= */}
          {activeTab === 'concepts' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
                Deep architectural breakdowns of pivotal lecture concepts, designed to eliminate textbook ambiguity.
              </div>

              {kit.concept_explanations.map((concept) => (
                <div
                  key={concept.id}
                  className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 className="text-base font-bold text-stone-900">{concept.concept_name}</h3>
                    <span className="text-[11px] font-mono text-stone-400">Concept Teardown</span>
                  </div>

                  {/* What it means */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
                      1. What It Means
                    </span>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                      {concept.what_it_means}
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      2. Why It Matters
                    </span>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {concept.why_it_matters}
                    </p>
                  </div>

                  {/* Step by step breakdown */}
                  {concept.step_by_step && concept.step_by_step.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                        3. Step-By-Step Mechanics
                      </span>
                      <ol className="list-decimal pl-5 space-y-1 text-xs text-stone-700">
                        {concept.step_by_step.map((st, sIdx) => (
                          <li key={sIdx}>{st}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Lecture example */}
                  {concept.lecture_example && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                      <strong className="block text-stone-900 mb-0.5">Lecture Example:</strong>
                      <span>{concept.lecture_example}</span>
                    </div>
                  )}

                  {/* Common Student Confusion */}
                  {concept.common_confusion && (
                    <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 text-xs text-red-950 space-y-1">
                      <strong className="font-semibold block text-red-900">
                        Common Student Trap / Misconception:
                      </strong>
                      <p className="text-[11px] leading-relaxed text-red-900">
                        {concept.common_confusion}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ================= TAB: REVISION ================= */}
          {activeTab === 'revision' && (
            <div className="space-y-6 max-w-3xl">
              {/* Key Takeaways */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-stone-900">
                  High-Yield Takeaways
                </h3>
                <ul className="space-y-2">
                  {kit.revision_sheet.high_value_points.map((k, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{k}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formulas & Definitions */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Formulas &amp; Recurrence Relations
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {kit.revision_sheet.formula_list.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-stone-50/70 border border-stone-200 space-y-2"
                    >
                      <strong className="text-stone-900 text-xs block">{item.name}</strong>
                      <div className="p-2.5 bg-white rounded border border-stone-200 font-mono text-xs text-indigo-950 font-semibold">
                        {item.formula}
                      </div>
                      {item.note && (
                        <p className="text-[11px] text-stone-500">
                          {item.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Definitions */}
              {kit.revision_sheet.critical_definitions && (
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-stone-900">Critical Definitions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {kit.revision_sheet.critical_definitions.map((cd, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs space-y-1">
                        <strong className="text-stone-900 block">{cd.term}</strong>
                        <p className="text-stone-600 text-[11px]">{cd.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last-Minute Exam Checklist */}
              {kit.revision_sheet.last_minute_checklist && (
                <div className="p-6 rounded-2xl bg-indigo-50/40 border border-indigo-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-indigo-950">
                    Pre-Exam Rapid Checklist
                  </h3>
                  <ul className="space-y-2">
                    {kit.revision_sheet.last_minute_checklist.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-indigo-950">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: PRACTICE QUESTIONS ================= */}
          {activeTab === 'questions' && (
            <QuizView questions={kit.practice_questions} />
          )}

          {/* ================= TAB: FLASHCARDS ================= */}
          {activeTab === 'flashcards' && (
            <FlashcardDeck cards={kit.flashcards} />
          )}

          {/* ================= TAB: MIND MAP ================= */}
          {activeTab === 'mindmap' && (
            <MindMapCanvas rootNode={kit.mind_map} />
          )}

          {/* ================= TAB: TRANSCRIPT & TIMESTAMPS ================= */}
          {activeTab === 'transcript' && (
            <div className="space-y-4 max-w-3xl">
              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
                Complete timestamped speech segments synchronized with video milestones.
              </div>

              {lecture.transcript?.segments && lecture.transcript.segments.length > 0 ? (
                <div className="space-y-2">
                  {lecture.transcript.segments.map((seg: TranscriptSegment) => (
                    <div
                      key={seg.id}
                      className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-indigo-200 transition-colors flex items-start gap-4 text-xs group"
                    >
                      <span className="font-mono text-[11px] text-stone-400 group-hover:text-indigo-600 shrink-0 mt-0.5">
                        [{seg.timestamp}]
                      </span>
                      <p className="text-stone-700 leading-relaxed">
                        {seg.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-xs text-stone-500">
                  Raw transcript text was provided directly without segmented timestamps.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Pane: AI Chat Assistant Grounded in Lecture */}
        {showChatPanel && (
          <aside className="w-full lg:w-[38%] h-[600px] lg:h-[calc(100vh-140px)] sticky top-24 shrink-0 animate-in fade-in">
            <AskLectureChat
              lecture={lecture}
              onClose={() => setShowChatPanel(false)}
            />
          </aside>
        )}
      </div>
    </div>
  );
};
