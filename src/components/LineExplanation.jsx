import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Terminal,
  HelpCircle,
  Layers,
  BookOpen,
  CheckCircle2,
  Flag
} from 'lucide-react';
import { getLineDetails, getDeterministicLineExplanation } from '../utils/lineMapper.js';
import { explainLineWithGemini, getActiveApiKey } from '../services/gemini.js';
import { getExplanationCache } from '../utils/storage.js';
import { lookupGlossaryTerm } from '../dictionary/programmingGlossary.js';

export function LineExplanation({
  selectedLine = 1,
  sourceCode = '',
  translatedCode = '',
  onOpenApiKey,
  onOpenGlossary,
  onReportError,
}) {
  const lineDetails = getLineDetails(sourceCode, translatedCode, selectedLine);
  const localExp = getDeterministicLineExplanation(
    lineDetails.sourceText,
    lineDetails.translatedText,
    selectedLine
  );

  const [aiExplanation, setAiExplanation] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // Detect glossary keywords on this line
  const detectedKeywords = React.useMemo(() => {
    const text = (lineDetails.sourceText || '').trim();
    if (!text || text.startsWith('#')) return [];

    const words = text.match(/[a-zA-Z_]\w*/g) || [];
    const found = [];
    const seen = new Set();

    for (const w of words) {
      if (seen.has(w.toLowerCase())) continue;
      const entry = lookupGlossaryTerm(w);
      if (entry) {
        seen.add(w.toLowerCase());
        found.push(entry);
      }
    }
    return found;
  }, [lineDetails.sourceText]);

  // Manual trigger function to fetch immediately without waiting for debounce
  const triggerAiForLine = useCallback(async () => {
    const trimmed = (lineDetails.sourceText || '').trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const apiKey = getActiveApiKey();
    if (!apiKey) return;

    setIsAiLoading(true);
    try {
      const result = await explainLineWithGemini(
        sourceCode,
        selectedLine,
        lineDetails.sourceText
      );
      if (result) {
        setAiExplanation(result);
      }
    } catch (err) {
      // Local deterministic explanation remains active
    } finally {
      setIsAiLoading(false);
    }
  }, [lineDetails.sourceText, selectedLine, sourceCode]);

  // Synchronous cache check + 1800ms debounced lookup to protect API quota
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.aborted = true;
    }

    const currentController = { aborted: false };
    abortControllerRef.current = currentController;

    const trimmed = (lineDetails.sourceText || '').trim();
    if (!trimmed || trimmed.startsWith('#')) {
      setAiExplanation(null);
      setIsAiLoading(false);
      return;
    }

    // 1. Immediate synchronous cache hit (0ms, 0 API tokens consumed)
    const cached = getExplanationCache(sourceCode, undefined, `line:${selectedLine}`);
    if (cached) {
      setAiExplanation(cached);
      setIsAiLoading(false);
      return;
    }

    // Reset AI state so instant deterministic explanation is visible cleanly
    setAiExplanation(null);

    const apiKey = getActiveApiKey();
    if (!apiKey) {
      setIsAiLoading(false);
      return;
    }

    // 2. Debounce by 1800ms to avoid firing requests on casual cursor navigation
    const timer = setTimeout(async () => {
      if (currentController.aborted) return;
      setIsAiLoading(true);

      try {
        const result = await explainLineWithGemini(
          sourceCode,
          selectedLine,
          lineDetails.sourceText
        );
        if (!currentController.aborted && result) {
          setAiExplanation(result);
        }
      } catch (err) {
        // Silently fall back to deterministic explanation on background failure
      } finally {
        if (!currentController.aborted) {
          setIsAiLoading(false);
        }
      }
    }, 1800);

    return () => {
      clearTimeout(timer);
      currentController.aborted = true;
    };
  }, [selectedLine, sourceCode, lineDetails.sourceText]);

  const whatItDoes = aiExplanation?.whatItDoes || localExp.whatItDoes;
  const whyItIsUsed = aiExplanation?.whyItIsUsed || localExp.whyItIsUsed;
  const teluguScriptWhat = localExp.teluguScript?.whatItDoes;
  const teluguScriptWhy = localExp.teluguScript?.whyItIsUsed;

  const variables = aiExplanation?.variablesInvolved?.length
    ? aiExplanation.variablesInvolved
    : lineDetails.variables;

  const handleReport = () => {
    if (onReportError) {
      onReportError({
        text: whatItDoes,
        line: selectedLine,
        title: `Line ${selectedLine} explanation`,
      });
    }
  };

  return (
    <div className="rounded-panel border border-[#30363D] bg-[#161B22] p-4 text-xs select-text">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#30363D] mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-[11px] font-mono text-[#58A6FF] font-medium">
            Line {lineDetails.lineNumber}
          </span>
          <span className="text-[#8B949E] text-xs">లైన్ వారీ తెలుగు వివరణ (Line Explanation)</span>
        </div>

        <div className="flex items-center space-x-2">
          {isAiLoading ? (
            <span className="text-[11px] text-[#8B949E] flex items-center space-x-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#58A6FF] animate-pulse" />
              <span>AI విశ్లేషణ...</span>
            </span>
          ) : aiExplanation ? (
            <span className="text-[10px] text-[#A371F7] bg-[#A371F7]/10 border border-[#A371F7]/30 px-2 py-0.5 rounded-full flex items-center space-x-1 font-mono">
              <Sparkles className="w-3 h-3 text-[#A371F7]" />
              <span>AI వివరణ చురుకుగా ఉంది</span>
            </span>
          ) : (
            <span className="text-[10px] text-[#3FB950] bg-[#238636]/10 border border-[#238636]/30 px-2 py-0.5 rounded-full flex items-center space-x-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-[#3FB950]" />
              <span>ధృవీకరించిన రూల్-బేస్డ్ వివరణ</span>
            </span>
          )}

          {!aiExplanation && !isAiLoading && getActiveApiKey() && (
            <button
              type="button"
              onClick={triggerAiForLine}
              className="text-[10px] text-[#58A6FF] hover:text-[#79C0FF] hover:underline flex items-center space-x-1 font-mono transition-colors"
              title="Fetch full AI contextual deep dive for this line immediately"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Deep Dive</span>
            </button>
          )}
        </div>
      </div>

      {/* Code statement comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded bg-[#0D1117] border border-[#30363D]">
          <div className="text-[10px] text-[#8B949E] uppercase font-semibold tracking-wider mb-1">
            Original Statement (English)
          </div>
          <code className="font-mono text-xs text-[#E6EDF3] break-all block">
            {lineDetails.sourceText || <span className="text-[#8B949E] italic">(empty line)</span>}
          </code>
        </div>

        <div className="p-2.5 rounded bg-[#0D1117] border border-[#30363D]">
          <div className="text-[10px] text-[#8B949E] uppercase font-semibold tracking-wider mb-1">
            Learning Representation (Telugu)
          </div>
          <code className="font-mono text-xs text-[#58A6FF] break-all block">
            {lineDetails.translatedText || <span className="text-[#8B949E] italic">(empty line)</span>}
          </code>
        </div>
      </div>

      {/* Explanation Points */}
      <div className="space-y-2.5">
        {/* Spoken Telugu Script Box */}
        {teluguScriptWhat && (
          <div className="p-3 rounded-lg bg-[#1F242C] border border-[#58A6FF]/30 space-y-1">
            <div className="text-[11px] font-semibold text-[#58A6FF] flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>ఈ లైన్ ఏమి చేస్తుంది? (Spoken Telugu & Meaning):</span>
            </div>
            <p className="text-xs sm:text-sm text-[#E6EDF3] font-medium leading-relaxed font-telugu pl-5">
              {teluguScriptWhat}
            </p>
          </div>
        )}

        <div className="p-2.5 rounded bg-[#1C2128] border border-[#30363D]/80">
          <div className="flex items-center space-x-1.5 text-[#8B949E] font-medium mb-1">
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span>Phonetic Details / వివరణ:</span>
          </div>
          <p className="text-[#C9D1D9] leading-relaxed pl-5 text-xs">
            {whatItDoes}
          </p>
        </div>

        <div className="p-2.5 rounded bg-[#1C2128] border border-[#30363D]/80">
          <div className="flex items-center space-x-1.5 text-[#3FB950] font-medium mb-1">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>ఎందుకు వాడతాం / Why it is used:</span>
          </div>
          <p className="text-[#E6EDF3] leading-relaxed pl-5 text-xs font-telugu">
            {teluguScriptWhy || whyItIsUsed}
          </p>
        </div>

        {/* Detected Glossary Terms (F4 & I1) */}
        {detectedKeywords.length > 0 && (
          <div className="p-2 rounded bg-[#0D1117] border border-[#30363D] flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-1 text-[#58A6FF] shrink-0 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>కీలక పదాల నిఘంటువు (Keywords):</span>
            </div>
            {detectedKeywords.map((term) => (
              <button
                key={term.id}
                type="button"
                onClick={() => onOpenGlossary && onOpenGlossary(term.term)}
                className="px-2 py-0.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] hover:text-[#58A6FF] border border-[#30363D] text-[11px] font-mono transition-colors flex items-center space-x-1"
                title={`${term.term}: ${term.teluguScript} (${term.plainMeaning})`}
              >
                <span>{term.term}</span>
                <span className="text-[#58A6FF]">({term.teluguScript})</span>
              </button>
            ))}
          </div>
        )}

        {/* Variables Involved & Report Link */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-[#8B949E]">
          {variables && variables.length > 0 ? (
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3 h-3 text-[#58A6FF]" />
              <span>చరరాశులు (Variables):</span>
              <div className="flex flex-wrap gap-1">
                {variables.map((v) => (
                  <span
                    key={v}
                    className="px-1.5 py-0.2 rounded bg-[#0D1117] border border-[#30363D] font-mono text-[#E6EDF3]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleReport}
            className="flex items-center space-x-1 text-[#8B949E] hover:text-[#D29922] transition-colors"
            title="Report inaccurate translation for this line"
          >
            <Flag className="w-3 h-3" />
            <span>తప్పు అనువాదం నివేదించండి</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LineExplanation;
