export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  componentCode?: string;
  componentPreview?: boolean;
}

export interface AppVersion {
  id: string;
  versionNumber: number;
  code: string;
  description: string;
  timestamp: string;
  changeType: 'NEW_APP' | 'MAJOR_CHANGE' | 'MINOR_CHANGE';
}

export interface GeneratedComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  timestamp: string;
  isFavorite: boolean;
  conversationHistory: ChatMessage[];
  versions?: AppVersion[]; // Version history
}

export interface PendingChange {
  id: string;
  changeDescription: string;
  newCode: string;
  timestamp: string;
}

export interface PendingDiff {
  id: string;
  summary: string;
  files: Array<{
    path: string;
    action: 'MODIFY' | 'CREATE' | 'DELETE';
    changes: Array<{
      type: 'ADD_IMPORT' | 'INSERT_AFTER' | 'INSERT_BEFORE' | 'REPLACE' | 'DELETE' | 'APPEND';
      searchFor?: string;
      content?: string;
      replaceWith?: string;
    }>;
  }>;
  timestamp: string;
}

export type LayoutMode = 'classic' | 'preview-first' | 'code-first' | 'stacked';
export type ActiveTab = 'chat' | 'preview' | 'code';
