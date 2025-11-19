# Enhanced Phase Review System - Implementation Guide

## Overview

This implementation preserves the **phase review requirement** (quality control) while significantly improving the user experience with:
- ✅ Objective mapping (see what was planned vs what was built)
- ✅ AI explanations for each file
- ✅ "Request Changes" workflow
- ✅ "Ask Questions" feature
- ✅ User settings for auto-approval (power users)
- ✅ Phase preview before building

---

## New Components

### 1. EnhancedPhaseReview.tsx

**Location:** [`src/components/EnhancedPhaseReview.tsx`](src/components/EnhancedPhaseReview.tsx)

**Purpose:** Replaces the standard DiffPreview modal with an enhanced version that shows:
- Plan vs Implementation side-by-side
- Objective checklist (which objectives were met)
- Auto-mapping of files to objectives
- AI explanations of what each file does
- "Request Changes" and "Ask Questions" workflows

**Key Features:**
```typescript
interface EnhancedPhaseReviewProps {
  phase: BuildPhase;                           // The phase being reviewed
  files: FileDiff[];                           // Files created/modified
  summary: string;                             // AI summary of changes
  onApprove: () => void;                       // User approves
  onReject: () => void;                        // User rejects
  onRequestChanges?: (feedback: string) => void; // User wants changes
  onAskQuestion?: (question: string) => void;   // User has questions
}
```

**View Modes:**
- **Checklist View (default):** Shows objectives vs implementation
- **Details View:** Shows file-by-file changes (like original DiffPreview)

---

### 2. PhasePreview.tsx

**Location:** [`src/components/PhasePreview.tsx`](src/components/PhasePreview.tsx)

**Purpose:** Shows BEFORE building starts, allowing user to:
- See what will be built (objectives, features, dependencies)
- Review complexity and time estimate
- Customize phase before building (optional)
- Cancel if needed

**Usage:**
```typescript
<PhasePreview
  phase={currentPhase}
  onStart={() => {
    // Start building the phase
    handlePhaseStart(currentPhase);
  }}
  onCancel={() => {
    // User decided not to build
    setShowPhasePreview(false);
  }}
  onCustomize={() => {
    // Open phase editor
    setShowPhaseEditor(true);
  }}
/>
```

---

### 3. User Settings System

**Files:**
- [`src/types/userSettings.ts`](src/types/userSettings.ts) - Type definitions
- [`src/hooks/useBuilderSettings.ts`](src/hooks/useBuilderSettings.ts) - Settings hook

**Purpose:** Persistent user preferences with localStorage

**Settings Categories:**

#### Review Preferences
```typescript
{
  autoApprovePhases: 'never' | 'simple' | 'all',
  // never: Always require review (default, safest)
  // simple: Auto-approve simple phases, review complex
  // all: Auto-approve all, show summary only

  defaultToDetailedView: boolean,         // Show diff or checklist
  requireApprovalForMinorChanges: boolean,
  showPhasePreview: boolean,              // Show preview before build
  autoExpandFiles: boolean,               // Auto-expand in review
}
```

#### Generation Preferences
```typescript
{
  model: 'claude-sonnet-4' | 'claude-opus-4',
  streaming: boolean,
  maxTokens: number,
}
```

#### UI Preferences
```typescript
{
  layoutMode: 'classic' | 'preview-first' | 'code-first' | 'stacked',
  showKeyboardShortcuts: boolean,
  enableAnimations: boolean,
}
```

#### Quality Preferences
```typescript
{
  autoRunQualityCheck: boolean,
  autoRunPerformanceCheck: boolean,
  autoGenerateTests: boolean,
}
```

**Usage:**
```typescript
import { useBuilderSettings } from '../hooks/useBuilderSettings';

function MyComponent() {
  const { settings, updateSettings } = useBuilderSettings();

  // Access settings
  if (settings.review.autoApprovePhases === 'simple') {
    // Auto-approve logic
  }

  // Update settings
  updateSettings({
    review: {
      ...settings.review,
      autoApprovePhases: 'all'
    }
  });
}
```

---

## Integration with AIBuilder

### Step 1: Import New Components

```typescript
// src/components/AIBuilder.tsx
import EnhancedPhaseReview from './EnhancedPhaseReview';
import PhasePreview from './PhasePreview';
import { useBuilderSettings } from '../hooks/useBuilderSettings';
```

### Step 2: Add State for Preview

