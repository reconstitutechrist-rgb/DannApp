# Quick Wins - Quick Reference Card

## 🎯 Import Cheatsheet

```tsx
// 1. Loading Skeletons
import {
  Skeleton,
  ChatMessageSkeleton,
  ProjectCardSkeleton,
  CodePreviewSkeleton,
  ComponentListSkeleton,
  SettingsSkeleton,
  PageLoadingSkeleton
} from '@/components/LoadingSkeleton';

// 2. Toast Notifications
import {
  ToastProvider,
  useToast,
  useSuccessToast,
  useErrorToast,
  useWarningToast,
  useInfoToast
} from '@/components/Toast';

// 3. Keyboard Shortcuts
import {
  KeyboardShortcutsModal,
  useKeyboardShortcuts
} from '@/components/KeyboardShortcutsModal';

// 4. Recent Projects
import {
  RecentProjects,
  RecentProjectsCompact
} from '@/components/RecentProjects';
import {
  getRecentProjects,
  addRecentProject,
  removeRecentProject,
  clearRecentProjects,
  getRelativeTimeString
} from '@/utils/recentProjects';

// 5. Copy Code
import {
  CopyCodeButton,
  CodeBlockWithCopy,
  FloatingCopyButton
} from '@/components/CopyCodeButton';

// 6. Settings
import {
  SettingsPage,
  useSettings
} from '@/components/SettingsPage';

// 7. Export
import { ExportConversationModal } from '@/components/ExportConversationModal';
import {
  exportToMarkdown,
  exportToJSON,
  exportToHTML,
  exportToText,
  downloadConversation,
  copyConversationToClipboard
} from '@/utils/exportConversation';

// 8. Tags
import {
  TagBadge,
  ProjectTagSelector,
  TagManagementModal
} from '@/components/ProjectTags';
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
  getProjectTags,
  addTagToProject,
  removeTagFromProject,
  setProjectTags,
  getProjectsWithTag,
  searchTags,
  TAG_COLORS
} from '@/utils/projectTags';
```

---

## ⚡ One-Liner Usage

```tsx
// Loading
{isLoading && <ProjectCardSkeleton />}

// Toast
const showSuccess = useSuccessToast();
showSuccess('Saved!');

// Shortcuts
const shortcuts = useKeyboardShortcuts();

// Recent
<RecentProjects onProjectClick={open} />

// Copy
<CopyCodeButton code={code} showLabel />

// Settings
const settings = useSettings();

// Export
downloadConversation(messages, 'chat.md');

// Tags
<ProjectTagSelector projectId="123" />
```

---

## 🎨 Common Patterns

### Show loading then content
```tsx
{isLoading ? (
  <ProjectCardSkeleton />
) : (
  <ProjectCard data={data} />
)}
```

### Show toast on action
```tsx
const showSuccess = useSuccessToast();
const handleSave = async () => {
  await save();
  showSuccess('Saved successfully!');
};
```

### Track project opens
```tsx
import { addRecentProject } from '@/utils/recentProjects';

const openProject = (project) => {
  addRecentProject({
    id: project.id,
    name: project.name,
    description: project.description
  });
  // ... open logic
};
```

### Code block with copy
```tsx
<CodeBlockWithCopy
  code={myCode}
  language="tsx"
  title="App.tsx"
  onCopy={() => showSuccess('Copied!')}
/>
```

---

## ⌨️ Keyboard Shortcuts to Implement

```tsx
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;

    // Undo/Redo
    if (ctrl && e.key === 'z') { e.preventDefault(); undo(); }
    if (ctrl && e.key === 'y') { e.preventDefault(); redo(); }

    // Save
    if (ctrl && e.key === 's') { e.preventDefault(); save(); }

    // Navigation
    if (ctrl && e.key === 'k') { e.preventDefault(); focusSearch(); }
    if (ctrl && e.key === 'b') { e.preventDefault(); toggleLibrary(); }

    // Actions
    if (ctrl && e.key === 'Enter') { e.preventDefault(); send(); }
    if (ctrl && e.shiftKey && e.key === 'C') { e.preventDefault(); copy(); }
    if (ctrl && e.shiftKey && e.key === 'E') { e.preventDefault(); export(); }

    // Settings
    if (ctrl && e.key === ',') { e.preventDefault(); openSettings(); }
  };

  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, []);
```

---

## 🔧 Required Setup

### 1. Wrap app with ToastProvider

```tsx
// app/layout.tsx
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

### 2. Add CSS animations (already done)

The animations are in `src/app/globals.css`:
- `slideInRight` - Toast slide-in
- `.custom-scrollbar` - Modal scrollbars

---

## 📁 File Structure

```
src/
├── components/
│   ├── LoadingSkeleton.tsx          # 1
│   ├── Toast.tsx                    # 2
│   ├── KeyboardShortcutsModal.tsx   # 3
│   ├── RecentProjects.tsx           # 4
│   ├── CopyCodeButton.tsx           # 5
│   ├── SettingsPage.tsx             # 6
│   ├── ExportConversationModal.tsx  # 7
│   ├── ProjectTags.tsx              # 8
│   └── FeatureShowcase.tsx          # Demo page
├── utils/
│   ├── recentProjects.ts            # 4
│   ├── exportConversation.ts        # 7
│   └── projectTags.ts               # 8
└── app/
    └── globals.css                  # Animations
```

---

## 🎯 Integration Checklist

- [ ] Wrap app with `<ToastProvider>`
- [ ] Add keyboard event listeners
- [ ] Replace loading states with skeletons
- [ ] Add toast notifications to all actions
- [ ] Track project opens with `addRecentProject()`
- [ ] Add copy buttons to code displays
- [ ] Add settings button and modal
- [ ] Add export button and modal
- [ ] Add tag selectors to project cards
- [ ] Test all keyboard shortcuts
- [ ] Test on mobile devices

---

## 💡 Pro Tips

1. **Toasts**: Use the convenience hooks (`useSuccessToast`, `useErrorToast`) for cleaner code

2. **Skeletons**: Match skeleton to actual content layout for best UX

3. **Recent Projects**: Call `addRecentProject()` when user actively opens a project, not on every view

4. **Copy Button**: Pass `onCopy` callback to show toast confirmation

5. **Settings**: Use `useSettings()` hook to access settings anywhere in your app

6. **Export**: Consider adding to toolbar and/or context menu

7. **Tags**: Use the 10 preset colors for consistency

8. **Keyboard Shortcuts**: Prevent default browser behavior with `e.preventDefault()`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Toasts not showing | Ensure `ToastProvider` wraps your app |
| Shortcuts not working | Check for event.preventDefault() |
| Tags not persisting | localStorage must be enabled |
| Copy fails | Requires HTTPS (clipboard API) |
| Settings not saving | Check localStorage quota |

---

## 📊 Performance Tips

- Skeletons render faster than "Loading..." text
- Debounce tag filtering in large lists
- Lazy load export modal only when opened
- Memoize recent projects list
- Use `React.memo` for tag badges

---

## 🎨 Customization

All components use CSS variables from `globals.css`:
- `--accent-primary` - Main accent color
- `--accent-secondary` - Secondary accent
- `--text-primary` - Primary text color
- `--bg-primary` - Background color

Override these to match your theme!

---

**Need help?** Check `QUICK_WINS_INTEGRATION_GUIDE.md` for detailed instructions.
