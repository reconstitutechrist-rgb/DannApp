'use client';

import { useState, useEffect } from 'react';
import type { BuilderSettings } from '../types/userSettings';
import { DEFAULT_SETTINGS } from '../types/userSettings';

const SETTINGS_KEY = 'ai-builder-settings';

/**
 * Hook to manage user settings with localStorage persistence
 */
export function useBuilderSettings() {
  const [settings, setSettings] = useState<BuilderSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (updates: Partial<BuilderSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
      review: { ...prev.review, ...(updates.review || {}) },
      generation: { ...prev.generation, ...(updates.generation || {}) },
      ui: { ...prev.ui, ...(updates.ui || {}) },
      quality: { ...prev.quality, ...(updates.quality || {}) },
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
  };
}
