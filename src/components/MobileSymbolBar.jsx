import React from 'react';
import { CornerDownLeft } from 'lucide-react';

const SYMBOLS = [
  { label: '(', insert: '(' },
  { label: ')', insert: ')' },
  { label: '[', insert: '[' },
  { label: ']', insert: ']' },
  { label: '{', insert: '{' },
  { label: '}', insert: '}' },
  { label: ':', insert: ':' },
  { label: '"', insert: '"' },
  { label: "'", insert: "'" },
  { label: '=', insert: '=' },
  { label: '+', insert: '+' },
  { label: '-', insert: '-' },
  { label: '*', insert: '*' },
  { label: '/', insert: '/' },
  { label: '<', insert: '<' },
  { label: '>', insert: '>' },
  { label: '#', insert: '# ' },
  { label: '_', insert: '_' },
  { label: ',', insert: ', ' },
];

export function MobileSymbolBar({ editorRef, onInsertSymbol, textareaRef }) {
  const handleInsert = (textToInsert) => {
    // 1. If explicit insertion callback provided
    if (onInsertSymbol) {
      onInsertSymbol(textToInsert);
      return;
    }

    // 2. Monaco Editor insertion
    if (editorRef?.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const id = { major: 1, minor: 1 };
      const op = {
        identifier: id,
        range: selection,
        text: textToInsert,
        forceMoveMarkers: true,
      };
      editor.executeEdits('symbol-bar', [op]);
      editor.focus();
      return;
    }

    // 3. Fallback standard textarea insertion
    if (textareaRef?.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + textToInsert + val.substring(end);
      textarea.value = newVal;
      textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
      textarea.focus();
      // Dispatch input event for React state sync
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  const handleInsertTab = () => {
    handleInsert('    '); // 4 spaces for Python PEP8 indentation
  };

  return (
    <div
      className="w-full bg-[#161B22] border-t border-b border-[#30363D] py-1 px-1.5 flex items-center space-x-1 overflow-x-auto no-scrollbar select-none z-10"
      aria-label="Mobile programming symbol shortcuts"
    >
      {/* 4 Spaces / Tab Indentation Shortcut */}
      <button
        type="button"
        onClick={handleInsertTab}
        className="h-8 px-2.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#58A6FF] font-mono text-xs font-semibold shrink-0 border border-[#30363D] flex items-center space-x-1 active:scale-95 transition-transform"
        title="Insert 4-space Python indentation"
      >
        <span className="text-[11px] font-sans">Tab</span>
        <span className="text-[10px] text-[#8B949E]">(4 స్పేస్)</span>
      </button>

      {/* Colon Shortcut with highlight */}
      <button
        type="button"
        onClick={() => handleInsert(':')}
        className="h-8 w-8 rounded bg-[#238636]/20 hover:bg-[#238636]/40 text-[#3FB950] font-mono text-sm font-bold shrink-0 border border-[#238636]/40 flex items-center justify-center active:scale-95 transition-transform"
        title="Colon (షరతు లేదా లూప్ చివర :)"
      >
        :
      </button>

      {/* Quick Programming Symbols */}
      {SYMBOLS.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => handleInsert(s.insert)}
          className="h-8 min-w-[32px] px-2 rounded bg-[#21262D] hover:bg-[#30363D] active:bg-[#58A6FF]/20 text-[#E6EDF3] font-mono text-xs font-medium shrink-0 border border-[#30363D] flex items-center justify-center active:scale-95 transition-transform"
          aria-label={`Insert ${s.label}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
