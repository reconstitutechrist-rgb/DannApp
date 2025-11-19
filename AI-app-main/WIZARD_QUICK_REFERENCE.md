# Wizard Enhancements - Quick Reference Card

## 📦 Import Cheatsheet

```tsx
// Validation
import {
  validateAppName,
  validateDescription,
  validateFeatureName,
  validateBasicInfo,
  ValidationError
} from '@/utils/wizardValidation';

import {
  ValidationMessage,
  CharacterCounter,
  ValidatedField,
  ValidationSummary
} from '@/components/ValidationMessage';

// Feature Library
import { FeatureLibrary, FEATURE_LIBRARY } from '@/components/FeatureLibrary';

// Example Prompts
import {
  ExamplePrompts,
  CategorizedPrompts,
  getRandomPlaceholder
} from '@/components/ExamplePrompts';

// Auto-Save
import {
  createAutoSaver,
  WIZARD_DRAFT_KEYS,
  formatDraftAge
} from '@/utils/wizardAutoSave';

// Quick Start
import {
  QuickStartSelector,
  QUICK_START_TEMPLATES
} from '@/components/QuickStartSelector';
```

---

## ⚡ One-Liner Usage

```tsx
// Validation
const error = validateAppName(name);
<ValidationMessage error={error} />

// Feature Library
<FeatureLibrary isOpen={show} onClose={() => {}} onSelect={addFeature} selectedFeatures={features} />

// Example Prompts
<ExamplePrompts onSelect={setText} variant="chips" />

// Auto-Save
const saver = createAutoSaver(WIZARD_DRAFT_KEYS.APP_CONCEPT);
saver.start(() => state);

// Quick Start
<QuickStartSelector isOpen onClose={() => {}} onSelect={useTemplate} onSkip={() => {}} />
```

---

## 🎨 Common Patterns

### Validated Form Field

```tsx
const [name, setName] = useState('');
const [error, setError] = useState<ValidationError | null>(null);

const handleChange = (value: string) => {
  setName(value);
  setError(validateAppName(value));
};

<ValidatedField
  label="App Name"
  required
  error={error}
  characterCount={{ current: name.length, max: 50 }}
  hint="Choose a memorable name for your app"
>
  <input
    value={name}
    onChange={(e) => handleChange(e.target.value)}
    className={`... ${error?.type === 'error' ? 'border-red-500' : ''}`}
  />
</ValidatedField>
```

### Feature Library Integration

```tsx
const [showLibrary, setShowLibrary] = useState(false);
const [features, setFeatures] = useState<Feature[]>([]);

const addFeature = (template: FeatureTemplate) => {
  setFeatures(prev => [...prev, {
    id: `feature-${Date.now()}`,
    name: template.name,
    description: template.description,
    priority: template.priority,
  }]);
};

// Button
<button onClick={() => setShowLibrary(true)}>
  Browse {FEATURE_LIBRARY.length} Features
</button>

// Modal
<FeatureLibrary
  isOpen={showLibrary}
  onClose={() => setShowLibrary(false)}
  onSelect={addFeature}
  selectedFeatures={features}
/>
```

### Auto-Save Hook

```tsx
const autoSaver = useRef(createAutoSaver<WizardState>(WIZARD_DRAFT_KEYS.APP_CONCEPT));

// On mount
useEffect(() => {
  // Check for draft
  if (autoSaver.current.hasDraft()) {
    const metadata = autoSaver.current.getMetadata();
    if (confirm(`Resume draft from ${formatDraftAge(metadata.timestamp)}?`)) {
      const draft = autoSaver.current.load();
      if (draft) {
        // Load state
        setState(draft);
      }
    }
  }

  // Start auto-saving
  autoSaver.current.start(() => state, (saved) => {
    console.log('Auto-saved!', saved);
    // Show toast notification
  });

  return () => {
    autoSaver.current.stop();
  };
}, []);

// Manual save
const handleSave = () => {
  autoSaver.current.save(state);
};

// Delete draft
const handleCancel = () => {
  autoSaver.current.delete();
  onClose();
};
```

### Quick Start Flow

```tsx
const [showQuickStart, setShowQuickStart] = useState(true);
const [showWizard, setShowWizard] = useState(false);
const [template, setTemplate] = useState<QuickStartTemplate | null>(null);

// Show quick start first
<QuickStartSelector
  isOpen={showQuickStart}
  onClose={() => setShowQuickStart(false)}
  onSelect={(selectedTemplate) => {
    setTemplate(selectedTemplate);
    setShowQuickStart(false);
    setShowWizard(true);
  }}
  onSkip={() => {
    setTemplate(null);
    setShowQuickStart(false);
    setShowWizard(true);
  }}
/>

// Pre-fill wizard if template selected
useEffect(() => {
  if (template && showWizard) {
    setName(template.concept.name);
    setDescription(template.concept.description);
    // ... etc
  }
}, [template, showWizard]);
```

