import React from 'react';
import { Play, Sparkles, X, Terminal, Check, BookOpen } from 'lucide-react';

export const SAMPLE_PROGRAMS = [
  {
    id: 'hello_world',
    title: '1. స్వాగతం సందేశం (Hello World)',
    concept: 'print() & input()',
    difficulty: 'ప్రారంభం (Beginner)',
    description: 'యూజర్ పేరు అడిగి, తెలుగులో చక్కగా స్వాగతం చెప్పే మొదటి ప్రోగ్రామ్.',
    code: `name = input("మీ పేరు రాయండి: ")
print("స్వాగతం,", name, "! పైథాన్ నేర్చుకోవడం చాలా సులభం.")`,
  },
  {
    id: 'add_two_numbers',
    title: '2. రెండు సంఖ్యల కూడిక (Add Two Numbers)',
    concept: 'చరరాశులు (Variables) & కూడిక (+)',
    difficulty: 'ప్రారంభం (Beginner)',
    description: 'రెండు సంఖ్యలను చరరాశులలో దాచి, వాటి మొత్తాన్ని లెక్కించడం.',
    code: `a = 15
b = 25
total = a + b
print("మొత్తం విలువ:", total)`,
  },
  {
    id: 'even_or_odd',
    title: '3. సరి లేక బేసి సంఖ్య (Even or Odd)',
    concept: 'షరతులు (if / else) & శేషం (%)',
    difficulty: 'మధ్యస్థం (Intermediate)',
    description: 'ఒక సంఖ్యను 2 తో భాగిస్తే శేషం 0 వస్తే సరి సంఖ్య, లేకపోతే బేసి సంఖ్య.',
    code: `number = 14

if number % 2 == 0:
    print(number, "అనేది సరి సంఖ్య (Even Number)")
else:
    print(number, "అనేది బేసి సంఖ్య (Odd Number)")`,
  },
  {
    id: 'multiplication_table',
    title: '4. ఎక్కాలు / గుణకార పట్టిక (Multiplication Table)',
    concept: 'లూప్ (for loop) & range()',
    difficulty: 'మధ్యస్థం (Intermediate)',
    description: '5 వ ఎక్కాన్ని 1 నుండి 10 వరకు లూప్ ద్వారా స్వయంచాలకంగా ముద్రించడం.',
    code: `table = 5

for i in range(1, 11):
    result = table * i
    print(table, "x", i, "=", result)`,
  },
  {
    id: 'marks_sum',
    title: '5. మార్కుల మొత్తం & సగటు (Sum of Marks)',
    concept: 'జాబితా (list) & లూప్ (for loop)',
    difficulty: 'మధ్యస్థం (Intermediate)',
    description: 'జాబితాలోని మార్కులను ఒక్కొక్కటిగా కూడి మొత్తం ఫలితాన్ని చూపించడం (Appendix A).',
    code: `marks = [72, 85, 90]
total = 0

for m in marks:
    total = total + m

print("మొత్తం మార్కులు (Total):", total)`,
  },
  {
    id: 'simple_function',
    title: '6. చతురస్ర వైశాల్యం ఫంక్షన్ (Square Function)',
    concept: 'ఫంక్షన్ (def) & ఫలితం (return)',
    difficulty: 'అధునాతనం (Advanced)',
    description: 'పునర్వినియోగించగల ఫంక్షన్ తయారు చేసి వైశాల్యాన్ని లెక్కించడం.',
    code: `def calculate_square(side):
    return side * side

side_length = 8
area = calculate_square(side_length)
print("చతురస్ర వైశాల్యం:", area)`,
  },
];

export function SampleProgramsModal({ isOpen, onClose, onSelectProgram }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-programs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363D] flex items-center justify-between bg-[#0D1117]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#238636]/15 text-[#3FB950] border border-[#238636]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="sample-programs-title" className="text-base font-semibold text-[#E6EDF3] tracking-tight">
                ఉదాహరణ ప్రోగ్రామ్‌లు (Sample Programs)
              </h2>
              <p className="text-xs text-[#8B949E]">
                ఒకే క్లిక్‌తో ప్రోగ్రామ్‌ను ఎడిటర్‌లోకి లోడ్ చేసి తెలుగు వివరణ చూడండి.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
            aria-label="Close Sample Programs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Programs Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SAMPLE_PROGRAMS.map((prog) => (
            <div
              key={prog.id}
              className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-[#58A6FF]/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-[#58A6FF] bg-[#58A6FF]/10 px-2 py-0.5 rounded">
                    {prog.concept}
                  </span>
                  <span className="text-[10px] text-[#8B949E] bg-[#21262D] px-1.5 py-0.5 rounded">
                    {prog.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#E6EDF3] group-hover:text-[#58A6FF] transition-colors">
                  {prog.title}
                </h3>
                <p className="text-xs text-[#8B949E] line-clamp-2 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              {/* Code preview snippet */}
              <div className="bg-[#161B22] p-2 rounded border border-[#30363D]/60 mb-3 font-mono text-[11px] text-[#7EE787] overflow-hidden max-h-20">
                <pre className="whitespace-pre truncate">{prog.code}</pre>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  onSelectProgram(prog.code);
                  onClose();
                }}
                className="w-full py-1.5 px-3 rounded-md bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ఈ ప్రోగ్రామ్ ప్రయత్నించండి (Try Now)</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#30363D] bg-[#0D1117] flex items-center justify-between text-xs text-[#8B949E]">
          <span>Appendix A మరియు ప్రాథమిక సిలబస్ ఆధారంగా రూపొందించబడింది.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] transition-colors"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
