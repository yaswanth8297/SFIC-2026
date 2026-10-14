/**
 * Line mapping and contextual line information utility for CodeToTelugu.
 * Synchronizes lines between original Python source and translated Telugu code.
 */

/**
 * Split code into lines safely handling \r\n and \n.
 *
 * @param {string} code
 * @returns {string[]}
 */
export function splitLines(code) {
  if (typeof code !== 'string') return [];
  return code.split(/\r?\n/);
}

/**
 * Maps a line number from source code to translated code.
 * In CodeToTelugu lexical translation, line counts and newlines are preserved 1:1,
 * but this utility safely validates, normalizes, and handles boundary fallbacks.
 *
 * @param {number} sourceLineNumber - 1-based line number in source code
 * @param {string} sourceCode
 * @param {string} translatedCode
 * @returns {number} 1-based mapped line number in translated code
 */
export function mapSourceLineToTranslated(sourceLineNumber, sourceCode, translatedCode) {
  const transLines = splitLines(translatedCode || '');
  const totalTransLines = Math.max(1, transLines.length);

  if (typeof sourceLineNumber !== 'number' || isNaN(sourceLineNumber) || sourceLineNumber < 1) {
    return 1;
  }

  // Safe boundary clamp
  return Math.min(Math.max(1, sourceLineNumber), totalTransLines);
}

/**
 * Maps a line number from translated code back to source code.
 *
 * @param {number} translatedLineNumber - 1-based line number in translated code
 * @param {string} sourceCode
 * @param {string} translatedCode
 * @returns {number} 1-based mapped line number in source code
 */
export function mapTranslatedLineToSource(translatedLineNumber, sourceCode, _translatedCode) {
  const srcLines = splitLines(sourceCode || '');
  const totalSrcLines = Math.max(1, srcLines.length);

  if (typeof translatedLineNumber !== 'number' || isNaN(translatedLineNumber) || translatedLineNumber < 1) {
    return 1;
  }

  return Math.min(Math.max(1, translatedLineNumber), totalSrcLines);
}

/**
 * Get comprehensive info for a line across both code versions.
 *
 * @param {string} sourceCode
 * @param {string} translatedCode
 * @param {number} lineNumber - 1-based line number
 * @returns {{
 *   lineNumber: number,
 *   sourceText: string,
 *   translatedText: string,
 *   isEmpty: boolean,
 *   isComment: boolean,
 *   indentation: number,
 *   variables: string[]
 * }}
 */
export function getLineDetails(sourceCode, translatedCode, lineNumber) {
  const srcLines = splitLines(sourceCode || '');
  const transLines = splitLines(translatedCode || '');

  const clampedLine = Math.min(Math.max(1, lineNumber || 1), Math.max(1, srcLines.length));
  const sourceText = srcLines[clampedLine - 1] ?? '';
  const translatedText = transLines[clampedLine - 1] ?? '';

  const trimmed = sourceText.trim();
  const isEmpty = trimmed.length === 0;
  const isComment = trimmed.startsWith('#');

  // Compute indentation
  const indentMatch = sourceText.match(/^[ \t]*/);
  const indentation = indentMatch ? indentMatch[0].length : 0;

  // Extract simple identifiers/variables in line (excluding Python keywords)
  const PYTHON_KEYWORDS = new Set([
    'if', 'else', 'elif', 'for', 'while', 'def', 'return', 'in', 'and', 'or',
    'not', 'is', 'None', 'True', 'False', 'import', 'from', 'as', 'class',
    'try', 'except', 'finally', 'with', 'pass', 'break', 'continue', 'lambda',
    'yield', 'print', 'input', 'range', 'len', 'int', 'str', 'float', 'list', 'dict'
  ]);

  const identifiers = (trimmed.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [])
    .filter((id) => !PYTHON_KEYWORDS.has(id));

  const uniqueVariables = Array.from(new Set(identifiers));

  return {
    lineNumber: clampedLine,
    sourceText,
    translatedText,
    isEmpty,
    isComment,
    indentation,
    variables: uniqueVariables,
  };
}

/**
 * Deterministic local beginner-friendly Telugu explanation for a line.
 * Provides immediate feedback before or alongside Gemini AI contextual explanations.
 *
 * @param {string} sourceLine
 * @param {string} translatedLine
 * @param {number} lineNumber
 * @returns {{ whatItDoes: string, whyItIsUsed: string }}
 */
