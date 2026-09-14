import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Trash2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Youtube,
  FileText,
  Mic,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Flame,
  Globe
} from 'lucide-react';
import { Lecture, ProcessingStatus, UserProfile } from '../types';

interface DashboardProps {
  lectures: Lecture[];
  user: UserProfile | null;
  onOpenImport: () => void;
  onOpenLecture: (lecture: Lecture) => void;
  onDeleteLecture: (id: string) => void;
  onLoadSample: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lectures,
  user,
  onOpenImport,
  onOpenLecture,
  onDeleteLecture,
  onLoadSample,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);

  // Derive unique subjects
  const subjects = Array.from(new Set(lectures.map(l => l.subject))).filter(Boolean);

  // Filtered lectures
  const filteredLectures = lectures.filter(lec => {
    const matchesSearch =
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || lec.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || lec.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Metrics
  const totalLectures = lectures.length;
  const completedCount = lectures.filter(l => l.status === 'completed').length;
  const processingCount = lectures.filter(l => l.status !== 'completed' && l.status !== 'failed').length;

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 text-red-500" />;
      case 'audio':
        return <Mic className="w-3.5 h-3.5 text-blue-500" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: ProcessingStatus, progress: number) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="capitalize">{status} ({progress}%)</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-sans">
            {user?.full_name ? `Welcome, ${user.full_name}` : 'Lecture Study Cockpit'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Synthesized study kits, practice questions, and grounded AI inquiry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-new-study-kit"
            onClick={onOpenImport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#12141D] text-white text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Study Kit</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Lectures</span>
          <div className="text-2xl font-bold text-stone-900">{totalLectures}</div>
          <p className="text-[11px] text-stone-500">Registered lectures</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Ready To Study</span>
          <div className="text-2xl font-bold text-stone-900">{completedCount}</div>
          <p className="text-[11px] text-stone-500">Kits synthesized</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Processing Jobs</span>
          <div className="text-2xl font-bold text-stone-900">{processingCount}</div>
          <p className="text-[11px] text-stone-500">AI analysis active</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Language Pipeline</span>
          <div className="text-sm font-bold text-stone-900 pt-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>EN / HI / Hinglish</span>
          </div>
          <p className="text-[11px] text-stone-500">NVIDIA GPT-OSS 20B</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search lectures or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-stone-900 bg-stone-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs rounded-lg border border-stone-200 bg-stone-50/50 text-stone-700 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs rounded-lg border border-stone-200 bg-stone-50/50 text-stone-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="generating">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-stone-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            No lectures found
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Get started by creating your first lecture study kit from a YouTube lecture transcript, audio recording, or syllabus text.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onOpenImport}
              className="px-4 py-2 rounded-lg bg-[#12141D] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Create Study Kit
            </button>
            <button
              onClick={onLoadSample}
              className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors"
            >
              Load MIT 6.006 Sample
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture.id}
              className="rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all p-5 shadow-xs flex flex-col justify-between group"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                    {getSourceIcon(lecture.source_type)}
                    <span className="capitalize">{lecture.source_type}</span>
                  </div>
                  {getStatusBadge(lecture.status, lecture.progress_percent)}
                </div>

                {/* Title & Subject */}
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-indigo-950 transition-colors line-clamp-2 mb-1.5">
                  {lecture.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                  <span className="font-medium text-stone-700">{lecture.subject}</span>
                  <span>&bull;</span>
                  <span>{lecture.preferred_language}</span>
                  {lecture.duration_formatted && (
                    <>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {lecture.duration_formatted}
                      </span>
                    </>
                  )}
                </div>

                {/* Progress bar if ongoing */}
                {lecture.status !== 'completed' && lecture.status !== 'failed' && (
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span className="truncate">{lecture.status_message || 'Processing...'}</span>
                      <span>{lecture.progress_percent}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-300"
                        style={{ width: `${lecture.progress_percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {new Date(lecture.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLectureToDelete(lecture)}
                    className="p-1.5 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete lecture"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenLecture(lecture)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#12141D] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                  >
                    <span>Open Kit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {lectureToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-stone-900">Delete Lecture Study Kit?</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete <strong>"{lectureToDelete.title}"</strong>? This will permanently remove its synthesized notes, questions, flashcards, and chat history.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setLectureToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteLecture(lectureToDelete.id);
                  setLectureToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
