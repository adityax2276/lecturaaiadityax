import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Eye, EyeOff, RotateCcw, Award } from 'lucide-react';
import { PracticeQuestion } from '../types';

interface QuizViewProps {
  questions: PracticeQuestion[];
}

export const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-xs text-stone-500">
        No practice questions generated for this lecture yet.
      </div>
    );
  }

  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const toggleReveal = (questionId: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setRevealedIds(new Set());
  };

  // Calculate MCQ score
  const mcqs = questions.filter((q) => q.type === 'mcq');
  const answeredMcqs = mcqs.filter((q) => selectedAnswers[q.id]);
  const correctMcqs = answeredMcqs.filter((q) => selectedAnswers[q.id] === q.correct_answer);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Score and Reset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Practice Score</h4>
            <p className="text-[11px] text-stone-500">
              {mcqs.length > 0
                ? `${correctMcqs.length} of ${mcqs.length} MCQs answered correctly`
                : `${questions.length} total review questions`}
            </p>
          </div>
        </div>

        <button
          onClick={resetQuiz}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Quiz</span>
        </button>
      </div>

      {/* Question Items */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isMcq = q.type === 'mcq';
          const selectedOption = selectedAnswers[q.id];
          const isAnswered = Boolean(selectedOption);
          const isCorrect = selectedOption === q.correct_answer;
          const isRevealed = revealedIds.has(q.id);

          return (
            <div
              key={q.id || idx}
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">Question {idx + 1}</span>
                  <span className="px-2 py-0.5 rounded uppercase font-semibold text-[10px] bg-stone-100 text-stone-600">
                    {q.type}
                  </span>
                  {q.timestamp_ref && (
                    <span className="text-[11px] text-stone-400 font-mono">
                      ref: [{q.timestamp_ref}]
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    q.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700'
                      : q.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {q.difficulty}
                </span>
              </div>

              {/* Question Prompt */}
              <p className="text-sm font-semibold text-stone-900 leading-relaxed">
                {q.question}
              </p>

              {/* MCQ Options */}
              {isMcq && q.options && (
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isThisSelected = selectedOption === opt;
                    const isThisCorrect = opt === q.correct_answer;

                    let btnClass = 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-800';
                    if (isAnswered) {
                      if (isThisCorrect) {
                        btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-400';
                      } else if (isThisSelected) {
                        btnClass = 'border-red-400 bg-red-50 text-red-950 line-through';
                      } else {
                        btnClass = 'border-stone-200 opacity-50 bg-white text-stone-500';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt)}
                        disabled={isAnswered}
                        className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {isAnswered && isThisSelected && !isThisCorrect && (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation & Rationale for MCQs */}
              {isMcq && isAnswered && (
                <div className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                  isCorrect ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-800'
                }`}>
                  <strong className="font-semibold block">
                    {isCorrect ? 'Correct!' : `Correct Answer: ${q.correct_answer}`}
                  </strong>
                  <p className="leading-relaxed text-[11px] text-stone-600">{q.explanation}</p>
                </div>
              )}

              {/* Non-MCQ: Conceptual or Application Reveal */}
              {!isMcq && (
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => toggleReveal(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer & Explanation'}</span>
                  </button>

                  {isRevealed && (
                    <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-200 text-xs space-y-2 animate-in fade-in">
                      <div>
                        <span className="font-bold text-indigo-950 block mb-1">Model Solution:</span>
                        <p className="text-stone-800 leading-relaxed">{q.correct_answer}</p>
                      </div>
                      <div className="pt-2 border-t border-indigo-100">
                        <span className="font-semibold text-indigo-900 block mb-1">Pedagogical Rubric &amp; Rationale:</span>
                        <p className="text-stone-600 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
