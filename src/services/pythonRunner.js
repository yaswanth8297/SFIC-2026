/**
 * In-Browser Python Execution Engine for CodeToTelugu (Feature F1).
 * Supports Pyodide (Python compiled to WebAssembly) with fallback to
 * our sandboxed execution evaluator for offline/low-spec devices.
 */

import { traceExecution } from './tracerService.js';

let pyodideInstance = null;
let pyodideLoadingPromise = null;

/**
 * Loads Pyodide from CDN lazily with progress tracking.
 * @param {(progress: string) => void} [onProgress]
 */
export async function getPyodide(onProgress) {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  pyodideLoadingPromise = (async () => {
    try {
      if (onProgress) onProgress('పైథాన్ ఇంజిన్ లోడ్ అవుతోంది... (Loading Python runtime)');

      // Check if pyodide script is already present in document
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
          document.head.appendChild(script);
        });
      }

      if (onProgress) onProgress('WebAssembly ప్రారంభమవుతోంది... (Initializing WebAssembly)');

      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      pyodideInstance = pyodide;
      return pyodide;
    } catch (err) {
      pyodideLoadingPromise = null;
      throw err;
    }
  })();

  return pyodideLoadingPromise;
}

/**
 * Translate common Python runtime exceptions into spoken Telugu explanations.
 * @param {string} rawError
 * @returns {{ type: string, line: number | null, teluguExplanation: string, suggestion: string }}
 */
export function explainRuntimeErrorInTelugu(rawError) {
  if (!rawError) {
    return {
      type: 'Unknown',
      line: null,
      teluguExplanation: 'గుర్తుతెలియని లోపం సంభవించింది.',
      suggestion: 'కోడ్‌ను ఒకసారి సరిచూడండి.',
    };
  }

  // Extract line number if available in traceback
  const lineMatch = rawError.match(/line (\d+)/i);
  const line = lineMatch ? parseInt(lineMatch[1], 10) : null;

  if (rawError.includes('ZeroDivisionError')) {
    return {
      type: 'ZeroDivisionError',
      line,
      teluguExplanation: 'సున్నా (0) తో ఏ సంఖ్యనూ భాగించలేము (Cannot divide by zero). గణితంలో ఇది అసాధ్యం.',
      suggestion: 'హారంలో (denominator) సున్నా కాకుండా వేరే సంఖ్య వచ్చేలా చూసుకోండి.',
    };
  }

  if (rawError.includes('NameError')) {
    const varMatch = rawError.match(/name '(\w+)' is not defined/);
    const varName = varMatch ? varMatch[1] : 'వేరియబుల్';
    return {
      type: 'NameError',
      line,
      teluguExplanation: `"${varName}" అనే పేరుతో ఎలాంటి చరరాశి (variable) లేదా ఫంక్షన్ ముందుగా తయారుచేయబడలేదు.`,
      suggestion: `"${varName}" స్పెల్లింగ్ సరిగ్గా ఉందో లేదో చూడండి లేదా లైన్ కంటే ముందే దానికి ఒక విలువను ఇవ్వండి (ఉదా: ${varName} = 0).`,
    };
  }

  if (rawError.includes('IndexError')) {
    return {
      type: 'IndexError',
      line,
      teluguExplanation: 'జాబితా (list) లో లేని ఇండెక్స్ స్థానాన్ని పొందడానికి ప్రయత్నించారు (List index out of range).',
      suggestion: 'జాబితా పరిమాణాన్ని (len) పరిశీలించి సరైన ఇండెక్స్ నంబర్ వాడండి. పైథాన్‌లో ఇండెక్స్ 0 తో ప్రారంభమవుతుంది.',
    };
  }

  if (rawError.includes('TypeError')) {
    return {
      type: 'TypeError',
      line,
      teluguExplanation: 'సరిపోలని వేర్వేరు డేటా రకాల మధ్య ఈ ఆపరేషన్ చేయడం కుదరదు (ఉదాహరణకు స్ట్రింగ్ మరియు నంబర్‌ను కూడటం).',
      suggestion: 'అవసరమైన చోట int() లేదా str() ఫంక్షన్ ఉపయోగించి డేటా రకాన్ని మార్చండి (Type Casting).',
    };
  }

  if (rawError.includes('ValueError')) {
    return {
      type: 'ValueError',
      line,
      teluguExplanation: 'ఫంక్షన్‌కు సరైన రకం డేటా వచ్చినప్పటికీ, అందులోని విలువ చెల్లనిదిగా ఉంది.',
      suggestion: 'ఇచ్చిన ఇన్‌పుట్ విలువ ఫంక్షన్ ఆశించిన రూపంలో ఉందో లేదో సరిచూడండి.',
    };
  }

  if (rawError.includes('SyntaxError')) {
    return {
      type: 'SyntaxError',
      line,
      teluguExplanation: 'పైథాన్ వ్యాకరణ నియమాలలో లోపం ఉంది (ఉదాహరణకు కోలన్ : మర్చిపోవడం లేదా బ్రాకెట్లు మూయకపోవడం).',
      suggestion: 'ఈ లైన్ చివర కోలన్ : ఉందో లేదో మరియు కొటేషన్లు, బ్రాకెట్లు సరిగ్గా సరిపోయాయో లేదో చూడండి.',
    };
  }

  if (rawError.includes('IndentationError')) {
    return {
      type: 'IndentationError',
      line,
      teluguExplanation: 'లైన్ల ముందు ఖాళీ స్థలం (indentation) సరిగ్గా లేదు. పైథాన్ లోపలి బ్లాక్‌లకు 4 స్పేస్‌ల ఖాళీ తప్పనిసరి.',
      suggestion: 'షరతు (if) లేదా లూప్ (for/while) లోపలి లైన్లకు కచ్చితంగా Tab (4 ఖాళీలు) ఇవ్వండి.',
    };
  }

  return {
    type: 'RuntimeError',
    line,
    teluguExplanation: 'ప్రోగ్రామ్ రన్ అవుతున్నప్పుడు లోపం ఏర్పడింది.',
    suggestion: rawError.split('\n').filter(Boolean).pop() || 'కోడ్‌ను పరిశీలించండి.',
  };
}

