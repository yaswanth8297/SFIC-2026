import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  Play,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Code
} from 'lucide-react';
import { TELUGU_LESSONS } from '../data/lessonsData.js';
import { useGamification } from '../context/GamificationContext.jsx';

export function LessonsModal({ isOpen, onClose, onSelectCode }) {
  const { awardXp } = useGamification();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('codetotelugu_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentLesson = TELUGU_LESSONS[selectedLessonIndex] || TELUGU_LESSONS[0];
  const isLessonCompleted = completedLessons.includes(currentLesson.id);

  const handleLessonChange = (index) => {
    setSelectedLessonIndex(index);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setCopiedCode(false);
  };

  const handleCopyCode = () => {
    if (currentLesson?.starterCode) {
      navigator.clipboard.writeText(currentLesson.starterCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleLoadCode = () => {
    if (onSelectCode && currentLesson?.starterCode) {
      onSelectCode(currentLesson.starterCode);
      onClose();
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setIsQuizSubmitted(true);

    const isCorrect = selectedQuizOption === currentLesson.outputQuiz.correctIndex;
    if (isCorrect) {
      if (!completedLessons.includes(currentLesson.id)) {
        const nextCompleted = [...completedLessons, currentLesson.id];
        setCompletedLessons(nextCompleted);
        try {
          localStorage.setItem('codetotelugu_completed_lessons', JSON.stringify(nextCompleted));
        } catch (e) {
          console.warn('Could not save completed lesson:', e);
        }
        // Award XP
        awardXp(
          'LEARNING_LESSON',
          currentLesson.id,
          `${currentLesson.number}వ పాఠం పూర్తి చేశారు! (${currentLesson.title})`
        );
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Telugu Programming Lessons"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl flex flex-col overflow-hidden text-[#E6EDF3]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363D] bg-[#0D1117]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#58A6FF]/10 border border-[#58A6FF]/20 flex items-center justify-center text-[#58A6FF]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold text-[#E6EDF3]">
                  తెలుగు పైథాన్ పాఠాలు (Interactive Lessons)
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 font-medium">
                  {completedLessons.length} / {TELUGU_LESSONS.length} పూర్తి
                </span>
              </div>
              <p className="text-xs text-[#8B949E]">
                ప్రారంభకుల కోసం తెలుగు వివరణలు, రోజూవారీ ఉదాహరణలు & క్విజ్‌లు
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D]/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar + Main Content */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Lessons Nav Sidebar */}
          <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#30363D] bg-[#0D1117]/50 overflow-y-auto max-h-[30vh] md:max-h-full p-2.5 space-y-1.5">
            <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider px-2 py-1">
              పాఠాల జాబితా (Curriculum)
            </div>
            {TELUGU_LESSONS.map((lesson, idx) => {
              const isSelected = idx === selectedLessonIndex;
              const isDone = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleLessonChange(idx)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start space-x-2.5 border text-xs ${
                    isSelected
                      ? 'bg-[#1F2937] border-[#58A6FF] text-[#E6EDF3] shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-[#1C2128] text-[#8B949E] hover:text-[#E6EDF3]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center font-bold text-xs ${
                      isDone
                        ? 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/30'
                        : isSelected
                        ? 'bg-[#58A6FF]/20 text-[#58A6FF] border border-[#58A6FF]/30'
                        : 'bg-[#21262D] text-[#8B949E]'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : lesson.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[13px] truncate text-[#E6EDF3]">
                      {lesson.title}
                    </div>
                    <div className="text-[11px] text-[#8B949E] truncate">
                      {lesson.englishTitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Lesson Main Area */}
          <main className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#161B22]">
            {/* Lesson Title & Summary */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20">
                  పాఠం {currentLesson.number}
                </span>
                <span className="text-xs text-[#8B949E]">• {currentLesson.englishTitle}</span>
                {isLessonCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#3FB950]/10 text-[#3FB950] border border-[#3FB950]/20 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>పూర్తయింది</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-[#E6EDF3]">{currentLesson.title}</h3>
              <p className="text-xs text-[#8B949E] leading-relaxed">{currentLesson.summary}</p>
            </div>

            {/* Everyday Analogy Card (Feature F14) */}
            {currentLesson.analogy && (
              <div className="p-3.5 rounded-lg bg-[#1F2937]/60 border border-[#30363D] flex items-start space-x-3">
                <div className="p-1.5 rounded-md bg-[#D29922]/15 text-[#D29922] flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#D29922] mb-1">
                    రోజూవారీ జీవిత పోలిక (Everyday Analogy):
                  </h4>
                  <p className="text-xs text-[#C9D1D9] leading-relaxed">
                    {currentLesson.analogy}
                  </p>
                </div>
              </div>
            )}

            {/* Theory Explanation */}
            <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#58A6FF]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>సిద్ధాంత వివరణ (Concept Details)</span>
              </div>
              <div className="text-xs text-[#C9D1D9] leading-relaxed whitespace-pre-line font-telugu">
                {currentLesson.theory}
              </div>
            </div>

            {/* Starter Code Snippet & Actions */}
            <div className="rounded-lg bg-[#0D1117] border border-[#30363D] overflow-hidden">
              <div className="px-3.5 py-2 bg-[#1C2128] border-b border-[#30363D] flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-[#8B949E]">
                  <Code className="w-3.5 h-3.5 text-[#3FB950]" />
                  <span className="font-mono text-[#E6EDF3]">ఉదాహరణ కోడ్ (Example Code)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2 py-1 rounded text-xs bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] transition-colors flex items-center space-x-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-[#3FB950]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'కాపీ అయింది!' : 'కాపీ'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadCode}
                    className="px-2.5 py-1 rounded text-xs bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-colors flex items-center space-x-1 shadow-sm"
                  >
                    <Play className="w-3 h-3" />
                    <span>ఎడిటర్‌లో రన్ చేయి</span>
                  </button>
                </div>
              </div>
              <pre className="p-3.5 font-mono text-xs text-[#E6EDF3] overflow-x-auto leading-relaxed">
                <code>{currentLesson.starterCode}</code>
              </pre>
            </div>

            {/* Interactive "What is the Output?" Quiz */}
            {currentLesson.outputQuiz && (
              <div className="p-4 rounded-lg bg-[#1C2128] border border-[#30363D] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#E6EDF3]">
                    <HelpCircle className="w-4 h-4 text-[#D29922]" />
                    <span>ఈ కోడ్ అవుట్‌పుట్ (Output) ఏమిటి? — ఆలోచించండి</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#D29922]/10 text-[#D29922] border border-[#D29922]/20 font-medium">
                    +{currentLesson.xpAward} XP
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#0D1117] border border-[#30363D] font-mono text-xs whitespace-pre-wrap text-[#C9D1D9]">
                  {currentLesson.outputQuiz.question}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentLesson.outputQuiz.options.map((opt, optIdx) => {
                    const isSelected = selectedQuizOption === optIdx;
                    const isCorrect = optIdx === currentLesson.outputQuiz.correctIndex;
                    let btnClass = 'border-[#30363D] bg-[#0D1117] text-[#C9D1D9] hover:border-[#58A6FF]/50';

                    if (isQuizSubmitted) {
                      if (isCorrect) {
                        btnClass = 'border-[#3FB950] bg-[#3FB950]/15 text-[#3FB950] font-medium';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'border-[#F85149] bg-[#F85149]/15 text-[#F85149]';
                      } else {
                        btnClass = 'border-[#30363D] bg-[#0D1117] text-[#6E7681] opacity-60';
                      }
                    } else if (isSelected) {
                      btnClass = 'border-[#58A6FF] bg-[#58A6FF]/15 text-[#58A6FF] font-medium';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isQuizSubmitted}
                        onClick={() => setSelectedQuizOption(optIdx)}
                        className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-start space-x-2 ${btnClass}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center flex-shrink-0 text-[10px]">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Status Button */}
                {!isQuizSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedQuizOption === null}
                    onClick={handleQuizSubmit}
                    className="w-full py-2 rounded-lg bg-[#58A6FF] hover:bg-[#4094F7] disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>సమాధానం సరిచూడు (Submit Answer)</span>
                  </button>
                ) : (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                      selectedQuizOption === currentLesson.outputQuiz.correctIndex
                        ? 'bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]'
                        : 'bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149]'
                    }`}
                  >
                    {selectedQuizOption === currentLesson.outputQuiz.correctIndex ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold mb-1">
                        {selectedQuizOption === currentLesson.outputQuiz.correctIndex
                          ? 'చాలా బాగుంది! సరైన సమాధానం.'
                          : 'తప్పు సమాధానం, వివరణ చూడండి:'}
                      </div>
                      <p className="text-xs text-[#E6EDF3] leading-relaxed">
                        {currentLesson.outputQuiz.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Practice Challenge Prompt */}
            {currentLesson.practiceTask && (
              <div className="p-3.5 rounded-lg bg-[#1C2128] border border-[#30363D] flex items-start space-x-3">
                <div className="p-1.5 rounded-md bg-[#58A6FF]/15 text-[#58A6FF] flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#58A6FF] mb-1">
                    మీ కోసం ప్రాక్టీస్ సవాలు (Coding Challenge):
                  </h4>
                  <p className="text-xs text-[#C9D1D9] leading-relaxed mb-2">
                    {currentLesson.practiceTask}
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadCode}
                    className="text-xs text-[#58A6FF] hover:underline flex items-center space-x-1 font-medium"
                  >
                    <span>వర్క్‌స్పేస్‌లో రాయడానికి ప్రయత్నించండి</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Previous / Next Lesson Footer Nav */}
            <div className="pt-2 flex items-center justify-between border-t border-[#30363D]">
              <button
                type="button"
                disabled={selectedLessonIndex === 0}
                onClick={() => handleLessonChange(selectedLessonIndex - 1)}
                className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] disabled:opacity-30 text-xs text-[#E6EDF3] transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>మునుపటి పాఠం</span>
              </button>

              <button
                type="button"
                disabled={selectedLessonIndex === TELUGU_LESSONS.length - 1}
                onClick={() => handleLessonChange(selectedLessonIndex + 1)}
                className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] disabled:opacity-30 text-xs text-[#E6EDF3] transition-colors flex items-center space-x-1.5"
              >
                <span>తదుపరి పాఠం</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LessonsModal;
