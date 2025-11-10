/**
 * Theme System for AI App Builder
 * Provides predefined themes and custom color customization
 */

export interface ColorScheme {
  // Main colors
  primary: string;
  secondary: string;
  accent: string;

  // Background colors
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Border and divider colors
  border: string;
  divider: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Chat-specific colors
  userMessageBg: string;
  assistantMessageBg: string;
  systemMessageBg: string;

  // Code editor colors
  codeBackground: string;
  codeBorder: string;

  // Button colors
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ColorScheme;
  isDark: boolean;
}

// Predefined Themes
export const THEMES: Record<string, Theme> = {
  // Original dark theme (current default)
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep dark theme with blue and purple accents',
    isDark: true,
    colors: {
      primary: '#3b82f6',        // blue-500
      secondary: '#8b5cf6',      // purple-500
      accent: '#06b6d4',         // cyan-500

      bgPrimary: '#0f172a',      // slate-900
      bgSecondary: '#1e293b',    // slate-800
      bgTertiary: '#334155',     // slate-700

      textPrimary: '#f8fafc',    // slate-50
      textSecondary: '#e2e8f0',  // slate-200
      textMuted: '#94a3b8',      // slate-400

      border: '#475569',         // slate-600
      divider: '#334155',        // slate-700

      success: '#10b981',        // green-500
      warning: '#f59e0b',        // amber-500
      error: '#ef4444',          // red-500
      info: '#06b6d4',           // cyan-500

      userMessageBg: '#1e40af',  // blue-800
      assistantMessageBg: '#1e293b', // slate-800
      systemMessageBg: '#7c3aed', // violet-600

      codeBackground: '#0f172a',
      codeBorder: '#334155',

      buttonPrimary: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
      buttonPrimaryHover: 'linear-gradient(to right, #2563eb, #7c3aed)',
      buttonSecondary: '#334155',
      buttonSecondaryHover: '#475569',
    }
  },

  // Ocean theme - Blue and teal
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool ocean blues with teal accents',
    isDark: true,
    colors: {
      primary: '#0ea5e9',        // sky-500
      secondary: '#14b8a6',      // teal-500
      accent: '#06b6d4',         // cyan-500

      bgPrimary: '#0c4a6e',      // sky-900
      bgSecondary: '#075985',    // sky-800
      bgTertiary: '#0369a1',     // sky-700

      textPrimary: '#f0f9ff',    // sky-50
      textSecondary: '#e0f2fe',  // sky-100
      textMuted: '#7dd3fc',      // sky-300

      border: '#0284c7',         // sky-600
      divider: '#0369a1',        // sky-700

      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',

      userMessageBg: '#0c4a6e',
      assistantMessageBg: '#075985',
      systemMessageBg: '#14b8a6',

      codeBackground: '#0c4a6e',
      codeBorder: '#0369a1',

      buttonPrimary: 'linear-gradient(to right, #0ea5e9, #14b8a6)',
      buttonPrimaryHover: 'linear-gradient(to right, #0284c7, #0d9488)',
      buttonSecondary: '#0369a1',
      buttonSecondaryHover: '#0284c7',
    }
  },

  // Forest theme - Green and emerald
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens with earthy tones',
    isDark: true,
    colors: {
      primary: '#10b981',        // emerald-500
      secondary: '#84cc16',      // lime-500
      accent: '#22c55e',         // green-500

      bgPrimary: '#064e3b',      // emerald-900
      bgSecondary: '#065f46',    // emerald-800
      bgTertiary: '#047857',     // emerald-700

      textPrimary: '#ecfdf5',    // emerald-50
      textSecondary: '#d1fae5',  // emerald-100
      textMuted: '#6ee7b7',      // emerald-300

      border: '#059669',         // emerald-600
      divider: '#047857',        // emerald-700

      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',

      userMessageBg: '#064e3b',
      assistantMessageBg: '#065f46',
      systemMessageBg: '#84cc16',

      codeBackground: '#064e3b',
      codeBorder: '#047857',

      buttonPrimary: 'linear-gradient(to right, #10b981, #84cc16)',
      buttonPrimaryHover: 'linear-gradient(to right, #059669, #65a30d)',
      buttonSecondary: '#047857',
      buttonSecondaryHover: '#059669',
    }
  },

  // Sunset theme - Orange and pink
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset colors with orange and pink',
    isDark: true,
    colors: {
      primary: '#f97316',        // orange-500
      secondary: '#ec4899',      // pink-500
      accent: '#fb923c',         // orange-400

      bgPrimary: '#7c2d12',      // orange-900
      bgSecondary: '#9a3412',    // orange-800
      bgTertiary: '#c2410c',     // orange-700

      textPrimary: '#fff7ed',    // orange-50
      textSecondary: '#ffedd5',  // orange-100
      textMuted: '#fdba74',      // orange-300

      border: '#ea580c',         // orange-600
      divider: '#c2410c',        // orange-700

      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',

      userMessageBg: '#7c2d12',
      assistantMessageBg: '#9a3412',
      systemMessageBg: '#ec4899',

      codeBackground: '#7c2d12',
      codeBorder: '#c2410c',

      buttonPrimary: 'linear-gradient(to right, #f97316, #ec4899)',
      buttonPrimaryHover: 'linear-gradient(to right, #ea580c, #db2777)',
      buttonSecondary: '#c2410c',
      buttonSecondaryHover: '#ea580c',
    }
  },

  // Neon theme - Vibrant cyberpunk
  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant neon colors with cyberpunk vibes',
    isDark: true,
    colors: {
      primary: '#a855f7',        // purple-500
      secondary: '#ec4899',      // pink-500
      accent: '#06b6d4',         // cyan-500

      bgPrimary: '#18181b',      // zinc-900
      bgSecondary: '#27272a',    // zinc-800
      bgTertiary: '#3f3f46',     // zinc-700

      textPrimary: '#fafafa',    // zinc-50
      textSecondary: '#e4e4e7',  // zinc-200
      textMuted: '#a1a1aa',      // zinc-400

      border: '#52525b',         // zinc-600
      divider: '#3f3f46',        // zinc-700

      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',

      userMessageBg: '#581c87',  // purple-900
      assistantMessageBg: '#27272a',
      systemMessageBg: '#831843', // pink-900

      codeBackground: '#18181b',
      codeBorder: '#3f3f46',

      buttonPrimary: 'linear-gradient(to right, #a855f7, #ec4899)',
      buttonPrimaryHover: 'linear-gradient(to right, #9333ea, #db2777)',
      buttonSecondary: '#3f3f46',
      buttonSecondaryHover: '#52525b',
    }
  },

  // Light theme - Clean and bright
  daylight: {
    id: 'daylight',
    name: 'Daylight',
    description: 'Clean light theme with blue accents',
    isDark: false,
    colors: {
      primary: '#3b82f6',        // blue-500
      secondary: '#8b5cf6',      // purple-500
      accent: '#06b6d4',         // cyan-500

      bgPrimary: '#ffffff',      // white
      bgSecondary: '#f8fafc',    // slate-50
      bgTertiary: '#f1f5f9',     // slate-100

      textPrimary: '#0f172a',    // slate-900
      textSecondary: '#334155',  // slate-700
      textMuted: '#64748b',      // slate-500

      border: '#cbd5e1',         // slate-300
      divider: '#e2e8f0',        // slate-200

      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',

      userMessageBg: '#dbeafe',  // blue-100
      assistantMessageBg: '#f8fafc',
      systemMessageBg: '#ede9fe', // violet-100

      codeBackground: '#f8fafc',
      codeBorder: '#e2e8f0',

      buttonPrimary: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
      buttonPrimaryHover: 'linear-gradient(to right, #2563eb, #7c3aed)',
      buttonSecondary: '#f1f5f9',
      buttonSecondaryHover: '#e2e8f0',
    }
  },

  // Minimal theme - Ultra clean
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra minimal black and white',
    isDark: false,
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#666666',

      bgPrimary: '#ffffff',
      bgSecondary: '#fafafa',
      bgTertiary: '#f5f5f5',

      textPrimary: '#000000',
      textSecondary: '#404040',
      textMuted: '#737373',

      border: '#e5e5e5',
      divider: '#f5f5f5',

      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',

      userMessageBg: '#f5f5f5',
      assistantMessageBg: '#fafafa',
      systemMessageBg: '#e5e5e5',

      codeBackground: '#fafafa',
      codeBorder: '#e5e5e5',

      buttonPrimary: '#000000',
      buttonPrimaryHover: '#404040',
      buttonSecondary: '#f5f5f5',
      buttonSecondaryHover: '#e5e5e5',
    }
  },

  // Nord theme - Popular developer theme
  nord: {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic-inspired color palette',
    isDark: true,
    colors: {
      primary: '#88c0d0',        // Nord frost
      secondary: '#81a1c1',      // Nord frost alt
      accent: '#8fbcbb',         // Nord frost accent

      bgPrimary: '#2e3440',      // Nord polar night
      bgSecondary: '#3b4252',    // Nord polar night light
      bgTertiary: '#434c5e',     // Nord polar night lighter

      textPrimary: '#eceff4',    // Nord snow storm
      textSecondary: '#e5e9f0',  // Nord snow storm alt
      textMuted: '#d8dee9',      // Nord snow storm muted

      border: '#4c566a',         // Nord polar night border
      divider: '#434c5e',

      success: '#a3be8c',        // Nord aurora green
      warning: '#ebcb8b',        // Nord aurora yellow
      error: '#bf616a',          // Nord aurora red
      info: '#88c0d0',           // Nord frost

      userMessageBg: '#5e81ac',  // Nord frost blue
      assistantMessageBg: '#3b4252',
      systemMessageBg: '#b48ead', // Nord aurora purple

      codeBackground: '#2e3440',
      codeBorder: '#434c5e',

      buttonPrimary: 'linear-gradient(to right, #88c0d0, #81a1c1)',
      buttonPrimaryHover: 'linear-gradient(to right, #8fbcbb, #5e81ac)',
      buttonSecondary: '#434c5e',
      buttonSecondaryHover: '#4c566a',
    }
  }
};

