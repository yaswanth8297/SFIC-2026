import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Copy,
  Check,
  X,
  Play,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { getActiveApiKey } from '../services/gemini.js';
import { GoogleGenAI } from '@google/genai';

const QUICK_PROMPTS = [
  {
    label: '1 నుండి 10 వరకు సంఖ్యలు (1 to 10 Numbers)',
    prompt: '1 నుండి 10 వరకు సంఖ్యలను స్క్రీన్‌పై చూపించు',
    code: `# 1 నుండి 10 వరకు లూప్ ద్వారా ముద్రించడం
for i in range(1, 11):
    print(i)`,
    explanation: 'range(1, 11) ని ఉపయోగించి 1 నుండి 10 వరకు ప్రతి సంఖ్యను వరుసగా print చేస్తుంది.',
  },
  {
    label: 'రెండు సంఖ్యల కూడిక (Add 2 numbers)',
    prompt: 'రెండు సంఖ్యలను ఇన్‌పుట్ తీసుకుని వాటిని కూడి ఫలితాన్ని చూపించు',
    code: `num1 = int(input("మొదటి సంఖ్య: "))
num2 = int(input("రెండవ సంఖ్య: "))
total = num1 + num2
print("రెండు సంఖ్యల కూడిక ఫలితం:", total)`,
    explanation: 'int(input()) ద్వారా రెండు సంఖ్యలను తీసుకుని, వాటి మొత్తాన్ని total లో దాచి print చేస్తుంది.',
  },
  {
    label: 'సరి లేక బేసి సంఖ్య (Even or Odd)',
    prompt: 'ఒక సంఖ్య సరి సంఖ్యో లేక బేసి సంఖ్యో సరిచూడు',
    code: `number = int(input("ఒక సంఖ్య రాయండి: "))

if number % 2 == 0:
    print(number, "అనేది సరి సంఖ్య (Even)")
else:
    print(number, "అనేది బేసి సంఖ్య (Odd)")`,
    explanation: 'సంఖ్యను 2 తో భాగించినప్పుడు శేషం (%) 0 వస్తే సరి సంఖ్య, లేకపోతే బేసి సంఖ్య అని నిర్ణయిస్తుంది.',
  },
  {
    label: '5 వ ఎక్కం పట్టిక (Multiplication Table)',
    prompt: '5 వ గుణకార పట్టికను 10 వరకు ముద్రించు',
    code: `table = 5
for i in range(1, 11):
    print(table, "x", i, "=", table * i)`,
    explanation: 'for లూప్ ఉపయోగించి 5 తో 1 నుండి 10 వరకు గుణించి ఎక్కాన్ని వరుసగా ప్రదర్శిస్తుంది.',
  },
  {
    label: 'మార్కుల సగటు (Average of Marks)',
    prompt: 'జాబితాలోని మార్కులను కూడి సగటు కనుక్కో',
    code: `marks = [85, 90, 78, 92, 88]
total = sum(marks)
average = total / len(marks)

print("మొత్తం మార్కులు:", total)
print("సగటు మార్కులు:", average)`,
    explanation: 'sum() తో మొత్తం మార్కులను కూడి, len() తో భాగించడం ద్వారా సగటును లెక్కిస్తుంది.',
  },
];

