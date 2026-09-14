export type ProcessingStatus =
  | 'uploaded'
  | 'validating'
  | 'transcribing'
  | 'generating'
  | 'saving'
  | 'completed'
  | 'failed';

export type SourceType = 'youtube' | 'transcript' | 'audio' | 'video';

export type StudyLanguage = 'English' | 'Hindi' | 'Hinglish';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type StudyKitTab =
  | 'notes'
  | 'concepts'
  | 'revision'
  | 'questions'
  | 'flashcards'
  | 'mindmap'
  | 'transcript';

export interface LectureSource {
  id: string;
  lecture_id: string;
  source_type: SourceType;
  source_url?: string;
  file_name?: string;
  file_size?: number;
  duration_seconds?: number;
  created_at: string;
}

export interface TranscriptSegment {
  id: string;
  start_seconds: number;
  end_seconds: number;
  timestamp: string; // e.g. "04:15"
  text: string;
  speaker?: string;
}

export interface Transcript {
  id: string;
  lecture_id: string;
  full_text: string;
  segments: TranscriptSegment[];
  language: string;
  confidence?: number;
  created_at: string;
}

export interface NoteSection {
  id: string;
  title: string;
  timestamp_ref?: string;
  summary: string;
  key_points: string[];
  important_definitions?: { term: string; definition: string }[];
  teacher_examples?: string[];
  formula_or_code?: { title: string; content: string; language?: string }[];
  relationships?: string[];
}

export interface ConceptExplanation {
  id: string;
  concept_name: string;
  what_it_means: string;
  why_it_matters: string;
  step_by_step: string[];
  lecture_example: string;
  common_confusion: string;
  prerequisites?: string[];
}

export interface RevisionSheet {
  high_value_points: string[];
  formula_list: { name: string; formula: string; note?: string }[];
  critical_definitions: { term: string; definition: string }[];
  common_mistakes_to_avoid: string[];
  last_minute_checklist: string[];
}

export interface PracticeQuestion {
  id: string;
  type: 'mcq' | 'short' | 'conceptual' | 'application';
  question: string;
  options?: string[]; // for mcq
  correct_answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timestamp_ref?: string;
}

export interface Flashcard {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  front: string;
  back: string;
  hint?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  children?: MindMapNode[];
}

export interface StudyKit {
  id: string;
  lecture_id: string;
  language: StudyLanguage;
  overview: string;
  notes: NoteSection[];
  concept_explanations: ConceptExplanation[];
  revision_sheet: RevisionSheet;
  practice_questions: PracticeQuestion[];
  flashcards: Flashcard[];
  mind_map: MindMapNode;
  missing_or_uncertain_info?: string[];
  created_at: string;
}

export interface Lecture {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  exam_level?: string;
  preferred_language: StudyLanguage;
  difficulty: DifficultyLevel;
  study_goal?: string;
  source_type: SourceType;
  source_url?: string;
  file_name?: string;
  duration_formatted?: string;
  status: ProcessingStatus;
  progress_percent: number;
  status_message?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  study_kit?: StudyKit;
  transcript?: Transcript;
}

export interface ChatMessage {
  id: string;
  lecture_id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cited_sections?: string[];
  cited_timestamps?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}