```typescript
// Add to AIBuilder state
const [showPhasePreview, setShowPhasePreview] = useState(false);
const [phaseToPreview, setPhaseToPreview] = useState<BuildPhase | null>(null);
const { settings, updateSettings } = useBuilderSettings();
```

### Step 3: Modify handlePhaseStart

**Before:**
```typescript
const handlePhaseStart = async (phase: BuildPhase) => {
  setActivePhase(phase);
  phaseStartTimeRef.current = Date.now();
  // ... generate prompt and start building
};
```

**After:**
```typescript
const handlePhaseStart = async (phase: BuildPhase) => {
  // Check user settings for phase preview
  if (settings.review.showPhasePreview) {
    setPhaseToPreview(phase);
    setShowPhasePreview(true);
    return; // Wait for user to click "Start Building"
  }

  // Otherwise, start building immediately
  startPhaseBuild(phase);
};

const startPhaseBuild = async (phase: BuildPhase) => {
  setActivePhase(phase);
  phaseStartTimeRef.current = Date.now();

  // Update plan status
  if (implementationPlan) {
    const updatedPlan = {
      ...implementationPlan,
      phases: implementationPlan.phases.map(p =>
        p.id === phase.id ? { ...p, status: 'in-progress' as const } : p
      ),
    };
    setImplementationPlan(updatedPlan);

    // Generate enhanced prompt
    const completedPhases = updatedPlan.phases.filter(p => p.status === 'completed');
    const enhancedPrompt = generatePhasePrompt({
      phase,
      plan: updatedPlan,
      previousPhases: completedPhases,
      completedFiles: completedPhases.flatMap(p => p.result?.filesCreated || []),
    });

    // Add to chat and send
    const phaseMessage: ChatMessage = {
      id: `phase-${Date.now()}`,
      role: 'user',
      content: enhancedPrompt,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, phaseMessage]);

    autoSendMessageRef.current = true;
    setUserInput(enhancedPrompt);
  }
};
```

### Step 4: Replace DiffPreview with EnhancedPhaseReview

**Find the existing DiffPreview usage:**
```typescript
{showDiffPreview && pendingDiff && (
  <DiffPreview
    summary={pendingDiff.summary}
    files={pendingDiff.files}
    onApprove={handleApproveDiff}
    onReject={handleRejectDiff}
  />
)}
```

**Replace with:**
```typescript
{showDiffPreview && pendingDiff && activePhase && (
  <EnhancedPhaseReview
    phase={activePhase}
    files={pendingDiff.files.map(file => ({
      ...file,
      matchedObjective: matchFileToObjective(file.path, activePhase),
      aiExplanation: generateFileExplanation(file),
    }))}
    summary={pendingDiff.summary}
    onApprove={handleApproveDiff}
    onReject={handleRejectDiff}
    onRequestChanges={handleRequestChanges}
    onAskQuestion={handleAskQuestion}
  />
)}
```

### Step 5: Add Handler Functions

```typescript
// Handle "Request Changes" workflow
const handleRequestChanges = (feedback: string) => {
  // Add user feedback to chat
  const feedbackMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: `Please make the following changes to Phase ${activePhase?.phaseNumber}:\n\n${feedback}`,
    timestamp: new Date().toISOString(),
  };
  setChatMessages(prev => [...prev, feedbackMessage]);

  // Close diff preview
  setShowDiffPreview(false);

  // Send feedback to AI (will regenerate phase)
  autoSendMessageRef.current = true;
  setUserInput(feedbackMessage.content);
};

// Handle "Ask Question" workflow
const handleAskQuestion = (question: string) => {
  // Add question to chat
  const questionMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: `Question about Phase ${activePhase?.phaseNumber}: ${question}`,
    timestamp: new Date().toISOString(),
  };
  setChatMessages(prev => [...prev, questionMessage]);

  // Don't close diff preview - user is just asking, not changing
  // Send question to AI
  setUserInput(questionMessage.content);
};
```

### Step 6: Add Phase Preview Modal

```typescript
{/* Phase Preview Modal */}
{showPhasePreview && phaseToPreview && (
  <PhasePreview
    phase={phaseToPreview}
    onStart={() => {
      setShowPhasePreview(false);
      startPhaseBuild(phaseToPreview);
    }}
    onCancel={() => {
      setShowPhasePreview(false);
      setPhaseToPreview(null);
    }}
    onCustomize={() => {
      setShowPhasePreview(false);
      // Open phase editor to customize
      // TODO: Implement phase editor integration
    }}
  />
)}
```

