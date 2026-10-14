import React, { useState, useEffect } from 'react';
import { Type, Sun, Moon, Contrast } from 'lucide-react';

export function AccessibilityControls() {
  const [fontSizeLevel, setFontSizeLevel] = useState(() => {
    return localStorage.getItem('codetotelugu_font_scale') || 'normal'; // 'normal' | 'large' | 'xl'
  });

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('codetotelugu_theme') || 'dark'; // 'dark' | 'light' | 'contrast'
  });

  useEffect(() => {
    // Apply font scale to document root
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xl');
    root.classList.add(`font-scale-${fontSizeLevel}`);
    localStorage.setItem('codetotelugu_font_scale', fontSizeLevel);

    // Dynamic style injection for Telugu script readability
    if (fontSizeLevel === 'large') {
      root.style.setProperty('--telugu-font-scale', '1.12');
    } else if (fontSizeLevel === 'xl') {
      root.style.setProperty('--telugu-font-scale', '1.25');
    } else {
      root.style.setProperty('--telugu-font-scale', '1.0');
    }
  }, [fontSizeLevel]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light-theme', 'high-contrast');

    if (themeMode === 'light') {
      root.classList.add('light-theme');
    } else if (themeMode === 'contrast') {
      root.classList.add('high-contrast');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem('codetotelugu_theme', themeMode);
  }, [themeMode]);

  const cycleFontSize = () => {
    setFontSizeLevel((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xl';
      return 'normal';
    });
  };

  const cycleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'dark') return 'contrast';
      if (prev === 'contrast') return 'light';
      return 'dark';
    });
  };

  return (
    <div className="flex items-center space-x-1.5 select-none">
      {/* Font Scale Button */}
      <button
        type="button"
        onClick={cycleFontSize}
        className="px-2 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] border border-[#30363D] text-xs font-medium flex items-center space-x-1 transition-colors"
        title={`Telugu Font Size: ${fontSizeLevel.toUpperCase()} (Click to toggle)`}
        aria-label="Adjust Telugu Font Size"
      >
        <Type className="w-3.5 h-3.5 text-[#58A6FF]" />
        <span className="text-[11px] font-mono">
          {fontSizeLevel === 'normal' ? 'A' : fontSizeLevel === 'large' ? 'A+' : 'A++'}
        </span>
      </button>

      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={cycleTheme}
        className="p-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] border border-[#30363D] transition-colors"
        title={`Theme: ${themeMode.toUpperCase()} (Click to change)`}
        aria-label="Toggle Theme Mode"
      >
        {themeMode === 'dark' && <Moon className="w-3.5 h-3.5 text-[#E6EDF3]" />}
        {themeMode === 'contrast' && <Contrast className="w-3.5 h-3.5 text-[#F0883E]" />}
        {themeMode === 'light' && <Sun className="w-3.5 h-3.5 text-[#D29922]" />}
      </button>
    </div>
  );
}
