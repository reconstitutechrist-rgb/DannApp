# Phase 1 Integration Instructions

## ✅ All features are built and ready!

The following Phase 1 enhancements have been created and are ready to integrate into your existing wizard components:

1. ✅ Validation System (`wizardValidation.ts`, `ValidationMessage.tsx`)
2. ✅ Feature Library (`FeatureLibrary.tsx`) - 56 features
3. ✅ Example Prompts (`ExamplePrompts.tsx`) - 15 examples
4. ✅ Auto-Save System (`wizardAutoSave.ts`)
5. ✅ Quick Start Templates (`QuickStartSelector.tsx`) - 6 templates

---

## 🎯 Integration Task List

### Task 1: Integrate into AppConceptWizard.tsx

**File:** `src/components/AppConceptWizard.tsx`

**Changes required:**

1. **Add imports** (after line 3):
```tsx
import { useState, useEffect, useRef } from 'react';  // Add useEffect, useRef
import {
  validateAppName,
  validateDescription,
  validatePurpose,
  validateTargetUsers,
  validateFeatureName,
  validateFeatureDescription,
  validateColor,
  type ValidationError
} from '../utils/wizardValidation';
import {
  ValidationMessage,
  ValidatedField,
} from './ValidationMessage';
import { FeatureLibrary, type FeatureTemplate } from './FeatureLibrary';
import { createAutoSaver, WIZARD_DRAFT_KEYS, formatDraftAge } from '../utils/wizardAutoSave';
import { useToast } from './Toast';
```

2. **Add state variables** (after line 38):
```tsx
// Validation state
const [errors, setErrors] = useState<Record<string, ValidationError | null>>({});
const [featureErrors, setFeatureErrors] = useState<Record<string, ValidationError | null>>({});

// Feature library
const [showLibrary, setShowLibrary] = useState(false);
const [justAddedFeature, setJustAddedFeature] = useState<string | null>(null);

// Auto-save
const autoSaver = useRef(createAutoSaver<any>(WIZARD_DRAFT_KEYS.APP_CONCEPT));
const [lastSaved, setLastSaved] = useState<string | null>(null);
const [showDraftPrompt, setShowDraftPrompt] = useState(false);

const { showToast } = useToast();
```

3. **Add auto-save logic** (after state declarations):
```tsx
// Check for draft on mount
useEffect(() => {
  const metadata = autoSaver.current.getMetadata();
  if (metadata?.exists) {
    setShowDraftPrompt(true);
  }

  // Start auto-saving
  autoSaver.current.start(
    () => ({
      name,
      description,
      purpose,
      targetUsers,
      features,
      uiPreferences,
      technical,
      currentStep,
    }),
    () => {
      setLastSaved(new Date().toISOString());
    }
  );

  return () => {
    autoSaver.current.stop();
  };
}, []);

// Auto-save when state changes
useEffect(() => {
  if (!showDraftPrompt) {
    autoSaver.current.save({
      name,
      description,
      purpose,
      targetUsers,
      features,
      uiPreferences,
      technical,
      currentStep,
    });
  }
}, [name, description, purpose, targetUsers, features, uiPreferences, technical, currentStep, showDraftPrompt]);

// Load draft
const loadDraft = () => {
  const draft = autoSaver.current.load();
  if (draft) {
    setName(draft.name || '');
    setDescription(draft.description || '');
    setPurpose(draft.purpose || '');
    setTargetUsers(draft.targetUsers || '');
    setFeatures(draft.features || []);
    setUIPreferences(draft.uiPreferences || { style: 'modern', colorScheme: 'auto', layout: 'single-page' });
    setTechnical(draft.technical || { needsAuth: false, needsDatabase: false, needsAPI: false, needsFileUpload: false, needsRealtime: false });
    setCurrentStep(draft.currentStep || 1);
    showToast({ type: 'success', message: 'Draft loaded successfully!' });
  }
  setShowDraftPrompt(false);
};

const discardDraft = () => {
  autoSaver.current.delete();
  setShowDraftPrompt(false);
};
```

4. **Add validation handlers** (replace existing setName, etc.):
```tsx
const handleNameChange = (value: string) => {
  setName(value);
  setErrors(prev => ({ ...prev, name: validateAppName(value) }));
};

const handleDescriptionChange = (value: string) => {
  setDescription(value);
  setErrors(prev => ({ ...prev, description: validateDescription(value) }));
};

const handlePurposeChange = (value: string) => {
  setPurpose(value);
  setErrors(prev => ({ ...prev, purpose: validatePurpose(value) }));
};

const handleTargetUsersChange = (value: string) => {
  setTargetUsers(value);
  setErrors(prev => ({ ...prev, targetUsers: validateTargetUsers(value) }));
};

const handleFeatureNameChange = (value: string) => {
  setFeatureName(value);
  setFeatureErrors(prev => ({ ...prev, name: validateFeatureName(value, features) }));
};

const handleFeatureDescChange = (value: string) => {
  setFeatureDesc(value);
  setFeatureErrors(prev => ({ ...prev, description: validateFeatureDescription(value) }));
};

const handleColorChange = (value: string) => {
  setUIPreferences({ ...uiPreferences, primaryColor: value });
  setErrors(prev => ({ ...prev, primaryColor: validateColor(value) }));
};
```

