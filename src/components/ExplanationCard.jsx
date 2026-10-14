import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  Copy,
  Check,
  Terminal,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function ExplanationCard({
  step,
  index,
  isCurrentSpeaking = false,
  onSpeakStep,
  onSelectLine,
  isSelected = false,
  onReportError,
  isAiGenerated = true,
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [userRating, setUserRating] = useState(null); // 'up' | 'down' | null

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (!step.codeReference) return;
    navigator.clipboard.writeText(step.codeReference);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRate = (type, e) => {
    e.stopPropagation();
    const newRating = userRating === type ? null : type;
    setUserRating(newRating);
    try {
      const ratings = JSON.parse(localStorage.getItem('codetotelugu_ratings') || '{}');
      ratings[`card_${index}_${step.title || 'step'}`] = newRating;
      localStorage.setItem('codetotelugu_ratings', JSON.stringify(ratings));
    } catch (err) {
      // ignore
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    if (onReportError) {
      onReportError({
        text: step.explanation,
        line: step.line || index + 1,
        title: step.title,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
      onClick={() => onSelectLine && onSelectLine(step.line || index + 1)}
      className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-[#1C2128] border-[#58A6FF] shadow-lg ring-1 ring-[#58A6FF]/40'
          : isCurrentSpeaking
          ? 'bg-gradient-to-br from-[#1F6FEB]/20 via-[#161B22] to-[#238636]/10 border-[#58A6FF] shadow-md'
          : 'bg-[#161B22] hover:bg-[#1C2128] border-[#30363D] hover:border-[#8B949E]/40'
      }`}
    >
      {/* Header of Step Card */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center space-x-3">
          {/* Step Number Badge */}
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
              isSelected || isCurrentSpeaking
                ? 'bg-[#58A6FF] text-[#0D1117] shadow-sm'
                : 'bg-[#1F6FEB]/15 text-[#58A6FF] border border-[#58A6FF]/30'
            }`}
          >
            {step.stepNumber || index + 1}
          </div>

          <div>
            <h4 className="font-semibold text-sm sm:text-base text-[#E6EDF3] tracking-tight flex items-center flex-wrap gap-2">
              <span>{step.title}</span>
              {/* Trust Badge (I8) */}
              {isAiGenerated ? (
                <span className="inline-flex items-center space-x-1 text-[10px] text-[#A371F7] bg-[#A371F7]/10 border border-[#A371F7]/25 px-1.5 py-0.5 rounded-full font-sans">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI వివరణ</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[10px] text-[#3FB950] bg-[#238636]/15 border border-[#238636]/30 px-1.5 py-0.5 rounded-full font-sans">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>ధృవీకరించబడింది</span>
                </span>
              )}

              {isCurrentSpeaking && (
                <span className="text-[10px] font-medium text-[#58A6FF] bg-[#1F6FEB]/20 border border-[#58A6FF]/40 px-2 py-0.5 rounded-full animate-pulse">
                  వినబడుతోంది...
                </span>
              )}
            </h4>
          </div>
        </div>

        {/* Listen to this single step button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSpeakStep && onSpeakStep(step, index);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            isCurrentSpeaking
              ? 'bg-[#58A6FF]/20 text-[#58A6FF] border-[#58A6FF]/40'
              : 'bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#58A6FF] border-[#30363D]'
          }`}
          title="Listen to this step in Telugu"
          aria-label={`Listen to step ${step.stepNumber || index + 1}`}
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Telugu Explanation Text */}
      <div className="text-[#C9D1D9] text-xs sm:text-sm leading-relaxed mb-3 whitespace-pre-line font-telugu pl-10 sm:pl-11">
        {step.explanation}
      </div>

      {/* Code Reference block (if provided) */}
      {step.codeReference && (
        <div className="mt-2.5 ml-10 sm:ml-11 rounded-lg bg-[#0D1117] border border-[#30363D] p-2.5 flex items-center justify-between group/code">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#79C0FF] overflow-x-auto">
            <Terminal className="w-3.5 h-3.5 text-[#8B949E] shrink-0" />
            <code className="text-[12px]">{step.codeReference}</code>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="p-1 rounded hover:bg-[#21262D] text-[#8B949E] hover:text-white transition-colors shrink-0 ml-2"
            title="Copy snippet"
            aria-label="Copy code snippet"
          >
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-[#3FB950]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      {/* Card Footer: Rating & Report Wrong Telugu (I8) */}
      <div className="mt-3 ml-10 sm:ml-11 pt-2 border-t border-[#30363D]/60 flex items-center justify-between text-xs text-[#8B949E]">
        <span className="text-[11px] text-[#6E7681]">
          ఈ వివరణ స్పష్టంగా ఉందా?
        </span>

        <div className="flex items-center space-x-2">
          {/* Thumbs Up */}
          <button
            type="button"
            onClick={(e) => handleRate('up', e)}
            className={`p-1 rounded transition-colors flex items-center space-x-1 ${
              userRating === 'up'
                ? 'text-[#3FB950] bg-[#238636]/20'
                : 'hover:text-[#E6EDF3] hover:bg-[#21262D]'
            }`}
            title="బాగుంది (Helpful)"
          >
            <ThumbsUp className="w-3 h-3" />
          </button>

          {/* Thumbs Down */}
          <button
            type="button"
            onClick={(e) => handleRate('down', e)}
            className={`p-1 rounded transition-colors flex items-center space-x-1 ${
              userRating === 'down'
                ? 'text-[#F85149] bg-[#DA3633]/20'
                : 'hover:text-[#E6EDF3] hover:bg-[#21262D]'
            }`}
            title="అర్థం కాలేదు (Confusing)"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>

          <span className="text-[#30363D]">|</span>

          {/* Report Wrong Telugu (I8) */}
          <button
            type="button"
            onClick={handleReport}
            className="text-[11px] text-[#8B949E] hover:text-[#D29922] transition-colors flex items-center space-x-1"
            title="Report wrong or unnatural Telugu translation"
          >
            <Flag className="w-3 h-3" />
            <span>తప్పు నివేదించండి</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ExplanationCard;
