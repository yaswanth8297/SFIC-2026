import React, { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppToolbar } from './components/AppToolbar.jsx';
import { AboutModal } from './components/AboutModal.jsx';
import { ApiKeyModal } from './components/ApiKeyModal.jsx';
import { ProgramHistory } from './components/ProgramHistory.jsx';
import { MyProgressModal } from './components/MyProgressModal.jsx';
import { GlossaryModal } from './components/GlossaryModal.jsx';
import { SampleProgramsModal } from './components/SampleProgramsModal.jsx';
import { FeedbackModal } from './components/FeedbackModal.jsx';
import { LessonsModal } from './components/LessonsModal.jsx';
import { ExportNotesModal } from './components/ExportNotesModal.jsx';
import { XpToast } from './components/XpToast.jsx';
import { GamificationProvider } from './context/GamificationContext.jsx';
import { Home } from './pages/Home.jsx';
import { Translate } from './pages/Translate.jsx';
import { getActiveApiKey } from './services/gemini.js';
import { saveTranslationRequest, saveProgram } from './utils/storage.js';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState('');
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isLessonsOpen, setIsLessonsOpen] = useState(false);
  const [isExportNotesOpen, setIsExportNotesOpen] = useState(false);
  const [exportNotesData, setExportNotesData] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(() => Boolean(getActiveApiKey()));
  const [keyUpdateCount, setKeyUpdateCount] = useState(0);

  // Reference to Monaco editor on Home page for Edit menu actions
  const homeEditorRef = useRef(null);

  const checkApiKey = () => {
    const key = getActiveApiKey();
    setHasApiKey(Boolean(key));
  };

  const handleOpenExportNotes = (data = null) => {
    if (data) {
      setExportNotesData(data);
    } else {
      const code = homeEditorRef.current ? homeEditorRef.current.getValue() : '';
      setExportNotesData({
        code,
        lineExplanations: [],
        overallExplanation: '',
        executionOutput: '',
      });
    }
    setIsExportNotesOpen(true);
  };

  // Menu action handlers
  const handleNewTranslation = () => {
    navigate('/');
  };

  const handleClearCode = () => {
    if (homeEditorRef.current) {
      homeEditorRef.current.setValue('');
    }
  };

  const handleCopyOriginal = () => {
    if (homeEditorRef.current) {
      const code = homeEditorRef.current.getValue();
      if (code) {
        navigator.clipboard.writeText(code);
      }
    }
  };

  const handleSelectAll = () => {
    if (homeEditorRef.current) {
      homeEditorRef.current.focus();
      homeEditorRef.current.trigger('keyboard', 'selectAll', null);
    }
  };

  const handleTranslateFromMenu = () => {
    if (location.pathname === '/') {
      const btn = document.querySelector('button[title="Translate code to Telugu"]');
      if (btn) btn.click();
    } else {
      navigate('/');
    }
  };

  const handleSaveCurrentProgram = () => {
    if (homeEditorRef.current && location.pathname === '/') {
      const code = homeEditorRef.current.getValue();
      if (code && code.trim()) {
        const firstLine = code.split('\n')[0].replace(/^[#\s]+/, '').slice(0, 30);
        saveProgram({
          name: firstLine ? `Python: ${firstLine}` : 'Saved Program',
          code,
        });
        setIsHistoryOpen(true);
      }
    }
  };

  const handleOpenProgram = (program) => {
    if (!program?.code) return;
    const saveRes = saveTranslationRequest(program.code, 'telugu');
    if (saveRes.success && saveRes.id) {
      navigate(`/translate?id=${encodeURIComponent(saveRes.id)}`);
    } else {
      if (homeEditorRef.current) {
        homeEditorRef.current.setValue(program.code);
      }
      navigate('/');
    }
  };

  const handleOpenGlossary = (term = '') => {
    setGlossaryTerm(term || '');
    setIsGlossaryOpen(true);
  };

  const handleOpenSamples = () => {
    setIsSamplesOpen(true);
  };

  const handleReportError = (context) => {
    setFeedbackContext(context);
    setIsFeedbackOpen(true);
  };

  const handleApplySnippetToEditor = (snippet) => {
    if (homeEditorRef.current) {
      homeEditorRef.current.setValue(snippet);
    }
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex flex-col font-sans">
      {/* IDE Top Toolbar */}
      <AppToolbar
        onNewTranslation={handleNewTranslation}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenProgress={() => setIsProgressOpen(true)}
        onToggleAiTutor={() => {
          if (location.pathname !== '/') {
            navigate('/');
          }
          setIsAiTutorOpen((prev) => !prev);
        }}
        onSaveProgram={handleSaveCurrentProgram}
        onClearCode={handleClearCode}
        onCopyOriginal={handleCopyOriginal}
        onSelectAll={handleSelectAll}
        onTranslate={handleTranslateFromMenu}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onOpenGlossary={() => handleOpenGlossary()}
        onOpenSamples={handleOpenSamples}
        onOpenLessons={() => setIsLessonsOpen(true)}
        onOpenExportNotes={() => handleOpenExportNotes()}
        hasApiKey={hasApiKey}
      />

      {/* Main View Area */}
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                editorRef={homeEditorRef}
                onOpenHistory={() => setIsHistoryOpen(true)}
                isAiTutorOpen={isAiTutorOpen}
                onToggleAiTutor={() => setIsAiTutorOpen((prev) => !prev)}
                onOpenApiKey={() => setIsApiKeyOpen(true)}
                onOpenGlossary={handleOpenGlossary}
                onOpenSamples={handleOpenSamples}
                onOpenLessons={() => setIsLessonsOpen(true)}
                onOpenExportNotes={(data) => handleOpenExportNotes(data)}
              />
            }
          />
          <Route
            path="/translate"
            element={
              <Translate
                keyUpdateCount={keyUpdateCount}
                onOpenApiKey={() => setIsApiKeyOpen(true)}
                onOpenAbout={() => setIsAboutOpen(true)}
                onOpenGlossary={handleOpenGlossary}
                onReportError={handleReportError}
                onOpenLessons={() => setIsLessonsOpen(true)}
                onOpenExportNotes={(data) => handleOpenExportNotes(data)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Modals & Notifications */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        onKeySaved={() => {
          checkApiKey();
          setKeyUpdateCount((c) => c + 1);
        }}
      />

      <ProgramHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onOpenProgram={handleOpenProgram}
      />

      <MyProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        initialTerm={glossaryTerm}
        onSelectSnippet={handleApplySnippetToEditor}
      />

      <SampleProgramsModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectProgram={handleApplySnippetToEditor}
      />

      <LessonsModal
        isOpen={isLessonsOpen}
        onClose={() => setIsLessonsOpen(false)}
        onSelectCode={handleApplySnippetToEditor}
      />

      <ExportNotesModal
        isOpen={isExportNotesOpen}
        onClose={() => setIsExportNotesOpen(false)}
        code={exportNotesData?.code || ''}
        lineExplanations={exportNotesData?.lineExplanations || []}
        overallExplanation={exportNotesData?.overallExplanation || ''}
        executionOutput={exportNotesData?.executionOutput || ''}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        contextData={feedbackContext}
      />

      <XpToast />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <GamificationProvider>
        <AppLayout />
      </GamificationProvider>
    </BrowserRouter>
  );
}

export default App;