5. **Update addFeature function** (replace existing):
```tsx
const addFeature = () => {
  const nameError = validateFeatureName(featureName, features);
  const descError = validateFeatureDescription(featureDesc);

  if (nameError) {
    setFeatureErrors({ name: nameError, description: descError });
    return;
  }

  const newFeature: Feature = {
    id: `feature-${Date.now()}`,
    name: featureName.trim(),
    description: featureDesc.trim(),
    priority: featurePriority,
  };

  setFeatures([...features, newFeature]);
  setFeatureName('');
  setFeatureDesc('');
  setFeaturePriority('high');
  setFeatureErrors({});

  // Show success feedback
  setJustAddedFeature(newFeature.id);
  setTimeout(() => setJustAddedFeature(null), 2000);
};

// Add new function for feature library
const handleLibrarySelect = (template: FeatureTemplate) => {
  const newFeature: Feature = {
    id: `feature-${Date.now()}`,
    name: template.name,
    description: template.description,
    priority: template.priority,
  };

  setFeatures([...features, newFeature]);
  setJustAddedFeature(newFeature.id);
  setTimeout(() => setJustAddedFeature(null), 2000);

  showToast({
    type: 'success',
    message: 'Feature added!',
    description: template.name,
  });
};
```

6. **Update handleCancel** to warn about unsaved changes:
```tsx
const handleCancel = () => {
  if (name || description || purpose || features.length > 0) {
    if (confirm('You have unsaved changes. Your progress has been auto-saved. Cancel anyway?')) {
      onCancel();
    }
  } else {
    autoSaver.current.delete();
    onCancel();
  }
};
```

7. **Update canProceed** to check validation:
```tsx
const canProceed = () => {
  switch (currentStep) {
    case 1:
      return (
        name.trim() &&
        description.trim() &&
        purpose.trim() &&
        !errors.name &&
        !errors.description &&
        !errors.purpose
      );
    case 2:
      return features.length > 0;
    case 3:
    case 4:
    case 5:
      return true;
    default:
      return false;
  }
};
```

8. **Add draft resume prompt** (before main wizard, after return statement):
```tsx
return (
  <>
    {/* Draft Resume Prompt */}
    {showDraftPrompt && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Resume Your Work?</h3>
          <p className="text-slate-400 mb-4">
            You have an unsaved draft from{' '}
            {formatDraftAge(autoSaver.current.getMetadata()?.timestamp || '')}.
          </p>
          <div className="flex gap-3">
            <button
              onClick={discardDraft}
              className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all"
            >
              Start Fresh
            </button>
            <button
              onClick={loadDraft}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
            >
              Resume Draft
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Feature Library Modal */}
    <FeatureLibrary
      isOpen={showLibrary}
      onClose={() => setShowLibrary(false)}
      onSelect={handleLibrarySelect}
      selectedFeatures={features}
    />

    {/* Existing wizard code... */}
  </>
);
```

9. **Update Step 1 inputs** to use ValidatedField:
```tsx
// Replace existing input for name:
<ValidatedField
  label="App Name"
  required
  error={errors.name}
  characterCount={{ current: name.length, max: 50 }}
  hint="Choose a memorable name for your app"
>
  <input
    type="text"
    value={name}
    onChange={(e) => handleNameChange(e.target.value)}
    placeholder="e.g., TaskMaster Pro"
    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors.name?.type === 'error' ? 'border-red-500' : 'border-white/10'
    }`}
  />
</ValidatedField>

// Repeat for description, purpose, targetUsers
```

10. **Add Feature Library button** in Step 2 (add after heading):
```tsx
<div className="flex items-center justify-between">
  <div>
    <h3 className="text-xl font-semibold text-white mb-4">Core Features</h3>
    <p className="text-slate-400 text-sm mb-6">
      What are the main features your app needs? Add at least one.
    </p>
  </div>
  <button
    onClick={() => setShowLibrary(true)}
    className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 transition-all text-sm font-medium flex items-center gap-2"
  >
    <span>📚</span>
    <span>Browse 56 Features</span>
  </button>
</div>
```

11. **Add auto-save indicator** in header (after title):
```tsx
<div className="flex items-center gap-3">
  {lastSaved && (
    <span className="text-xs text-slate-500">
      Saved {formatDraftAge(lastSaved)}
    </span>
  )}
  <button
    onClick={handleCancel}
    className="p-2 rounded-lg hover:bg-white/10 transition-all text-slate-400"
  >
    ✕
  </button>
