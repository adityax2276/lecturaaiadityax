import React, { useState, useEffect } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Shuffle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDeck(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [cards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length]);

  if (!deck || deck.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-xs text-stone-500">
        No flashcards available for this study kit.
      </div>
    );
  }

  const currentCard = deck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isMastered = masteredIds.has(currentCard.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Deck Stats & Controls */}
      <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-stone-800">
            Card {currentIndex + 1} of {deck.length}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px]">
            {masteredIds.size} Mastered
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* 3D Flashcard Stage */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative min-h-[300px] sm:min-h-[340px] w-full rounded-2xl border border-stone-200 bg-white p-8 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col justify-between select-none"
        style={{ perspective: '1000px' }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 font-semibold text-[11px]">
            {currentCard.topic}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                currentCard.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700'
                  : currentCard.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {currentCard.difficulty}
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              {isFlipped ? 'BACK' : 'FRONT'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-8 my-auto text-center">
          {!isFlipped ? (
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-semibold text-stone-900 leading-relaxed max-w-lg mx-auto">
                {currentCard.front}
              </p>
              {currentCard.hint && showHint && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 text-left max-w-md mx-auto">
                  <strong>Hint:</strong> {currentCard.hint}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-left max-w-lg mx-auto">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Core Explanation &amp; Answer:
              </div>
              <div className="text-sm sm:text-base text-stone-800 leading-relaxed whitespace-pre-line font-normal">
                {currentCard.back}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Hint & Flip instruction */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            {currentCard.hint && !isFlipped && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(!showHint);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800 font-medium"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Recall Hint'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <RotateCw className="w-3 h-3 text-stone-400" />
            <span>Click or Space to flip</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => toggleMastered(currentCard.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            isMastered
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'border border-stone-300 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isMastered ? 'Marked Mastered' : 'Mark as Mastered'}</span>
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#12141D] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center text-[11px] text-stone-400 font-mono">
        Keyboard: [Space] to flip &bull; [&larr;] previous card &bull; [&rarr;] next card
      </div>
    </div>
  );
};