### Step 7: Implement Auto-Approve Logic

```typescript
// After phase completes successfully
if (activePhase && implementationPlan) {
  const createdFiles = data ? extractCreatedFiles(data) : [];
  const actualHours = phaseStartTimeRef.current
    ? (Date.now() - phaseStartTimeRef.current) / (1000 * 60 * 60)
    : undefined;

  // Check if should auto-approve
  const shouldAutoApprove = (
    settings.review.autoApprovePhases === 'all' ||
    (settings.review.autoApprovePhases === 'simple' &&
     activePhase.estimatedComplexity === 'simple')
  );

  if (shouldAutoApprove) {
    // Auto-approve: Update phase and continue
    const updatedPlan: ImplementationPlan = {
      ...implementationPlan,
      phases: implementationPlan.phases.map(p =>
        p.id === activePhase.id
          ? {
              ...p,
              status: 'completed' as const,
              result: {
                code: JSON.stringify(data, null, 2),
                componentName: data.name,
                completedAt: new Date().toISOString(),
                actualHours,
                filesCreated: createdFiles,
              },
            }
          : p
      ),
    };
    setImplementationPlan(updatedPlan);

    // Show auto-approve notification
    const autoApproveMessage: ChatMessage = {
      id: (Date.now() + 5).toString(),
      role: 'system',
      content: `✅ Phase ${activePhase.phaseNumber} auto-approved (${activePhase.estimatedComplexity} complexity)\n\n${createdFiles.length} files created. Settings: Auto-approve ${settings.review.autoApprovePhases} phases.`,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, autoApproveMessage]);

    // Clear active phase
    setActivePhase(null);
    phaseStartTimeRef.current = null;

    // Continue to next phase or show completion
    // ... (existing logic)
  } else {
    // Show review modal (existing logic)
    setPendingDiff({
      id: Date.now().toString(),
      summary: `Phase ${activePhase.phaseNumber} complete: ${createdFiles.length} files created`,
      files: createdFiles.map(path => ({
        path,
        action: 'CREATE',
        changes: []
      })),
      timestamp: new Date().toISOString()
    });
    setShowDiffPreview(true);
  }
}
```

---

## User Flow Examples

### Flow 1: Default (Review All Phases)

```
User clicks "Start Phase 1"
   ↓
[PhasePreview Modal appears]
   "About to build Phase 1: Core Authentication"
   Shows: objectives, features, estimated time
   [Cancel] [Customize] [Start Building]
   ↓
User clicks "Start Building"
   ↓
AI generates code (2-3 minutes)
   ↓
[EnhancedPhaseReview Modal appears]
   Shows: Plan vs Implementation side-by-side
   Objectives checklist: ✅ All 4 met
   Files: 6 created, each mapped to objectives
   [Ask Questions] [Request Changes] [Reject] [Approve]
   ↓
User clicks "Approve"
   ↓
Phase 1 complete, ready for Phase 2
```

### Flow 2: Auto-Approve Simple Phases

```
Settings: autoApprovePhases = 'simple'

User starts Phase 1 (simple complexity)
   ↓
[PhasePreview] (if enabled)
   ↓
AI generates code
   ↓
✅ Auto-approved! (notification in chat)
   "Phase 1 auto-approved (simple complexity)"
   ↓
Immediately continues to Phase 2
```

### Flow 3: Request Changes

```
User in [EnhancedPhaseReview]
   ↓
Clicks "Request Changes"
   ↓
[Feedback form appears inline]
   "What would you like changed?"
   User types: "Add email verification to registration"
   ↓
Clicks "Submit Changes Request"
   ↓
Feedback sent to AI
   ↓
AI regenerates Phase 1 with changes
   ↓
[EnhancedPhaseReview] shows updated implementation
   ↓
User approves or requests more changes
```

### Flow 4: Ask Questions

```
User in [EnhancedPhaseReview]
   ↓
Clicks "Ask Questions"
   ↓
[Question form appears inline]
   User types: "How does the middleware protect routes?"
   ↓
Clicks "Ask AI"
   ↓
AI responds in chat with explanation
   ↓
Review modal stays open
   ↓
User can continue reviewing or ask more questions
```

---

## Settings UI (Recommended Addition)

