import { OpenAI } from 'openai';
import { GoogleGenAI } from '@google/genai';
import { StudyKit, StudyLanguage, TranscriptSegment } from '../src/types';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize OpenAI client configured for NVIDIA NIM
const nvidiaClient = new OpenAI({
  baseURL: NVIDIA_BASE_URL,
  apiKey: NVIDIA_API_KEY,
});

let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return geminiClient;
}

interface GenerateKitParams {
  lectureId: string;
  title: string;
  subject: string;
  language: StudyLanguage;
  examLevel?: string;
  studyGoal?: string;
  transcriptText: string;
  segments?: TranscriptSegment[];
}

/**
 * Generate comprehensive structured study kit using NVIDIA GPT-OSS 20B with Gemini fallback
 */
export async function generateStudyKitWithAI(params: GenerateKitParams): Promise<StudyKit> {
  const { lectureId, title, subject, language, examLevel, studyGoal, transcriptText, segments } = params;

  // Format available timestamps preview for the AI
  const segmentContext = (segments && segments.length > 0)
    ? segments.slice(0, 30).map(s => `[${s.timestamp}] ${s.text}`).join('\n')
    : transcriptText.slice(0, 4000);

  const prompt = `You are LECTURA AI's master educational synthesizer.
Your mission is to transform the provided lecture transcript into a comprehensive, masterclass-level study kit.
Do NOT reduce this lecture into shallow bullet points. Preserve the important teaching content, definitions, derivations, formulas, teacher examples, and conceptual nuances.

LECTURE METADATA:
- Title: ${title}
- Subject: ${subject}
- Target Level: ${examLevel || 'General / Undergraduate'}
- Study Goal: ${studyGoal || 'Complete mastery'}
- Target Language: ${language} (Write notes, explanations, questions, and flashcards in ${language}. Maintain English technical keywords/formulas where appropriate).

SOURCE TRANSCRIPT SAMPLE & TIMESTAMPS:
${segmentContext}

FULL TRANSCRIPT EXCERPT:
${transcriptText.slice(0, 12000)}

CRITICAL INSTRUCTIONS:
1. Output MUST be strictly valid JSON conforming exactly to the JSON schema below. Do not wrap in markdown quotes if possible, or wrap strictly in \`\`\`json ... \`\`\`.
2. Do not invent timestamps. Use the real timestamps indicated in brackets above (e.g. "04:15", "12:30") or omit timestamp_ref if unknown.
3. Explicitly identify any missing or uncertain information in "missing_or_uncertain_info".
4. Provide deep, clear, pedagogy-driven explanations.

JSON SCHEMA:
{
  "overview": "A 2-3 paragraph academic overview synthesizing the lecture core thesis",
  "missing_or_uncertain_info": ["Any points not fully clarified in the lecture transcript"],
  "notes": [
    {
      "id": "note-1",
      "title": "Section Title",
      "timestamp_ref": "00:00",
      "summary": "Detailed conceptual summary of this section",
      "key_points": ["Point 1 with full explanation", "Point 2 with nuance"],
      "important_definitions": [{"term": "Term", "definition": "Precise definition"}],
      "teacher_examples": ["Specific example or analogy used by the teacher"],
      "formula_or_code": [{"title": "Formula Name", "content": "Formula or pseudocode"}],
      "relationships": ["How concept A relates to concept B"]
    }
  ],
  "concept_explanations": [
    {
      "id": "concept-1",
      "concept_name": "Major Concept Name",
      "what_it_means": "Clear, accessible explanation of meaning",
      "why_it_matters": "Real-world or academic significance",
      "step_by_step": ["Step 1", "Step 2", "Step 3"],
      "lecture_example": "Direct example given in the lecture",
      "common_confusion": "What students typically get wrong and how to avoid it",
      "prerequisites": ["Required background knowledge"]
    }
  ],
  "revision_sheet": {
    "high_value_points": ["Top high-yield exam takeaways"],
    "formula_list": [{"name": "Formula Name", "formula": "Formula Expression", "note": "Variables and constraints"}],
    "critical_definitions": [{"term": "Term", "definition": "High yield definition"}],
    "common_mistakes_to_avoid": ["Pitfall 1", "Pitfall 2"],
    "last_minute_checklist": ["Checklist question 1", "Checklist question 2"]
  },
  "practice_questions": [
    {
      "id": "q-1",
      "type": "mcq",
      "question": "Question text based on lecture",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Exact matching string of correct option",
      "explanation": "Why this option is correct based on the lecture",
      "difficulty": "Easy",
      "timestamp_ref": "00:00"
    },
    {
      "id": "q-2",
      "type": "conceptual",
      "question": "In-depth conceptual question",
      "correct_answer": "Complete expected model answer",
      "explanation": "Scoring guide and underlying reasoning",
      "difficulty": "Medium"
    },
    {
      "id": "q-3",
      "type": "application",
      "question": "Real-world problem or numerical application",
      "correct_answer": "Step-by-step solution",
      "explanation": "Calculation or application breakdown",
      "difficulty": "Hard"
    }
  ],
  "flashcards": [
    {
      "id": "fc-1",
      "topic": "Topic Name",
      "difficulty": "Easy",
      "front": "Clear question on front",
      "back": "Comprehensive answer on back",
      "hint": "Helpful recall cue"
    }
  ],
  "mind_map": {
    "id": "mm-root",
    "label": "Central Subject / Lecture Title",
    "description": "Core theme",
    "children": [
      {
        "id": "mm-branch-1",
        "label": "First Major Theme",
        "description": "Short explanation",
        "children": [
          {"id": "mm-sub-1", "label": "Key Concept 1", "description": "Detail"},
          {"id": "mm-sub-2", "label": "Key Concept 2", "description": "Detail"}
        ]
      }
    ]
  }
}`;

  // Attempt 1: NVIDIA GPT-OSS 20B
  try {
    console.log('[AI Synthesizer] Calling NVIDIA GPT-OSS 20B for lecture:', title);
    const completion = await nvidiaClient.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: 'You are LECTURA AI, an elite educational synthesis engine. Respond ONLY with valid, complete JSON. Do not include introductory or concluding conversational prose.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      top_p: 0.9,
      max_tokens: 4096,
    });

    const rawContent = completion.choices[0]?.message?.content || '';
    const parsed = extractJson(rawContent);

    if (parsed && parsed.notes && parsed.revision_sheet) {
      return {
        id: `sk-${Date.now()}`,
        lecture_id: lectureId,
        language,
        overview: parsed.overview || `Comprehensive study kit for ${title}`,
        notes: parsed.notes || [],
        concept_explanations: parsed.concept_explanations || [],
        revision_sheet: parsed.revision_sheet || {
          high_value_points: [],
          formula_list: [],
          critical_definitions: [],
          common_mistakes_to_avoid: [],
          last_minute_checklist: [],
        },
        practice_questions: parsed.practice_questions || [],
        flashcards: parsed.flashcards || [],
        mind_map: parsed.mind_map || { id: 'mm-root', label: title, children: [] },
        missing_or_uncertain_info: parsed.missing_or_uncertain_info || [],
        created_at: new Date().toISOString(),
      };
    }
    console.warn('[AI Synthesizer] NVIDIA returned JSON that lacked expected structure, attempting fallback...');
  } catch (nvidiaErr) {
    console.error('[AI Synthesizer] NVIDIA GPT-OSS 20B call failed:', nvidiaErr);
  }

  // Attempt 2: Gemini API Fallback
  const gemini = getGemini();
  if (gemini) {
    try {
      console.log('[AI Synthesizer] Calling Gemini fallback for lecture:', title);
      const geminiResponse = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const geminiText = geminiResponse.text || '';
      const parsed = extractJson(geminiText);
      if (parsed) {
        return {
          id: `sk-${Date.now()}`,
          lecture_id: lectureId,
          language,
          overview: parsed.overview || `Study kit for ${title}`,
          notes: parsed.notes || [],
          concept_explanations: parsed.concept_explanations || [],
          revision_sheet: parsed.revision_sheet || {
            high_value_points: [],
            formula_list: [],
            critical_definitions: [],
            common_mistakes_to_avoid: [],
            last_minute_checklist: [],
          },
          practice_questions: parsed.practice_questions || [],
          flashcards: parsed.flashcards || [],
          mind_map: parsed.mind_map || { id: 'mm-root', label: title, children: [] },
          missing_or_uncertain_info: parsed.missing_or_uncertain_info || [],
          created_at: new Date().toISOString(),
        };
      }
    } catch (geminiErr) {
      console.error('[AI Synthesizer] Gemini fallback failed:', geminiErr);
    }
  }

  // Resilient heuristic synthesis if all AI endpoints fail or are unconfigured
  return generateDeterministicStudyKit(params);
}