---

## 🎯 Integration Checklist

### AppConceptWizard.tsx

- [ ] Import validation utilities
- [ ] Add error state: `useState<Record<string, ValidationError | null>>({})`
- [ ] Add auto-saver: `useRef(createAutoSaver(WIZARD_DRAFT_KEYS.APP_CONCEPT))`
- [ ] Add feature library: `useState(false)` for modal
- [ ] Replace inputs with `<ValidatedField>`
- [ ] Add character counters
- [ ] Add "Browse Features" button in Step 2
- [ ] Implement draft resume on mount
- [ ] Start auto-save in useEffect
- [ ] Stop auto-save on unmount

### ConversationalAppWizard.tsx

- [ ] Import example prompts
- [ ] Add auto-saver: `useRef(createAutoSaver(WIZARD_DRAFT_KEYS.CONVERSATIONAL))`
- [ ] Show `<ExamplePrompts>` when conversation starts
- [ ] Use `getRandomPlaceholder()` for input placeholder
- [ ] Implement draft resume on mount
- [ ] Start auto-save in useEffect
- [ ] Add manual save indicator ("Draft saved 2m ago")

### AIBuilder.tsx

- [ ] Import `QuickStartSelector`
- [ ] Add state: `useState(false)` for quick start modal
- [ ] Modify "Plan App" button to show quick start first
- [ ] Handle template selection (pre-fill wizard)
- [ ] Handle skip (open empty wizard)

---

## 🔧 Customization Options

### Validation Messages

```tsx
// Custom error type
<ValidationMessage
  error={{
    field: 'custom',
    message: 'Custom error',
    type: 'error'
  }}
/>

// Warning instead of error
<ValidationMessage
  error={{
    field: 'name',
    message: 'Consider a shorter name',
    type: 'warning'
  }}
/>
```

### Feature Library

```tsx
// Custom selected features
<FeatureLibrary
  selectedFeatures={[
    { name: 'User Login' },
    { name: 'Shopping Cart' }
  ]}
/>

// Access full library
FEATURE_LIBRARY.filter(f => f.category === 'auth')
```

### Example Prompts

```tsx
// Different variants
<ExamplePrompts variant="chips" />   // Default
<ExamplePrompts variant="list" />    // Vertical list
<ExamplePrompts variant="grid" />    // 2-column grid

// Categorized version
<CategorizedPrompts onSelect={setText} />

// Limit display
<ExamplePrompts maxDisplay={3} />
```

### Auto-Save

```tsx
// Custom save interval (default 30s)
// Note: Interval is hardcoded in utility, but you can
// manually trigger saves more frequently

autoSaver.save(state); // Manual save anytime

// Custom draft key
const customSaver = createAutoSaver<MyType>('my_custom_key');
```

---

## 📊 Feature Stats

| Feature | Components | Functions | Lines of Code |
|---------|-----------|-----------|---------------|
| Validation | 6 | 10+ | ~400 |
| Feature Library | 1 | - | ~600 |
| Example Prompts | 3 | 1 | ~300 |
| Auto-Save | - | 15+ | ~300 |
| Quick Start | 1 | - | ~400 |
| **Total** | **11** | **25+** | **~2,000** |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Validation not showing | Check error state is set with `ValidationError` type |
| Character counter wrong color | Ensure current/max props are numbers |
| Feature library won't open | Check `isOpen` prop is true |
| Auto-save not working | Verify `start()` is called in useEffect |
| Draft not loading | Check localStorage is enabled |
| Quick start template empty | Ensure template has `concept` property |

---

## 💡 Pro Tips

1. **Validation**: Call validation on every keystroke (`onChange`) for best UX
2. **Feature Library**: Pre-select features by matching names (case-insensitive)
3. **Example Prompts**: Randomize order on each mount for variety
4. **Auto-Save**: Show "Draft saved" toast notification on save callback
5. **Quick Start**: Track which template was used for analytics

---

## 🎨 Styling

All components use your existing design system:
- `glass` and `glass-subtle` classes
- `primary-400`, `violet-400` accent colors
- `neutral-*` grayscale
- `animate-fade-in` animation
- `custom-scrollbar` for modals

To customize colors:
```tsx
// In component
className="bg-primary-500/20 text-primary-400"

// Or override CSS variables in globals.css
--accent-primary: #YOUR_COLOR;
```

---

**Need more help?** See `WIZARD_ENHANCEMENTS_SUMMARY.md` for detailed documentation.
