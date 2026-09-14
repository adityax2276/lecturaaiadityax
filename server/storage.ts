import { Lecture, StudyKit, Transcript, ChatMessage } from '../src/types';
import { SAMPLE_LECTURE } from '../src/data/sampleLectures';

// In-memory persistent store initialized with sample lecture
const lecturesStore = new Map<string, Lecture>();
const chatMessagesStore = new Map<string, ChatMessage[]>();

// Seed sample lecture
lecturesStore.set(SAMPLE_LECTURE.id, { ...SAMPLE_LECTURE });
chatMessagesStore.set(SAMPLE_LECTURE.id, [
  {
    id: 'msg-seed-1',
    lecture_id: SAMPLE_LECTURE.id,
    sender: 'assistant',
    content: `Hello! I am your study companion for "${SAMPLE_LECTURE.title}". You can ask me to clarify the MIT 5-step recipe, explain optimal substructure, compare memoization vs. tabulation, or quiz you in English, Hindi, or Hinglish!`,
    timestamp: new Date().toISOString(),
    cited_sections: ['Overview'],
  }
]);

export const storage = {
  getAllLectures(userId?: string): Lecture[] {
    const list = Array.from(lecturesStore.values());
    if (userId) {
      return list.filter(l => l.user_id === userId || l.user_id === 'demo-user-lectura');
    }
    return list;
  },

  getLecture(id: string): Lecture | undefined {
    return lecturesStore.get(id);
  },

  saveLecture(lecture: Lecture): Lecture {
    lecture.updated_at = new Date().toISOString();
    lecturesStore.set(lecture.id, lecture);
    return lecture;
  },

  updateLectureStatus(id: string, updates: Partial<Lecture>): Lecture | undefined {
    const existing = lecturesStore.get(id);
    if (!existing) return undefined;
    const updated: Lecture = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    lecturesStore.set(id, updated);
    return updated;
  },

  deleteLecture(id: string): boolean {
    chatMessagesStore.delete(id);
    return lecturesStore.delete(id);
  },

  getChatMessages(lectureId: string): ChatMessage[] {
    return chatMessagesStore.get(lectureId) || [];
  },

  addChatMessage(lectureId: string, message: ChatMessage): ChatMessage {
    const list = chatMessagesStore.get(lectureId) || [];
    list.push(message);
    chatMessagesStore.set(lectureId, list);
    return message;
  },

  clearChatMessages(lectureId: string): void {
    chatMessagesStore.set(lectureId, []);
  },
};
