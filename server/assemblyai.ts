/**
 * AssemblyAI Transcription Service
 * Transcribes audio / video inputs with real word/paragraph timestamping
 */

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY || '3be2b8ade47c422cb51f2ccfe0c3e97f';

export interface AssemblyTranscriptSegment {
  id: string;
  start_seconds: number;
  end_seconds: number;
  timestamp: string;
  text: string;
  speaker?: string;
}

export interface AssemblyTranscriptionResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  text: string;
  segments: AssemblyTranscriptSegment[];
  confidence?: number;
  error?: string;
}

function formatSecondsToTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Upload raw audio buffer to AssemblyAI
 */
export async function uploadAudioToAssemblyAI(buffer: Buffer): Promise<string> {
  const response = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
      'content-type': 'application/octet-stream',
    },
    body: buffer,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AssemblyAI upload failed (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as { upload_url: string };
  return data.upload_url;
}

/**
 * Submit transcription job to AssemblyAI
 */
export async function submitAssemblyTranscription(
  audioUrl: string,
  options?: { language_code?: string; speaker_labels?: boolean }
): Promise<string> {
  const response = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      speaker_labels: options?.speaker_labels ?? true,
      punctuate: true,
      format_text: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AssemblyAI transcript submission failed (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as { id: string };
  return data.id;
}

/**
 * Check transcription status
 */
export async function getAssemblyTranscription(transcriptId: string): Promise<AssemblyTranscriptionResult> {
  const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
    method: 'GET',
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AssemblyAI poll failed: ${errText}`);
  }

  const data = await response.json();

  if (data.status === 'completed') {
    // Transform utterances or chapters into clean segments
    const rawUtterances = data.utterances || [];
    let segments: AssemblyTranscriptSegment[] = [];

    if (rawUtterances.length > 0) {
      segments = rawUtterances.map((u: any, idx: number) => {
        const startSec = Math.round((u.start || 0) / 1000);
        const endSec = Math.round((u.end || 0) / 1000);
        return {
          id: `seg-${idx}`,
          start_seconds: startSec,
          end_seconds: endSec,
          timestamp: formatSecondsToTimestamp(startSec),
          text: u.text,
          speaker: u.speaker ? `Speaker ${u.speaker}` : undefined,
        };
      });
    } else if (data.words && data.words.length > 0) {
      // Group words into 30-second chunk segments
      const words = data.words;
      let currentSegWords: string[] = [];
      let segStart = 0;
      let segIdx = 0;

      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (currentSegWords.length === 0) {
          segStart = Math.round(w.start / 1000);
        }
        currentSegWords.push(w.text);

        const currentSec = Math.round(w.end / 1000);
        if (currentSec - segStart >= 25 || i === words.length - 1) {
          segments.push({
            id: `seg-${segIdx++}`,
            start_seconds: segStart,
            end_seconds: currentSec,
            timestamp: formatSecondsToTimestamp(segStart),
            text: currentSegWords.join(' '),
          });
          currentSegWords = [];
        }
      }
    } else {
      segments.push({
        id: 'seg-0',
        start_seconds: 0,
        end_seconds: 60,
        timestamp: '00:00',
        text: data.text || '',
      });
    }

    return {
      id: data.id,
      status: 'completed',
      text: data.text || '',
      segments,
      confidence: data.confidence,
    };
  }

  if (data.status === 'error') {
    return {
      id: data.id,
      status: 'error',
      text: '',
      segments: [],
      error: data.error || 'Transcription failed',
    };
  }

  return {
    id: data.id,
    status: data.status, // queued or processing
    text: '',
    segments: [],
  };
}
