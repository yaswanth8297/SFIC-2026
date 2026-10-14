import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  BookOpen,
  Key,
  FolderOpen,
  Award,
  Flame,
  Sparkles,
  FileCode2,
  GraduationCap,
  FileText
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext.jsx';
import { AccessibilityControls } from './AccessibilityControls.jsx';

export function AppToolbar({
  onNewTranslation,
  onOpenHistory,
  onOpenProgress,
  onToggleAiTutor,
  onSaveProgram,
  onClearCode,
  onCopyOriginal,
  onSelectAll,
  onTranslate,
  onOpenAbout,
  onOpenApiKey,
  onOpenGlossary,
  onOpenSamples,
  onOpenLessons,
  onOpenExportNotes,
  hasApiKey,
}) {
  const { levelInfo, streakInfo } = useGamification();

  // Menu states
  const [openMenu, setOpenMenu] = useState(null); // 'file' | 'edit' | 'translate' | null
  const toolbarRef = useRef(null);

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleMenuAction = (action) => {
    setOpenMenu(null);
    if (action) action();
  };

  return (
    <header
      ref={toolbarRef}
      className="sticky top-0 z-40 w-full h-12 bg-[#161B22] border-b border-[#30363D] select-none text-[13px]"
    >
      <div className="h-full px-3 flex items-center justify-between">
        {/* Left Side: Brand, Menus, Workspace */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-[#E6EDF3] hover:text-[#58A6FF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#58A6FF] rounded px-1.5 py-1"
            aria-label="CodeToTelugu Home"
          >
            <Code2 className="w-4 h-4 text-[#58A6FF]" />
            <span className="font-semibold tracking-tight text-[14px]">CodeToTelugu</span>
          </Link>

          {/* Divider */}
          <div className="h-4 w-px bg-[#30363D]" />

          {/* Menus */}
          <div className="flex items-center space-x-0.5">
            {/* File Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('file')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                  openMenu === 'file'
                    ? 'bg-[#1C2128] text-[#E6EDF3]'
                    : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                }`}
                aria-expanded={openMenu === 'file'}
                aria-haspopup="menu"
              >
                <span>File</span>
              </button>

              {openMenu === 'file' && (
                <div
                  className="absolute left-0 top-full mt-1 w-52 bg-[#161B22] border border-[#30363D] rounded-md shadow-xl py-1 z-50 animate-in fade-in duration-100"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onNewTranslation)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>New Translation</span>
                    <span className="text-[10px] text-[#8B949E] font-mono">/</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenHistory)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>Open Saved Programs...</span>
                    <span className="text-[10px] text-[#8B949E] font-mono">Ctrl+O</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onSaveProgram)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>Save Current Program</span>
                    <span className="text-[10px] text-[#8B949E] font-mono">Ctrl+S</span>
                  </button>
                  <div className="h-px bg-[#30363D] my-1" />
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenProgress)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>My Progress Dashboard</span>
                    <span className="text-[10px] text-[#3FB950] font-mono">Lvl {levelInfo?.level || 1}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenLessons)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>పాఠాలు (Guided Lessons)...</span>
                    <span className="text-[10px] text-[#58A6FF] font-mono">F7</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenExportNotes)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>నోట్స్ ఎగుమతి (Export Study Sheet)...</span>
                    <span className="text-[10px] text-[#3FB950] font-mono">Ctrl+P</span>
                  </button>
                  <div className="h-px bg-[#30363D] my-1" />
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onClearCode)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>Clear Code</span>
                    <span className="text-[10px] text-[#8B949E] font-mono">Alt+C</span>
                  </button>
                </div>
              )}
            </div>

            {/* Edit Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('edit')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                  openMenu === 'edit'
                    ? 'bg-[#1C2128] text-[#E6EDF3]'
                    : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                }`}
                aria-expanded={openMenu === 'edit'}
                aria-haspopup="menu"
              >
                <span>Edit</span>
              </button>

              {openMenu === 'edit' && (
                <div
                  className="absolute left-0 top-full mt-1 w-48 bg-[#161B22] border border-[#30363D] rounded-md shadow-xl py-1 z-50 animate-in fade-in duration-100"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onCopyOriginal)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>Copy Original Code</span>
                    <span className="text-[10px] text-[#8B949E] font-mono">Ctrl+C</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onSelectAll)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>Select All</span>
                    <span className="text-[10px] text-[#8B949E] font-mono">Ctrl+A</span>
                  </button>
                </div>
              )}
            </div>

            {/* Translate Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('translate')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                  openMenu === 'translate'
                    ? 'bg-[#1C2128] text-[#E6EDF3]'
                    : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                }`}
                aria-expanded={openMenu === 'translate'}
                aria-haspopup="menu"
              >
                <span>Translate</span>
              </button>

              {openMenu === 'translate' && (
                <div
                  className="absolute left-0 top-full mt-1 w-52 bg-[#161B22] border border-[#30363D] rounded-md shadow-xl py-1 z-50 animate-in fade-in duration-100"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onTranslate)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>Translate to Telugu</span>
                    <span className="text-[10px] text-[#8B949E] font-mono">Ctrl+Enter</span>
                  </button>
                  <div className="h-px bg-[#30363D] my-1" />
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenAbout)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128]"
                    role="menuitem"
                  >
                    Telugu Dictionary Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenApiKey)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128]"
                    role="menuitem"
                  >
                    Gemini API Settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-[#30363D] hidden md:block" />

          {/* Workspace Label */}
          <div className="hidden md:flex items-center space-x-1 text-xs text-[#8B949E]">
            <span>Workspace:</span>
            <span className="text-[#E6EDF3] font-medium">Python Workspace</span>
          </div>
        </div>

        {/* Right Side: Progress, Tutor, History, Language, Status */}
        <div className="flex items-center space-x-2">
          {/* Progress / Level Pill */}
          <button
            type="button"
            onClick={onOpenProgress}
            className="px-2 py-1 rounded-md bg-[#1C2128] hover:bg-[#30363D]/50 text-[#E6EDF3] border border-[#30363D] transition-colors text-xs flex items-center space-x-1.5"
            title={`Level ${levelInfo?.level}: ${levelInfo?.title} (${levelInfo?.totalXp} XP)`}
          >
            <Award className="w-3.5 h-3.5 text-[#3FB950]" />
            <span className="font-semibold text-[#3FB950]">Lvl {levelInfo?.level || 1}</span>
            <span className="text-[#8B949E] hidden lg:inline">• {levelInfo?.totalXp || 0} XP</span>
            {streakInfo?.currentStreak > 0 && (
              <span className="flex items-center space-x-0.5 text-[#F85149] font-mono pl-1 border-l border-[#30363D]">
                <Flame className="w-3 h-3 text-[#F85149]" />
                <span>{streakInfo.currentStreak}d</span>
              </span>
            )}
          </button>

          {/* AI Tutor Toggle Button */}
          {onToggleAiTutor && (
            <button
              type="button"
              onClick={onToggleAiTutor}
              className="px-2.5 py-1 rounded-md bg-[#1C2128] hover:bg-[#30363D]/50 text-[#58A6FF] border border-[#30363D] transition-colors text-xs flex items-center space-x-1.5 font-medium"
              title="Open AI Coding Companion"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span className="hidden sm:inline">AI Tutor</span>
            </button>
          )}

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-2 py-1 rounded-md bg-[#1C2128] hover:bg-[#30363D]/50 text-[#8B949E] hover:text-[#E6EDF3] border border-[#30363D] transition-colors text-xs flex items-center space-x-1"
            title="Saved Programs and History"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#58A6FF]" />
            <span className="hidden lg:inline">Programs</span>
          </button>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#1C2128] border border-[#30363D] text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" />
            <span className="text-[#8B949E]">Status:</span>
            <span className="text-[#E6EDF3]">Ready</span>
          </div>

          {/* Guided Telugu Lessons Button (F7) */}
          {onOpenLessons && (
            <button
              type="button"
              onClick={onOpenLessons}
              className="px-2 py-1 rounded-md bg-[#1C2128] hover:bg-[#30363D]/50 text-[#58A6FF] hover:text-[#79C0FF] border border-[#30363D] transition-colors text-xs flex items-center space-x-1 font-medium"
              title="Guided Telugu Lessons & Quizzes (పాఠాలు)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span className="hidden sm:inline">పాఠాలు (Lessons)</span>
            </button>
          )}

          {/* Export Notes / Classroom Worksheet Button (F12) */}
          {onOpenExportNotes && (
            <button
              type="button"
              onClick={onOpenExportNotes}
              className="px-2 py-1 rounded-md bg-[#1C2128] hover:bg-[#30363D]/50 text-[#3FB950] hover:text-[#56D364] border border-[#30363D] transition-colors text-xs flex items-center space-x-1 font-medium"
              title="Export Printable Study Sheet or Lab Worksheet (నోట్స్)"
            >
              <FileText className="w-3.5 h-3.5 text-[#3FB950]" />
              <span className="hidden md:inline">నోట్స్ (Notes)</span>
            </button>
          )}

          {/* Samples Button (I11) */}
          {onOpenSamples && (
            <button
              type="button"
              onClick={onOpenSamples}
              className="px-2 py-1 rounded-md bg-[#1C2128] hover:bg-[#30363D]/50 text-[#D29922] hover:text-[#E3B341] border border-[#30363D] transition-colors text-xs flex items-center space-x-1 font-medium"
              title="One-Click Sample Programs"
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#D29922]" />
              <span className="hidden sm:inline">నమూనాలు (Samples)</span>
            </button>
          )}

          {/* Interactive Telugu Glossary Button (F4 / Appendix B) */}
          {onOpenGlossary && (
            <button
              type="button"
              onClick={onOpenGlossary}
              className="px-2 py-1 rounded-md bg-[#1C2128] hover:bg-[#30363D]/50 text-[#58A6FF] hover:text-[#79C0FF] border border-[#30363D] transition-colors text-xs flex items-center space-x-1 font-medium"
              title="Telugu Programming Glossary (నిఘంటువు)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span className="hidden md:inline">నిఘంటువు (Glossary)</span>
            </button>
          )}

          {/* Accessibility & Font Scaler Controls (I10) */}
          <AccessibilityControls />

          {/* API Key Modal Button */}
          <button
            type="button"
            onClick={onOpenApiKey}
            className={`px-2 py-1 rounded-md border text-xs transition-colors flex items-center space-x-1.5 ${
              hasApiKey
                ? 'bg-[#1C2128] text-[#3FB950] border-[#30363D] hover:bg-[#30363D]/50'
                : 'bg-[#1C2128] text-[#8B949E] border-[#30363D] hover:bg-[#30363D]/50'
            }`}
            title={hasApiKey ? 'Gemini API Key Connected' : 'Configure Gemini API Key'}
          >
            <Key className="w-3.5 h-3.5" />
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasApiKey ? 'bg-[#3FB950]' : 'bg-[#8B949E]'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppToolbar;
