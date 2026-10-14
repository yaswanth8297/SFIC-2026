import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquare, X, Send } from 'lucide-react';

export function FeedbackModal({ isOpen, onClose, contextData = null }) {
  const [feedbackType, setFeedbackType] = useState('translation_error');
  const [reportedText, setReportedText] = useState('');
  const [suggestedTelugu, setSuggestedTelugu] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (contextData?.text) {
      setReportedText(contextData.text);
    }
    setSubmitted(false);
  }, [contextData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const report = {
      id: `report_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: feedbackType,
      originalText: reportedText,
      suggestedTelugu,
      comment,
      line: contextData?.line || null,
    };

    // Save report to localStorage for review / export
    try {
      const existing = JSON.parse(localStorage.getItem('codetotelugu_reports') || '[]');
      existing.push(report);
      localStorage.setItem('codetotelugu_reports', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not save feedback report:', err);
    }

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setSuggestedTelugu('');
      setComment('');
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#30363D] flex items-center justify-between bg-[#0D1117]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-base font-semibold text-[#E6EDF3] tracking-tight">
                తప్పు అనువాదం నివేదించండి
              </h2>
              <p className="text-xs text-[#8B949E]">
                Report Incorrect Telugu & Suggest Better Phrasing
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

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#E6EDF3]">
              మీ సలహా విజయవంతంగా నమోదైంది!
            </h3>
            <p className="text-xs text-[#8B949E]">
              మీ సూచనను మా విద్యా నిపుణులు సమీక్షించి నిఘంటువును మరింత మెరుగుపరుస్తారు. ధన్యవాదాలు!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1">
                నివేదిక రకం (Feedback Type)
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-md text-xs text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"
              >
                <option value="translation_error">తప్పు తెలుగు అనువాదం (Grammar / Vocabulary Issue)</option>
                <option value="formal_complex">చాలా కష్టమైన పుస్తక భాష (Too Formal/Unnatural)</option>
                <option value="logic_mismatch">కోడ్ భావన సరిపోలడం లేదు (Logic Explanation Incorrect)</option>
                <option value="other">ఇతర సూచనలు (Other Suggestion)</option>
              </select>
            </div>

            {reportedText && (
              <div>
                <label className="block text-xs font-medium text-[#8B949E] mb-1">
                  ప్రస్తుత వివరణ (Current Text)
                </label>
                <div className="p-2.5 rounded bg-[#0D1117] border border-[#30363D] text-xs text-[#C9D1D9] max-h-24 overflow-y-auto">
                  {reportedText}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1">
                మీ సూచన / సరైన తెలుగు పదం (Suggested Correction)
              </label>
              <textarea
                value={suggestedTelugu}
                onChange={(e) => setSuggestedTelugu(e.target.value)}
                placeholder="ఉదాహరణ: 'ఇక్కడ సరళంగా చరరాశి విలువ పెరుగుతుంది అని రాస్తే బాగుంటుంది'..."
                rows={3}
                required
                className="w-full p-2.5 bg-[#0D1117] border border-[#30363D] rounded-md text-xs text-[#E6EDF3] placeholder-[#6E7681] focus:outline-none focus:border-[#58A6FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8B949E] mb-1">
                అదనపు వివరాలు (Optional Notes)
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="కాలేజీ లేదా ప్రాంతీయ వాడుక వివరాలు..."
                className="w-full px-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-md text-xs text-[#E6EDF3] placeholder-[#6E7681] focus:outline-none focus:border-[#58A6FF]"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-md text-xs text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]"
              >
                రద్దు చేయి (Cancel)
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>నివేదించు (Submit)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