</div>
```

---

### Task 2: Integrate into ConversationalAppWizard.tsx

**File:** `src/components/ConversationalAppWizard.tsx`

**Changes required:**

1. **Add imports**:
```tsx
import { ExamplePrompts, getRandomPlaceholder } from './ExamplePrompts';
import { createAutoSaver, WIZARD_DRAFT_KEYS, formatDraftAge } from '../utils/wizardAutoSave';
import { useToast } from './Toast';
```

2. **Add state**:
```tsx
const autoSaver = useRef(createAutoSaver(WIZARD_DRAFT_KEYS.CONVERSATIONAL));
const [lastSaved, setLastSaved] = useState<string | null>(null);
const [showDraftPrompt, setShowDraftPrompt] = useState(false);
const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());
const { showToast } = useToast();
```

3. **Add auto-save logic** (similar to AppConceptWizard)

4. **Show ExamplePrompts** when conversation starts:
```tsx
{messages.length === 1 && !userInput && (
  <ExamplePrompts
    onSelect={(text) => {
      setUserInput(text);
      // Optionally auto-submit
    }}
    variant="chips"
    maxDisplay={5}
  />
)}
```

5. **Use random placeholder**:
```tsx
<input
  placeholder={placeholder}
  value={userInput}
  onChange={(e) => setUserInput(e.target.value)}
/>
```

---

### Task 3: Integrate QuickStartSelector into AIBuilder.tsx

**File:** `src/components/AIBuilder.tsx`

**Changes required:**

1. **Add import**:
```tsx
import { QuickStartSelector } from './QuickStartSelector';
```

2. **Add state**:
```tsx
const [showQuickStart, setShowQuickStart] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
```

3. **Modify "Plan App" button handler** (find existing handler):
```tsx
const handlePlanApp = () => {
  setShowQuickStart(true);  // Show quick start first instead of wizard
};
```

4. **Add QuickStartSelector modal** (before ConversationalAppWizard):
```tsx
{showQuickStart && (
  <QuickStartSelector
    isOpen={showQuickStart}
    onClose={() => setShowQuickStart(false)}
    onSelect={(template) => {
      setSelectedTemplate(template);
      setShowQuickStart(false);
      setShowConceptWizard(true);  // Or whatever opens your wizard
    }}
    onSkip={() => {
      setSelectedTemplate(null);
      setShowQuickStart(false);
      setShowConceptWizard(true);
    }}
  />
)}
```

5. **Pre-fill wizard with template** (in wizard component, check for selectedTemplate):
```tsx
useEffect(() => {
  if (selectedTemplate) {
    const concept = selectedTemplate.concept;
    setName(concept.name || '');
    setDescription(concept.description || '');
    setPurpose(concept.purpose || '');
    // ... etc
  }
}, [selectedTemplate]);
```

---

### Task 4: Wrap app with ToastProvider

**File:** `src/app/layout.tsx` OR wherever your root layout is

**Changes required:**

```tsx
import { ToastProvider } from '@/components/Toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

---

## 🧪 Testing Checklist

After integration, test each feature:

### Validation
- [ ] Type invalid name (too short, special chars) - see error
- [ ] Type valid name - error disappears
- [ ] Character counter shows correctly
- [ ] Try to add duplicate feature - see error
- [ ] All fields validate properly

### Feature Library
- [ ] Click "Browse 56 Features" button
- [ ] Search for features works
- [ ] Filter by category works
- [ ] Click feature adds it to list
- [ ] Already-selected features show as selected
- [ ] Toast shows "Feature added"

### Example Prompts
- [ ] See example chips when conversation starts
- [ ] Click example populates input
- [ ] Random placeholder shows in input

### Auto-Save
- [ ] See "Saved X ago" indicator
- [ ] Close wizard
- [ ] Re-open - see "Resume draft?" prompt
- [ ] Click "Resume Draft" - data loads
- [ ] Click "Start Fresh" - starts empty

### Quick Start
- [ ] Click "Plan App" shows quick start modal
- [ ] Click template opens wizard with pre-filled data
- [ ] Click "Start from Scratch" opens empty wizard
- [ ] All 6 templates work

---

## 📝 Notes

- All features work independently - integrate one at a time if preferred
- Validation and feature library have the biggest UX impact
- Auto-save prevents data loss - high priority
- Quick start speeds up initial setup - nice-to-have
- Example prompts reduce friction - nice-to-have

---

## 🐛 Common Issues

**Issue:** Import errors
- **Fix:** Ensure all new files are in correct locations
- Check file paths match your project structure

**Issue:** Toast not showing
- **Fix:** Ensure ToastProvider wraps your app

**Issue:** TypeScript errors on ValidationError
- **Fix:** Import the type: `import type { ValidationError } from '../utils/wizardValidation'`

**Issue:** Auto-save not working
- **Fix:** Check useEffect dependencies, ensure autoSaver.start() is called

---

**Ready to integrate!** Start with validation (biggest UX win), then feature library, then auto-save, then quick start and example prompts.
