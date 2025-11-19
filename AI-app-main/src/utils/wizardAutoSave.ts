/**
 * Auto-save functionality for wizard forms
 * Automatically saves draft state to localStorage and provides resume capability
 */

export interface AutoSaveState<T> {
  data: T;
  timestamp: string;
  version: number;
}

const AUTO_SAVE_VERSION = 1;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/**
 * Save wizard state to localStorage
 */
export function saveWizardDraft<T>(key: string, data: T): void {
  try {
    const state: AutoSaveState<T> = {
      data,
      timestamp: new Date().toISOString(),
      version: AUTO_SAVE_VERSION,
    };

    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save wizard draft:', error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Clearing old drafts...');
      clearOldDrafts();
      // Try again
      try {
        const state: AutoSaveState<T> = {
          data,
          timestamp: new Date().toISOString(),
          version: AUTO_SAVE_VERSION,
        };
        localStorage.setItem(key, JSON.stringify(state));
      } catch (retryError) {
        console.error('Failed to save draft after clearing old drafts:', retryError);
      }
    }
  }
}

/**
 * Load wizard draft from localStorage
 */
export function loadWizardDraft<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const state: AutoSaveState<T> = JSON.parse(stored);

    // Check version compatibility
    if (state.version !== AUTO_SAVE_VERSION) {
      console.warn('Draft version mismatch. Ignoring old draft.');
      deleteDraft(key);
      return null;
    }

    // Check if draft is not too old (7 days)
    const draftAge = Date.now() - new Date(state.timestamp).getTime();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (draftAge > maxAge) {
      console.warn('Draft is too old. Deleting...');
      deleteDraft(key);
      return null;
    }

    return state.data;
  } catch (error) {
    console.error('Failed to load wizard draft:', error);
    return null;
  }
}

/**
 * Check if a draft exists
 */
export function hasDraft(key: string): boolean {
  return loadWizardDraft(key) !== null;
}

/**
 * Delete a specific draft
 */
export function deleteDraft(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to delete draft:', error);
  }
}

/**
 * Get draft metadata without loading full data
 */
export function getDraftMetadata(key: string): {
  exists: boolean;
  timestamp?: string;
  ageInMinutes?: number;
} | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return { exists: false };

    const state: AutoSaveState<any> = JSON.parse(stored);
    const ageInMinutes = Math.floor(
      (Date.now() - new Date(state.timestamp).getTime()) / 60000
    );

    return {
      exists: true,
      timestamp: state.timestamp,
      ageInMinutes,
    };
  } catch (error) {
    console.error('Failed to get draft metadata:', error);
    return null;
  }
}

/**
 * Clear all old drafts (older than 7 days)
 */
function clearOldDrafts(): void {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('wizard_draft_')) continue;

      try {
        const stored = localStorage.getItem(key);
        if (!stored) continue;

        const state: AutoSaveState<any> = JSON.parse(stored);
        const draftAge = Date.now() - new Date(state.timestamp).getTime();

        if (draftAge > maxAge) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Invalid draft, remove it
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Failed to clear old drafts:', error);
  }
}

/**
 * Format draft age for display
 */
export function formatDraftAge(timestamp: string): string {
  const now = new Date();
  const draftTime = new Date(timestamp);
  const diffMs = now.getTime() - draftTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return draftTime.toLocaleDateString();
}

/**
 * React hook for auto-save functionality
 */
export class AutoSaver<T> {
  private key: string;
  private intervalId: number | null = null;
  private saveCallback: ((data: T) => void) | null = null;

  constructor(key: string) {
    this.key = `wizard_draft_${key}`;
  }

  /**
   * Start auto-saving
   */
  start(getData: () => T, onSave?: (data: T) => void): void {
    this.saveCallback = onSave || null;

    // Save immediately
    this.save(getData());

    // Set up interval
    this.intervalId = window.setInterval(() => {
      this.save(getData());
    }, AUTO_SAVE_INTERVAL);
  }

  /**
   * Stop auto-saving
   */
  stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Save immediately
   */
  save(data: T): void {
    saveWizardDraft(this.key, data);
    if (this.saveCallback) {
      this.saveCallback(data);
    }
  }

  /**
   * Load draft
   */
  load(): T | null {
    return loadWizardDraft<T>(this.key);
  }

  /**
   * Check if draft exists
   */
  hasDraft(): boolean {
    return hasDraft(this.key);
  }

  /**
   * Delete draft
   */
  delete(): void {
    deleteDraft(this.key);
  }

  /**
   * Get metadata
   */
  getMetadata() {
    return getDraftMetadata(this.key);
  }
}

/**
 * Create auto-saver instance
 */
export function createAutoSaver<T>(key: string): AutoSaver<T> {
  return new AutoSaver<T>(key);
}

/**
 * Wizard draft keys
 */
export const WIZARD_DRAFT_KEYS = {
  APP_CONCEPT: 'app_concept_wizard',
  CONVERSATIONAL: 'conversational_wizard',
  TEMPLATE_CONFIG: 'template_config',
} as const;

/**
 * Clear all wizard drafts
 */
export function clearAllDrafts(): void {
  Object.values(WIZARD_DRAFT_KEYS).forEach((key) => {
    deleteDraft(`wizard_draft_${key}`);
  });
}

/**
 * Get all draft summaries
 */
export function getAllDrafts(): Array<{
  key: string;
  label: string;
  metadata: ReturnType<typeof getDraftMetadata>;
}> {
  const drafts = [
    { key: WIZARD_DRAFT_KEYS.APP_CONCEPT, label: 'App Concept Wizard' },
    { key: WIZARD_DRAFT_KEYS.CONVERSATIONAL, label: 'Conversational Wizard' },
    { key: WIZARD_DRAFT_KEYS.TEMPLATE_CONFIG, label: 'Template Configuration' },
  ];

  return drafts
    .map((draft) => ({
      ...draft,
      metadata: getDraftMetadata(`wizard_draft_${draft.key}`),
    }))
    .filter((draft) => draft.metadata?.exists);
}
