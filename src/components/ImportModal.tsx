import React, { useState, useRef } from 'react';
import {
  X,
  Youtube,
  FileText,
  Mic,
  Video,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Loader2,
  Check,
  FileCode,
  HelpCircle
} from 'lucide-react';
import { SourceType, StudyLanguage, DifficultyLevel } from '../types';
import { uploadMediaForTranscription } from '../lib/api';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLecture: (data: {
    title: string;
    subject: string;
    exam_level?: string;
    preferred_language: StudyLanguage;
    difficulty: DifficultyLevel;
    study_goal?: string;
    source_type: SourceType;
    source_url?: string;
    file_name?: string;
    transcript_text?: string;
  }) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onSubmitLecture,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Source
  const [sourceType, setSourceType] = useState<SourceType>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [transcriptText, setTranscriptText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioTranscriptId, setAudioTranscriptId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Step 2: Lecture Details
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [examLevel, setExamLevel] = useState('Undergraduate / University');
  const [language, setLanguage] = useState<StudyLanguage>('English');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [studyGoal, setStudyGoal] = useState('Deep conceptual mastery and exam readiness');

  // Step 3: Study Kit Preferences
  const [preferences, setPreferences] = useState({
    completeNotes: true,
    simpleExplanations: true,
    revisionSheet: true,
    formulasDefinitions: true,
    practiceQuestions: true,
    flashcards: true,
    mindMap: true,
    timestamps: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // File drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMsg(null);
    // File size limit: 100MB
    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 100MB maximum limit.');
      return;
    }

    setUploadedFile(file);
    if (!title) {
      // Auto-populate title from clean filename
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // If text/srt/vtt, read text immediately
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.srt') || file.name.endsWith('.vtt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setTranscriptText(text);
      };
      reader.readAsText(file);
    } else if (sourceType === 'audio' || sourceType === 'video') {
      // Audio or video file for AssemblyAI
      try {
        setUploadingAudio(true);
        const res = await uploadMediaForTranscription(file);
        setAudioTranscriptId(res.transcriptId);
      } catch (err: any) {
        setErrorMsg(`AssemblyAI audio upload warning: ${err.message}. You can still paste or generate study material.`);
      } finally {
        setUploadingAudio(false);
      }
    }
  };

  const validateYoutube = (url: string) => {
    setYoutubeUrl(url);
    setUrlError(null);
    if (!url.trim()) return;
    const isValid = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.test(url);
    if (!isValid) {
      setUrlError('Please enter a valid YouTube educational lecture URL (e.g. https://www.youtube.com/watch?v=...)');
    }
  };

  const handleLoadSampleTranscript = () => {
    setTitle('MIT 6.006: Dynamic Programming & Optimal Substructure');
    setSubject('Computer Science');
    setExamLevel('Undergraduate / GATE');
    setYoutubeUrl('https://www.youtube.com/watch?v=OQ5jsbhAv_M');
    setTranscriptText(`Welcome to Lecture 19 of 6.006. Today we begin dynamic programming, perhaps the most powerful algorithmic design technique you will learn in this course. Dynamic programming equals recursion plus memoization plus guessing. First, we look at the Fibonacci numbers. The naive recursive algorithm takes exponential time O(2^(n/2)) because it repeatedly solves identical subproblems millions of times. By introducing a memo table, we store the result of each subproblem the first time we solve it. When we encounter that subproblem again, we look up the answer in O(1) time, reducing total time to linear O(n). Next, we formalize the five-step DP recipe: define subproblems, guess the choice, relate subproblem solutions via recurrence, build topological order of subproblems, and solve the original problem. We also examine shortest paths on Directed Acyclic Graphs (DAGs) to see why acyclicity guarantees that our subproblem dependency graph is well-founded.`);
  };

  const handleGenerate = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await onSubmitLecture({
        title: title.trim() || 'Untitled Lecture',
        subject: subject.trim() || 'General Studies',
        exam_level: examLevel,
        preferred_language: language,
        difficulty,
        study_goal: studyGoal,
        source_type: sourceType,
        source_url: youtubeUrl.trim() || undefined,
        file_name: uploadedFile?.name,
        transcript_text: transcriptText.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit lecture for processing');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <span>Step {step} of 4</span>
            <span>&bull;</span>
            <span>
              {step === 1 && 'Choose Source & Content'}
              {step === 2 && 'Lecture Metadata'}
              {step === 3 && 'Study Kit Format'}
              {step === 4 && 'Review & Generate'}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Create Masterclass Study Kit
          </h2>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-indigo-600'
                  : s < step
                  ? 'w-4 bg-stone-900'
                  : 'w-4 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Select Source Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { type: 'youtube', label: 'YouTube URL', icon: Youtube },
                  { type: 'transcript', label: 'Transcript / Text', icon: FileText },
                  { type: 'audio', label: 'Audio File', icon: Mic },
                  { type: 'video', label: 'Authorized Video', icon: Video },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = sourceType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setSourceType(item.type as SourceType);
                        setErrorMsg(null);
                      }}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-600'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-stone-500'}`} />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* YouTube Workflow */}
            {sourceType === 'youtube' && (
              <div className="space-y-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    YouTube Educational Lecture URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => validateYoutube(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                  />
                  {urlError && <p className="text-[11px] text-red-600 mt-1">{urlError}</p>}
                </div>

                <div className="p-3 rounded-lg bg-white border border-stone-200 text-xs text-stone-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                    <Info className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Authorized Captions &amp; Transcripts</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-500">
                    In compliance with intellectual property standards, LECTURA AI does not scrape or rip video content. You can paste the video transcript below or click sample to autofill.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-800">
                      Lecture Captions / Transcript (Required for analysis)
                    </label>
                    <button
                      type="button"
                      onClick={handleLoadSampleTranscript}
                      className="text-[11px] text-indigo-700 hover:underline font-medium"
                    >
                      Load Sample MIT Lecture Transcript
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder="Paste timestamped transcript, professor notes, or video captions here..."
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Direct Transcript Text / File */}
            {sourceType === 'transcript' && (
              <div className="space-y-3">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.srt,.vtt,.md"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && processSelectedFile(e.target.files[0])}
                  />
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-800">
                    {uploadedFile ? uploadedFile.name : 'Drop transcript file here, or click to browse'}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Supports .txt, .srt, .vtt up to 50MB
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Or Paste Raw Transcript Text</label>
                    <button
                      type="button"
                      onClick={handleLoadSampleTranscript}
                      className="text-[11px] text-indigo-700 hover:underline font-medium"
                    >
                      Load Sample
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder="Paste lecture text or transcript here..."
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Audio / Video Upload via AssemblyAI */}
            {(sourceType === 'audio' || sourceType === 'video') && (
              <div className="space-y-3">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={sourceType === 'audio' ? '.mp3,.wav,.m4a,.aac,.ogg' : '.mp4,.webm,.mov'}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && processSelectedFile(e.target.files[0])}
                  />
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-800">
                    {uploadedFile ? uploadedFile.name : `Drop ${sourceType} recording here, or click to browse`}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {sourceType === 'audio' ? 'MP3, WAV, M4A up to 100MB' : 'MP4, WebM up to 100MB'}
                  </p>
                </div>

                {uploadingAudio && (
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Uploading to AssemblyAI speech pipeline...</span>
                  </div>
                )}

                {audioTranscriptId && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>AssemblyAI transcription queued (ID: {audioTranscriptId.slice(0, 8)}...)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Lecture Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Dynamic Programming"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Computer Science, Physics, Economics"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Class / Exam Level
                </label>
                <input
                  type="text"
                  value={examLevel}
                  onChange={(e) => setExamLevel(e.target.value)}
                  placeholder="e.g. University Undergraduate, GATE, AP"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Preferred Study Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as StudyLanguage)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white text-stone-800"
                >
                  <option value="English">English (Standard Academic)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Hinglish">Hinglish (Conversational Blend)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white text-stone-800"
                >
                  <option value="Beginner">Beginner (Foundational definitions)</option>
                  <option value="Intermediate">Intermediate (Core theoretical depth)</option>
                  <option value="Advanced">Advanced (Rigorous proofs &amp; edge cases)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Specific Study Goal
              </label>
              <input
                type="text"
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                placeholder="e.g. Master recurrence relations for upcoming midterm"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Configure which artifacts should be synthesized into this lecture's master study kit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'completeNotes', label: 'Topic-wise Complete Notes', desc: 'Headings, definitions, teacher examples, code/math' },
                { key: 'simpleExplanations', label: 'Concept Explanations', desc: 'Step-by-step breakdown and common confusions' },
                { key: 'revisionSheet', label: 'Rapid Revision Sheet', desc: 'High-value formulas and last-minute checklist' },
                { key: 'formulasDefinitions', label: 'Formulas & Definitions', desc: 'Extracted mathematical and scientific notation' },
                { key: 'practiceQuestions', label: 'Practice Questions', desc: 'MCQs, conceptual, and application exercises' },
                { key: 'flashcards', label: 'Interactive Flashcards', desc: '3D flip cards with difficulty tags' },
                { key: 'mindMap', label: 'Visual Mind Map', desc: 'Hierarchical node tree with accessible outline' },
                { key: 'timestamps', label: 'Timestamp References', desc: 'Preserves real audio marks whenever available' },
              ].map((item) => {
                const isChecked = (preferences as any)[item.key];
                return (
                  <label
                    key={item.key}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      isChecked ? 'border-stone-900 bg-stone-50/50' : 'border-stone-200 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setPreferences({ ...preferences, [item.key]: e.target.checked })
                      }
                      className="mt-0.5 rounded text-stone-900 focus:ring-stone-900"
                    />
                    <div>
                      <span className="text-xs font-semibold text-stone-900 block">{item.label}</span>
                      <span className="text-[11px] text-stone-500 leading-tight block">{item.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
              <h4 className="font-bold text-stone-900 text-sm">Review Synthesis Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-stone-600">
                <div>
                  <span className="text-stone-400 block">Lecture Title:</span>
                  <strong className="text-stone-800">{title || 'Untitled Lecture'}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Subject:</span>
                  <strong className="text-stone-800">{subject || 'General'}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Source:</span>
                  <strong className="text-stone-800 capitalize">{sourceType}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Study Language:</span>
                  <strong className="text-stone-800">{language}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Difficulty:</span>
                  <strong className="text-stone-800">{difficulty}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Transcript Length:</span>
                  <strong className="text-stone-800">
                    {transcriptText ? `${transcriptText.split(/\s+/).length} words` : 'From source media'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>NVIDIA GPT-OSS 20B Synthesis Plan</span>
              </div>
              <p className="text-[11px] text-indigo-900 leading-relaxed">
                The platform will now construct topic-wise notes, detailed explanations, practice problems, 3D flashcards, and a DAG mind map. Processing runs asynchronously in the background.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !transcriptText.trim() && !youtubeUrl.trim() && !uploadedFile) {
                  setErrorMsg('Please provide a YouTube URL, transcript text, or uploaded file to continue.');
                  return;
                }
                if (step === 2 && !title.trim()) {
                  setErrorMsg('Please enter a lecture title.');
                  return;
                }
                setErrorMsg(null);
                setStep((s) => (s + 1) as any);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#12141D] text-white text-xs font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#12141D] text-white text-xs font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Initiating Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Generate Study Kit</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
