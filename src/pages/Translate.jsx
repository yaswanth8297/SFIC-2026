import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  Plus,
  Activity,
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  Bookmark,
  CheckCheck,
  Play,
  GitFork,
  FileText
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor.jsx';
import { EditorTabs } from '../components/EditorTabs.jsx';
import { ExplanationSection } from '../components/ExplanationSection.jsx';
import { LineExplanation } from '../components/LineExplanation.jsx';
import { ExecutionTracer } from '../components/ExecutionTracer.jsx';
import { LearningQuiz } from '../components/LearningQuiz.jsx';
import { CodeTutor } from '../components/CodeTutor.jsx';
import { ErrorExplainer } from '../components/ErrorExplainer.jsx';
import { CodeRunnerTerminal } from '../components/CodeRunnerTerminal.jsx';
import { FlowchartVisualizer } from '../components/FlowchartVisualizer.jsx';
import { getTranslationRequest, saveProgram, updateTranslationRequest } from '../utils/storage.js';
import { translateCode } from '../utils/translator.js';
import { explainCodeWithGemini } from '../services/gemini.js';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js';

export function Translate({
  onOpenApiKey,
  onOpenAbout,
  onOpenGlossary,
  onReportError,
  onOpenExportNotes,
  onOpenLessons,
  keyUpdateCount = 0,
}) {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('id');

  const [requestData, setRequestData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Editable Code state (Removes read-only mode, enables live updates)
  const [code, setCode] = useState('');
  const [isCodeModified, setIsCodeModified] = useState(false);

  // Right-side companion view ('telugu' translation or 'terminal' output)
  const [rightTab, setRightTab] = useState('telugu'); // 'telugu' | 'terminal'
  const [runnerTriggerCount, setRunnerTriggerCount] = useState(0);

  // Line selection synchronization (Feature One)
  const [selectedLine, setSelectedLine] = useState(1);
  const [tracerLine, setTracerLine] = useState(null);

  // Active educational tool view ('none' | 'tracer' | 'quiz' | 'tutor' | 'error')
  const [activeTool, setActiveTool] = useState('none');

  // Learning mode (Feature Six: 'simple' | 'detailed' | 'interview')
  const [explanationMode, setExplanationMode] = useState('detailed');

  // Transliteration display style ('script' | 'bilingual' | 'phonetic')
  const [transliterationMode, setTransliterationMode] = useState('script');

  // Gemini state
  const [explanationSteps, setExplanationSteps] = useState(null);
  const [modelUsed, setModelUsed] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [geminiError, setGeminiError] = useState(null);

  // Copy state
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Speech synthesis
  const speech = useSpeechSynthesis();

  // 1. Fetch request from storage
  useEffect(() => {
    if (!requestId) {
      setLoadError('No translation request ID provided in the URL.');
      return;
    }

    const res = getTranslationRequest(requestId);
    if (!res.success || !res.data) {
      setLoadError(
        res.error || 'The requested translation could not be found or has expired.'
      );
      return;
    }

    setRequestData(res.data);
    setCode(res.data.code);
  }, [requestId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setIsCodeModified(true);
    if (requestId) {
      updateTranslationRequest(requestId, newCode, 'telugu');
    }
  };

  // 2. Compute Telugu translation dynamically from editable code using lexical tokenizer
  const translatedCode = useMemo(() => {
    if (!code) return '';
    return translateCode(code, transliterationMode);
  }, [code, transliterationMode]);

  // 3. Request Gemini logic explanation on load or mode change
  const triggerGeminiExplanation = React.useCallback(async (bypassCache = false, modeToUse = explanationMode) => {
    if (!code) return;

    // Stop speech synthesis if already playing before fetching new mode
    if (speech?.stop) speech.stop();

    setIsExplaining(true);
    setGeminiError(null);

    try {
      const result = await explainCodeWithGemini(code, bypassCache, modeToUse);
      setExplanationSteps(result.steps);
      setModelUsed(result.modelUsed || null);
    } catch (err) {
      console.warn('Gemini explanation error:', err);
      setGeminiError(err);
    } finally {
      setIsExplaining(false);
    }
  }, [code, explanationMode, speech]);

  useEffect(() => {
    if (code && !isCodeModified) {
      triggerGeminiExplanation(false, explanationMode);
    }
  }, [code, isCodeModified, keyUpdateCount, explanationMode, triggerGeminiExplanation]);

  const handleModeChange = (newMode) => {
    setExplanationMode(newMode);
  };

  // Copy handlers
  const handleCopyOriginal = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const handleCopyTranslated = () => {
    if (!translatedCode) return;
    navigator.clipboard.writeText(translatedCode);
    setCopiedTranslated(true);
    setTimeout(() => setCopiedTranslated(false), 2000);
  };

  // Save to Program History (Feature Eight)
  const handleSaveProgram = () => {
    if (!code) return;
    const firstLine = code.split('\n')[0].replace(/^[#\s]+/, '').slice(0, 30);
    const progName = firstLine ? `Python: ${firstLine}` : 'Saved Python Program';

    const res = saveProgram({
      name: progName,
      code,
      language: 'telugu',
      translatedCode,
      explanationMode,
      explanationData: { steps: explanationSteps },
    });

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const toggleTool = (toolName) => {
    setActiveTool((prev) => (prev === toolName ? 'none' : toolName));
    if (toolName !== 'tracer') {
      setTracerLine(null);
    }
  };

  const origLineCount = code ? code.split('\n').length : 0;
  const origCharCount = code ? code.length : 0;

  const transLineCount = translatedCode ? translatedCode.split('\n').length : 0;
  const transCharCount = translatedCode ? translatedCode.length : 0;

  // Active highlighted line: tracer line takes priority during active trace, otherwise selectedLine
  const activeEditorHighlight = activeTool === 'tracer' && tracerLine ? tracerLine : selectedLine;
  const activeHighlightClass =
    activeTool === 'tracer' && tracerLine ? 'monaco-tracer-active-line' : 'monaco-sync-active-line';

  // Empty / missing state
  if (loadError) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center">
        <div className="max-w-md w-full rounded-panel bg-[#161B22] border border-[#30363D] p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[#F85149] mx-auto" />
          <h2 className="text-sm font-semibold text-[#E6EDF3]">
            Translation Request Not Found
          </h2>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            {loadError}
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-btn bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home Workspace</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!requestData) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center">
        <div className="text-xs text-[#8B949E] font-mono">
          Loading translation workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 w-full flex flex-col space-y-4">
      {/* Page Heading & Actions Bar (Left-aligned, compact) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#30363D] gap-3">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-1.5 text-xs text-[#8B949E] mb-1">
            <Link to="/" className="hover:text-[#58A6FF] transition-colors">
              CodeToTelugu
            </Link>
            <span>/</span>
            <span className="text-[#E6EDF3]">Translation</span>
          </div>

          <h1 className="text-lg font-semibold text-[#E6EDF3] tracking-tight">
            Code Translation
          </h1>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-1">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-btn bg-[#1C2128] hover:bg-[#30363D]/50 text-[#E6EDF3] border border-[#30363D] text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#58A6FF]" />
            <span>New Translation</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveProgram}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-btn border text-xs transition-colors ${
              saveSuccess
                ? 'bg-[#238636]/20 border-[#3FB950] text-[#3FB950]'
                : 'bg-[#1C2128] hover:bg-[#30363D]/50 text-[#8B949E] hover:text-[#E6EDF3] border-[#30363D]'
            }`}
            title="Save Program to Local History"
          >
            {saveSuccess ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-[#3FB950]" />
                <span className="text-[#3FB950]">Saved to History</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-[#58A6FF]" />
                <span>Save Program</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyOriginal}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-btn bg-[#1C2128] hover:bg-[#30363D]/50 text-[#8B949E] hover:text-[#E6EDF3] border border-[#30363D] text-xs transition-colors"
            title="Copy Original Code"
          >
            {copiedOriginal ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3FB950]" />
                <span className="text-[#3FB950]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Original</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyTranslated}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-btn bg-[#1C2128] hover:bg-[#30363D]/50 text-[#8B949E] hover:text-[#E6EDF3] border border-[#30363D] text-xs transition-colors"
            title="Copy Translated Code"
          >
            {copiedTranslated ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3FB950]" />
                <span className="text-[#3FB950]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Translation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Tool Strip: Runner, Tracer, Flowchart, Quiz, Tutor, Error */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* 1. Run in Browser Terminal (Feature F1) */}
        <button
          type="button"
          onClick={() => {
            setRightTab('terminal');
            setRunnerTriggerCount((c) => c + 1);
            if (activeTool === 'runner') setActiveTool('none');
          }}
          className={`px-3 py-1.5 rounded-btn text-xs font-semibold border flex items-center space-x-1.5 transition-colors shrink-0 ${
            rightTab === 'terminal'
              ? 'bg-[#238636] border-[#3FB950] text-white shadow-xs'
              : 'bg-[#161B22] border-[#30363D] text-[#3FB950] hover:bg-[#1C2128]'
          }`}
          title="Run Python code in browser terminal on the right side"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>అమలు చేయి (Run Code)</span>
        </button>

        {/* 2. Visual Execution Tracer (Feature F2) */}
        <button
          type="button"
          onClick={() => toggleTool('tracer')}
          className={`px-3 py-1.5 rounded-btn text-xs font-medium border flex items-center space-x-1.5 transition-colors shrink-0 ${
            activeTool === 'tracer'
              ? 'bg-[#238636] border-[#3FB950] text-white'
              : 'bg-[#161B22] border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128]'
          }`}
          title="Trace code line-by-line with Telugu narration"
        >
          <Activity className="w-3.5 h-3.5 text-[#3FB950]" />
          <span>దశలవారీ యానిమేషన్ (Visual Tracer)</span>
        </button>

        {/* 3. Code to Flowchart (Feature F13) */}
        <button
          type="button"
          onClick={() => toggleTool('flowchart')}
          className={`px-3 py-1.5 rounded-btn text-xs font-medium border flex items-center space-x-1.5 transition-colors shrink-0 ${
            activeTool === 'flowchart'
              ? 'bg-[#A371F7] border-[#D2A8FF] text-white'
              : 'bg-[#161B22] border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128]'
          }`}
          title="Visual Flowchart with Telugu labels"
        >
          <GitFork className="w-3.5 h-3.5 text-[#A371F7]" />
          <span>ఫ్లోచార్ట్ (Flowchart)</span>
        </button>

        {/* 4. Quiz */}
        <button
          type="button"
          onClick={() => toggleTool('quiz')}
          className={`px-3 py-1.5 rounded-btn text-xs font-medium border flex items-center space-x-1.5 transition-colors shrink-0 ${
            activeTool === 'quiz'
              ? 'bg-[#1F6FEB] border-[#58A6FF] text-white'
              : 'bg-[#161B22] border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>క్విజ్ (Quiz)</span>
        </button>

        {/* 5. Tutor */}
        <button
          type="button"
          onClick={() => toggleTool('tutor')}
          className={`px-3 py-1.5 rounded-btn text-xs font-medium border flex items-center space-x-1.5 transition-colors shrink-0 ${
            activeTool === 'tutor'
              ? 'bg-[#1F6FEB] border-[#58A6FF] text-white'
              : 'bg-[#161B22] border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>AI ట్యూటర్ (Ask Tutor)</span>
        </button>

        {/* 6. Error Explainer */}
        <button
          type="button"
          onClick={() => toggleTool('error')}
          className={`px-3 py-1.5 rounded-btn text-xs font-medium border flex items-center space-x-1.5 transition-colors shrink-0 ${
            activeTool === 'error'
              ? 'bg-[#F85149]/30 border-[#F85149] text-white'
              : 'bg-[#161B22] border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#F85149]" />
          <span>లోపాల వివరణ (Explain Error)</span>
        </button>

        {/* 7. Export Notes (Feature F12) */}
        {onOpenExportNotes && (
          <button
            type="button"
            onClick={() => {
              onOpenExportNotes({
                code,
                lineExplanations: explanationSteps?.lineByLine || [],
                overallExplanation: explanationSteps?.overall || '',
                executionOutput: '',
              });
            }}
            className="px-3 py-1.5 rounded-btn text-xs font-medium border border-[#30363D] bg-[#161B22] hover:bg-[#1C2128] text-[#3FB950] flex items-center space-x-1.5 transition-colors shrink-0"
            title="Export Printable Study Sheet or Classroom Worksheet (F12)"
          >
            <FileText className="w-3.5 h-3.5 text-[#3FB950]" />
            <span>నోట్స్ ఎగుమతి (Export Notes)</span>
          </button>
        )}
      </div>

      {/* Interactive Tool Expanded Area */}
      {activeTool === 'tracer' && (
        <ExecutionTracer
          code={code}
          onStepLineChange={(line) => setTracerLine(line)}
          onClose={() => {
            setActiveTool('none');
            setTracerLine(null);
          }}
        />
      )}

      {activeTool === 'flowchart' && (
        <FlowchartVisualizer
          code={code}
          onClose={() => setActiveTool('none')}
        />
      )}

      {activeTool === 'quiz' && (
        <LearningQuiz
          code={code}
          onOpenApiKey={onOpenApiKey}
          onClose={() => setActiveTool('none')}
        />
      )}

      {activeTool === 'tutor' && (
        <CodeTutor
          code={code}
          selectedLine={selectedLine}
          onOpenApiKey={onOpenApiKey}
          onClose={() => setActiveTool('none')}
        />
      )}

      {activeTool === 'error' && (
        <ErrorExplainer
          code={code}
          onOpenApiKey={onOpenApiKey}
          onHighlightLine={(line) => setSelectedLine(line || 1)}
          onClose={() => setActiveTool('none')}
        />
      )}

      {/* Main Two-Panel Layout (Desktop: Side by Side, Mobile: Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel: Python Source Code (Editable, Read-Only Removed) */}
        <div className="rounded-panel border border-[#30363D] bg-[#161B22] overflow-hidden flex flex-col justify-between">
          <div>
            <EditorTabs
              fileName="main.py"
              languageLabel="Python"
              lineCount={origLineCount}
              charCount={origCharCount}
              isReadOnly={false}
              badge="Original Code (English)"
              onCopy={handleCopyOriginal}
              copied={copiedOriginal}
              onClear={() => handleCodeChange('')}
            />

            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              readOnly={false}
              height="380px"
              language="python"
              highlightedLine={activeEditorHighlight}
              highlightClass={activeHighlightClass}
              onLineSelect={(line) => setSelectedLine(line)}
            />
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-t border-[#30363D] text-[11px] text-[#8B949E] font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-[#3FB950] font-medium">సవరించదగినది (Editable)</span>
              {isCodeModified && (
                <button
                  type="button"
                  onClick={() => {
                    triggerGeminiExplanation(true, explanationMode);
                    setIsCodeModified(false);
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#1F6FEB]/20 text-[#58A6FF] border border-[#58A6FF]/40 hover:bg-[#1F6FEB]/30 transition-colors"
                  title="Update AI Logic Explanation for edited code"
                >
                  AI వివరణను నవీకరించండి (Update AI)
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>{origCharCount} chars</span>
              <span className="text-[#30363D]">|</span>
              <span className="text-[#58A6FF]">Click any line to inspect</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Telugu Transliterated Learning Code OR Terminal Output */}
        <div className="rounded-panel border border-[#30363D] bg-[#161B22] overflow-hidden flex flex-col justify-between">
          <div>
            {/* Right Panel Header with Tab Switcher */}
            <div className="px-3 py-1.5 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-1 p-0.5 rounded bg-[#0D1117] border border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setRightTab('telugu')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    rightTab === 'telugu'
                      ? 'bg-[#238636] text-white shadow-xs'
                      : 'text-[#8B949E] hover:text-[#E6EDF3]'
                  }`}
                >
                  తెలుగు అనువాదం (Telugu Code)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRightTab('terminal');
                    setRunnerTriggerCount((c) => c + 1);
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    rightTab === 'terminal'
                      ? 'bg-[#238636] text-white shadow-xs'
                      : 'text-[#8B949E] hover:text-[#E6EDF3]'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>టెర్మినల్ అవుట్‌పుట్ (Terminal)</span>
                </button>
              </div>

              {rightTab === 'telugu' && (
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handleCopyTranslated}
                    className="p-1 rounded text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
                    title="Copy Translated Code"
                  >
                    {copiedTranslated ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5 text-[#8B949E]" />}
                  </button>
                </div>
              )}
            </div>

            {rightTab === 'telugu' ? (
              <>
                {/* Transliteration Style Switcher (I1 & I4) */}
                <div className="flex items-center justify-between px-3 py-1 bg-[#0D1117] border-b border-[#30363D] text-xs">
                  <span className="text-[#8B949E] text-[11px] font-medium">అనువాద శైలి (Style):</span>
                  <div className="flex items-center space-x-1 p-0.5 rounded bg-[#161B22] border border-[#30363D]">
                    <button
                      type="button"
                      onClick={() => setTransliterationMode('script')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        transliterationMode === 'script'
                          ? 'bg-[#238636] text-white shadow-xs'
                          : 'text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                      title="Pure Telugu script keywords"
                    >
                      తెలుగు లిపి
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransliterationMode('bilingual')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        transliterationMode === 'bilingual'
                          ? 'bg-[#238636] text-white shadow-xs'
                          : 'text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                      title="Telugu script with English in brackets"
                    >
                      ద్విభాష (Bilingual)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransliterationMode('phonetic')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        transliterationMode === 'phonetic'
                          ? 'bg-[#238636] text-white shadow-xs'
                          : 'text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                      title="Romanized Tenglish pronunciation"
                    >
                      ఉచ్చారణ (Tenglish)
                    </button>
                  </div>
                </div>

                <CodeEditor
                  value={translatedCode}
                  readOnly={true}
                  height="340px"
                  language="python"
                  highlightedLine={activeEditorHighlight}
                  highlightClass={activeHighlightClass}
                  onLineSelect={(line) => setSelectedLine(line)}
                />

                <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-t border-[#30363D] text-[11px] text-[#8B949E]">
                  <span>విద్యా ప్రయోజనాల కొరకు తెలుగు అనువాదం</span>
                  <span className="font-mono text-[#58A6FF]">సమకాలీకరించబడింది (Synced)</span>
                </div>
              </>
            ) : (
              <CodeRunnerTerminal
                code={code}
                autoRunTrigger={runnerTriggerCount}
                onHighlightLine={(line) => setSelectedLine(line || 1)}
                onClose={() => setRightTab('telugu')}
                className="border-none shadow-none rounded-none min-h-[420px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Feature One: Synchronized Line Explanation Card */}
      <LineExplanation
        selectedLine={selectedLine}
        sourceCode={code}
        translatedCode={translatedCode}
        onOpenApiKey={onOpenApiKey}
        onOpenGlossary={onOpenGlossary}
        onReportError={onReportError}
      />

      {/* Feature Six: Logic Explanation Section with Learning Modes and Global Audio */}
      <ExplanationSection
        steps={explanationSteps}
        modelUsed={modelUsed}
        isLoading={isExplaining}
        error={geminiError}
        mode={explanationMode}
        onModeChange={handleModeChange}
        onRetry={() => triggerGeminiExplanation(true, explanationMode)}
        onOpenApiKey={onOpenApiKey}
        speech={speech}
        onReportError={onReportError}
        onSelectLine={(line) => setSelectedLine(line)}
      />
    </main>
  );
}

export default Translate;
