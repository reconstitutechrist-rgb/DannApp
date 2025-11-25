# 🚀 Performance Improvements Analysis

**Analyzed:** November 2025  
**Status:** Recommendations Ready for Implementation

---

## 📊 Executive Summary

This analysis identifies slow or inefficient code patterns in the DannApp AI Builder codebase and provides actionable recommendations for optimization. The focus areas include:

1. **React Component Optimizations** - Unnecessary re-renders and memoization opportunities
2. **Algorithm & Data Structure Improvements** - Inefficient loops and data processing
3. **Memory Management** - Potential memory leaks and excessive allocations
4. **API & Async Operations** - Slow API calls and streaming improvements
5. **Bundle Size & Loading** - Large file sizes and lazy loading opportunities

---

## 🔴 High Priority Improvements

### 1. Semantic Memory - O(n) Lookups on Every Search

**File:** `src/utils/semanticMemory.ts`

**Issue:** The `getRelevantContext()` method performs O(n) scoring on every memory entry for each search, which can become slow with 500+ stored memories.

```typescript
// CURRENT (SLOW) - Lines 87-104
const scored = this.storage.map(memory => ({
  memory,
  score: this.calculateRelevance(memory, promptKeywords, promptType)
}));
```

**Recommendation:** Implement keyword indexing for O(1) lookups.

```typescript
// IMPROVED - Add keyword index
private keywordIndex: Map<string, Set<string>> = new Map(); // keyword -> memoryIds

addMemory(message: ChatMessage): void {
  // ... existing logic ...
  
  // Index keywords for fast lookup
  for (const keyword of keywords) {
    if (!this.keywordIndex.has(keyword)) {
      this.keywordIndex.set(keyword, new Set());
    }
    this.keywordIndex.get(keyword)!.add(entry.id);
  }
}

getRelevantContext(currentPrompt: string, limit: number = 5): RelevantContext[] {
  const promptKeywords = this.extractKeywords(currentPrompt);
  
  // Fast O(k) lookup where k = number of keywords
  const candidateIds = new Set<string>();
  for (const keyword of promptKeywords) {
    const memoryIds = this.keywordIndex.get(keyword);
    if (memoryIds) {
      memoryIds.forEach(id => candidateIds.add(id));
    }
  }
  
  // Only score candidates, not all memories
  const candidates = this.storage.filter(m => candidateIds.has(m.id));
  // ... rest of scoring logic
}
```

**Impact:** ~10x faster searches with large memory stores (500+ entries).

---

### 2. Context Compression - Redundant Token Estimation

**File:** `src/utils/contextCompression.ts`

**Issue:** `compressToTokenLimit()` calls `estimateTokenCount()` multiple times in a while loop, recalculating the entire message array each iteration.

```typescript
// CURRENT (INEFFICIENT) - Lines 231-246
export function compressToTokenLimit(
  messages: ChatMessage[],
  targetTokens: number = 4000
): CompressionResult {
  let compressed = compressConversationHistory(messages);
  let estimatedTokens = estimateTokenCount(compressed.messages);  // Called multiple times

  while (estimatedTokens > targetTokens && compressed.messages.length > 7 && iterations < 5) {
    compressed = compressConversationHistory(compressed.messages, compressed.messages.length - 2);
    estimatedTokens = estimateTokenCount(compressed.messages);  // Recalculates all
    iterations++;
  }
}
```

**Recommendation:** Cache token counts per message and use incremental updates.

```typescript
// IMPROVED - Cache token counts
export function compressToTokenLimit(
  messages: ChatMessage[],
  targetTokens: number = 4000
): CompressionResult {
  // Pre-calculate token counts once
  const tokenCache = new Map<string, number>();
  messages.forEach(msg => {
    tokenCache.set(msg.id, Math.ceil(msg.content.length / 4));
  });
  
  let compressed = compressConversationHistory(messages);
  
  // Calculate initial tokens from cache
  let estimatedTokens = compressed.messages.reduce(
    (sum, msg) => sum + (tokenCache.get(msg.id) || Math.ceil(msg.content.length / 4)),
    0
  );
  
  // Use cached values in loop
  // ...
}
```

**Impact:** ~3x faster compression for long conversations.

---

### 3. Code Validator - Repeated String Operations

**File:** `src/utils/codeValidator.ts`

**Issue:** The `hasNestedFunctionDeclarations()` function performs multiple regex replacements on every line, creating many intermediate strings.

