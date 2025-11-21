import { useReducer, useEffect } from 'react';
import { GeneratedComponent, AppVersion, PendingChange, PendingDiff } from '../types/aiBuilderTypes';
import { ThemeManager } from '../utils/themeSystem';

export type LayoutMode = 'classic' | 'preview-first' | 'code-first' | 'stacked';
export type ActiveTab = 'chat' | 'preview' | 'code';

export interface AIBuilderState {
  // Data
  components: GeneratedComponent[];
  currentComponent: GeneratedComponent | null;
  undoStack: AppVersion[];
  redoStack: AppVersion[];
  
  // UI State
  layoutMode: LayoutMode;
  activeTab: ActiveTab;
  showLibrary: boolean;
  showVersionHistory: boolean;
  showDiffPreview: boolean;
  showApprovalModal: boolean;
  
  // Pending Operations
  pendingChange: PendingChange | null;
  pendingDiff: PendingDiff | null;
  
  // Theme
  themeManager: ThemeManager | null;
}

export type AIBuilderAction =
  | { type: 'SET_COMPONENTS'; payload: GeneratedComponent[] }
  | { type: 'SET_CURRENT_COMPONENT'; payload: GeneratedComponent | null }
  | { type: 'UPDATE_COMPONENT'; payload: GeneratedComponent }
  | { type: 'ADD_COMPONENT'; payload: GeneratedComponent }
  | { type: 'DELETE_COMPONENT'; payload: string }
  | { type: 'SET_LAYOUT_MODE'; payload: LayoutMode }
  | { type: 'SET_ACTIVE_TAB'; payload: ActiveTab }
  | { type: 'TOGGLE_LIBRARY' }
  | { type: 'TOGGLE_VERSION_HISTORY' }
  | { type: 'SET_SHOW_DIFF_PREVIEW'; payload: boolean }
  | { type: 'SET_PENDING_DIFF'; payload: PendingDiff | null }
  | { type: 'SET_PENDING_CHANGE'; payload: PendingChange | null }
  | { type: 'SET_SHOW_APPROVAL_MODAL'; payload: boolean }
  | { type: 'SET_THEME_MANAGER'; payload: ThemeManager }
  | { type: 'PUSH_UNDO'; payload: AppVersion }
  | { type: 'PUSH_REDO'; payload: AppVersion }
  | { type: 'POP_UNDO' } // Removes last undo
  | { type: 'POP_REDO' } // Removes last redo
  | { type: 'CLEAR_REDO' }
  | { type: 'SET_UNDO_STACK'; payload: AppVersion[] }
  | { type: 'SET_REDO_STACK'; payload: AppVersion[] };

const initialState: AIBuilderState = {
  components: [],
  currentComponent: null,
  undoStack: [],
  redoStack: [],
  layoutMode: 'classic',
  activeTab: 'chat',
  showLibrary: false,
  showVersionHistory: false,
  showDiffPreview: false,
  showApprovalModal: false,
  pendingChange: null,
  pendingDiff: null,
  themeManager: null,
};

function reducer(state: AIBuilderState, action: AIBuilderAction): AIBuilderState {
  switch (action.type) {
    case 'SET_COMPONENTS':
      return { ...state, components: action.payload };
    case 'SET_CURRENT_COMPONENT':
      return { ...state, currentComponent: action.payload };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
        currentComponent: state.currentComponent?.id === action.payload.id ? action.payload : state.currentComponent
      };
    case 'ADD_COMPONENT':
      return {
        ...state,
        components: [action.payload, ...state.components].slice(0, 50),
        currentComponent: action.payload
      };
    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(c => c.id !== action.payload),
        currentComponent: state.currentComponent?.id === action.payload ? null : state.currentComponent
      };
    case 'SET_LAYOUT_MODE':
      return { ...state, layoutMode: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_LIBRARY':
      return { ...state, showLibrary: !state.showLibrary };
    case 'TOGGLE_VERSION_HISTORY':
      return { ...state, showVersionHistory: !state.showVersionHistory };
    case 'SET_SHOW_DIFF_PREVIEW':
      return { ...state, showDiffPreview: action.payload };
    case 'SET_PENDING_DIFF':
      return { ...state, pendingDiff: action.payload };
    case 'SET_PENDING_CHANGE':
      return { ...state, pendingChange: action.payload };
    case 'SET_SHOW_APPROVAL_MODAL':
      return { ...state, showApprovalModal: action.payload };
    case 'SET_THEME_MANAGER':
      return { ...state, themeManager: action.payload };
    case 'PUSH_UNDO':
      return { ...state, undoStack: [...state.undoStack, action.payload] };
    case 'PUSH_REDO':
      return { ...state, redoStack: [...state.redoStack, action.payload] };
    case 'POP_UNDO':
      return { ...state, undoStack: state.undoStack.slice(0, -1) };
    case 'POP_REDO':
      return { ...state, redoStack: state.redoStack.slice(0, -1) };
    case 'CLEAR_REDO':
      return { ...state, redoStack: [] };
    case 'SET_UNDO_STACK':
      return { ...state, undoStack: action.payload };
    case 'SET_REDO_STACK':
      return { ...state, redoStack: action.payload };
    default:
      return state;
  }
}

export function useAIBuilderState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // Theme
        const manager = ThemeManager.loadFromLocalStorage();
        manager.applyTheme();
        dispatch({ type: 'SET_THEME_MANAGER', payload: manager });

        // Layout
        const savedLayout = localStorage.getItem('layout-mode');
        if (savedLayout && ['classic', 'preview-first', 'code-first', 'stacked'].includes(savedLayout)) {
        dispatch({ type: 'SET_LAYOUT_MODE', payload: savedLayout as LayoutMode });
        }

        // Components
        try {
        const stored = localStorage.getItem('ai_components');
        if (stored) {
            dispatch({ type: 'SET_COMPONENTS', payload: JSON.parse(stored) });
        }
        } catch (e) {
        console.error('Error loading components:', e);
        }
    }
  }, []);

  // Persist components
  useEffect(() => {
    if (typeof window !== 'undefined' && state.components.length > 0) {
      localStorage.setItem('ai_components', JSON.stringify(state.components));
    }
  }, [state.components]);

  // Persist layout
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('layout-mode', state.layoutMode);
    }
  }, [state.layoutMode]);

  return { state, dispatch };
}