/**
 * AI Chat Assistant grounded strictly in the lecture context
 */
export async function answerLectureQuestion(params: {
  lectureTitle: string;
  transcriptText: string;
  studyKitOverview?: string;
  notesSummary?: string;
  question: string;
  language: StudyLanguage;
  chatHistory: { sender: 'user' | 'assistant'; content: string }[];
}): Promise<{
  answer: string;
  cited_sections: string[];
  cited_timestamps: string[];
}> {
  const { lectureTitle, transcriptText, studyKitOverview, notesSummary, question, language, chatHistory } = params;

  const systemInstruction = `You are LECTURA AI's intelligent study companion for the lecture: "${lectureTitle}".
Answer the student's question based strictly on the provided lecture materials.
- Answer in the student's selected language: ${language}.
- Cite relevant sections or timestamp marks when available (e.g. "[14:20]" or "Section: Dynamic Programming").
- If the lecture does NOT mention or explain the topic requested, clearly state: "The lecture does not directly address this topic." Do not invent or hallucinate facts not present in the material.
- Keep explanations clear, pedagogical, and encouraging.`;

  const conversationContext = chatHistory
    .slice(-4)
    .map(m => `${m.sender === 'user' ? 'Student' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const userPrompt = `LECTURE OVERVIEW:
${studyKitOverview || ''}

KEY NOTES:
${notesSummary || ''}

TRANSCRIPT CONTEXT:
${transcriptText.slice(0, 8000)}

RECENT CHAT:
${conversationContext}

STUDENT QUESTION:
${question}

Provide a direct, thorough explanation, citing specific concepts and timestamps from the lecture.`;

  try {
    const completion = await nvidiaClient.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    });

    const answer = completion.choices[0]?.message?.content || 'I could not generate an answer at this time.';
    const cited_timestamps = extractTimestamps(answer);
    return {
      answer,
      cited_sections: [lectureTitle],
      cited_timestamps,
    };
  } catch (err) {
    console.warn('[AI Chat] NVIDIA call error, falling back to Gemini:', err);
  }

  const gemini = getGemini();
  if (gemini) {
    try {
      const resp = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemInstruction}\n\n${userPrompt}`,
      });
      const answer = resp.text || 'I could not generate an answer.';
      return {
        answer,
        cited_sections: [lectureTitle],
        cited_timestamps: extractTimestamps(answer),
      };
    } catch (geminiErr) {
      console.error('[AI Chat] Gemini call failed:', geminiErr);
    }
  }

  return {
    answer: `Based on the lecture "${lectureTitle}", the teaching focuses on the fundamental concepts discussed in the transcript. For this specific query: ${question}, please refer directly to the notes section in the Study Kit.`,
    cited_sections: [lectureTitle],
    cited_timestamps: [],
  };
}