// Custom color configuration
export interface CustomColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export class ThemeManager {
  private currentTheme: Theme;
  private customColors: CustomColors;
  private styleElement: HTMLStyleElement | null = null;

  constructor(themeId: string = 'midnight', customColors: CustomColors = {}) {
    this.currentTheme = THEMES[themeId] || THEMES.midnight;
    this.customColors = customColors;
  }

  /**
   * Apply theme to the page
   */
  applyTheme(): void {
    const colors = this.getEffectiveColors();

    // Create or update style element
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.id = 'theme-system-styles';
      document.head.appendChild(this.styleElement);
    }

    // Generate CSS variables
    const cssVars = `
      :root {
        /* Main colors */
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};

        /* Background colors */
        --color-bg-primary: ${colors.bgPrimary};
        --color-bg-secondary: ${colors.bgSecondary};
        --color-bg-tertiary: ${colors.bgTertiary};

        /* Text colors */
        --color-text-primary: ${colors.textPrimary};
        --color-text-secondary: ${colors.textSecondary};
        --color-text-muted: ${colors.textMuted};

        /* Border and divider */
        --color-border: ${colors.border};
        --color-divider: ${colors.divider};

        /* Status colors */
        --color-success: ${colors.success};
        --color-warning: ${colors.warning};
        --color-error: ${colors.error};
        --color-info: ${colors.info};

        /* Chat colors */
        --color-user-message: ${colors.userMessageBg};
        --color-assistant-message: ${colors.assistantMessageBg};
        --color-system-message: ${colors.systemMessageBg};

        /* Code editor */
        --color-code-bg: ${colors.codeBackground};
        --color-code-border: ${colors.codeBorder};

        /* Buttons */
        --color-button-primary: ${colors.buttonPrimary};
        --color-button-primary-hover: ${colors.buttonPrimaryHover};
        --color-button-secondary: ${colors.buttonSecondary};
        --color-button-secondary-hover: ${colors.buttonSecondaryHover};
      }
    `;

