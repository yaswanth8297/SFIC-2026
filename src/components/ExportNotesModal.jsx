import React, { useState, useId } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  FileText,
  GraduationCap,
  Sparkles,
  BookOpen,
  Terminal,
  Layers
} from 'lucide-react';
import { PROGRAMMING_GLOSSARY } from '../dictionary/programmingGlossary.js';

export function ExportNotesModal({
  isOpen,
  onClose,
  code = '',
  lineExplanations = [],
  overallExplanation = '',
  executionOutput = ''
}) {
  const [worksheetMode, setWorksheetMode] = useState('full'); // 'full' | 'blank_worksheet'
  const [copied, setCopied] = useState(false);
  const printSheetId = useId();

  if (!isOpen) return null;

  const codeLines = (code || '').split('\n');

  // Identify keywords present in the code for the glossary reference section
  const lowerCode = (code || '').toLowerCase();
  const relevantGlossaryTerms = PROGRAMMING_GLOSSARY.filter((term) => {
    const en = term.english.toLowerCase();
    return lowerCode.includes(en);
  }).slice(0, 8);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textLines = [];
    textLines.push('========================================');
    textLines.push('CodeToTelugu — పైథాన్ స్టడీ నోట్స్ (Study Sheet)');
    textLines.push('========================================\n');
    textLines.push('## పైథాన్ కోడ్:');
    textLines.push(code || '');
    textLines.push('\n## లైన్-బై-లైన్ వివరణ:');

    codeLines.forEach((line, idx) => {
      const exp = lineExplanations?.[idx]?.telugu || 'సాధారణ అమలు';
      textLines.push(`${idx + 1}. ${line.trim()} => ${exp}`);
    });

    if (overallExplanation) {
      textLines.push(`\n## మొత్తం సారాంశం:\n${overallExplanation}`);
    }

    if (executionOutput) {
      textLines.push(`\n## అమలు ఫలితం (Output):\n${executionOutput}`);
    }

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Export Notes and Classroom Worksheets"
    >
      {/* Inline Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-study-sheet, #print-study-sheet * {
            visibility: visible !important;
          }
          #print-study-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .print-border {
            border: 1px solid #ddd !important;
          }
          .print-text-dark {
            color: #111 !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl flex flex-col overflow-hidden text-[#E6EDF3]">
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 border-b border-[#30363D] bg-[#0D1117]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3FB950]/10 border border-[#3FB950]/20 flex items-center justify-center text-[#3FB950]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#E6EDF3] flex items-center space-x-2">
                <span>తెలుగు స్టడీ షీట్ & నోట్స్ ఎగుమతి (Study Sheet Export)</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#3FB950]/10 text-[#3FB950] border border-[#3FB950]/20 font-medium">
                  Feature F12
                </span>
              </h2>
              <p className="text-xs text-[#8B949E]">
                తరగతి గది & ల్యాబ్ కోసం ప్రింటబుల్ నోట్స్ లేదా విద్యార్థి ప్రాక్టీస్ వర్క్‌షీట్
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D]/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls (No Print) */}
        <div className="no-print px-5 py-2.5 bg-[#1C2128] border-b border-[#30363D] flex flex-wrap items-center justify-between gap-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-[#0D1117] p-1 rounded-lg border border-[#30363D]">
            <button
              type="button"
              onClick={() => setWorksheetMode('full')}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1.5 font-medium ${
                worksheetMode === 'full'
                  ? 'bg-[#58A6FF] text-white shadow-sm'
                  : 'text-[#8B949E] hover:text-[#E6EDF3]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>పూర్తి నోట్స్ (Full Study Sheet)</span>
            </button>
            <button
              type="button"
              onClick={() => setWorksheetMode('blank_worksheet')}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1.5 font-medium ${
                worksheetMode === 'blank_worksheet'
                  ? 'bg-[#58A6FF] text-white shadow-sm'
                  : 'text-[#8B949E] hover:text-[#E6EDF3]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>ల్యాబ్ వర్క్‌షీట్ (Blank Worksheet)</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs text-[#E6EDF3] border border-[#30363D] transition-colors flex items-center space-x-1.5 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'కాపీ అయింది!' : 'టెక్స్ట్ కాపీ చేయి'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-xs text-white transition-colors flex items-center space-x-1.5 font-medium shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ప్రింట్ / PDF గా సేవ్ చేయి</span>
            </button>
          </div>
        </div>

        {/* Study Sheet Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0D1117]">
          <div
            id="print-study-sheet"
            className="max-w-3xl mx-auto p-6 sm:p-8 bg-[#161B22] border border-[#30363D] rounded-xl space-y-6 text-[#E6EDF3]"
          >
            {/* Printable Header */}
            <div className="border-b border-[#30363D] pb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-wider uppercase text-[#58A6FF]">
                  CodeToTelugu — Python Learning Studio
                </div>
                <h1 className="text-xl font-bold mt-1 text-[#E6EDF3]">
                  {worksheetMode === 'blank_worksheet'
                    ? 'ల్యాబ్ ప్రాక్టీస్ వర్క్‌షీట్ (Student Coding Worksheet)'
                    : 'పైథాన్ ప్రోగ్రామ్ తెలుగు స్టడీ షీట్ (Study Notes)'}
                </h1>
                <p className="text-xs text-[#8B949E] mt-0.5">
                  ద్విభాషా కోడింగ్ బోధన (Bilingual Programming Education)
                </p>
              </div>

              {/* Student Metadata Box (Useful for Lab Submissions) */}
              <div className="text-right border border-[#30363D] rounded-lg p-2.5 bg-[#0D1117] text-[11px] space-y-1">
                <div>
                  <span className="text-[#8B949E]">తేదీ: </span>
                  <span className="font-mono text-[#E6EDF3]">{new Date().toLocaleDateString('te-IN')}</span>
                </div>
                <div>
                  <span className="text-[#8B949E]">విద్యార్థి పేరు: </span>
                  <span className="inline-block w-28 border-b border-[#8B949E] border-dashed"></span>
                </div>
                <div>
                  <span className="text-[#8B949E]">రోల్ నంబర్: </span>
                  <span className="inline-block w-20 border-b border-[#8B949E] border-dashed"></span>
                </div>
              </div>
            </div>

            {/* Overall Summary if present */}
            {overallExplanation && (
              <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1">
                <div className="text-xs font-semibold text-[#58A6FF] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>మొత్తం ప్రోగ్రామ్ సారాంశం (Program Summary)</span>
                </div>
                <p className="text-xs text-[#C9D1D9] leading-relaxed font-telugu">
                  {overallExplanation}
                </p>
              </div>
            )}

            {/* Line by Line Code & Telugu Explanation Table */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#3FB950]" />
                <span>లైన్-బై-లైన్ వివరణ పట్టిక (Line-by-Line Code & Meaning)</span>
              </h2>

              <div className="border border-[#30363D] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1C2128] border-b border-[#30363D] text-[#8B949E]">
                      <th className="py-2 px-3 w-12 text-center font-mono">లైన్</th>
                      <th className="py-2 px-3 w-1/2 font-mono">పైథాన్ కోడ్ (Python Code)</th>
                      <th className="py-2 px-3">
                        {worksheetMode === 'blank_worksheet'
                          ? 'విద్యార్థి సమాధానం (ఈ లైన్ ఏం చేస్తుందో రాయండి)'
                          : 'తెలుగులో వివరణ (Telugu Meaning)'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]">
                    {codeLines.map((line, idx) => {
                      const exp = lineExplanations?.[idx]?.telugu || '';
                      return (
                        <tr key={idx} className="hover:bg-[#1C2128]/50">
                          <td className="py-2 px-3 text-center font-mono text-[#8B949E] text-[11px] align-top bg-[#0D1117]/30">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3 font-mono text-[#58A6FF] align-top whitespace-pre-wrap break-all">
                            {line || <span className="text-[#484F58] italic">&lt;empty line&gt;</span>}
                          </td>
                          <td className="py-2 px-3 align-top font-telugu text-[#C9D1D9] leading-relaxed">
                            {worksheetMode === 'blank_worksheet' ? (
                              <div className="h-6 border-b border-[#484F58] border-dashed"></div>
                            ) : (
                              exp || <span className="text-[#8B949E] italic">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Execution Output Preview */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#E6EDF3]" />
                <span>అమలు ఫలితం (Program Output)</span>
              </h2>
              <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#3FB950] whitespace-pre-wrap">
                {worksheetMode === 'blank_worksheet' ? (
                  <div className="text-[#8B949E] italic py-4 text-center border border-dashed border-[#30363D] rounded">
                    [ పై ప్రోగ్రామ్ రన్ చేస్తే వచ్చే అవుట్‌పుట్‌ను ఇక్కడ చేతితో రాయండి ]
                  </div>
                ) : (
                  executionOutput || 'ప్రోగ్రామ్ అవుట్‌పుట్ ఇంకా రన్ కాలేదు'
                )}
              </div>
            </div>

            {/* Key Glossary Reference Terms */}
            {relevantGlossaryTerms.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#30363D]">
                <h2 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D29922]" />
                  <span>ముఖ్యమైన సాంకేతిక పదాల నిఘంటువు (Glossary Terms Reference)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {relevantGlossaryTerms.map((term, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[#58A6FF] font-semibold">{term.english}</span>
                        <span className="font-telugu text-[#3FB950] font-medium">{term.teluguScript}</span>
                      </div>
                      <div className="text-[11px] text-[#8B949E] font-telugu">
                        {term.meaningTelugu}
                      </div>
                      {term.analogy && (
                        <div className="text-[10px] text-[#D29922]">
                          పోలిక: {term.analogy}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Printable Footer */}
            <div className="text-center text-[10px] text-[#8B949E] pt-4 border-t border-[#30363D]">
              రూపొందించబడింది: CodeToTelugu — గ్రామీణ మరియు టైర్-3/4 విద్యార్థుల కోసం ఉచిత కంప్యూటర్ విద్య సాధనం.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportNotesModal;
