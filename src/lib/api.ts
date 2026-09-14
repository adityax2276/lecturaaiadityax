import { Lecture, StudyKit, ChatMessage, ProcessingStatus } from '../types';

const API_BASE = ''; // Same origin

export async function fetchLectures(userId?: string): Promise<Lecture[]> {
  const url = userId ? `${API_BASE}/api/lectures?userId=${encodeURIComponent(userId)}` : `${API_BASE}/api/lectures`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch lectures');
  return res.json();
}

export async function fetchLecture(id: string): Promise<Lecture> {
  const res = await fetch(`${API_BASE}/api/lectures/${id}`);
  if (!res.ok) throw new Error('Failed to fetch lecture');
  return res.json();
}

export async function createLecture(payload: {
  title: string;
  subject: string;
  exam_level?: string;
  preferred_language: string;
  difficulty: string;
  study_goal?: string;
  source_type: string;
  source_url?: string;
  file_name?: string;
  transcript_text?: string;
  user_id?: string;
}): Promise<Lecture> {
  const res = await fetch(`${API_BASE}/api/lectures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create lecture');
  }
  return res.json();
}

export async function processLecture(
  id: string,
  options?: { preferred_language?: string; difficulty?: string; study_goal?: string }
): Promise<{ message: string; status: ProcessingStatus }> {
  const res = await fetch(`${API_BASE}/api/lectures/${id}/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options || {}),
  });
  if (!res.ok) throw new Error('Failed to start processing');
  return res.json();
}

export const checkLectureStatus = pollLectureStatus;
export const deleteLecture = deleteLectureApi;

export async function pollLectureStatus(id: string): Promise<{
  id: string;
  status: ProcessingStatus;
  progress_percent: number;
  status_message?: string;
  error_message?: string;
  has_material: boolean;
}> {
  const res = await fetch(`${API_BASE}/api/lectures/${id}/status`);
  if (!res.ok) throw new Error('Failed to poll status');
  return res.json();
}

export async function fetchStudyMaterial(id: string): Promise<StudyKit> {
  const res = await fetch(`${API_BASE}/api/lectures/${id}/material`);
  if (!res.ok) throw new Error('Study material not ready');
  return res.json();
}

export async function sendChatMessage(
  lectureId: string,
  question: string,
  messageHistory: { sender: 'user' | 'assistant'; content: string }[]
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const res = await fetch(`${API_BASE}/api/lectures/${lectureId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, messageHistory }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send question');
  }
  return res.json();
}

export async function fetchChatMessages(lectureId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/api/lectures/${lectureId}/chat`);
  if (!res.ok) throw new Error('Failed to fetch chat history');
  return res.json();
}

export async function deleteLectureApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lectures/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete lecture');
}

export async function uploadMediaForTranscription(file: File): Promise<{
  success: boolean;
  transcriptId: string;
  fileName: string;
  fileSize: number;
}> {
  const formData = new FormData();
  formData.append('mediaFile', file);

  const res = await fetch(`${API_BASE}/api/upload-media`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload media file');
  }
  return res.json();
}

export async function pollAssemblyAI(transcriptId: string): Promise<{
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  text: string;
  segments: any[];
  error?: string;
}> {
  const res = await fetch(`${API_BASE}/api/assemblyai/status/${transcriptId}`);
  if (!res.ok) throw new Error('Failed to check transcription status');
  return res.json();
}
