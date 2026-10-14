import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Copy,
  Check,
  X,
  Volume2
} from 'lucide-react';
import { runPythonCode } from '../services/pythonRunner.js';

export function CodeRunnerTerminal({
  code,
  onClose,
  onHighlightLine,
  autoRunTrigger = 0,
  className = '',
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [result, setResult] = useState(null);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showInputBox, setShowInputBox] = useState(false);
  const prevTriggerRef = React.useRef(autoRunTrigger);

  const handleRun = async () => {
    setIsRunning(true);
    setStatusMsg('ప్రారంభమవుతోంది... (Starting)');
    setResult(null);

    try {
      const res = await runPythonCode(code, customInput, (msg) => setStatusMsg(msg));
      setResult(res);

      if (res.errorInfo?.line && onHighlightLine) {
        onHighlightLine(res.errorInfo.line);
      } else if (onHighlightLine) {
        onHighlightLine(null);
      }
    } catch (err) {
      setResult({
        success: false,
        stdout: '',
        stderr: err.message || 'Execution error',
        executionTimeMs: 0,
        errorInfo: {
          type: 'SystemError',
          line: null,
          teluguExplanation: 'బ్రౌజర్‌లో పైథాన్ రన్ చేయడంలో అంతర్గత లోపం ఏర్పడింది.',
          suggestion: 'దయచేసి పేజీని రీఫ్రెష్ చేసి మళ్లీ ప్రయత్నించండి.',
        },
        engineUsed: 'offline_tracer',
      });
    } finally {
      setIsRunning(false);
      setStatusMsg('');
    }
  };

  const handleCopy = () => {
    if (!result?.stdout) return;
    navigator.clipboard.writeText(result.stdout);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleSpeakOutput = () => {
    if (!window.speechSynthesis || !result?.stdout) return;
    window.speechSynthesis.cancel();
    const text = `అవుట్‌పుట్ ఫలితం: ${result.stdout}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'te-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  React.useEffect(() => {
    if (autoRunTrigger > 0 && autoRunTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = autoRunTrigger;
      handleRun();
    }
  }, [autoRunTrigger]);

  return (
    <div className={`w-full rounded-panel border border-[#30363D] bg-[#0D1117] overflow-hidden shadow-xl animate-in fade-in duration-200 ${className || 'mb-4'}`}>
      {/* Terminal Titlebar */}
      <div className="px-4 py-2 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#3FB950]" />
          <span className="font-semibold text-xs text-[#E6EDF3]">
            ఇంటరాక్టివ్ పైథాన్ టెర్మినల్ (In-Browser Execution)
          </span>
          {result && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center space-x-1 ${
                result.success
                  ? 'bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40'
                  : 'bg-[#DA3633]/20 text-[#F85149] border border-[#DA3633]/40'
              }`}
            >
              {result.success ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>విజయవంతం (Success)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>లోపం (Error)</span>
                </>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Engine indicator */}
          {result && (
            <span className="text-[10px] text-[#8B949E] flex items-center space-x-1 font-mono hidden sm:inline-flex">
              <Cpu className="w-3 h-3 text-[#58A6FF]" />
              <span>{result.engineUsed === 'pyodide' ? 'WebAssembly Pyodide' : 'Offline Interpreter'}</span>
            </span>
          )}

          {/* Close Terminal button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Action Controls */}
      <div className="px-4 py-2.5 bg-[#161B22]/70 border-b border-[#30363D] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          {/* Main Run Button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning || !code?.trim()}
            className={`px-4 py-1.5 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all shadow-xs ${
              isRunning || !code?.trim()
                ? 'bg-[#238636]/50 text-white/50 cursor-not-allowed'
                : 'bg-[#238636] hover:bg-[#2EA043] text-white active:scale-95'
            }`}
            title="Run Python code in browser (Ctrl+Enter)"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'రన్ అవుతోంది...' : 'అమలు చేయి (Run Code)'}</span>
          </button>

          {/* Stdin Input Toggle */}
          <button
            type="button"
            onClick={() => setShowInputBox((p) => !p)}
            className={`px-2.5 py-1.5 rounded-md border text-xs transition-colors ${
              showInputBox
                ? 'bg-[#1F6FEB]/20 text-[#58A6FF] border-[#58A6FF]'
                : 'bg-[#21262D] text-[#8B949E] border-[#30363D] hover:text-[#E6EDF3]'
            }`}
            title="Provide input() values"
          >
            <span>ఇన్‌పుట్ డేటా (Inputs)</span>
          </button>
        </div>

        {/* Output actions */}
        {result?.stdout && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSpeakOutput}
              className="px-2 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#58A6FF] border border-[#30363D] text-xs flex items-center space-x-1"
              title="Listen to output in Telugu"
            >
              <Volume2 className="w-3 h-3" />
              <span>వినండి (Listen)</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] border border-[#30363D] text-xs flex items-center space-x-1"
              title="Copy output"
            >
              {copiedOutput ? (
                <>
                  <Check className="w-3 h-3 text-[#3FB950]" />
                  <span className="text-[#3FB950]">కాపీ అయింది</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>కాపీ (Copy)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Interactive Stdin Drawer */}
      {showInputBox && (
        <div className="p-3 bg-[#161B22] border-b border-[#30363D] space-y-1">
          <label className="block text-[11px] font-medium text-[#8B949E]">
            input() ఫంక్షన్‌ల కొరకు విలువలు (ఒక్కొక్క లైన్‌లో ఒక్కో విలువ ఇవ్వండి):
          </label>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="ఉదాహరణ:&#10;రాజు&#10;25"
            rows={2}
            className="w-full p-2 bg-[#0D1117] border border-[#30363D] rounded font-mono text-xs text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"
          />
        </div>
      )}

      {/* Terminal Screen / Output Log */}
      <div className="p-4 font-mono text-xs min-h-[220px] max-h-[460px] flex-1 overflow-y-auto bg-[#0D1117] select-text">
        {isRunning ? (
          <div className="flex items-center space-x-2 text-[#58A6FF] py-6 justify-center">
            <span className="w-2 h-2 rounded-full bg-[#58A6FF] animate-ping" />
            <span>{statusMsg || 'పైథాన్ ప్రోగ్రామ్ నడుస్తోంది...'}</span>
          </div>
        ) : !result ? (
          <div className="text-[#6E7681] py-8 text-center">
            <p>"అమలు చేయి (Run Code)" బటన్‌ను క్లిక్ చేసి టెర్మినల్ అవుట్‌పుట్‌ను చూడండి.</p>
            <p className="text-[11px] mt-1 text-[#484F58]">
              Pyodide WebAssembly ద్వారా మీ బ్రౌజర్‌లోనే సర్వర్ లేకుండా నడుస్తుంది.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Stdout Output */}
            {result.stdout ? (
              <div className="space-y-1">
                <span className="text-[10px] text-[#3FB950] font-semibold uppercase tracking-wider block">
                  Output (ఫలితం):
                </span>
                <pre className="text-[#E6EDF3] whitespace-pre-wrap leading-relaxed text-[13px] bg-[#161B22]/60 p-3 rounded border border-[#30363D]/60 font-mono">
                  {result.stdout}
                </pre>
              </div>
            ) : result.success ? (
              <div className="text-[#8B949E] italic py-2">
                (ప్రోగ్రామ్ విజయవంతంగా పూర్తయింది. ఎలాంటి print అవుట్‌పుట్ లేదు)
              </div>
            ) : null}

            {/* Error Message & Telugu Error Explanation (I5) */}
            {!result.success && result.errorInfo && (
              <div className="p-3.5 rounded-lg bg-[#DA3633]/10 border border-[#F85149]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#F85149] flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{result.errorInfo.type}</span>
                    {result.errorInfo.line && (
                      <span className="text-xs bg-[#DA3633]/20 px-2 py-0.5 rounded font-mono">
                        Line {result.errorInfo.line}
                      </span>
                    )}
                  </span>
                </div>

                {/* Plain Telugu Explanation of Runtime Error */}
                <p className="text-xs sm:text-sm text-[#E6EDF3] font-telugu leading-relaxed font-medium">
                  {result.errorInfo.teluguExplanation}
                </p>

                {/* Actionable Suggestion */}
                <div className="text-xs text-[#8B949E] pt-1 border-t border-[#F85149]/20 font-telugu">
                  <span className="text-[#F85149] font-semibold">పరిష్కారం (Fix): </span>
                  <span>{result.errorInfo.suggestion}</span>
                </div>
              </div>
            )}

            {/* Raw Traceback (Collapsible) */}
            {result.stderr && (
              <details className="text-[11px] text-[#8B949E] pt-1">
                <summary className="cursor-pointer hover:text-[#E6EDF3]">
                  సాంకేతిక వివరాలు (Technical Traceback)
                </summary>
                <pre className="mt-1 p-2 rounded bg-[#161B22] text-[#F85149] overflow-x-auto text-[11px]">
                  {result.stderr}
                </pre>
              </details>
            )}

            {/* Execution time banner */}
            <div className="pt-2 text-[10px] text-[#6E7681] flex items-center space-x-3 border-t border-[#30363D]/40 font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="w-2.5 h-2.5" />
                <span>సమయం: {result.executionTimeMs}ms</span>
              </span>
              <span>•</span>
              <span>ఇంజిన్: {result.engineUsed}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeRunnerTerminal;