```typescript
// CURRENT (INEFFICIENT) - Lines 48-53
const cleanedLine = line
  .replace(/"(?:[^"\\]|\\.)*"/g, '""')  // 4 string allocations
  .replace(/'(?:[^'\\]|\\.)*'/g, "''")  // per line
  .replace(/`(?:[^`\\]|\\.)*`/g, '``')
  .replace(/\/\/.*$/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');
```

**Recommendation:** Combine regex operations or use a single-pass tokenizer.

```typescript
// IMPROVED - Single-pass cleaning
function cleanCodeLine(line: string): string {
  let result = '';
  let i = 0;
  let inString: string | null = null;
  let inComment = false;
  
  while (i < line.length) {
    const char = line[i];
    const prev = i > 0 ? line[i - 1] : '';
    
    // Handle string/comment state transitions
    if (!inString && !inComment) {
      if (char === '"' || char === "'" || char === '`') {
        inString = char;
        result += char;
      } else if (char === '/' && line[i + 1] === '/') {
        break; // Rest is comment
      } else {
        result += char;
      }
    } else if (inString && char === inString && prev !== '\\') {
      inString = null;
      result += char;
    }
    // ... handle other cases
    
    i++;
  }
  return result;
}
```

**Impact:** ~2x faster validation for large files (500+ lines).

---

### 4. AST Modifier - Redundant Tree Traversals

**File:** `src/utils/astModifier.ts`

**Issue:** Multiple methods traverse the entire AST tree separately (e.g., `findFunction`, `findStateVariables`, `findImports`).

```typescript
// Called separately, each traverses the full tree
const functionNode = this.parser.findDefaultExportedFunction(this.tree);
const stateVars = this.parser.findStateVariables(this.tree);
const imports = this.parser.findImports(this.tree);
```

**Recommendation:** Implement a single-pass visitor pattern.

```typescript
// IMPROVED - Single traversal collecting all info
interface ParsedInfo {
  functions: Map<string, Parser.SyntaxNode>;
  stateVariables: StateVariable[];
  imports: Parser.SyntaxNode[];
  defaultExport: Parser.SyntaxNode | null;
}

function analyzeTree(tree: Parser.Tree): ParsedInfo {
  const info: ParsedInfo = {
    functions: new Map(),
    stateVariables: [],
    imports: [],
    defaultExport: null,
  };
  
  const traverse = (node: Parser.SyntaxNode) => {
    // Collect all in one pass
    switch (node.type) {
      case 'function_declaration':
        const name = node.childForFieldName('name');
        if (name) info.functions.set(name.text, node);
        break;
      case 'import_statement':
        info.imports.push(node);
        break;
      // ... other cases
    }
    
    for (const child of node.children) {
      traverse(child);
    }
  };
  
  traverse(tree.rootNode);
  return info;
}
```

**Impact:** ~4x faster AST operations for complex files.

---

## 🟡 Medium Priority Improvements

### 5. Chat Panel - Missing `useCallback` for Event Handlers

**File:** `src/components/ChatPanel.tsx`

**Issue:** The `handleKeyPress` function is recreated on every render.

```typescript
// CURRENT - Recreated each render
const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSendMessage();
  }
};
```

**Recommendation:** Wrap with `useCallback`.

```typescript
// IMPROVED
const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSendMessage();
  }
}, [onSendMessage]);
```

**Impact:** Reduced re-renders, especially in chat-heavy usage.

---

### 6. Full App Preview - Expensive JSON Parsing

**File:** `src/components/FullAppPreview.tsx`

**Issue:** `useMemo` correctly caches parsed data, but the dependency `appDataJson` is a string that may reference the same data with different string instances.

```typescript
// Lines 45-52 - Parsing on every new string reference
const appData = useMemo(() => {
  try {
    return JSON.parse(appDataJson) as FullAppData;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}, [appDataJson]);
```

**Recommendation:** Use a stable reference or hash comparison.

```typescript
// IMPROVED - Hash-based comparison
const appDataHash = useMemo(() => {
  // Simple hash for comparison
  let hash = 0;
  for (let i = 0; i < appDataJson.length; i++) {
    hash = ((hash << 5) - hash) + appDataJson.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}, [appDataJson]);

const appData = useMemo(() => {
  try {
    return JSON.parse(appDataJson) as FullAppData;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}, [appDataHash]); // Only re-parse when content actually changes
```

---

### 7. Tree-Sitter Parser - Eager Language Loading

**File:** `src/utils/treeSitterParser.ts`

**Issue:** Good pattern using lazy initialization, but `ensureInitialized()` is called on every parse, adding async overhead.

**Recommendation:** Warm up the parser during app initialization.

```typescript
// In app startup or route initialization
import { getDefaultParser } from '@/utils/treeSitterParser';

// Warm up parser early
getDefaultParser().initialize().catch(console.error);
```

---

### 8. Analytics Logger - Linear Search for Metric Lookup

**File:** `src/utils/analytics.ts`

**Issue:** `findMetric()` uses linear search which becomes slow with 1000 stored metrics.

```typescript
// CURRENT - O(n) lookup
private findMetric(requestId: string): RequestMetrics | undefined {
  return this.metrics.find(m => m.requestId === requestId);
}
```

**Recommendation:** Use a Map for O(1) lookups.

```typescript
// IMPROVED
class AnalyticsLogger {
  private metrics: RequestMetrics[] = [];
  private metricsById: Map<string, RequestMetrics> = new Map();
  
  logRequestStart(routeType: RouteType, requestId: string, metadata?: Record<string, any>): void {
    const metric = { /* ... */ };
    this.metrics.push(metric);
    this.metricsById.set(requestId, metric);
    // ...
  }
  
  private findMetric(requestId: string): RequestMetrics | undefined {
    return this.metricsById.get(requestId); // O(1) instead of O(n)
  }
}
```

**Impact:** ~100x faster metric lookups under load.

---

## 🟢 Low Priority / Quick Wins

### 9. Component Extractor - Regex Compilation

**File:** `src/utils/componentExtractor.ts`

**Issue:** Multiple regexes are recompiled on every function call.

```typescript
// Lines 84-127 - Patterns recreated each call
const jsxBlockPatterns = [
  { pattern: /<div className="[^"]*"[^>]*>[\s\S]{200,}?<\/div>/g, ... },
  // ...
];
```

**Recommendation:** Move patterns to module scope constants.

```typescript
// IMPROVED - Compile once
const JSX_BLOCK_PATTERNS = [
  { pattern: /<div className="[^"]*"[^>]*>[\s\S]{200,}?<\/div>/g, name: 'Section', reason: 'Large div block detected' },
  // ...
] as const;

function findExtractionCandidates(code: string, filePath: string): ExtractionSuggestion[] {
  // Use pre-compiled patterns
  for (const { pattern, name, reason } of JSX_BLOCK_PATTERNS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    // ...
  }
}
```

---

### 10. Export App - Synchronous ZIP Generation

**File:** `src/utils/exportApp.ts`

**Issue:** The `exportAppAsZip()` function blocks while generating the ZIP.

```typescript
// Line 280 - Blocks until complete
return await zip.generateAsync({ type: 'blob' });
```

**Recommendation:** Add progress callback for large exports.

```typescript
// IMPROVED
export async function exportAppAsZip(
  options: ExportOptions,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  // ...
  return await zip.generateAsync(
    { type: 'blob' },
    (metadata) => {
      if (onProgress) {
        onProgress(metadata.percent);
      }
    }
  );
}
```

---

## 📈 Bundle Size Observations

### Large Dependencies

| Package | Est. Size | Notes |
|---------|-----------|-------|
| `@codesandbox/sandpack-react` | ~500KB | Consider lazy loading for preview |
| `tree-sitter` | ~200KB | Server-only, not in client bundle |
| `jszip` | ~100KB | Consider lazy loading for export |

### Recommendations

1. **Lazy load Sandpack**: Only load when preview tab is active
2. **Dynamic imports for JSZip**: Load on-demand when exporting
3. **Tree-shake lucide-react**: Import only used icons

```typescript
// IMPROVED - Lazy load heavy components
const PowerfulPreview = dynamic(() => import('./PowerfulPreview'), {
  loading: () => <div>Loading preview...</div>,
  ssr: false,
});

// IMPROVED - Dynamic import for export
async function handleExport() {
  const { exportAppAsZip } = await import('@/utils/exportApp');
  const blob = await exportAppAsZip(options);
  // ...
}
```

---

## 🔄 API Route Optimizations

### Streaming Response Improvements

**Files:** `src/app/api/ai-builder/modify/route.ts`, `src/app/api/ai-builder/full-app/route.ts`

**Current Pattern:** Collect entire response then process.

```typescript
// CURRENT - Wait for complete response
let responseText = '';
for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    responseText += chunk.delta.text;
  }
}
// Then parse responseText
```

**Recommendation:** Stream partial results to client for perceived speed.

```typescript
// IMPROVED - Stream to client
export async function POST(request: Request) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of aiStream) {
        // Send progress updates to client
        controller.enqueue(encoder.encode(
          JSON.stringify({ type: 'progress', data: chunk }) + '\n'
        ));
      }
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
```

---

## 📋 Implementation Priority

| Priority | Issue | Estimated Effort | Impact |
|----------|-------|------------------|--------|
| 🔴 HIGH | Semantic Memory Indexing | 2 hours | High |
| 🔴 HIGH | AST Single-Pass Traversal | 3 hours | High |
| 🟡 MED | Context Compression Caching | 1 hour | Medium |
| 🟡 MED | Analytics Map Lookup | 30 min | Medium |
| 🟡 MED | useCallback in Chat | 30 min | Low-Medium |
| 🟢 LOW | Regex Pre-compilation | 15 min | Low |
| 🟢 LOW | Bundle Lazy Loading | 2 hours | Medium |

---

## 🧪 Measuring Improvements

Use the existing analytics infrastructure to track improvements:

```typescript
// Track performance before/after changes
import { PerformanceTracker } from '@/utils/analytics';

const tracker = new PerformanceTracker();
// ... operation ...
tracker.checkpoint('operation_complete');
tracker.log('MyOperation');
```

---

## 📚 Next Steps

1. **Implement High Priority items first** - Focus on Semantic Memory and AST optimizations
2. **Measure baseline performance** - Use analytics to capture current metrics
3. **Apply changes incrementally** - One optimization at a time with testing
4. **Re-measure after each change** - Verify improvements with data

---

*This analysis was generated based on static code review. Actual performance impact may vary based on usage patterns.*
