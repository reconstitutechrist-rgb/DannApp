'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Palette,
  Cpu,
  Sliders,
  Moon,
  Sun,
  Monitor,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

type ModelOption = 'claude-3-5-sonnet-20241022' | 'claude-3-opus-20240229' | 'claude-3-haiku-20240307';

interface AppSettings {
  model: ModelOption;
  theme: string;
  displayMode: 'light' | 'dark' | 'auto';
  codeStyle: 'compact' | 'comfortable' | 'spacious';
  autoSave: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  wordWrap: boolean;
  fontSize: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  model: 'claude-3-5-sonnet-20241022',
  theme: 'midnight',
  displayMode: 'dark',
  codeStyle: 'comfortable',
  autoSave: true,
  lineNumbers: true,
  minimap: false,
  wordWrap: true,
  fontSize: 14,
};

const MODEL_OPTIONS: { value: ModelOption; label: string; description: string }[] = [
  {
    value: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet',
    description: 'Best balance of speed and intelligence',
  },
  {
    value: 'claude-3-opus-20240229',
    label: 'Claude 3 Opus',
    description: 'Most capable model for complex tasks',
  },
  {
    value: 'claude-3-haiku-20240307',
    label: 'Claude 3 Haiku',
    description: 'Fastest model for quick responses',
  },
];

const THEME_OPTIONS = [
  { id: 'midnight', name: 'Midnight', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
  { id: 'ocean', name: 'Ocean', colors: ['#003f5c', '#2f4b7c', '#665191'] },
  { id: 'forest', name: 'Forest', colors: ['#1b4332', '#2d6a4f', '#40916c'] },
  { id: 'sunset', name: 'Sunset', colors: ['#582f0e', '#7f4f24', '#936639'] },
  { id: 'neon', name: 'Neon', colors: ['#0a0a0b', '#1a1a2e', '#16213e'] },
  { id: 'futuristic', name: 'Futuristic', colors: ['#0a0a0b', '#141b2d', '#1f2940'] },
  { id: 'daylight', name: 'Daylight', colors: ['#f8f9fa', '#e9ecef', '#dee2e6'] },
  { id: 'minimal', name: 'Minimal', colors: ['#ffffff', '#f5f5f5', '#e0e0e0'] },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('app_settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings));
      setHasChanges(false);
      onThemeChange?.(settings.theme);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass border border-neutral-700/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-700/30 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-violet-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <p className="text-sm text-neutral-400">Customize your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Model Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">AI Model</h3>
            </div>
            <div className="space-y-2">
              {MODEL_OPTIONS.map((model) => (
                <label
                  key={model.value}
                  className={`
                    glass-subtle rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3
                    ${
                      settings.model === model.value
                        ? 'border border-primary-500/50 bg-primary-500/10'
                        : 'border border-transparent hover:bg-white/5'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="model"
                    value={model.value}
                    checked={settings.model === model.value}
                    onChange={(e) => updateSetting('model', e.target.value as ModelOption)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">{model.label}</p>
                    <p className="text-sm text-neutral-400 mt-0.5">{model.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Theme Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Theme</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSetting('theme', theme.id)}
                  className={`
                    glass-subtle rounded-xl p-3 transition-all text-left
                    ${
                      settings.theme === theme.id
                        ? 'border border-primary-500/50 bg-primary-500/10'
                        : 'border border-transparent hover:bg-white/5'
                    }
                  `}
                >
                  <div className="flex gap-1.5 mb-2">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-md border border-neutral-700/30"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-white">{theme.name}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Display Mode */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Display Mode</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'auto', label: 'Auto', icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateSetting('displayMode', value as any)}
                  className={`
                    glass-subtle rounded-xl p-4 transition-all flex flex-col items-center gap-2
                    ${
                      settings.displayMode === value
                        ? 'border border-primary-500/50 bg-primary-500/10'
                        : 'border border-transparent hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm font-medium text-white">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Editor Preferences */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Editor Preferences</h3>
            </div>
            <div className="glass-subtle rounded-xl p-4 space-y-4">
              {/* Code Style */}
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">
                  Code Density
                </label>
                <select
                  value={settings.codeStyle}
                  onChange={(e) => updateSetting('codeStyle', e.target.value as any)}
                  className="w-full glass-subtle rounded-lg px-3 py-2 text-white border border-neutral-700/30 focus:border-primary-500/50 focus:outline-none"
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
              </div>

              {/* Toggle Options */}
              <div className="space-y-3 pt-2">
                {[
                  { key: 'autoSave', label: 'Auto-save projects' },
                  { key: 'lineNumbers', label: 'Show line numbers' },
                  { key: 'minimap', label: 'Show minimap' },
                  { key: 'wordWrap', label: 'Word wrap' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-neutral-300">{label}</span>
                    <input
                      type="checkbox"
                      checked={settings[key as keyof AppSettings] as boolean}
                      onChange={(e) => updateSetting(key as any, e.target.checked)}
                      className="w-4 h-4 accent-primary-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-700/30 bg-neutral-900/50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={resetSettings}
            className="px-4 py-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                saveSettings();
                onClose();
              }}
              disabled={!hasChanges}
              className="px-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 hover:text-primary-300 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook to manage settings
export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('app_settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  return settings;
};