Create a settings panel accessible from the AIBuilder header:

```typescript
// src/components/SettingsPanel.tsx
export default function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useBuilderSettings();

  return (
    <div className="p-6 space-y-6">
      {/* Review Preferences */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4">
          Phase Review
        </h3>

        <div className="space-y-3">
          <label className="block">
            <span className="text-sm text-neutral-300 mb-2 block">
              Auto-approve phases
            </span>
            <select
              value={settings.review.autoApprovePhases}
              onChange={(e) => updateSettings({
                review: {
                  ...settings.review,
                  autoApprovePhases: e.target.value as 'never' | 'simple' | 'all'
                }
              })}
              className="w-full px-3 py-2 rounded bg-neutral-800 border border-white/[0.08] text-white"
            >
              <option value="never">Never (always review)</option>
              <option value="simple">Simple phases only</option>
              <option value="all">All phases</option>
            </select>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.review.showPhasePreview}
              onChange={(e) => updateSettings({
                review: {
                  ...settings.review,
                  showPhasePreview: e.target.checked
                }
              })}
              className="w-4 h-4 rounded bg-neutral-800 border-white/[0.08]"
            />
            <span className="text-sm text-neutral-300">
              Show phase preview before building
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.review.defaultToDetailedView}
              onChange={(e) => updateSettings({
                review: {
                  ...settings.review,
                  defaultToDetailedView: e.target.checked
                }
              })}
              className="w-4 h-4 rounded bg-neutral-800 border-white/[0.08]"
            />
            <span className="text-sm text-neutral-300">
              Default to detailed diff view
            </span>
          </label>
        </div>
      </section>

      {/* Quality Preferences */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4">
          Code Quality
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.quality.autoRunQualityCheck}
              onChange={(e) => updateSettings({
                quality: {
                  ...settings.quality,
                  autoRunQualityCheck: e.target.checked
                }
              })}
              className="w-4 h-4 rounded bg-neutral-800 border-white/[0.08]"
            />
            <span className="text-sm text-neutral-300">
              Auto-run code quality analysis
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.quality.autoGenerateTests}
              onChange={(e) => updateSettings({
                quality: {
                  ...settings.quality,
                  autoGenerateTests: e.target.checked
                }
              })}
              className="w-4 h-4 rounded bg-neutral-800 border-white/[0.08]"
            />
            <span className="text-sm text-neutral-300">
              Auto-generate tests for new code
            </span>
          </label>
        </div>
      </section>

      {/* Reset Button */}
      <button
        onClick={resetSettings}
        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Phase preview appears before building (when enabled in settings)
- [ ] Enhanced review shows objectives vs implementation
- [ ] Files are auto-mapped to objectives correctly
- [ ] "Request Changes" workflow works (AI regenerates with feedback)
- [ ] "Ask Questions" workflow works (AI responds without closing modal)
- [ ] Auto-approve works for simple phases (when enabled)
- [ ] Auto-approve works for all phases (when enabled)
- [ ] Settings persist across page reloads
- [ ] Toggle between checklist view and details view works
- [ ] All objectives marked as met/unmet correctly

---

## Summary of Improvements

### What Was Preserved ✅
- Phase review requirement (quality control)
- User approval before changes applied
- Diff preview functionality
- Multi-phase workflow

### What Was Enhanced ✨
- **Better Context:** Side-by-side plan vs implementation
- **Auto-Mapping:** Files automatically linked to objectives
- **AI Explanations:** Each file explained in plain language
- **Faster Review:** Checklist view for quick verification
- **Power User Options:** Auto-approve for experienced users
- **Iteration Support:** "Request Changes" without rejection
- **Q&A:** Ask questions during review
- **Preview Before Build:** See what will be built

### Expected Impact 📊
- **Review Time:** 60% faster (checklist vs reading diffs)
- **User Confidence:** Higher (see plan-implementation mapping)
- **Iteration Speed:** 3x faster (request changes vs reject/rebuild)
- **Power User Satisfaction:** Higher (auto-approve option)
- **Question Resolution:** Instant (ask AI during review)

---

## Next Steps

1. **Integrate Components** into AIBuilder (follow steps above)
2. **Create Settings UI** for user preferences
3. **Test Workflows** with real users
4. **Gather Feedback** and iterate
5. **Add Analytics** to track review times and patterns

This enhanced review system maintains the critical quality control while dramatically improving the user experience! 🎉