/**
 * Execute Python code in the browser.
 * Uses Pyodide if available/reachable, with graceful offline tracer fallback.
 *
 * @param {string} pythonCode
 * @param {string} [inputData=''] - User interactive stdin inputs
 * @param {(progress: string) => void} [onProgress]
 * @returns {Promise<{
 *   success: boolean,
 *   stdout: string,
 *   stderr: string,
 *   executionTimeMs: number,
 *   errorInfo: ReturnType<typeof explainRuntimeErrorInTelugu> | null,
 *   engineUsed: 'pyodide' | 'offline_tracer'
 * }>}
 */
export async function runPythonCode(pythonCode, inputData = '', onProgress) {
  const startTime = performance.now();

  if (!pythonCode || !pythonCode.trim()) {
    return {
      success: true,
      stdout: '',
      stderr: '',
      executionTimeMs: 0,
      errorInfo: null,
      engineUsed: 'offline_tracer',
    };
  }

  // 1. Try Pyodide execution
  try {
    const pyodide = await getPyodide(onProgress);

    if (onProgress) onProgress('కోడ్ అమలు అవుతోంది... (Running code)');

    let outputBuffer = '';
    let errorBuffer = '';

    pyodide.setStdout({
      batched: (text) => {
        outputBuffer += text + '\n';
      },
    });

    pyodide.setStderr({
      batched: (text) => {
        errorBuffer += text + '\n';
      },
    });

    // Provide mock stdin input stream if inputs provided
    const inputLines = inputData.split('\n');
    let inputIdx = 0;
    pyodide.setStdin({
      stdin: () => {
        if (inputIdx < inputLines.length) {
          return inputLines[inputIdx++] + '\n';
        }
        return '0\n';
      },
    });

    // Run Python
    await pyodide.runPythonAsync(pythonCode);

    const endTime = performance.now();

    return {
      success: true,
      stdout: outputBuffer.trimEnd(),
      stderr: errorBuffer.trimEnd(),
      executionTimeMs: Math.round(endTime - startTime),
      errorInfo: null,
      engineUsed: 'pyodide',
    };
  } catch (pyErr) {
    console.warn('Pyodide execution or load failed, attempting safe offline tracer fallback:', pyErr);

    // If Pyodide failed due to script error, translate it
    if (pyodideInstance && pyErr.message) {
      const endTime = performance.now();
      const errorInfo = explainRuntimeErrorInTelugu(pyErr.message);
      return {
        success: false,
        stdout: '',
        stderr: pyErr.message,
        executionTimeMs: Math.round(endTime - startTime),
        errorInfo,
        engineUsed: 'pyodide',
      };
    }

    // Offline Sandboxed Fallback: Run safe AST tracer
    if (onProgress) onProgress('ఆఫ్‌లైన్ ఎగ్జిక్యూషన్ ఇంజిన్‌తో నడుస్తోంది... (Using offline runner)');

    const traceResult = traceExecution(pythonCode);
    const endTime = performance.now();

    if (traceResult.success) {
      const output = (traceResult.finalOutput || []).join('\n');
      return {
        success: true,
        stdout: output,
        stderr: '',
        executionTimeMs: Math.round(endTime - startTime),
        errorInfo: null,
        engineUsed: 'offline_tracer',
      };
    } else {
      const errorInfo = explainRuntimeErrorInTelugu(traceResult.error || 'Syntax error in code');
      return {
        success: false,
        stdout: (traceResult.finalOutput || []).join('\n'),
        stderr: traceResult.error || 'Execution stopped due to syntax or bounds',
        executionTimeMs: Math.round(endTime - startTime),
        errorInfo,
        engineUsed: 'offline_tracer',
      };
    }
  }
}
