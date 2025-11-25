import { create } from "zustand";
import {
  GeneratedComponent,
  AppVersion,
  PendingChange,
  PendingDiff,
  ChatMessage,
  LayoutMode,
  ActiveTab,
} from "../types/aiBuilderTypes";
import { ThemeManager } from "../utils/themeSystem";
import {
  AppConcept,
  ImplementationPlan,
  BuildPhase,
} from "../types/appConcept";
import { QuickStartTemplate } from "../components/QuickStartSelector";
import { QualityReport } from "../utils/codeQuality";
import { PerformanceReport } from "../utils/performanceOptimization";
import { ArchitectureTemplate } from "../utils/architectureTemplates";
import { DeploymentInstructions } from "../utils/exportApp";

interface ChatSlice {
  chatMessages: ChatMessage[];
  userInput: string;
  isGenerating: boolean;
  generationProgress: string;
  isStreaming: boolean;
  streamingProgress: any; // Type this properly if possible

  setChatMessages: (
    messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => void;
  addMessage: (message: ChatMessage) => void;
  setUserInput: (input: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setStreamingProgress: (progress: any) => void;
}

interface BuilderSlice {
  components: GeneratedComponent[];
  currentComponent: GeneratedComponent | null;
  undoStack: AppVersion[];
  redoStack: AppVersion[];

  setComponents: (components: GeneratedComponent[]) => void;
  setCurrentComponent: (component: GeneratedComponent | null) => void;
  updateComponent: (component: GeneratedComponent) => void;
  addComponent: (component: GeneratedComponent) => void;
  deleteComponent: (id: string) => void;

  pushUndo: (version: AppVersion) => void;
  pushRedo: (version: AppVersion) => void;
  popUndo: () => void;
  popRedo: () => void;
  clearRedo: () => void;
}

interface UISlice {
  layoutMode: LayoutMode;
  activeTab: ActiveTab;
  showLibrary: boolean;
  showVersionHistory: boolean;
  showDiffPreview: boolean;
  showApprovalModal: boolean;

  // Modals & Overlays
  showConceptWizard: boolean;
  showQuickStart: boolean;
  showTemplateSelector: boolean;
  showNewAppStagingModal: boolean;
  showDeploymentModal: boolean;
  showCompareModal: boolean;
  showQualityReport: boolean;
  showPerformanceReport: boolean;

  // Phase Preview
  showPhasePreview: boolean;
  phaseToPreview: BuildPhase | null;

  // Modes
  currentMode: "PLAN" | "ACT";
  guidedBuildMode: boolean;

  setLayoutMode: (mode: LayoutMode) => void;
  setActiveTab: (tab: ActiveTab) => void;
  toggleLibrary: () => void;
  toggleVersionHistory: () => void;
  setShowDiffPreview: (show: boolean) => void;
  setShowApprovalModal: (show: boolean) => void;

  setShowConceptWizard: (show: boolean) => void;
  setShowQuickStart: (show: boolean) => void;
  setShowTemplateSelector: (show: boolean) => void;
  setShowNewAppStagingModal: (show: boolean) => void;
  setShowDeploymentModal: (show: boolean) => void;
  setShowCompareModal: (show: boolean) => void;
  setShowQualityReport: (show: boolean) => void;
  setShowPerformanceReport: (show: boolean) => void;

  setShowPhasePreview: (show: boolean) => void;
  setPhaseToPreview: (phase: BuildPhase | null) => void;

  setCurrentMode: (mode: "PLAN" | "ACT") => void;
  setGuidedBuildMode: (mode: boolean) => void;
}

interface DataSlice {
  themeManager: ThemeManager | null;
  pendingChange: PendingChange | null;
  pendingDiff: PendingDiff | null;

  // Wizard & Plan Data
  selectedQuickStartTemplate: QuickStartTemplate | null;
  implementationPlan: ImplementationPlan | null;
  activePhase: BuildPhase | null;
  qualityReport: QualityReport | null;
  performanceReport: PerformanceReport | null;

  // Staging
  newAppStagePlan: any;
  showNewAppStagingModal: boolean;
  pendingNewAppRequest: string;
  showTemplateSelector: boolean;
  selectedTemplate: ArchitectureTemplate | null;
  pendingTemplateRequest: string;
  currentStagePlan: any;

  // Export/Deploy
  deploymentInstructions: DeploymentInstructions | null;
  exportingApp: GeneratedComponent | null;

  // Compare
  compareVersions: { v1: AppVersion | null; v2: AppVersion | null };

  // Analysis State
  isRunningReview: boolean;
  isApplyingFixes: boolean;
  autoReviewEnabled: boolean;
  lastReviewedCode: string | null;
  isRunningPerformanceAnalysis: boolean;
  isApplyingPerformanceOptimizations: boolean;

  setThemeManager: (manager: ThemeManager) => void;
  setPendingChange: (change: PendingChange | null) => void;
  setPendingDiff: (diff: PendingDiff | null) => void;

  setSelectedQuickStartTemplate: (template: QuickStartTemplate | null) => void;
  setImplementationPlan: (plan: ImplementationPlan | null) => void;
  setActivePhase: (phase: BuildPhase | null) => void;
  setQualityReport: (report: QualityReport | null) => void;
  setPerformanceReport: (report: PerformanceReport | null) => void;

  setNewAppStagePlan: (plan: any) => void;
  setPendingNewAppRequest: (request: string) => void;
  setSelectedTemplate: (template: ArchitectureTemplate | null) => void;
  setPendingTemplateRequest: (request: string) => void;
  setCurrentStagePlan: (plan: any) => void;

  setDeploymentInstructions: (
    instructions: DeploymentInstructions | null
  ) => void;
  setExportingApp: (app: GeneratedComponent | null) => void;

  setCompareVersions: (versions: {
    v1: AppVersion | null;
    v2: AppVersion | null;
  }) => void;

  setIsRunningReview: (is: boolean) => void;
  setIsApplyingFixes: (is: boolean) => void;
  setAutoReviewEnabled: (enabled: boolean) => void;
  setLastReviewedCode: (code: string | null) => void;
  setIsRunningPerformanceAnalysis: (is: boolean) => void;
  setIsApplyingPerformanceOptimizations: (is: boolean) => void;
}

export type AppState = ChatSlice & BuilderSlice & UISlice & DataSlice;

export const useAppStore = create<AppState>((set) => ({
  // --- Chat Slice ---
  chatMessages: [],
  userInput: "",
  isGenerating: false,
  generationProgress: "",
  isStreaming: false,
  streamingProgress: {
    phase: "architecture",
    message: "",
    percentComplete: 0,
    files: [],
  },

  setChatMessages: (messages) =>
    set((state) => ({
      chatMessages:
        typeof messages === "function"
          ? messages(state.chatMessages)
          : messages,
    })),
  addMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setUserInput: (input) => set({ userInput: input }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setStreamingProgress: (progress) => set({ streamingProgress: progress }),

  // --- Builder Slice ---
  components: [],
  currentComponent: null,
  undoStack: [],
  redoStack: [],

  setComponents: (components) => set({ components }),
  setCurrentComponent: (component) => set({ currentComponent: component }),
  updateComponent: (component) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === component.id ? component : c
      ),
      currentComponent:
        state.currentComponent?.id === component.id
          ? component
          : state.currentComponent,
    })),
  addComponent: (component) =>
    set((state) => ({
      components: [component, ...state.components].slice(0, 50),
      currentComponent: component,
    })),
  deleteComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      currentComponent:
        state.currentComponent?.id === id ? null : state.currentComponent,
    })),

  pushUndo: (version) =>
    set((state) => ({ undoStack: [...state.undoStack, version] })),
  pushRedo: (version) =>
    set((state) => ({ redoStack: [...state.redoStack, version] })),
  popUndo: () => set((state) => ({ undoStack: state.undoStack.slice(0, -1) })),
  popRedo: () => set((state) => ({ redoStack: state.redoStack.slice(0, -1) })),
  clearRedo: () => set({ redoStack: [] }),

  // --- UI Slice ---
  layoutMode: "classic",
  activeTab: "chat",
  showLibrary: false,
  showVersionHistory: false,
  showDiffPreview: false,
  showApprovalModal: false,

  showConceptWizard: false,
  showQuickStart: false,
  showTemplateSelector: false,
  showNewAppStagingModal: false,
  showDeploymentModal: false,
  showCompareModal: false,
  showQualityReport: false,
  showPerformanceReport: false,

  showPhasePreview: false,
  phaseToPreview: null,

  currentMode: "PLAN",
  guidedBuildMode: false,

  setLayoutMode: (mode) => set({ layoutMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleLibrary: () => set((state) => ({ showLibrary: !state.showLibrary })),
  toggleVersionHistory: () =>
    set((state) => ({ showVersionHistory: !state.showVersionHistory })),
  setShowDiffPreview: (show) => set({ showDiffPreview: show }),
  setShowApprovalModal: (show) => set({ showApprovalModal: show }),

  setShowConceptWizard: (show) => set({ showConceptWizard: show }),
  setShowQuickStart: (show) => set({ showQuickStart: show }),
  setShowTemplateSelector: (show) => set({ showTemplateSelector: show }),
  setShowNewAppStagingModal: (show) => set({ showNewAppStagingModal: show }),
  setShowDeploymentModal: (show) => set({ showDeploymentModal: show }),
  setShowCompareModal: (show) => set({ showCompareModal: show }),
  setShowQualityReport: (show) => set({ showQualityReport: show }),
  setShowPerformanceReport: (show) => set({ showPerformanceReport: show }),

  setShowPhasePreview: (show) => set({ showPhasePreview: show }),
  setPhaseToPreview: (phase) => set({ phaseToPreview: phase }),

  setCurrentMode: (mode) => set({ currentMode: mode }),
  setGuidedBuildMode: (mode) => set({ guidedBuildMode: mode }),

  // --- Data Slice ---
  themeManager: null,
  pendingChange: null,
  pendingDiff: null,

  selectedQuickStartTemplate: null,
  implementationPlan: null,
  activePhase: null,
  qualityReport: null,
  performanceReport: null,

  newAppStagePlan: null,
  pendingNewAppRequest: "",
  selectedTemplate: null,
  pendingTemplateRequest: "",
  currentStagePlan: null,

  deploymentInstructions: null,
  exportingApp: null,

  compareVersions: { v1: null, v2: null },

  isRunningReview: false,
  isApplyingFixes: false,
  autoReviewEnabled: false,
  lastReviewedCode: null,
  isRunningPerformanceAnalysis: false,
  isApplyingPerformanceOptimizations: false,

  setThemeManager: (manager) => set({ themeManager: manager }),
  setPendingChange: (change) => set({ pendingChange: change }),
  setPendingDiff: (diff) => set({ pendingDiff: diff }),

  setSelectedQuickStartTemplate: (template) =>
    set({ selectedQuickStartTemplate: template }),
  setImplementationPlan: (plan) => set({ implementationPlan: plan }),
  setActivePhase: (phase) => set({ activePhase: phase }),
  setQualityReport: (report) => set({ qualityReport: report }),
  setPerformanceReport: (report) => set({ performanceReport: report }),

  setNewAppStagePlan: (plan) => set({ newAppStagePlan: plan }),
  setPendingNewAppRequest: (request) => set({ pendingNewAppRequest: request }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setPendingTemplateRequest: (request) =>
    set({ pendingTemplateRequest: request }),
  setCurrentStagePlan: (plan) => set({ currentStagePlan: plan }),

  setDeploymentInstructions: (instructions) =>
    set({ deploymentInstructions: instructions }),
  setExportingApp: (app) => set({ exportingApp: app }),

  setCompareVersions: (versions) => set({ compareVersions: versions }),

  setIsRunningReview: (is) => set({ isRunningReview: is }),
  setIsApplyingFixes: (is) => set({ isApplyingFixes: is }),
  setAutoReviewEnabled: (enabled) => set({ autoReviewEnabled: enabled }),
  setLastReviewedCode: (code) => set({ lastReviewedCode: code }),
  setIsRunningPerformanceAnalysis: (is) =>
    set({ isRunningPerformanceAnalysis: is }),
  setIsApplyingPerformanceOptimizations: (is) =>
    set({ isApplyingPerformanceOptimizations: is }),
}));