    this.styleElement.textContent = cssVars;

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${this.currentTheme.id}`);
    document.body.classList.add(this.currentTheme.isDark ? 'dark' : 'light');
  }

  /**
   * Get effective colors (theme colors merged with custom overrides)
   */
  getEffectiveColors(): ColorScheme {
    const colors = { ...this.currentTheme.colors };

    if (this.customColors.primary) colors.primary = this.customColors.primary;
    if (this.customColors.secondary) colors.secondary = this.customColors.secondary;
    if (this.customColors.accent) colors.accent = this.customColors.accent;
    if (this.customColors.background) {
      colors.bgPrimary = this.customColors.background;
      colors.bgSecondary = this.adjustBrightness(this.customColors.background, 10);
      colors.bgTertiary = this.adjustBrightness(this.customColors.background, 20);
    }
    if (this.customColors.text) {
      colors.textPrimary = this.customColors.text;
      colors.textSecondary = this.adjustOpacity(this.customColors.text, 0.9);
      colors.textMuted = this.adjustOpacity(this.customColors.text, 0.6);
    }

    return colors;
  }

  /**
   * Change theme
   */
  setTheme(themeId: string): void {
    if (THEMES[themeId]) {
      this.currentTheme = THEMES[themeId];
      this.applyTheme();
      this.saveToLocalStorage();
    }
  }

  /**
   * Set custom colors
   */
  setCustomColors(colors: CustomColors): void {
    this.customColors = { ...this.customColors, ...colors };
    this.applyTheme();
    this.saveToLocalStorage();
  }

  /**
   * Reset to theme defaults
   */
  resetCustomColors(): void {
    this.customColors = {};
    this.applyTheme();
    this.saveToLocalStorage();
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Get custom colors
   */
  getCustomColors(): CustomColors {
    return this.customColors;
  }

  /**
   * Save to localStorage
   */
  saveToLocalStorage(): void {
    localStorage.setItem('theme-id', this.currentTheme.id);
    localStorage.setItem('custom-colors', JSON.stringify(this.customColors));
  }

  /**
   * Load from localStorage
   */
  static loadFromLocalStorage(): ThemeManager {
    const themeId = localStorage.getItem('theme-id') || 'midnight';
    const customColorsStr = localStorage.getItem('custom-colors');
    const customColors = customColorsStr ? JSON.parse(customColorsStr) : {};

    return new ThemeManager(themeId, customColors);
  }

  /**
   * Helper: Adjust brightness
   */
  private adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  /**
   * Helper: Adjust opacity
   */
  private adjustOpacity(hex: string, opacity: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const R = num >> 16;
    const G = num >> 8 & 0x00FF;
    const B = num & 0x0000FF;
    return `rgba(${R}, ${G}, ${B}, ${opacity})`;
  }
}

// Export convenience functions
export function getAllThemes(): Theme[] {
  return Object.values(THEMES);
}

export function getThemeById(id: string): Theme | undefined {
  return THEMES[id];
}
