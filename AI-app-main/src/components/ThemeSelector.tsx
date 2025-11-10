"use client";

import React, { useState, useEffect } from 'react';
import { ThemeManager, getAllThemes, type Theme, type CustomColors } from '../utils/themeSystem';

interface ThemeSelectorProps {
  themeManager: ThemeManager;
  onThemeChange?: (theme: Theme) => void;
  onCustomColorsChange?: (colors: CustomColors) => void;
}

export default function ThemeSelector({ themeManager, onThemeChange, onCustomColorsChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themeManager.getCurrentTheme());
  const [customColors, setCustomColors] = useState(themeManager.getCustomColors());
  const [showColorPicker, setShowColorPicker] = useState(false);

  const themes = getAllThemes();

  const handleThemeSelect = (theme: Theme) => {
    themeManager.setTheme(theme.id);
    setCurrentTheme(theme);
    onThemeChange?.(theme);
  };

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    themeManager.setCustomColors(newColors);
    onCustomColorsChange?.(newColors);
  };

  const handleResetColors = () => {
    themeManager.resetCustomColors();
    setCustomColors({});
    onCustomColorsChange?.({});
  };

  return (
    <div className="theme-selector-container">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-toggle-button"
        title="Change Theme"
      >
        🎨 Theme
      </button>

      {/* Theme Selector Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 rounded-lg shadow-2xl border border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    🎨 Theme Customization
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Choose a preset theme or customize your own colors
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Current Theme Info */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Current Theme: {currentTheme.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {currentTheme.description}
                  </p>
                </div>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
                >
                  {showColorPicker ? '🎨 Hide' : '🎨 Customize'} Colors
                </button>
              </div>
            </div>

            {/* Custom Color Picker */}
            {showColorPicker && (
              <div className="p-6 bg-slate-900/50 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Custom Colors
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <ColorInput
                    label="Primary"
                    value={customColors.primary || currentTheme.colors.primary}
                    onChange={(val) => handleColorChange('primary', val)}
                  />
                  <ColorInput
                    label="Secondary"
                    value={customColors.secondary || currentTheme.colors.secondary}
                    onChange={(val) => handleColorChange('secondary', val)}
                  />
                  <ColorInput
                    label="Accent"
                    value={customColors.accent || currentTheme.colors.accent}
                    onChange={(val) => handleColorChange('accent', val)}
                  />
                  <ColorInput
                    label="Background"
                    value={customColors.background || currentTheme.colors.bgPrimary}
                    onChange={(val) => handleColorChange('background', val)}
                  />
                  <ColorInput
                    label="Text"
                    value={customColors.text || currentTheme.colors.textPrimary}
                    onChange={(val) => handleColorChange('text', val)}
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleResetColors}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                  >
                    🔄 Reset to Theme Default
                  </button>
                  <p className="text-slate-400 text-xs self-center">
                    💡 Custom colors override the selected theme
                  </p>
                </div>
              </div>
            )}

            {/* Theme Grid */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Preset Themes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isActive={currentTheme.id === theme.id}
                    onClick={() => handleThemeSelect(theme)}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-4 flex justify-between items-center">
              <p className="text-slate-400 text-sm">
                💾 Changes are saved automatically
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Theme Card Component
function ThemeCard({ theme, isActive, onClick }: { theme: Theme; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 transition-all text-left
        ${isActive
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
        }
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
          ✓
        </div>
      )}

      {/* Theme name */}
      <h4 className="text-white font-semibold mb-1">{theme.name}</h4>
      <p className="text-slate-400 text-xs mb-3">{theme.description}</p>

      {/* Color preview */}
      <div className="flex gap-2">
        <div
          className="w-8 h-8 rounded border border-white/20"
          style={{ background: theme.colors.primary }}
          title="Primary"
        />
        <div
          className="w-8 h-8 rounded border border-white/20"
          style={{ background: theme.colors.secondary }}
          title="Secondary"
        />
        <div
          className="w-8 h-8 rounded border border-white/20"
          style={{ background: theme.colors.accent }}
          title="Accent"
        />
        <div
          className="w-8 h-8 rounded border border-white/20"
          style={{ background: theme.colors.bgPrimary }}
          title="Background"
        />
      </div>

      {/* Dark/Light badge */}
      <div className="mt-3">
        <span className={`
          text-xs px-2 py-1 rounded
          ${theme.isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-800'}
        `}>
          {theme.isDark ? '🌙 Dark' : '☀️ Light'}
        </span>
      </div>
    </button>
  );
}

// Color Input Component
function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-slate-300 font-medium">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-slate-600 bg-slate-800 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