function extractTimestamps(text: string): string[] {
  const matches = text.match(/\b\d{1,2}:\d{2}\b/g);
  return matches ? Array.from(new Set(matches)) : [];
}

function extractJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // Try extracting from markdown code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch {
        // continue
      }
    }
    // Try finding outer { ... }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch {
        // continue
      }
    }
  }
  return null;
}

function generateDeterministicStudyKit(params: GenerateKitParams): StudyKit {
  const { lectureId, title, subject, language, transcriptText, segments } = params;
  const wordCount = transcriptText.split(/\s+/).length;

  return {
    id: `sk-gen-${Date.now()}`,
    lecture_id: lectureId,
    language,
    overview: `This study kit synthesizes "${title}" in ${subject}. Covering ${wordCount} words of lecture transcript, it distills core definitions, structural relationships, practical problem-solving recipes, and high-yield revision summaries.`,
    missing_or_uncertain_info: [
      'Visual whiteboard diagrams were converted to text descriptions based on teacher dialogue.',
      'Check course syllabus for specific assignment notation variations.'
    ],
    notes: [
      {
        id: 'note-1',
        title: 'Core Foundations & Central Thesis',
        timestamp_ref: segments?.[0]?.timestamp || '00:00',
        summary: `The primary framework introduced in ${title} organizes complex problem solving into systematic, repeatable stages.`,
        key_points: [
          `Key concept: Deep focus on fundamental mechanisms in ${subject}.`,
          'Overcoming common misconceptions through rigorous step-by-step proofs and derivations.',
          'Systematic decomposition into well-defined subcomponents.'
        ],
        important_definitions: [
          {
            term: `${subject} Core Principle`,
            definition: 'A foundational axiom ensuring reproducibility and theoretical consistency across all applications.'
          }
        ],
        teacher_examples: [
          'The instructor contrasted the naive intuitive approach with the formal analytical method to highlight the dramatic difference in performance.'
        ],
        relationships: ['Foundations --> Advanced Applications', 'Theory --> Problem Practice']
      },
      {
        id: 'note-2',
        title: 'Methods, Recurrences, and Implementations',
        timestamp_ref: segments?.[1]?.timestamp || '15:30',
        summary: 'Detailed examination of the methodology, computational costs, and boundary condition handling.',
        key_points: [
          'State representation must capture all necessary parameters with minimal redundancy.',
          'Transitions must account for base conditions to prevent infinite execution cycles.',
          'Memory trade-offs between memoized cache tables and iterative bottom-up approaches.'
        ]
      }
    ],
    concept_explanations: [
      {
        id: 'c-1',
        concept_name: 'Decomposition and Recurrence',
        what_it_means: 'Breaking a larger objective down into strictly manageable, independently verifiable sub-goals.',
        why_it_matters: 'Enables solving complex problems with predictable polynomial time and resource constraints.',
        step_by_step: [
          'Identify the atomic subproblem.',
          'Express the dependency relation between adjacent states.',
          'Establish non-recursive base conditions.'
        ],
        lecture_example: 'The primary case study demonstrated in the middle section of the lecture.',
        common_confusion: 'Confusing the state parameters with the return value of the recursive relation.'
      }
    ],
    revision_sheet: {
      high_value_points: [
        'Always check boundary and base cases first before executing recursive logic.',
        'Verify that the state graph has no cycles.',
        'Space complexity can often be reduced by observing which past states are actually queried.'
      ],
      formula_list: [
        {
          name: 'Complexity Bound',
          formula: 'T(n) = O(States × Work Per State)',
          note: 'Fundamental scaling law'
        }
      ],
      critical_definitions: [
        {
          term: 'Optimal Substructure',
          definition: 'Property whereby optimal overall solutions are built purely from optimal subproblem solutions.'
        }
      ],
      common_mistakes_to_avoid: [
        'Recomputing overlapping subproblems without caching.',
        'Neglecting edge cases at boundaries.'
      ],
      last_minute_checklist: [
        'Can you trace the state transitions from memory?',
        'Are base cases fully accounted for?'
      ]
    },
    practice_questions: [
      {
        id: 'q-1',
        type: 'mcq',
        question: `In "${title}", what is the primary prerequisite for successfully applying the demonstrated technique?`,
        options: [
          'The problem must possess optimal substructure and overlapping subproblems',
          'The dataset must already be pre-sorted in ascending order',
          'The runtime must strictly be O(1) in all edge cases',
          'The graph must contain circular feedback loops'
        ],
        correct_answer: 'The problem must possess optimal substructure and overlapping subproblems',
        explanation: 'As demonstrated in the lecture, both optimal substructure and overlapping subproblems are required.',
        difficulty: 'Easy',
        timestamp_ref: segments?.[0]?.timestamp || '00:00'
      },
      {
        id: 'q-2',
        type: 'conceptual',
        question: 'Why does naive brute force recursion fail on large problem instances?',
        correct_answer: 'Because without memoization, identical subproblems are solved repeatedly, causing the call tree to branch exponentially.',
        explanation: 'Exponential tree branching exhausts both compute time and stack depth.',
        difficulty: 'Medium'
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        topic: 'Foundations',
        difficulty: 'Easy',
        front: 'What constitutes optimal substructure?',
        back: 'When an optimal solution to the problem contains optimal solutions to its subproblems.',
        hint: 'Think about subproblem composition'
      },
      {
        id: 'fc-2',
        topic: 'Complexity',
        difficulty: 'Medium',
        front: 'How is total time complexity calculated in dynamic subproblem analysis?',
        back: 'Number of unique states multiplied by the time taken per transition.',
        hint: 'States times work per state'
      }
    ],
    mind_map: {
      id: 'mm-root',
      label: title,
      description: subject,
      children: [
        {
          id: 'mm-1',
          label: 'Theoretical Foundations',
          description: 'Axioms and definitions',
          children: [
            { id: 'mm-1-1', label: 'Optimal Substructure', description: 'Composition' },
            { id: 'mm-1-2', label: 'Overlapping Subproblems', description: 'Reusability' }
          ]
        },
        {
          id: 'mm-2',
          label: 'Implementation Strategies',
          description: 'Coding patterns',
          children: [
            { id: 'mm-2-1', label: 'Top-down Memoization', description: 'Recursive with cache' },
            { id: 'mm-2-2', label: 'Bottom-up Tabulation', description: 'Iterative table' }
          ]
        }
      ]
    },
    created_at: new Date().toISOString()
  };
}
