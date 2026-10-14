import React, { useState } from 'react';
import { SpeechControls } from './SpeechControls.jsx';
import { LoadingState } from './LoadingState.jsx';
import { ErrorState } from './ErrorState.jsx';
import {
  RefreshCw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const MODES = [
  {
    id: 'simple',
    label: 'Simple',
    teluguLabel: 'Sulabhamga',
    description: 'Beginner-friendly explanation using everyday analogies with zero jargon.',
  },
  {
    id: 'detailed',
    label: 'Detailed',
    teluguLabel: 'Vivaramga',
    description: 'Statement by statement breakdown of variables, flow, loops, and conditions.',
  },
  {
    id: 'interview',
    label: 'Interview',
    teluguLabel: 'Technical Reasoning',
    description: 'Time/space complexity, technical edge cases, and typical interview questions.',
  },
];

export function ExplanationSection({
  steps,
  modelUsed,
  isLoading,
  error,
  mode = 'detailed',
  onModeChange,
  onRetry,
  onOpenApiKey,
  speech,
  onReportError,
  onSelectLine,
}) {
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState(null);
  const [stepRatings, setStepRatings] = useState({});

  const handleCopySnippet = (snippet, index) => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const handleRateStep = (index, ratingType, e) => {
    e.stopPropagation();
    setStepRatings((prev) => ({
      ...prev,
      [index]: prev[index] === ratingType ? null : ratingType,
    }));
  };

  const handleReportStep = (step, index, e) => {
    e.stopPropagation();
    if (onReportError) {
      onReportError({
        text: step.explanation,
        line: step.line || index + 1,
        title: step.title,
      });
    }
  };

  const currentModeInfo = MODES.find((m) => m.id === mode) || MODES[1];

  return (
    <section className="w-full mt-6 space-y-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#30363D]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-semibold text-[#E6EDF3] tracking-tight">
              ఈ కోడ్ ఏమి చేస్తుంది? (Code Explanation)
            </h2>
            <span className="text-xs text-[#8B949E]">/</span>
            <span className="text-xs text-[#8B949E] font-medium">
              Logic Explanation
            </span>
            {modelUsed && (
              <span className="text-[11px] font-mono text-[#8B949E] px-1.5 py-0.5 rounded bg-[#1C2128] border border-[#30363D] flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-[#58A6FF]" />
                <span>{modelUsed}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#8B949E] mt-0.5">
            {currentModeInfo.description}
          </p>
        </div>

        {/* Right side: Learning Mode Selector & Retry Button */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Mode Selector */}
          <div className="flex items-center p-0.5 rounded-md bg-[#161B22] border border-[#30363D]">
            {MODES.map((m) => {
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onModeChange && onModeChange(m.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors font-medium flex items-center space-x-1 ${
                    isActive
                      ? 'bg-[#238636] text-white shadow-xs'
                      : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                  }`}
                  title={m.description}
                >
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Retry Button */}
          {!isLoading && steps && steps.length > 0 && (
            <button
              type="button"
              onClick={onRetry}
              className="p-1.5 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128] border border-[#30363D] transition-colors"
              title="Regenerate explanation"
              aria-label="Regenerate explanation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={onRetry}
          onOpenApiKey={onOpenApiKey}
        />
      ) : steps && steps.length > 0 ? (
        <div className="rounded-panel border border-[#30363D] bg-[#161B22] overflow-hidden">
          {/* Global Audio Player Bar */}
          <div className="border-b border-[#30363D] p-3 bg-[#161B22]">
            <SpeechControls
              speech={speech}
              steps={steps}
              disabled={isLoading || !steps || steps.length === 0}
            />
          </div>

          {/* Numbered Vertical List with Trust & Feedback */}
          <div className="divide-y divide-[#30363D]">
            {steps.map((step, index) => {
              const isSpeakingThisStep =
                speech.isPlaying && speech.currentStepIndex === index;
              const rating = stepRatings[index];

              return (
                <article
                  key={index}
                  onClick={() => onSelectLine && onSelectLine(step.line || index + 1)}
                  className={`flex items-start text-xs transition-colors cursor-pointer ${
                    isSpeakingThisStep ? 'bg-[#1C2128]/80' : 'hover:bg-[#1C2128]/30'
                  }`}
                >
                  {/* Narrow Left Column: Step Number */}
                  <div className="w-12 sm:w-14 shrink-0 flex flex-col items-center pt-3 pb-3 relative">
                    <span
                      className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                        isSpeakingThisStep
                          ? 'bg-[#238636] text-white'
                          : 'bg-[#1C2128] text-[#8B949E] border border-[#30363D]'
                      }`}
                    >
                      {step.stepNumber || index + 1}
                    </span>
                    {/* Vertical Line */}
                    <div className="w-0.5 bg-[#30363D] flex-1 mt-2 min-h-[20px]" />
                  </div>

                  {/* Right Column: Step Content */}
                  <div className="flex-1 py-3 pr-4 pl-2 space-y-2">
                    {/* Step Title & Trust Badge */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-[13px] text-[#E6EDF3] tracking-tight">
                          {step.title}
                        </h3>
                        {isSpeakingThisStep && (
                          <span className="text-[10px] text-[#3FB950] font-mono px-1.5 py-0.2 rounded bg-[#1C2128] border border-[#30363D]">
                            Speaking
                          </span>
                        )}
                      </div>

                      {/* Trust Badge (I8) */}
                      <span className="inline-flex items-center space-x-1 text-[10px] text-[#A371F7] bg-[#A371F7]/10 border border-[#A371F7]/25 px-1.5 py-0.5 rounded-full font-sans">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI వివరణ</span>
                      </span>
                    </div>

                    {/* Step Explanation in Telugu and English */}
                    <div className="text-[#E6EDF3] text-xs sm:text-[13px] leading-relaxed font-telugu whitespace-pre-line">
                      {step.explanation}
                    </div>

                    {/* Code Reference (if present) */}
                    {step.codeReference && (
                      <div className="mt-2 rounded bg-[#0D1117] border border-[#30363D] p-2 flex items-center justify-between font-mono text-[11px] text-[#58A6FF]">
                        <code className="overflow-x-auto whitespace-pre">
                          {step.codeReference}
                        </code>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopySnippet(step.codeReference, index);
                          }}
                          className="ml-2 p-1 rounded hover:bg-[#1C2128] text-[#8B949E] hover:text-[#E6EDF3] transition-colors shrink-0"
                          title="Copy snippet"
                          aria-label="Copy snippet"
                        >
                          {copiedSnippetIndex === index ? (
                            <Check className="w-3.5 h-3.5 text-[#3FB950]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Feedback Toolbar: Thumbs Up / Down & Report Wrong Telugu (I8) */}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-[#8B949E]">
                      <span className="text-[#6E7681]">ఈ వివరణ స్పష్టంగా ఉందా?</span>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => handleRateStep(index, 'up', e)}
                          className={`p-1 rounded transition-colors flex items-center space-x-1 ${
                            rating === 'up'
                              ? 'text-[#3FB950] bg-[#238636]/20'
                              : 'hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                          }`}
                          title="స్పష్టంగా ఉంది (Helpful)"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleRateStep(index, 'down', e)}
                          className={`p-1 rounded transition-colors flex items-center space-x-1 ${
                            rating === 'down'
                              ? 'text-[#F85149] bg-[#DA3633]/20'
                              : 'hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                          }`}
                          title="సరిగా అర్థం కాలేదు (Confusing)"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>

                        <span className="text-[#30363D]">|</span>

                        <button
                          type="button"
                          onClick={(e) => handleReportStep(step, index, e)}
                          className="flex items-center space-x-1 text-[#8B949E] hover:text-[#D29922] transition-colors text-[10px]"
                          title="Report translation or grammar issue"
                        >
                          <Flag className="w-3 h-3" />
                          <span>తప్పు అనువాదం నివేదించండి</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ExplanationSection;