export function TeluguToPythonModal({ isOpen, onClose, onApplyCode }) {
  const [promptText, setPromptText] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSelectQuickPrompt = (item) => {
    setPromptText(item.prompt);
    setGeneratedCode(item.code);
    setExplanation(item.explanation);
    setErrorMsg('');
  };

  const handleGenerate = async () => {
    if (!promptText.trim()) return;

    // 1. Check if matches any offline prompt directly
    const matched = QUICK_PROMPTS.find(
      (q) => q.prompt.toLowerCase() === promptText.trim().toLowerCase()
    );
    if (matched) {
      setGeneratedCode(matched.code);
      setExplanation(matched.explanation);
      return;
    }

    // 2. Check for API key for custom generation
    const apiKey = getActiveApiKey();
    if (!apiKey) {
      // Fallback: search best match
      const fuzzy = QUICK_PROMPTS.find((q) =>
        promptText.includes('కూడిక') || promptText.includes('add')
          ? q.label.includes('కూడిక')
          : promptText.includes('సరి') || promptText.includes('even')
          ? q.label.includes('సరి')
          : promptText.includes('లూప్') || promptText.includes('వరకు')
          ? q.label.includes('వరకు')
          : false
      );

      if (fuzzy) {
        setGeneratedCode(fuzzy.code);
        setExplanation(
          `${fuzzy.explanation} (ఆఫ్‌లైన్ టెంప్లేట్ సరిపోలింది. AI ఆధారిత కస్టమ్ జనరేషన్ కొరకు API కీ కనెక్ట్ చేయండి).`
        );
      } else {
        setErrorMsg(
          'కస్టమ్ తెలుగు సూచనలను కోడ్‌గా మార్చడానికి దయచేసి జెమిని API కీ ని కనెక్ట్ చేయండి, లేదా పైనున్న నమూనా ప్రాంప్ట్‌లలో ఒకదాన్ని ఎంచుకోండి.'
        );
      }
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert Python coding educator for Telugu-speaking students.
The user wants to generate clean, beginner-friendly Python code from this Telugu description:
"${promptText}"

Please respond ONLY with valid JSON in this exact structure without markdown backticks:
{
  "code": "Python source code here",
  "explanation_te": "Clear explanation in spoken Telugu with English terms in brackets"
}`,
      });

      const raw = response.text?.trim() || '';
      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.code) {
        setGeneratedCode(parsed.code);
        setExplanation(parsed.explanation_te || 'పైథాన్ కోడ్ విజయవంతంగా రూపొందించబడింది.');
      } else {
        setErrorMsg('కోడ్ జనరేట్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.');
      }
    } catch (err) {
      console.warn('Telugu to Python AI generation failed:', err);
      setErrorMsg('AI సర్వీస్ అందుబాటులో లేదు. దయచేసి పైనున్న ఉదాహరణలను ఎంచుకోండి.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reverse-mode-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363D] flex items-center justify-between bg-[#0D1117]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="reverse-mode-title" className="text-base font-semibold text-[#E6EDF3] tracking-tight">
                రివర్స్ మోడ్: తెలుగు నుండి పైథాన్ (Telugu to Python)
              </h2>
              <p className="text-xs text-[#8B949E]">
                మీ ఆలోచనను తెలుగులో చెప్పండి — సరైన పైథాన్ కోడ్ మరియు వివరణ పొందండి (Feature F6).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Prompts Suggestions */}
          <div>
            <label className="block text-xs font-medium text-[#8B949E] mb-1.5">
              త్వరిత ఉదాహరణలు (Click any to test):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleSelectQuickPrompt(q)}
                  className="px-2.5 py-1 rounded-md bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] hover:text-[#58A6FF] text-xs transition-colors border border-[#30363D]"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Input Prompt */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#8B949E]">
              మీరు ఏమి చేయాలనుకుంటున్నారో తెలుగులో లేదా టెంగ్లీష్‌లో రాయండి:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="ఉదాహరణ: 1 నుండి 20 వరకు సరి సంఖ్యలను చూపించు..."
                className="flex-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-xs sm:text-sm text-[#E6EDF3] placeholder-[#6E7681] focus:outline-none focus:border-[#58A6FF]"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !promptText.trim()}
                className={`px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-medium flex items-center space-x-1.5 transition-colors shrink-0 ${
                  isLoading || !promptText.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoading ? 'తయారవుతోంది...' : 'కోడ్ రూపొందించు (Generate)'}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-md bg-[#DA3633]/15 border border-[#DA3633]/40 text-xs text-[#F85149]">
              {errorMsg}
            </div>
          )}

          {/* Output Code & Explanation Display */}
          {generatedCode && (
            <div className="space-y-3 pt-2">
              <div className="rounded-lg bg-[#0D1117] border border-[#30363D] overflow-hidden">
                <div className="px-3 py-2 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#58A6FF]">
                    రూపొందించబడిన పైథాన్ కోడ్ (Generated Python Code):
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-2 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] text-xs flex items-center space-x-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-[#3FB950]" />
                          <span className="text-[#3FB950]">కాపీ అయింది</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>కాపీ</span>
                        </>
                      )}
                    </button>

                    {onApplyCode && (
                      <button
                        type="button"
                        onClick={() => {
                          onApplyCode(generatedCode);
                          onClose();
                        }}
                        className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-medium flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>ఎడిటర్‌లో అమలు చేయి (Use in Editor)</span>
                      </button>
                    )}
                  </div>
                </div>

                <pre className="p-3.5 font-mono text-xs sm:text-[13px] text-[#7EE787] overflow-x-auto leading-relaxed">
                  {generatedCode}
                </pre>
              </div>

              {explanation && (
                <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] space-y-1">
                  <span className="text-xs font-semibold text-[#3FB950] block">
                    లాజిక్ వివరణ (Logic Explanation):
                  </span>
                  <p className="text-xs sm:text-sm text-[#E6EDF3] leading-relaxed font-telugu">
                    {explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#30363D] bg-[#0D1117] flex items-center justify-between text-xs text-[#8B949E]">
          <span>మీరు ఆలోచించే మాతృభాష నుండి ప్రోగ్రామింగ్ నేర్చుకోండి.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3]"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeluguToPythonModal;
