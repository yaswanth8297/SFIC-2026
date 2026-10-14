/**
 * Structured Guided Telugu Lessons & Practice (Feature F7).
 * Follows Tier-3/4 junior college syllabus: Output/Input, Variables, Conditions, Loops, Lists, Functions.
 */

export const TELUGU_LESSONS = [
  {
    id: 'lesson_1_io',
    number: 1,
    title: 'స్క్రీన్‌పై చూపించడం & ఇన్‌పుట్ తీసుకోవడం',
    englishTitle: 'Output and Input (print & input)',
    summary: 'కంప్యూటర్‌తో మాట్లాడే మొదటి అడుగు: స్క్రీన్‌పై ఫలితాన్ని చూపించడం మరియు యూజర్ నుండి వివరాలు తీసుకోవడం.',
    analogy: 'మైక్రోఫోన్ ద్వారా అనౌన్స్‌మెంట్ చేయడం (print) మరియు కౌంటర్‌లో పేరు అడిగి నమోదు చేసుకోవడం (input).',
    theory: `పైథాన్‌లో ఫలితాన్ని స్క్రీన్‌పై ముద్రించడానికి **print()** ఫంక్షన్‌ను ఉపయోగిస్తాము.
కొటేషన్లు (" " లేదా ' ') లోపల రాసిన సందేశం యథాతథంగా కనిపిస్తుంది.
యూజర్ కీబోర్డ్ ద్వారా ఏదైనా విలువను టైప్ చేయడానికి **input()** ఫంక్షన్ వాడతాం.`,
    starterCode: `name = input("మీ పేరు రాయండి: ")
print("స్వాగతం,", name, "! పైథాన్ స్టూడియోకి స్వాగతం.")`,
    outputQuiz: {
      question: 'కింది కోడ్ యొక్క అవుట్‌పుట్ (Output) ఏమిటి?\nx = "హలో"\nprint(x, "ప్రపంచం")',
      options: [
        'x ప్రపంచం',
        'హలో ప్రపంచం',
        '"హలో" "ప్రపంచం"',
        'Error: x is not defined'
      ],
      correctIndex: 1,
      explanation: 'x అనే చరరాశిలో "హలో" ఉంది. print(x, "ప్రపంచం") అన్నప్పుడు x విలువ మరియు పక్కన ఉన్న పదం కలిసి "హలో ప్రపంచం" గా ముద్రించబడుతుంది.',
    },
    practiceTask: 'మీ వయస్సును input() ద్వారా అడిగి "మీ వయస్సు: [వయస్సు]" అని ముద్రించే ప్రోగ్రామ్ రాయండి.',
    xpAward: 25,
  },
  {
    id: 'lesson_2_variables',
    number: 2,
    title: 'చరరాశులు & డేటా రకాలు',
    englishTitle: 'Variables and Data Types (int, float, str)',
    summary: 'విలువలను భద్రపరిచే పేరున్న పెట్టెలు (Variables) మరియు సంఖ్యలు, అక్షరాలు.',
    analogy: 'లేబుల్ అంటించిన స్టోరేజ్ బాక్స్ — అందులో బియ్యం (నంబర్) లేదా ఉప్పు (స్ట్రింగ్) వేరువేరుగా ఉంచుతాం.',
    theory: `పైథాన్‌లో విలువను దాచుకోవడానికి పేరు ఇవ్వడాన్ని చరరాశి (variable) అంటాము.
ముఖ్యమైన డేటా రకాలు:
1. **int (పూర్ణాంకం)**: 10, -5, 100 వంటి సంపూర్ణ సంఖ్యలు.
2. **float (దశాంశం)**: 3.14, 99.50 వంటి బిందువు ఉండే సంఖ్యలు.
3. **str (స్ట్రింగ్)**: కొటేషన్లలో ఉండే అక్షరాలు.`,
    starterCode: `marks = 95
percentage = 95.5
subject = "తెలుగు"

print("విషయం:", subject)
print("మార్కులు:", marks)
print("శాతం:", percentage)`,
    outputQuiz: {
      question: 'కింది కోడ్ రన్ చేస్తే total విలువ ఎంత అవుతుంది?\na = 10\nb = 20\ntotal = a + b\nprint(total)',
      options: ['1020', '30', '10 + 20', 'Error'],
      correctIndex: 1,
      explanation: 'a మరియు b రెండూ పూర్ణాంకాలు (integers), కాబట్టి + గుర్తు వాటిని కూడి 30 ని ఇస్తుంది.',
    },
    practiceTask: 'రెండు సంఖ్యలను గుణించి (a * b) ఫలితాన్ని ప్రదర్శించండి.',
    xpAward: 25,
  },
  {
    id: 'lesson_3_conditions',
    number: 3,
    title: 'షరతులు & నిర్ణయాలు (if / elif / else)',
    englishTitle: 'Conditional Decisions (if, elif, else)',
    summary: 'పరిస్థితిని బట్టి ప్రోగ్రామ్ సరైన దారిని ఎంచుకునేలా చేయడం.',
    analogy: 'రహదారి కూడలి లేదా ట్రాఫిక్ సిగ్నల్ — పచ్చ లైట్ వెలిగితే వెళ్ళు, ఎరుపు అయితే ఆగు.',
    theory: `షరతు నిజమైతే (True) ఒక పని, కాకపోతే (False) వేరే పని చేయడానికి if / else వాడతాము.
పైథాన్‌లో if లైన్ చివర కచ్చితంగా **కోలన్ (:)** ఉండాలి.
లోపలి పనికి **ఇండెంటేషన్ (4 ఖాళీ స్థలాలు)** తప్పనిసరి.`,
    starterCode: `score = 82

if score >= 90:
    print("గ్రేడ్: A (ఉత్తమం)")
elif score >= 60:
    print("గ్రేడ్: B (మంచిది)")
else:
    print("గ్రేడ్: C (మరింత ప్రాక్టీస్ చేయండి)")`,
    outputQuiz: {
      question: 'x = 15 ఉన్నప్పుడు ఈ కోడ్ ఏమి చూపిస్తుంది?\nif x < 10:\n    print("చిన్నది")\nelse:\n    print("పెద్దది")',
      options: ['చిన్నది', 'పెద్దది', '15', 'ఏమీ రాదు'],
      correctIndex: 1,
      explanation: '15 అనేది 10 కంటే చిన్నది కాదు (షరతు False), కాబట్టి else బ్లాక్ అమలు అయ్యి "పెద్దది" అని వస్తుంది.',
    },
    practiceTask: 'ఒక వ్యక్తి వయస్సు 18 లేదా అంతకంటే ఎక్కువ ఉంటే "ఓటు హక్కు ఉంది", లేకపోతే "ఓటు హక్కు లేదు" అని చూపే కోడ్ రాయండి.',
    xpAward: 30,
  },
  {
    id: 'lesson_4_loops',
    number: 4,
    title: 'లూప్‌లు — పునరావృతం చేయడం',
    englishTitle: 'Loops & Iterations (for, while, range)',
    summary: 'ఒకే పనిని కంప్యూటర్‌తో వందల సార్లు మళ్లీ మళ్లీ చేయించడం.',
    analogy: 'రేషన్ షాప్ లేదా టికెట్ కౌంటర్ క్యూలో ఉన్న ప్రతి ఒక్కరికీ వరుసగా వస్తువులు ఇవ్వడం.',
    theory: `ఒక నిర్ణీత సంఖ్యల వరకు పునరావృతం చేయడానికి **for loop** మరియు **range()** వాడతాము.
ఉదాహరణకు range(1, 6) అంటే 1 నుండి 5 వరకు సంఖ్యలు వస్తాయి.
షరతు నిజంగా ఉన్నంత సేపు నడవడానికి **while loop** ఉపయోగిస్తాము.`,
    starterCode: `print("1 నుండి 5 వరకు లూప్:")
for i in range(1, 6):
    print("సంఖ్య:", i)`,
    outputQuiz: {
      question: 'కింది లూప్ ఎన్ని సార్లు తిరుగుతుంది?\nfor i in range(3):\n    print("హలో")',
      options: ['2 సార్లు', '3 సార్లు (0, 1, 2)', '4 సార్లు', 'అనంతంగా (Infinite)'],
      correctIndex: 1,
      explanation: 'range(3) అనేది 0, 1, 2 అనే 3 విలువలను ఇస్తుంది, కాబట్టి లూప్ 3 సార్లు తిరుగుతుంది.',
    },
    practiceTask: '3 వ ఎక్కాన్ని 1 నుండి 10 వరకు ముద్రించే for loop రాయండి.',
    xpAward: 35,
  },
  {
    id: 'lesson_5_lists',
    number: 5,
    title: 'జాబితాలు (Lists)',
    englishTitle: 'Lists & Collections',
    summary: 'అనేక విలువలను ఒకే క్రమంలో అమర్చే సరుకుల చిట్టా.',
    analogy: 'తరగతి విద్యార్థుల హాజరు పట్టిక లేదా సరుకుల చిట్టా — ప్రతి అంశానికి ఒక స్థానం (ఇండెక్స్) ఉంటుంది.',
    theory: `చతురస్రపు బ్రాకెట్లలో [ ] కామాలతో వేరుచేస్తూ రాసే విలువల సమాహారాన్ని **list** అంటాము.
జాబితాలోని మొదటి అంశం ఇండెక్స్ ఎల్లప్పుడూ 0 తో మొదలవుతుంది.
len(list) తో జాబితాలో ఎన్ని అంశాలున్నాయో లెక్కించవచ్చు.`,
    starterCode: `marks = [72, 85, 90]
print("మొదటి మార్కు:", marks[0])
print("మొత్తం విద్యార్థులు:", len(marks))

total = sum(marks)
print("మొత్తం మార్కులు:", total)`,
    outputQuiz: {
      question: 'items = ["పెన్", "పుస్తకం", "స్కేల్"] అయితే items[1] విలువ ఏమిటి?',
      options: ['పెన్', 'పుస్తకం', 'స్కేల్', 'Error'],
      correctIndex: 1,
      explanation: 'పైథాన్‌లో ఇండెక్స్ 0 తో మొదలవుతుంది. 0 = పెన్, 1 = పుస్తకం.',
    },
    practiceTask: 'మీకు ఇష్టమైన 3 ఆహార పదార్థాలతో ఒక జాబితా తయారు చేసి print చేయండి.',
    xpAward: 35,
  },
  {
    id: 'lesson_6_functions',
    number: 6,
    title: 'ఫంక్షన్లు — పునర్వినియోగ కోడ్',
    englishTitle: 'Functions (def & return)',
    summary: 'ఒక పనిని పేరు పెట్టి దాచిపెట్టి, అవసరమైనప్పుడల్లా పిలవడం.',
    analogy: 'మిక్సీ గ్రైండర్ లేదా జ్యూసర్ — ఇన్‌పుట్ ఇస్తే ప్రాసెస్ చేసి అవుట్‌పుట్ ఇచ్చే యంత్రం.',
    theory: `కోడ్‌ను మళ్లీ మళ్లీ రాయకుండా ఉండటానికి **def** కీవర్డ్‌తో ఫంక్షన్‌ను తయారుచేస్తాము.
ఫంక్షన్ లెక్కించిన జవాబును **return** ద్వారా తిరిగి పంపుతాం.`,
    starterCode: `def square(number):
    return number * number

ans1 = square(5)
ans2 = square(9)

print("5 యొక్క వర్గం:", ans1)
print("9 యొక్క వర్గం:", ans2)`,
    outputQuiz: {
      question: 'కింది ఫంక్షన్ ఏమి రిటర్న్ చేస్తుంది?\ndef add(a, b):\n    return a + b\nprint(add(4, 6))',
      options: ['46', '10', 'a + b', 'None'],
      correctIndex: 1,
      explanation: 'add(4, 6) ఫంక్షన్‌కు 4 మరియు 6 పంపినప్పుడు, అది 4 + 6 = 10 ని return చేస్తుంది.',
    },
    practiceTask: 'రెండు సంఖ్యలలో ఏది పెద్దదో తెలిపే max_of_two(a, b) అనే ఫంక్షన్ రాయండి.',
    xpAward: 40,
  },
];
