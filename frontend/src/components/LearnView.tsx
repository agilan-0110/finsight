import React, { useState, useEffect } from "react";
import { ACADEMY_LESSONS, type AcademyLesson } from "../data/investmentData";
import { FINANCIAL_TERMS } from "./ExplainModal";
import { api } from "../api/client";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  X,
  Award,
  Clock,
  RotateCcw,
} from "lucide-react";

interface LearnViewProps {
  onAskAI: (prompt: string) => void;
  onOpenExplain: (termKey: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  onAskAI,
  onOpenExplain,
}) => {
  const [activeTab, setActiveTab] = useState<"curriculum" | "glossary">("curriculum");
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [glossarySearch, setGlossarySearch] = useState<string>("");

  // Quiz state for active lesson
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Load user's learning progress from API
  useEffect(() => {
    api.getLearningProgress()
      .then((records) => {
        const completed = new Set(records.filter((r) => r.completed).map((r) => r.lesson_id));
        setCompletedLessonIds(completed);
      })
      .catch((err) => console.error("Failed to load learning progress:", err));
  }, []);

  const handleSelectLesson = (lesson: AcademyLesson) => {
    setSelectedLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setIsCorrect(false);
  };

  const handleAnswerQuiz = async () => {
    if (selectedOption === null || !selectedLesson) return;
    const correct = selectedOption === selectedLesson.quiz.correctIndex;
    setIsCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      const updated = new Set(completedLessonIds);
      updated.add(selectedLesson.id);
      setCompletedLessonIds(updated);

      try {
        await api.saveLearningProgress({
          lesson_id: selectedLesson.id,
          quiz_score: 100,
        });
      } catch (err) {
        console.error("Failed to record progress:", err);
      }
    }
  };

  const currentLevelLessons = ACADEMY_LESSONS.filter((l) => l.level === selectedLevel);
  const totalLessons = ACADEMY_LESSONS.length;
  const completedCount = completedLessonIds.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const filteredGlossary = Object.entries(FINANCIAL_TERMS).filter(([_, def]) =>
    def.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    def.fullName.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    def.shortDefinition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Level Selector */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-headline text-2xl font-bold text-on-surface">
              FinSight Academy 📚
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label text-xs font-semibold">
              Interactive
            </span>
          </div>
          <p className="font-body text-xs text-on-surface-variant">
            A 5-level curriculum taking you from zero financial knowledge to confident portfolio ownership.
          </p>
        </div>

        {/* Learning progress meter */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-right">
            <span className="font-label text-xs font-bold text-on-surface block">
              {completedCount} of {totalLessons} Lessons Done
            </span>
            <span className="font-body text-[11px] text-outline">
              {progressPercent}% Academy Progress
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary flex items-center justify-center font-headline font-bold text-xs text-primary">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Tabs: Curriculum vs Glossary */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
        <button
          onClick={() => {
            setActiveTab("curriculum");
            setSelectedLesson(null);
          }}
          className={`px-4 py-2 rounded-xl font-label text-xs font-semibold transition-all ${
            activeTab === "curriculum"
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          Curriculum &amp; Quizzes
        </button>
        <button
          onClick={() => setActiveTab("glossary")}
          className={`px-4 py-2 rounded-xl font-label text-xs font-semibold transition-all ${
            activeTab === "glossary"
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          Beginner Glossary ({Object.keys(FINANCIAL_TERMS).length} Terms)
        </button>
      </div>

      {/* TAB 1: CURRICULUM VIEW */}
      {activeTab === "curriculum" && !selectedLesson && (
        <div className="space-y-6">
          {/* Level Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { level: 1, name: "Level 1: Money Basics" },
              { level: 2, name: "Level 2: Market Basics" },
              { level: 3, name: "Level 3: Valuation & Ratios" },
              { level: 4, name: "Level 4: Portfolio Management" },
            ].map((lvl) => {
              const countInLvl = ACADEMY_LESSONS.filter((l) => l.level === lvl.level).length;
              const doneInLvl = ACADEMY_LESSONS.filter((l) => l.level === lvl.level && completedLessonIds.has(l.id)).length;
              return (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedLevel(lvl.level)}
                  className={`px-4 py-2.5 rounded-xl text-left border transition-all ${
                    selectedLevel === lvl.level
                      ? "border-primary bg-primary/10 text-primary shadow-sm font-bold"
                      : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline"
                  }`}
                >
                  <span className="font-headline text-xs block">{lvl.name}</span>
                  <span className="font-label text-[10px] text-outline block mt-0.5">
                    {doneInLvl}/{countInLvl} completed
                  </span>
                </button>
              );
            })}
          </div>

          {/* Lessons Grid for Selected Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLevelLessons.map((lesson) => {
              const isDone = completedLessonIds.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-stitch ${
                    isDone
                      ? "bg-surface-container-lowest border-gain/30"
                      : "bg-surface-container-lowest border-outline-variant/40 hover:border-primary/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold bg-surface-container text-on-surface-variant uppercase">
                        {lesson.levelTitle.split("—")[0]}
                      </span>
                      <div className="flex items-center gap-1.5 text-outline text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.durationMinutes} min</span>
                      </div>
                    </div>

                    <h3 className="font-headline font-bold text-sm text-on-surface hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-label font-semibold text-gain">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-xs font-label font-semibold text-primary">
                        Start Lesson →
                      </span>
                    )}

                    <span className="font-label text-[11px] text-outline">
                      Includes Mini-Quiz
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE LESSON VIEW WITH INTERACTIVE QUIZ */}
      {activeTab === "curriculum" && selectedLesson && (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedLesson(null)}
            className="inline-flex items-center gap-1.5 text-xs font-label font-semibold text-outline hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Curriculum</span>
          </button>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-6 max-w-3xl mx-auto">
            {/* Lesson Title Header */}
            <div className="space-y-2 border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-label font-bold bg-primary/10 text-primary uppercase">
                  {selectedLesson.levelTitle}
                </span>
                <span className="text-outline text-xs font-label">• {selectedLesson.durationMinutes} min read</span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">
                {selectedLesson.title}
              </h2>
            </div>

            {/* Core Explanation */}
            <div className="space-y-3">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary">
                1. Core Concept
              </h4>
              <p className="font-body text-sm text-on-surface leading-relaxed">
                {selectedLesson.explanation}
              </p>
            </div>

            {/* Everyday Analogy Box */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary font-headline text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Everyday Analogy</span>
              </div>
              <p className="font-body text-xs text-on-surface leading-relaxed">
                {selectedLesson.analogy}
              </p>
            </div>

            {/* Practical Example */}
            <div className="space-y-3">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary">
                2. Real-World Math / Example
              </h4>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 font-body text-xs text-on-surface leading-relaxed font-mono">
                {selectedLesson.practicalExample}
              </div>
            </div>

            {/* INTERACTIVE MINI QUIZ */}
            <div className="p-6 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface font-headline font-bold text-sm">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Interactive Mini-Quiz</span>
                </div>
                <span className="font-label text-[11px] text-outline">
                  100 XP upon completion
                </span>
              </div>

              <p className="font-headline font-semibold text-xs text-on-surface">
                {selectedLesson.quiz.question}
              </p>

              <div className="space-y-2">
                {selectedLesson.quiz.options.map((option, idx) => {
                  let optStyle = "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50 text-on-surface";
                  if (quizSubmitted) {
                    if (idx === selectedLesson.quiz.correctIndex) {
                      optStyle = "border-gain bg-gain/10 text-gain font-semibold";
                    } else if (idx === selectedOption) {
                      optStyle = "border-error bg-error/10 text-error";
                    }
                  } else if (selectedOption === idx) {
                    optStyle = "border-primary bg-primary/10 text-primary font-semibold";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && idx === selectedLesson.quiz.correctIndex && (
                        <Check className="w-4 h-4 text-gain flex-shrink-0" />
                      )}
                      {quizSubmitted && idx === selectedOption && idx !== selectedLesson.quiz.correctIndex && (
                        <X className="w-4 h-4 text-error flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit or Result Banner */}
              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleAnswerQuiz}
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Check Answer &amp; Complete Lesson
                </button>
              ) : (
                <div className={`p-4 rounded-xl space-y-2 ${isCorrect ? "bg-gain/10 border border-gain/30" : "bg-error/10 border border-error/30"}`}>
                  <div className="flex items-center gap-2 font-headline font-bold text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-gain" />
                        <span className="text-gain">Correct! Lesson Marked as Completed.</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-error" />
                        <span className="text-error">Not quite right. Review the explanation:</span>
                      </>
                    )}
                  </div>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    {selectedLesson.quiz.explanation}
                  </p>
                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedOption(null);
                      }}
                      className="inline-flex items-center gap-1 font-label text-xs text-primary font-semibold hover:underline pt-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Try Quiz Again</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* AI Assistant Help */}
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 text-xs">
              <span className="text-on-surface-variant">Still unclear about this concept?</span>
              <button
                type="button"
                onClick={() => onAskAI(`Explain the lesson '${selectedLesson.title}' to me as if I am 15 years old with zero finance background.`)}
                className="text-primary font-label font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>Ask AI Tutor to Simplify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOSSARY VIEW */}
      {activeTab === "glossary" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Search financial terms (P/E, ROE, CAGR, Inflation)..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map(([key, item]) => (
              <div
                key={key}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-sm text-on-surface">
                      {item.fullName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-label font-bold bg-primary/10 text-primary">
                      {item.term}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenExplain(key)}
                    className="text-xs font-label text-primary font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <span>Full Explainer</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  {item.shortDefinition}
                </p>

                <div className="p-3 rounded-xl bg-surface-container-low text-[11px] font-body text-on-surface">
                  <span className="font-bold text-primary mr-1">Analogy:</span>
                  {item.simpleAnalogy}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
