import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  X,
  Volume2,
  Copy,
  Check,
  Lightbulb,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PROGRAMMING_GLOSSARY } from '../dictionary/programmingGlossary.js';

const CATEGORIES = [
  { id: 'all', label: 'అన్నీ (All)' },
  { id: 'data', label: 'డేటా రకాలు (Data Types)' },
  { id: 'data_structure', label: 'జాబితాలు (Data Structures)' },
  { id: 'control_flow', label: 'షరతులు & లూప్‌లు (Control Flow)' },
  { id: 'io', label: 'ఇన్‌పుట్ / అవుట్‌పుట్ (I/O)' },
  { id: 'functions', label: 'ఫంక్షన్స్ (Functions)' },
  { id: 'syntax', label: 'సింటాక్స్ (Syntax)' },
  { id: 'error', label: 'లోపాలు (Errors)' },
];

export function GlossaryModal({ isOpen, onClose, initialTerm = '', onSelectSnippet }) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  // Sync initialTerm if provided
  React.useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
    }
  }, [initialTerm]);

  const filteredGlossary = useMemo(() => {
    return PROGRAMMING_GLOSSARY.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchTerm || !searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();

      return (
        item.term.toLowerCase().includes(q) ||
        item.teluguScript.toLowerCase().includes(q) ||
        item.phonetic.toLowerCase().includes(q) ||
        item.plainMeaning.toLowerCase().includes(q) ||
        item.englishMeaning.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, selectedCategory]);

  const handleCopyExample = (exampleCode, id) => {
    if (!exampleCode) return;
    navigator.clipboard.writeText(exampleCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakTelugu = (text, id) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Find Telugu voice if available
    const voices = window.speechSynthesis.getVoices();
    const teluguVoice = voices.find(
      (v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu')
    );
    if (teluguVoice) {
      utterance.voice = teluguVoice;
    }
    utterance.lang = 'te-IN';
    utterance.rate = 0.9;

    setPlayingId(id);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363D] flex items-center justify-between bg-[#0D1117]/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="glossary-title" className="text-base font-semibold text-[#E6EDF3] tracking-tight flex items-center gap-2">
                తెలుగు ప్రోగ్రామింగ్ నిఘంటువు
                <span className="text-xs font-normal text-[#8B949E] px-2 py-0.5 rounded-full bg-[#1F242C] border border-[#30363D]">
                  Programming Glossary (Appendix B)
                </span>
              </h2>
              <p className="text-xs text-[#8B949E]">
                ప్రోగ్రామింగ్ కీలక పదాలు, వాటి తెలుగు అర్థాలు మరియు నిత్యజీవిత పోలికలు.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
            aria-label="Close Glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-[#30363D] bg-[#161B22] flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keyword (e.g. variable, loop, print, చరరాశి, జాబితా)..."
              className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs sm:text-sm text-[#E6EDF3] placeholder-[#6E7681] focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8B949E] hover:text-[#E6EDF3]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#238636] text-white shadow-xs'
                    : 'bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Terms List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-[#30363D]/40">
          {filteredGlossary.length === 0 ? (
            <div className="text-center py-12 text-[#8B949E]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">"{searchTerm}" కు సరిపోయే పదాలు కనుగొనబడలేదు.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs text-[#58A6FF] hover:underline"
              >
                అన్ని పదాలను చూడండి (Reset Filters)
              </button>
            </div>
          ) : (
            filteredGlossary.map((item) => (
              <div
                key={item.id}
                className="pt-3.5 first:pt-0 group flex flex-col md:flex-row md:items-start justify-between gap-4 p-3 rounded-lg hover:bg-[#1C2128]/60 transition-colors"
              >
                {/* Term Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-mono font-semibold text-sm sm:text-base text-[#58A6FF]">
                      {item.term}
                    </span>
                    <span className="text-sm font-medium text-[#E6EDF3] bg-[#21262D] px-2 py-0.5 rounded">
                      {item.teluguScript}
                    </span>
                    <span className="text-xs text-[#8B949E] italic">
                      ({item.phonetic})
                    </span>
                    {item.reviewed && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-[#3FB950] bg-[#238636]/15 border border-[#238636]/30 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ధృవీకరించబడింది</span>
                      </span>
                    )}
                  </div>

                  {/* Plain Spoken Telugu Meaning */}
                  <p className="text-xs sm:text-sm text-[#E6EDF3] font-medium leading-relaxed">
                    {item.plainMeaning}
                  </p>

                  {/* English Definition */}
                  <p className="text-xs text-[#8B949E] leading-relaxed">
                    <span className="text-[#6E7681]">Meaning:</span> {item.englishMeaning}
                  </p>

                  {/* Local Telugu Analogy (F14) */}
                  {item.analogy && (
                    <div className="flex items-start space-x-2 text-xs text-[#D29922] bg-[#D29922]/10 border border-[#D29922]/20 p-2 rounded-md">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">నిత్యజీవిత పోలిక: </span>
                        <span>{item.analogy}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side: Example Code & Actions */}
                <div className="md:w-64 shrink-0 flex flex-col space-y-2">
                  {item.example && (
                    <div className="relative rounded-md bg-[#0D1117] border border-[#30363D] p-2.5 font-mono text-xs text-[#7EE787]">
                      <pre className="overflow-x-auto whitespace-pre font-mono text-[11px] leading-tight">
                        {item.example}
                      </pre>
                      <button
                        type="button"
                        onClick={() => handleCopyExample(item.example, item.id)}
                        className="absolute top-2 right-2 p-1 rounded bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
                        title="Copy code snippet"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3 text-[#3FB950]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSpeakTelugu(item.plainMeaning, item.id)}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                        playingId === item.id
                          ? 'bg-[#58A6FF]/20 border-[#58A6FF] text-[#58A6FF] animate-pulse'
                          : 'bg-[#21262D] border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                      title="Listen in Telugu"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{playingId === item.id ? 'వినబడుతోంది...' : 'వినండి (Listen)'}</span>
                    </button>

                    {onSelectSnippet && item.example && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSnippet(item.example);
                          onClose();
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs bg-[#238636] hover:bg-[#2EA043] text-white transition-colors"
                        title="Insert into editor"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>ఎడిటర్‌లో ప్రయత్నించండి</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#30363D] bg-[#0D1117] flex items-center justify-between text-xs text-[#8B949E]">
          <span>మొత్తం పదాలు: {PROGRAMMING_GLOSSARY.length} (ధృవీకరించిన నిఘంటువు)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] transition-colors font-medium"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
