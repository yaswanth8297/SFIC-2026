/**
 * Comprehensive Bilingual Telugu Programming Glossary
 * Based on Appendix B of CodeToTelugu Review and standard Python vocabulary.
 * Standardizes spoken-style Telugu with bracketed English terms.
 */

export const PROGRAMMING_GLOSSARY = [
  {
    id: 'variable',
    term: 'variable',
    teluguScript: 'చరరాశి',
    phonetic: 'Chararaasi',
    spokenWithEnglish: 'చరరాశి (variable)',
    category: 'data',
    plainMeaning: 'విలువను దాచుకోవడానికి ఒక పేరున్న పెట్టె లాంటిది.',
    englishMeaning: 'A named container/box that stores a value.',
    analogy: 'ఒక లేబుల్ అంటించిన పెట్టె (Labelled Box) — అవసరమైనప్పుడు అందులోని వస్తువును మార్చవచ్చు.',
    example: 'age = 18\ntotal = 150',
    reviewed: true,
  },
  {
    id: 'integer',
    term: 'integer (int)',
    teluguScript: 'పూర్ణాంకం',
    phonetic: 'Poornaankam',
    spokenWithEnglish: 'పూర్ణాంకం (integer)',
    category: 'data',
    plainMeaning: 'దశాంశాలు లేని పూర్తి సంఖ్య (ఉదాహరణకు 5, 25, -10).',
    englishMeaning: 'A whole number without a decimal point.',
    analogy: 'లెక్కించడానికి వీలైన పూర్తి వస్తువులు — అర లేదా పావు కాకుండా పూర్తి సంఖ్య.',
    example: 'count = 10\nscore = -5',
    reviewed: true,
  },
  {
    id: 'float',
    term: 'float',
    teluguScript: 'దశాంశ సంఖ్య',
    phonetic: 'Dasaamsa Sankhya',
    spokenWithEnglish: 'దశాంశ సంఖ్య (float)',
    category: 'data',
    plainMeaning: 'దశాంశ బిందువు (decimal point) ఉండే సంఖ్య (ఉదాహరణకు 3.14, 99.5).',
    englishMeaning: 'A number that contains decimal points or fractions.',
    analogy: 'దుకాణంలో బిల్లు లేదా కిలోల తూకం (ఉదా: 2.5 కేజీలు, రూ. 45.50).',
    example: 'price = 99.50\npercentage = 85.6',
    reviewed: true,
  },
  {
    id: 'string',
    term: 'string (str)',
    teluguScript: 'అక్షర శ్రేణి / స్ట్రింగ్',
    phonetic: 'Akshara Sreni',
    spokenWithEnglish: 'అక్షర శ్రేణి (string)',
    category: 'data',
    plainMeaning: 'కొటేషన్లలో (" " లేదా \' \') ఉండే అక్షరాలు లేదా పదాల సమూహం.',
    englishMeaning: 'Text characters wrapped inside quotes.',
    analogy: 'పూసల దండ లాంటిది — ఒక్కొక్క అక్షరం ఒక పూసలాగా వరుసగా అమర్చబడి ఉంటుంది.',
    example: 'name = "రాజు"\ncity = \'హైదరాబాద్\'',
    reviewed: true,
  },
  {
    id: 'boolean',
    term: 'boolean (bool)',
    teluguScript: 'నిజం లేదా అబద్ధం',
    phonetic: 'Nijam / Abaddham',
    spokenWithEnglish: 'బూలియన్ (boolean - True/False)',
    category: 'data',
    plainMeaning: 'కేవలం నిజం (True) లేదా అబద్ధం (False) అనే రెండు విలువలను మాత్రమే సూచిస్తుంది.',
    englishMeaning: 'A data type that has only two possible values: True or False.',
    analogy: 'లైట్ స్విచ్ — ఆన్ (True) లేదా ఆఫ్ (False) మాత్రమే ఉంటుంది.',
    example: 'is_passed = True\nis_raining = False',
    reviewed: true,
  },
  {
    id: 'list',
    term: 'list',
    teluguScript: 'జాబితా',
    phonetic: 'Jaabitha',
    spokenWithEnglish: 'జాబితా (list)',
    category: 'data_structure',
    plainMeaning: 'చతురస్రపు బ్రాకెట్లలో [ ] వరుసగా నిల్వ చేయబడిన విలువల సమూహం.',
    englishMeaning: 'An ordered collection of items inside square brackets.',
    analogy: 'సరుకుల చిట్టా లేదా తరగతి విద్యార్థుల పేర్ల రిజిస్టర్.',
    example: 'marks = [72, 85, 90]\nfruits = ["మామిడి", "అరటి", "జామ"]',
    reviewed: true,
  },
  {
    id: 'dictionary',
    term: 'dictionary (dict)',
    teluguScript: 'నిఘంటువు / డిక్షనరీ',
    phonetic: 'Nighantuvu',
    spokenWithEnglish: 'నిఘంటువు (dictionary)',
    category: 'data_structure',
    plainMeaning: 'కీ (key) మరియు దాని విలువ (value) జంటలుగా { } బ్రాకెట్లలో దాచే విధానం.',
    englishMeaning: 'A collection of key-value pairs stored in curly braces.',
    analogy: 'ఫోన్‌బుక్ — పేరు (కీ) వెతికితే వారి ఫోన్ నంబర్ (విలువ) లభిస్తుంది.',
    example: 'student = {"name": "రమ్య", "marks": 95}',
    reviewed: true,
  },
  {
    id: 'print',
    term: 'print()',
    teluguScript: 'ముద్రించు / చూపించు',
    phonetic: 'Chupinchu / Mudrinchu',
    spokenWithEnglish: 'స్క్రీన్‌పై చూపించు (print)',
    category: 'io',
    plainMeaning: 'కంప్యూటర్ స్క్రీన్‌పై లేదా టెర్మినల్‌లో ఫలితాన్ని ప్రదర్శిస్తుంది.',
    englishMeaning: 'Displays specified messages or variable values onto the screen.',
    analogy: 'మైక్‌లో అనౌన్స్‌మెంట్ చేయడం లేదా బోర్డుపై సమాచారం రాయడం లాంటిది.',
    example: 'print("నమస్కారం!")\nprint("మొత్తం:", total)',
    reviewed: true,
  },
  {
    id: 'input',
    term: 'input()',
    teluguScript: 'ఇన్‌పుట్ (విలువ తీసుకోవడం)',
    phonetic: 'Input / Teesukovadam',
    spokenWithEnglish: 'విలువను అడుగు (input)',
    category: 'io',
    plainMeaning: 'యూజర్ కీబోర్డ్ ద్వారా టైప్ చేసిన విలువను స్వీకరిస్తుంది.',
    englishMeaning: 'Takes user-typed keyboard input from the terminal.',
    analogy: 'టికెట్ కౌంటర్‌లో క్లర్క్ మీ పేరు అడిగి నమోదు చేసుకోవడం.',
    example: 'name = input("మీ పేరు రాయండి: ")',
    reviewed: true,
  },
  {
    id: 'if_else',
    term: 'if / elif / else',
    teluguScript: 'ఒకవేళ / లేకపోతే',
    phonetic: 'Oka vela / Lekapothe',
    spokenWithEnglish: 'షరతు నిర్ణయం (if / else)',
    category: 'control_flow',
    plainMeaning: 'ఒక షరతు నిజమైతే ఒక పని, కాకపోతే మరో పని చేయడానికి నిర్ణయం తీసుకుంటుంది.',
    englishMeaning: 'Conditional branching that runs code blocks based on conditions.',
    analogy: 'రహదారి కూడలి — వర్షం పడితే గొడుగు తీసుకో, లేకపోతే సాధారణంగా వెళ్ళు.',
    example: 'if marks >= 35:\n    print("పాస్")\nelse:\n    print("మళ్లీ ప్రయత్నించండి")',
    reviewed: true,
  },
  {
    id: 'for_loop',
    term: 'for loop',
    teluguScript: 'ప్రతి ... కోసం లూప్',
    phonetic: 'Prathi daaniki loop',
    spokenWithEnglish: 'లూప్ (for loop)',
    category: 'control_flow',
    plainMeaning: 'ఒక జాబితాలోని ప్రతి అంశం కోసం లేదా నిర్ణీత సంఖ్యల వరకు పనిని మళ్లీ మళ్లీ చేస్తుంది.',
    englishMeaning: 'Iterates through each element in a sequence or range.',
    analogy: 'క్యూ లైన్‌లో ఉన్న ప్రతి ఒక్కరికీ వరుసగా టోకెన్ ఇవ్వడం.',
    example: 'for i in range(1, 6):\n    print(i)',
    reviewed: true,
  },
  {
    id: 'while_loop',
    term: 'while loop',
    teluguScript: '... ఉన్నంతవరకు లూప్',
    phonetic: 'Unnanthavaraku loop',
    spokenWithEnglish: 'షరతు ఉన్నంతవరకు లూప్ (while loop)',
    category: 'control_flow',
    plainMeaning: 'ఒక షరతు నిజంగా (True) ఉన్నంత సేపు ఆ కోడ్ బ్లాక్‌ను పునరావృతం చేస్తుంది.',
    englishMeaning: 'Repeats code execution as long as a specified condition stays True.',
    analogy: 'వాటర్ ట్యాంక్ నిండేంతవరకు మోటార్ నడవడం — నిండిపోతే ఆగిపోతుంది.',
    example: 'count = 1\nwhile count <= 5:\n    print(count)\n    count += 1',
    reviewed: true,
  },
  {
    id: 'function',
    term: 'function (def)',
    teluguScript: 'ఫంక్షన్ / పునర్వినియోగ బ్లాక్',
    phonetic: 'Function / Def',
    spokenWithEnglish: 'ఫంక్షన్ (function)',
    category: 'functions',
    plainMeaning: 'ఒక నిర్దిష్టమైన పనిని పదే పదే చేయడానికి తయారుచేసే పేరున్న కోడ్ భాగం.',
    englishMeaning: 'A reusable named block of code that performs an action.',
    analogy: 'మిక్సీ గ్రైండర్ లేదా జ్యూసర్ యంత్రం — పండ్లు వేస్తే (ఇన్‌పుట్), జ్యూస్ ఇస్తుంది (అవుట్‌పుట్).',
    example: 'def add(a, b):\n    return a + b\n\nresult = add(10, 20)',
    reviewed: true,
  },
  {
    id: 'return',
    term: 'return',
    teluguScript: 'తిరిగి ఇవ్వు / ఫలితాన్ని పంపు',
    phonetic: 'Tirigi ivvu',
    spokenWithEnglish: 'ఫలితాన్ని తిరిగి ఇవ్వు (return)',
    category: 'functions',
    plainMeaning: 'ఫంక్షన్ చేసిన పని పూర్తయిన తర్వాత ఆ ఫలితాన్ని పిలిచిన చోటికి పంపుతుంది.',
    englishMeaning: 'Sends back the resulting value from a function to the caller.',
    analogy: 'దుకాణదారుడు సరుకు ఇచ్చి చిల్లర తిరిగి ఇవ్వడం లాంటిది.',
    example: 'def square(n):\n    return n * n',
    reviewed: true,
  },
  {
    id: 'indentation',
    term: 'indentation',
    teluguScript: 'ఇండెంటేషన్ (ఖాళీ స్థలం)',
    phonetic: 'Indentation / Spacing',
    spokenWithEnglish: 'ఇండెంటేషన్ (indentation - 4 ఖాళీలు)',
    category: 'syntax',
    plainMeaning: 'పైథాన్‌లో ఒక బ్లాక్ లేదా పరిధిని తెలియజేయడానికి లైన్ ముందు ఉంచే 4 స్పేస్‌ల ఖాళీ.',
    englishMeaning: '4 spaces used at the start of a line to define code blocks.',
    analogy: 'పుస్తకంలో పేరాగ్రాఫ్ మొదలుపెట్టే ముందు కొద్దిగా స్థలం వదిలినట్లు.',
    example: 'if True:\n    print("ఇది లోపలి బ్లాక్")',
    reviewed: true,
  },
  {
    id: 'syntax_error',
    term: 'SyntaxError',
    teluguScript: 'సింటాక్స్ లోపం',
    phonetic: 'Syntax Lopam',
    spokenWithEnglish: 'సింటాక్స్ లోపం (SyntaxError)',
    category: 'error',
    plainMeaning: 'పైథాన్ నియమాలు సరిగ్గా పాటించనప్పుడు (ఉదా: కోలన్ : లేదా బ్రాకెట్లు మర్చిపోవడం).',
    englishMeaning: 'Occurs when Python rules are violated, like missing colons or mismatched brackets.',
    analogy: 'భాషలో వ్యాకరణ దోషం లేదా వాక్యం చివర ఫుల్‌స్టాప్ పెట్టకపోవడం లాంటిది.',
    example: 'if x > 5   # Error: missing colon :',
    reviewed: true,
  },
  {
    id: 'name_error',
    term: 'NameError',
    teluguScript: 'పేరు గుర్తింపు లోపం',
    phonetic: 'Peru Gurthimpu Lopam',
    spokenWithEnglish: 'పేరు లోపం (NameError)',
    category: 'error',
    plainMeaning: 'ముందుగా తయారుచేయని లేదా నిర్వచించని వేరియబుల్ పేరును వాడినప్పుడు వస్తుంది.',
    englishMeaning: 'Occurs when accessing a variable name that has not been defined yet.',
    analogy: 'తరగతిలో లేని విద్యార్థి పేరును హాజరు పట్టికలో పిలిచినట్లు.',
    example: 'print(total)  # Error if total is not created',
    reviewed: true,
  },
  {
    id: 'type_error',
    term: 'TypeError',
    teluguScript: 'రకం సరిపోలని లోపం',
    phonetic: 'Rakam Saripolani Lopam',
    spokenWithEnglish: 'రకం లోపం (TypeError)',
    category: 'error',
    plainMeaning: 'సరిపోలని వేర్వేరు డేటా రకాలను కలపడానికి ప్రయత్నించినప్పుడు (ఉదా: సంఖ్యను స్ట్రింగ్‌తో కూడటం).',
    englishMeaning: 'Occurs when an operation is performed on incompatible types (e.g. string + int).',
    analogy: 'రూపాయలను మరియు కిలోమీటర్లను కలిపి లెక్కించలేము కదా, అదే విధంగా.',
    example: 'total = "10" + 5  # Error: cannot add str and int',
    reviewed: true,
  },
];

