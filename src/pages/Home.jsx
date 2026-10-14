import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  FolderOpen,
  Sparkles,
  AlertTriangle,
  BookOpen,
  FileCode2,
  Play,
  GitFork,
  GraduationCap,
  FileText
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor.jsx';
import { EditorTabs } from '../components/EditorTabs.jsx';
import { AiTutorPanel } from '../components/AiTutorPanel.jsx';
import { ErrorExplainer } from '../components/ErrorExplainer.jsx';
import { MobileSymbolBar } from '../components/MobileSymbolBar.jsx';
import { CodeRunnerTerminal } from '../components/CodeRunnerTerminal.jsx';
import { TeluguToPythonModal } from '../components/TeluguToPythonModal.jsx';
import { FlowchartVisualizer } from '../components/FlowchartVisualizer.jsx';
import { saveTranslationRequest } from '../utils/storage.js';

const STARTER_CODE = `name = input("Enter your name: ")

if name:
    print("Hello", name)
else:
    print("No name entered")`;

const MAX_CODE_LENGTH = 5000;

export function Home({
  editorRef: externalEditorRef,
  onOpenHistory,
  isAiTutorOpen = false,
  onToggleAiTutor,
  onOpenApiKey,
  onOpenGlossary,
  onOpenSamples,
  onOpenLessons,
  onOpenExportNotes,
}) {
  const navigate = useNavigate();
  const [code, setCode] = useState(STARTER_CODE);
  const [cursorPos, setCursorPos] = useState({ lineNumber: 1, column: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [localTutorOpen, setLocalTutorOpen] = useState(false);

  // Explain Python Error state
  const [isErrorExplainerOpen, setIsErrorExplainerOpen] = useState(false);
  const [highlightedErrorLine, setHighlightedErrorLine] = useState(null);

  // In-Browser Code Runner Terminal & Right Companion state (F1)
  const [isRunnerOpen, setIsRunnerOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState('runner'); // 'runner' | 'tutor'
  const [runnerTriggerCount, setRunnerTriggerCount] = useState(0);

  // Reverse Mode: Telugu to Python state (F6)
  const [isTeluguToPythonOpen, setIsTeluguToPythonOpen] = useState(false);

  // Flowchart visualizer state (F13)
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);

  const localEditorRef = useRef(null);
  const activeEditorRef = externalEditorRef || localEditorRef;

  const activeTutorOpen = onToggleAiTutor ? isAiTutorOpen : localTutorOpen;
  const handleToggleTutor = () => {
    setActiveRightTab('tutor');
    setIsRunnerOpen(true);
    if (onToggleAiTutor) {
      if (!isAiTutorOpen) onToggleAiTutor();
    } else {
      setLocalTutorOpen(true);
    }
  };

  const handleCloseTutor = () => {
    if (onToggleAiTutor && isAiTutorOpen) {
      onToggleAiTutor();
    } else {
      setLocalTutorOpen(false);
    }
  };

  const lineCount = code ? code.split('\n').length : 0;
  const characterCount = code.length;
  const isOverLimit = characterCount > MAX_CODE_LENGTH;

  const handleClearCode = () => {
    setCode('');
    setErrorMessage('');
    setHighlightedErrorLine(null);
  };

  const handleApplyCode = (newCode) => {
    if (typeof newCode === 'string') {
      setCode(newCode);
      if (activeEditorRef.current?.setValue) {
        activeEditorRef.current.setValue(newCode);
      }
    }
  };

  const handleTranslate = () => {
    setErrorMessage('');

    // 1. Validate nonempty code
    if (!code || !code.trim()) {
      setErrorMessage('Editor is empty. Paste or type Python code before translating.');
      return;
    }

    if (isOverLimit) {
      setErrorMessage(`Code length exceeds maximum allowed limit of ${MAX_CODE_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // 2 & 3. Save to localStorage with unique request ID
      const saveResult = saveTranslationRequest(code, 'telugu');

      if (!saveResult.success || !saveResult.id) {
        setErrorMessage(
          saveResult.error || 'Failed to save translation request to local storage.'
        );
        setIsSubmitting(false);
        return;
      }

      const targetUrl = `/translate?id=${encodeURIComponent(saveResult.id)}`;

      // 4. Navigate directly in the same tab using React Router
      navigate(targetUrl);
    } catch (err) {
      console.error('Translation launch error:', err);
      setErrorMessage('An error occurred while launching the translation workspace.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col space-y-4">
      {/* Workspace Heading & AI Companion Quick Launch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col space-y-1">
          <h1 className="text-lg font-semibold text-[#E6EDF3] tracking-tight">
            Python Workspace
          </h1>
          <p className="text-xs text-[#8B949E]">
            Translate Python concepts into Telugu and understand the logic behind your code.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {onOpenLessons && (
            <button
              type="button"
              onClick={onOpenLessons}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-btn text-xs font-medium bg-[#161B22] border border-[#30363D] text-[#58A6FF] hover:text-[#79C0FF] hover:bg-[#1C2128] transition-colors"
              title="Guided Telugu Lessons & Quizzes (పాఠాలు)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>పాఠాలు (Lessons)</span>
            </button>
          )}

          {onOpenSamples && (
            <button
              type="button"
              onClick={onOpenSamples}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-btn text-xs font-medium bg-[#161B22] border border-[#30363D] text-[#3FB950] hover:text-[#56D364] hover:bg-[#1C2128] transition-colors"
              title="One-Click Sample Programs"
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#3FB950]" />
              <span>నమూనా కోడ్ (Samples)</span>
            </button>
          )}

          {onOpenExportNotes && (
            <button
              type="button"
              onClick={() => onOpenExportNotes({ code })}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-btn text-xs font-medium bg-[#161B22] border border-[#30363D] text-[#3FB950] hover:text-[#56D364] hover:bg-[#1C2128] transition-colors"
              title="Export Printable Study Sheet (నోట్స్)"
            >
              <FileText className="w-3.5 h-3.5 text-[#3FB950]" />
              <span>నోట్స్ (Notes)</span>
            </button>
          )}

          {onOpenGlossary && (
            <button
              type="button"
              onClick={() => onOpenGlossary()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-btn text-xs font-medium bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128] transition-colors"
              title="Programming Glossary (నిఘంటువు)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>నిఘంటువు (Glossary)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleTutor}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-btn text-xs font-medium border transition-colors ${
              activeTutorOpen
                ? 'bg-[#1F6FEB]/20 border-[#58A6FF] text-[#58A6FF]'
                : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
            }`}
            title="Toggle AI Coding Companion"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#58A6FF]" />
            <span>{activeTutorOpen ? 'Close AI Tutor' : 'Open AI Tutor'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Right Companion Container (Side-by-side on desktop, stacked on mobile) */}
      <div className={(isRunnerOpen || activeTutorOpen) ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 items-start' : 'w-full'}>
        {/* Main Editor Panel (Border #30363D, 8px radius, solid dark surface) */}
        <div className="rounded-panel border border-[#30363D] bg-[#161B22] overflow-hidden flex flex-col justify-between">
          <div>
            {/* Editor Tab Header */}
            <EditorTabs
              fileName="main.py"
              languageLabel="Python 3"
              lineCount={lineCount}
              charCount={characterCount}
              isReadOnly={false}
              onClear={handleClearCode}
            />

            {/* Mobile Programming Symbol Bar (I7) */}
            <MobileSymbolBar editorRef={activeEditorRef} />

            {/* Monaco Editor */}
            <CodeEditor
              value={code}
              onChange={setCode}
              onCursorChange={setCursorPos}
              editorRef={activeEditorRef}
              height="500px"
              language="python"
              highlightedLine={highlightedErrorLine}
              highlightClass="monaco-error-active-line"
            />
          </div>

          {/* Editor Footer */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-t border-[#30363D] text-[11px] text-[#8B949E] font-mono">
            <span>Paste or type Python code here</span>
            <div className="flex items-center space-x-3">
              <span className={isOverLimit ? 'text-[#F85149]' : ''}>
                {characterCount} / {MAX_CODE_LENGTH} chars
              </span>
              <span className="text-[#30363D]">|</span>
              <span>
                Ln {cursorPos.lineNumber}, Col {cursorPos.column}
              </span>
              <span className="text-[#30363D]">|</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>

        {/* Right Companion Panel: Terminal Output on Right Side of Code OR AI Tutor */}
        {(isRunnerOpen || activeTutorOpen) && (
          <div className="flex flex-col space-y-2">
            {/* Right Panel Tabs Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-1 p-0.5 rounded bg-[#161B22] border border-[#30363D]">
                <button
                  type="button"
                  onClick={() => {
                    setIsRunnerOpen(true);
                    setActiveRightTab('runner');
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    activeRightTab === 'runner'
                      ? 'bg-[#238636] text-white shadow-xs'
                      : 'text-[#8B949E] hover:text-[#E6EDF3]'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>టెర్మినల్ అవుట్‌పుట్ (Terminal)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRightTab('tutor');
                    if (!activeTutorOpen) handleToggleTutor();
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    activeRightTab === 'tutor'
                      ? 'bg-[#1F6FEB] text-white shadow-xs'
                      : 'text-[#8B949E] hover:text-[#E6EDF3]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#58A6FF]" />
                  <span>AI ట్యూటర్ (Tutor)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsRunnerOpen(false);
                  handleCloseTutor();
                }}
                className="text-xs text-[#8B949E] hover:text-[#E6EDF3] px-2 py-1 rounded hover:bg-[#161B22] transition-colors"
                title="Hide right panel"
              >
                మూయి (Hide)
              </button>
            </div>

            {activeRightTab === 'runner' ? (
              <CodeRunnerTerminal
                code={code}
                autoRunTrigger={runnerTriggerCount}
                onClose={() => setIsRunnerOpen(false)}
                onHighlightLine={setHighlightedErrorLine}
                className="min-h-[500px]"
              />
            ) : (
              <AiTutorPanel
                code={code}
                selectedLine={cursorPos.lineNumber}
                onApplyCode={handleApplyCode}
                onOpenApiKey={onOpenApiKey}
                isOpen={true}
                onClose={() => {
                  setActiveRightTab('runner');
                  handleCloseTutor();
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Code to Flowchart Visualizer (Feature F13) */}
      {isFlowchartOpen && (
        <div className="pt-1">
          <FlowchartVisualizer
            code={code}
            onClose={() => setIsFlowchartOpen(false)}
          />
        </div>
      )}

      {/* Explain Python Error Panel (Appears below editor when opened) */}
      {isErrorExplainerOpen && (
        <div className="pt-1">
          <ErrorExplainer
            code={code}
            onApplyCode={handleApplyCode}
            onHighlightLine={setHighlightedErrorLine}
            onOpenApiKey={onOpenApiKey}
            onClose={() => {
              setIsErrorExplainerOpen(false);
              setHighlightedErrorLine(null);
            }}
          />
        </div>
      )}

      {/* Error Message Notice */}
      {errorMessage && (
        <div className="p-3 rounded-md bg-[#161B22] border border-[#F85149]/40 flex items-center space-x-2 text-xs text-[#F85149]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Actions (Directly below editor, left-aligned) */}
      <div className="flex items-center justify-start space-x-2 pt-1 flex-wrap gap-y-2">
        {/* 1. Run Python in Browser (Feature F1) */}
        <button
          type="button"
          onClick={() => {
            setIsRunnerOpen(true);
            setActiveRightTab('runner');
            setRunnerTriggerCount((c) => c + 1);
          }}
          disabled={!code.trim()}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-btn font-semibold text-xs bg-[#238636] hover:bg-[#2EA043] text-white active:bg-[#238636] transition-colors shadow-xs"
          title="Run Python code in browser terminal on the right side"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>అమలు చేయి (Run Code)</span>
        </button>

        {/* 2. Translate to Telugu */}
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isSubmitting || !code.trim() || isOverLimit}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-btn font-medium text-xs border border-[#30363D] bg-[#161B22] hover:bg-[#1C2128] text-[#E6EDF3] transition-colors ${
            isSubmitting || !code.trim() || isOverLimit ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Translate code to Telugu"
        >
          <span>తెలుగులోకి అనువదించు (Translate)</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#58A6FF]" />
        </button>

        {/* 3. Reverse Mode: Telugu to Python (Feature F6) */}
        <button
          type="button"
          onClick={() => setIsTeluguToPythonOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-btn bg-[#1F6FEB]/15 hover:bg-[#1F6FEB]/25 border border-[#58A6FF]/40 text-[#58A6FF] font-medium text-xs transition-colors"
          title="Generate Python from Telugu descriptions"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>తెలుగు నుండి కోడ్ (Reverse Mode)</span>
        </button>

        {/* 4. Code to Flowchart (Feature F13) */}
        <button
          type="button"
          onClick={() => setIsFlowchartOpen((prev) => !prev)}
          disabled={!code.trim()}
          className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-btn border text-xs font-medium transition-colors ${
            isFlowchartOpen
              ? 'bg-[#A371F7]/20 border-[#A371F7] text-[#D2A8FF]'
              : 'bg-[#1C2128] hover:bg-[#30363D]/50 text-[#E6EDF3] border-[#30363D]'
          }`}
          title="Visual Flowchart with Telugu labels"
        >
          <GitFork className="w-3.5 h-3.5 text-[#A371F7]" />
          <span>ఫ్లోచార్ట్ (Flowchart)</span>
        </button>

        {/* 5. Explain Python Error */}
        <button
          type="button"
          onClick={() => {
            setIsErrorExplainerOpen((prev) => !prev);
          }}
          disabled={!code.trim()}
          className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-btn border text-xs font-medium transition-colors ${
            !code.trim()
              ? 'bg-[#1C2128]/50 text-[#8B949E]/50 border-[#30363D]/50 cursor-not-allowed'
              : isErrorExplainerOpen
              ? 'bg-[#F85149]/20 border-[#F85149] text-[#F85149]'
              : 'bg-[#1C2128] hover:bg-[#30363D]/50 text-[#E6EDF3] border-[#30363D]'
          }`}
          title="Analyze Python code for syntax and runtime errors and explain in Telugu"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#F85149]" />
          <span>Explain Python Error</span>
        </button>

        {/* 6. Ask AI Tutor */}
        <button
          type="button"
          onClick={handleToggleTutor}
          className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-btn border text-xs font-medium transition-colors ${
            activeTutorOpen
              ? 'bg-[#1F6FEB]/20 border-[#58A6FF] text-[#58A6FF]'
              : 'bg-[#1C2128] hover:bg-[#30363D]/50 text-[#8B949E] hover:text-[#E6EDF3] border-[#30363D]'
          }`}
          title="Toggle AI Coding Companion"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>{activeTutorOpen ? 'Close AI Tutor' : 'Ask AI Tutor'}</span>
        </button>

        {/* 7. Open Saved Program */}
        {onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-btn bg-[#1C2128] hover:bg-[#30363D]/50 text-[#8B949E] hover:text-[#E6EDF3] border border-[#30363D] font-medium text-xs transition-colors"
            title="Browse Saved Programs"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#58A6FF]" />
            <span>Open Saved Program</span>
          </button>
        )}
      </div>

      {/* Reverse Mode Modal */}
      <TeluguToPythonModal
        isOpen={isTeluguToPythonOpen}
        onClose={() => setIsTeluguToPythonOpen(false)}
        onApplyCode={handleApplyCode}
      />
    </main>
  );
}

export default Home;
