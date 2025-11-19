/**
 * User Settings and Preferences for AI Builder
 */

export interface ReviewPreferences {
  /**
   * Auto-approve strategy for phase reviews
   * - 'never': Always require manual review (default, safest)
   * - 'simple': Auto-approve simple phases, review complex ones
   * - 'all': Auto-approve all phases (show summary only)
   */
  autoApprovePhases: 'never' | 'simple' | 'all';

  /**
   * Show detailed diff view by default
   * - true: Show file-by-file changes
   * - false: Show objective checklist (faster)
   */
  defaultToDetailedView: boolean;

  /**
   * Require explicit approval even for minor changes
   */
  requireApprovalForMinorChanges: boolean;

  /**
   * Show phase preview before starting build
   */
  showPhasePreview: boolean;

  /**
   * Auto-expand all files in review
   */
  autoExpandFiles: boolean;
}

export interface BuilderSettings {
  /**
   * Review and approval preferences
   */
  review: ReviewPreferences;

  /**
   * Code generation preferences
   */
  generation: {
    /**
     * Preferred AI model
     */
    model: 'claude-sonnet-4' | 'claude-opus-4';

    /**
     * Enable streaming responses
     */
    streaming: boolean;

    /**
     * Max tokens per request
     */
    maxTokens: number;
  };

  /**
   * UI preferences
   */
  ui: {
    /**
     * Layout mode
     */
    layoutMode: 'classic' | 'preview-first' | 'code-first' | 'stacked';

    /**
     * Show keyboard shortcuts help
     */
    showKeyboardShortcuts: boolean;

    /**
     * Enable animations
     */
    enableAnimations: boolean;
  };

  /**
   * Quality and testing
   */
  quality: {
    /**
     * Auto-run code quality analysis after generation
     */
    autoRunQualityCheck: boolean;

    /**
     * Auto-run performance analysis
     */
    autoRunPerformanceCheck: boolean;

    /**
     * Generate tests automatically
     */
    autoGenerateTests: boolean;
  };
}

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: BuilderSettings = {
  review: {
    autoApprovePhases: 'never',
    defaultToDetailedView: false,
    requireApprovalForMinorChanges: true,
    showPhasePreview: true,
    autoExpandFiles: false,
  },
  generation: {
    model: 'claude-sonnet-4',
    streaming: true,
    maxTokens: 16000,
  },
  ui: {
    layoutMode: 'classic',
    showKeyboardShortcuts: true,
    enableAnimations: true,
  },
  quality: {
    autoRunQualityCheck: false,
    autoRunPerformanceCheck: false,
    autoGenerateTests: false,
  },
};