/**
 * Fast lookup map by term / keyword
 */
export const GLOSSARY_BY_TERM = PROGRAMMING_GLOSSARY.reduce((acc, item) => {
  acc[item.term.toLowerCase()] = item;
  acc[item.id] = item;
  return acc;
}, {});

/**
 * Find glossary entry by token or word
 * @param {string} token
 * @returns {typeof PROGRAMMING_GLOSSARY[0] | null}
 */
export function lookupGlossaryTerm(token) {
  if (!token || typeof token !== 'string') return null;
  const clean = token.toLowerCase().trim().replace(/[():]/g, '');
  
  if (GLOSSARY_BY_TERM[clean]) return GLOSSARY_BY_TERM[clean];

  // Fuzzy matches
  if (clean === 'for' || clean === 'while') return GLOSSARY_BY_TERM[`${clean}_loop`];
  if (clean === 'if' || clean === 'elif' || clean === 'else') return GLOSSARY_BY_TERM['if_else'];
  if (clean === 'def') return GLOSSARY_BY_TERM['function'];
  if (clean === 'int') return GLOSSARY_BY_TERM['integer'];
  if (clean === 'str') return GLOSSARY_BY_TERM['string'];
  if (clean === 'bool') return GLOSSARY_BY_TERM['boolean'];
  if (clean === 'dict') return GLOSSARY_BY_TERM['dictionary'];

  return null;
}