export function getDeterministicLineExplanation(sourceLine, _translatedLine, _lineNumber) {
  const trimmed = (sourceLine || '').trim();

  if (!trimmed) {
    return {
      whatItDoes: 'Idi oka empty line (khali line).',
      whyItIsUsed: 'Code chadavadaniki neat ga, clean ga undadaniki lines madhyalo space istham.',
      teluguScript: {
        whatItDoes: 'ఇది ఖాళీ లైన్.',
        whyItIsUsed: 'కోడ్ చదవడానికి వీలుగా లైన్ల మధ్య ఖాళీ ఉంచుతాం.',
      },
    };
  }

  if (trimmed.startsWith('#')) {
    const commentBody = trimmed.replace(/^#\s*/, '');
    return {
      whatItDoes: `Idi comment: "${commentBody}". Python deenni run cheyadu.`,
      whyItIsUsed: 'Programmer ki code gurthu undataniki mariyu logic vivarinchataniki comments vadatharu.',
      teluguScript: {
        whatItDoes: `ఇది వ్యాఖ్య (comment): "${commentBody}". పైథాన్ దీనిని అమలు చేయదు.`,
        whyItIsUsed: 'ప్రోగ్రామర్‌కు కోడ్ లాజిక్ గుర్తుండటానికి కామెంట్స్ రాస్తారు.',
      },
    };
  }

  // Print statement
  if (/^print\s*\(/.test(trimmed)) {
    const match = trimmed.match(/^print\s*\((.*)\)$/);
    const args = match ? match[1] : '';
    return {
      whatItDoes: `Screen pai (${args || 'value'}) ni chupistundi (output ga isthundi).`,
      whyItIsUsed: 'User ki result chupinchadaniki "print()" function vadatham.',
      teluguScript: {
        whatItDoes: `స్క్రీన్‌పై (${args || 'ఫలితాన్ని'}) చూపిస్తుంది (output ga చూపిస్తుంది).`,
        whyItIsUsed: 'యూజర్‌కు ఫలితాన్ని స్క్రీన్‌పై చూపించడానికి "print()" ఫంక్షన్ వాడతాం.',
      },
    };
  }

  // Input statement
  if (/input\s*\(/.test(trimmed)) {
    return {
      whatItDoes: 'User nundi keyboard dwara value ni theesukuni variable lo store chestundi.',
      whyItIsUsed: 'Program dynamic ga user inputs tho pani cheyadaniki "input()" vadatharu.',
      teluguScript: {
        whatItDoes: 'యూజర్ నుండి కీబోర్డ్ ద్వారా విలువను తీసుకుని చరరాశి (variable) లో భద్రపరుస్తుంది.',
        whyItIsUsed: 'యూజర్ ఇచ్చే డేటాతో ప్రోగ్రామ్ నడవడానికి "input()" వాడతాం.',
      },
    };
  }

  // For loop with range
  if (/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*)\)\s*:/.test(trimmed)) {
    const match = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*)\)\s*:/);
    const loopVar = match ? match[1] : 'i';
    const rangeArgs = match ? match[2] : '';
    return {
      whatItDoes: `"${loopVar}" variable tho range(${rangeArgs}) lo unna prathi number ki kindi code ni repeat chestundi.`,
      whyItIsUsed: 'Oka pani ni multiple times cheyadaniki loop vadatharu.',
      teluguScript: {
        whatItDoes: `"${loopVar}" అనే చరరాశి (variable) తో range(${rangeArgs}) లోని ప్రతి సంఖ్య కోసం కింద ఉన్న పనిని మళ్లీ మళ్లీ చేస్తుంది. ఇదే లూప్ (for loop).`,
        whyItIsUsed: 'ఒకే పనిని పదే పదే చేయడానికి లూప్ (for loop) వాడతాం.',
      },
    };
  }

  // While loop
  if (/^while\s+(.*):/.test(trimmed)) {
    const match = trimmed.match(/^while\s+(.*):/);
    const cond = match ? match[1] : '';
    return {
      whatItDoes: `Condition (${cond}) Nijam (True) ainanthavaraku kindi code repeat avuthundi.`,
      whyItIsUsed: 'Condition true unnantha varaku repeat ga run cheyadaniki while loop vadathamu.',
      teluguScript: {
        whatItDoes: `షరతు (${cond}) నిజం (True) అయినంతవరకు కింద ఉన్న కోడ్ మళ్లీ మళ్లీ నడుస్తుంది.`,
        whyItIsUsed: 'షరతు వర్తించేంతవరకు పునరావృతం చేయడానికి while loop వాడతాం.',
      },
    };
  }

  // If statement
  if (/^if\s+(.*):/.test(trimmed)) {
    const match = trimmed.match(/^if\s+(.*):/);
    const cond = match ? match[1] : '';
    return {
      whatItDoes: `Condition (${cond}) Nijam (True) ayithe mathrame kindi code block execute avuthundi.`,
      whyItIsUsed: 'Decision teesukodaniki (decide cheyadaniki) "if" condition vadathamu.',
      teluguScript: {
        whatItDoes: `షరతు (${cond}) నిజం (True) అయితే మాత్రమే ఈ కోడ్ బ్లాక్ అమలు అవుతుంది.`,
        whyItIsUsed: 'షరతు ఆధారంగా నిర్ణయం తీసుకోవడానికి (if condition) వాడతాం.',
      },
    };
  }

  // Elif statement
  if (/^elif\s+(.*):/.test(trimmed)) {
    const match = trimmed.match(/^elif\s+(.*):/);
    const cond = match ? match[1] : '';
    return {
      whatItDoes: `Paina if false ayithe, ee condition (${cond}) check chestundi.`,
      whyItIsUsed: 'Multiple conditions ni okadani tharvatha okati check cheyadaniki "elif" vadathamu.',
      teluguScript: {
        whatItDoes: `పైన ఉన్న if షరతు తప్పు (False) అయితే, ఈ కొత్త షరతును (${cond}) తనిఖీ చేస్తుంది.`,
        whyItIsUsed: 'ఒకదాని తర్వాత మరొక షరతును వరుసగా తనిఖీ చేయడానికి "elif" వాడతాం.',
      },
    };
  }

  // Else statement
  if (/^else\s*:/.test(trimmed)) {
    return {
      whatItDoes: 'Paina unna conditions annie False ainappudu ee block run avuthundi.',
      whyItIsUsed: 'Default case ga, paina evi match kakapothe "else" block execute avvali.',
      teluguScript: {
        whatItDoes: 'పైన పేర్కొన్న షరతులన్నీ తప్పు (False) అయినప్పుడు ఈ కోడ్ బ్లాక్ నడుస్తుంది.',
        whyItIsUsed: 'ఏ షరతు సరిపోలనప్పుడు ప్రత్యామ్నాయంగా "else" బ్లాక్ అమలు కావాలి.',
      },
    };
  }

  // Function definition
  if (/^def\s+([a-zA-Z_]\w*)\s*\((.*)\)\s*:/.test(trimmed)) {
    const match = trimmed.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*)\)\s*:/);
    const funcName = match ? match[1] : '';
    const params = match ? match[2] : '';
    return {
      whatItDoes: `"${funcName}" ane kotha function ni define chestundi (${params ? `parameters: ${params}` : 'parameters lekunda'}).`,
      whyItIsUsed: 'Code reusability kosam, logic ni oka peru tho group cheyadaniki functions vadatham.',
      teluguScript: {
        whatItDoes: `"${funcName}" అనే కొత్త ఫంక్షన్‌ను తయారుచేస్తుంది (${params ? `పారామీటర్లు: ${params}` : 'పారామీటర్లు లేకుండా'}).`,
        whyItIsUsed: 'కోడ్‌ను తిరిగి వాడుకోవడానికి మరియు ఒక పేరుతో గ్రూప్ చేయడానికి ఫంక్షన్ (def) వాడతాం.',
      },
    };
  }

  // Return statement
  if (/^return\b/.test(trimmed)) {
    const val = trimmed.replace(/^return\s*/, '');
    return {
      whatItDoes: `Function nundi result (${val || 'None'}) ni tirigi pampistundi (return chestundi).`,
      whyItIsUsed: 'Function calculate chesina answer ni caller ki ivvadaniki "return" vadathamu.',
      teluguScript: {
        whatItDoes: `ఫంక్షన్ నుండి ఫలితాన్ని (${val || 'None'}) తిరిగి పంపుతుంది (return).`,
        whyItIsUsed: 'ఫంక్షన్ లెక్కించిన జవాబును పిలిచిన చోటికి పంపడానికి "return" వాడతాం.',
      },
    };
  }

  // Variable assignment
  if (/^[a-zA-Z_]\w*\s*(=|\+=|-=|\*=|\/=)\s*(.*)/.test(trimmed)) {
    const match = trimmed.match(/^([a-zA-Z_]\w*)\s*(=|\+=|-=|\*=|\/=)\s*(.*)/);
    const varName = match ? match[1] : 'variable';
    const op = match ? match[2] : '=';
    const expr = match ? match[3] : '';

    if (op === '=') {
      return {
        whatItDoes: `"${expr}" value ni calculate chesi "${varName}" variable lo store chestundi.`,
        whyItIsUsed: 'Data ni memory lo dachukuni tharvatha vadukodaniki variable assignment vadatharu.',
        teluguScript: {
          whatItDoes: `"${expr}" విలువను లెక్కించి "${varName}" అనే చరరాశి (variable) లో భద్రపరుస్తుంది.`,
          whyItIsUsed: 'డేటాను మెమరీలో దాచుకుని భవిష్యత్తులో వాడుకోవడానికి వేరియబుల్ వాడతాం.',
        },
      };
    } else {
      return {
        whatItDoes: `"${varName}" lo unna value ni "${expr}" tho update chestundi (${op}).`,
        whyItIsUsed: 'Existing variable value ni update cheyadaniki vadathamu.',
        teluguScript: {
          whatItDoes: `"${varName}" లో ఉన్న విలువను "${expr}" తో నవీకరిస్తుంది (${op}).`,
          whyItIsUsed: 'ఇప్పటికే ఉన్న చరరాశి (variable) విలువను మార్చడానికి వాడతాం.',
        },
      };
    }
  }

  // Generic statement
  return {
    whatItDoes: `Ee line (${trimmed}) oka expression ni evaluate chestundi.`,
    whyItIsUsed: 'Program flow lo ee statement tana calculation ni perform chestundi.',
    teluguScript: {
      whatItDoes: `ఈ లైన్ (${trimmed}) ఒక ఎక్స్‌ప్రెషన్‌ను లెక్కిస్తుంది.`,
      whyItIsUsed: 'ప్రోగ్రామ్ ఫ్లోలో లెక్కలు లేదా పనులు చేయడానికి ఈ స్టేట్‌మెంట్ వాడతాం.',
    },
  };
}
