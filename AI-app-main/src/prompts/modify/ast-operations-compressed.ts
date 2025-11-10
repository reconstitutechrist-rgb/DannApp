/**
 * Compressed AST operations reference for modify route
 * Reduced from ~2400 tokens to ~655 tokens (73% reduction)
 */

export const AST_OPERATIONS_COMPRESSED = `
AST OPERATIONS (Structural React Changes):

**When to Use AST vs String Operations:**
- AST: React hooks, JSX structure, className, props, wrapping
- String: Text content, variable names, simple replacements

**Quick Reference:**

AST_ADD_STATE - useState hook
{ "type": "AST_ADD_STATE", "name": "count", "setter": "setCount", "initialValue": "0" }

AST_ADD_USEEFFECT - useEffect hook  
{ "type": "AST_ADD_USEEFFECT", "body": "fetchData();", "dependencies": ["userId"], "cleanup": "abort();" }

AST_ADD_REF - useRef hook
{ "type": "AST_ADD_REF", "name": "inputRef", "initialValue": "null" }

AST_ADD_MEMO - useMemo hook
{ "type": "AST_ADD_MEMO", "name": "filtered", "computation": "items.filter(i => i.active)", "dependencies": ["items"] }

AST_ADD_CALLBACK - useCallback hook
{ "type": "AST_ADD_CALLBACK", "name": "handleClick", "params": ["id"], "body": "select(id);", "dependencies": [] }

AST_ADD_REDUCER - useReducer hook
{ "type": "AST_ADD_REDUCER", "name": "state", "dispatchName": "dispatch", "reducerName": "reducer", 
  "initialState": "{ count: 0 }", "actions": [
    { "type": "INCREMENT", "handler": "return { count: state.count + 1 };" }
  ]}

AST_ADD_IMPORT - Import with deduplication
{ "type": "AST_ADD_IMPORT", "source": "react", "namedImports": ["useState", "useEffect"] }

AST_MODIFY_CLASSNAME - Dynamic classes
{ "type": "AST_MODIFY_CLASSNAME", "targetElement": "div", "staticClasses": ["container"],
  "template": { "variable": "dark", "trueValue": "dark-mode", "operator": "?" }}

AST_INSERT_JSX - Insert JSX reliably
{ "type": "AST_INSERT_JSX", "targetElement": "div", 
  "jsx": "<button onClick={handleClick}>Click</button>", "position": "inside_end" }
Positions: before, after, inside_start, inside_end

AST_MODIFY_PROP - Add/update/remove props
{ "type": "AST_MODIFY_PROP", "targetElement": "button", "propName": "disabled", 
  "propValue": "loading", "action": "add" }

AST_WRAP_ELEMENT - Wrap in component
{ "type": "AST_WRAP_ELEMENT", "targetElement": "div", "wrapperComponent": "AuthGuard",
  "import": { "source": "@/components/AuthGuard", "defaultImport": "AuthGuard" }}

AST_ADD_AUTHENTICATION - Complete auth system (ONE operation)
{ "type": "AST_ADD_AUTHENTICATION", "loginFormStyle": "styled", "includeEmailField": true }
Generates: login form, state, handlers, conditional rendering, logout button

AST_ADD_CONTEXT_PROVIDER - React Context scaffolding
{ "type": "AST_ADD_CONTEXT_PROVIDER", "contextName": "Auth", "initialValue": "{ user: null }",
  "valueType": "{ user: User | null }", "stateVariables": [
    { "name": "user", "initialValue": "null", "type": "User | null" }
  ]}
Generates: Context, Provider, custom hook with error handling

AST_ADD_ZUSTAND_STORE - Zustand store generation
{ "type": "AST_ADD_ZUSTAND_STORE", "storeName": "useAppStore",
  "initialState": { "count": 0 }, "actions": [
    { "name": "increment", "params": [], "body": "({ count: state.count + 1 })" }
  ], "persist": true, "persistKey": "app-store" }
Generates: Complete Zustand store with TypeScript types and optional persistence

AST_EXTRACT_COMPONENT - Extract JSX to new component
{ "type": "AST_EXTRACT_COMPONENT", "targetJSX": "<div>...</div>",
  "componentName": "Card", "propTypes": { "title": "string" }}
Generates: New component file with props interface

**Hook Selection Guide:**
- Simple state? → AST_ADD_STATE
- Side effects? → AST_ADD_USEEFFECT
- DOM ref? → AST_ADD_REF
- Expensive calc? → AST_ADD_MEMO
- Event handler? → AST_ADD_CALLBACK
- Complex state? → AST_ADD_REDUCER
- Global state (Context)? → AST_ADD_CONTEXT_PROVIDER
- Global state (Zustand)? → AST_ADD_ZUSTAND_STORE
- Refactor large component? → AST_EXTRACT_COMPONENT

**Additional Capabilities:**
- Test Generation: Available via /api/generate-tests endpoint
  Analyzes components and generates Jest/Vitest tests automatically
  Includes: rendering, props, events, state, snapshots, accessibility tests
`.trim();
