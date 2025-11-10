import { ASTModifier } from './astModifier';
import type { ImportSpec, WrapperSpec, StateVariableSpec } from './astModifierTypes';

/**
 * AST Operation Types
 * These represent high-level operations that use the AST Modifier
 */
export interface ASTWrapElementOperation {
  type: 'AST_WRAP_ELEMENT';
  targetElement: string;        // JSX element to find (e.g., 'div', 'App')
  wrapperComponent: string;     // Component to wrap with (e.g., 'AuthGuard')
  wrapperProps?: Record<string, string>; // Optional props for wrapper
  import?: {
    source: string;
    defaultImport?: string;
    namedImports?: string[];
    namespaceImport?: string;
  };
}

export interface ASTAddStateOperation {
  type: 'AST_ADD_STATE';
  name: string;           // State variable name (e.g., 'isOpen')
  setter: string;         // Setter function name (e.g., 'setIsOpen')
  initialValue: string;   // Initial value (e.g., 'false', '0', '[]')
}

export interface ASTAddImportOperation {
  type: 'AST_ADD_IMPORT';
  source: string;
  defaultImport?: string;
  namedImports?: string[];
  namespaceImport?: string;
}

export interface ASTModifyClassNameOperation {
  type: 'AST_MODIFY_CLASSNAME';
  targetElement: string;        // JSX element to find
  staticClasses?: string[];     // Static classes to preserve/add
  template?: {
    variable: string;           // Variable name (e.g., 'darkMode')
    trueValue: string;          // Value when true (e.g., 'dark')
    falseValue?: string;        // Value when false (default: '')
    operator?: '?' | '&&';      // Operator to use (default: '?')
  };
  rawTemplate?: string;         // Or raw template string (advanced)
}

export interface ASTInsertJSXOperation {
  type: 'AST_INSERT_JSX';
  targetElement: string;        // JSX element to find
  jsx: string;                  // JSX code to insert
  position: 'before' | 'after' | 'inside_start' | 'inside_end';
}

export interface ASTAddUseEffectOperation {
  type: 'AST_ADD_USEEFFECT';
  body: string;                 // Effect body code
  dependencies?: string[];      // Dependency array
  cleanup?: string;            // Optional cleanup function body
}

export interface ASTModifyPropOperation {
  type: 'AST_MODIFY_PROP';
  targetElement: string;        // JSX element to find
  propName: string;            // Prop name
  propValue?: string;          // New value (undefined = remove)
  action: 'add' | 'update' | 'remove';
}

export interface ASTAddAuthenticationOperation {
  type: 'AST_ADD_AUTHENTICATION';
  loginFormStyle?: 'simple' | 'styled';  // Style of login form
  includeEmailField?: boolean;           // Include email field (default: true)
}

export interface ASTAddRefOperation {
  type: 'AST_ADD_REF';
  name: string;              // Ref variable name (e.g., 'inputRef')
  initialValue: string;      // Initial value (e.g., 'null' or 'undefined')
}

export interface ASTAddMemoOperation {
  type: 'AST_ADD_MEMO';
  name: string;              // Memoized variable name (e.g., 'filteredItems')
  computation: string;       // Computation to memoize (e.g., 'items.filter(i => i.active)')
  dependencies: string[];    // Dependency array (e.g., ['items', 'searchTerm'])
}

export interface ASTAddCallbackOperation {
  type: 'AST_ADD_CALLBACK';
  name: string;              // Callback function name (e.g., 'handleClick')
  params?: string[];         // Parameters (e.g., ['id', 'event'])
  body: string;              // Function body code
  dependencies: string[];    // Dependency array (e.g., ['items', 'setItems'])
}

export interface ASTAddReducerOperation {
  type: 'AST_ADD_REDUCER';
  name: string;              // State variable name (e.g., 'state')
  dispatchName: string;      // Dispatch function name (e.g., 'dispatch')
  reducerName: string;       // Reducer function name (e.g., 'reducer')
  initialState: string;      // Initial state (e.g., '{ count: 0 }')
  actions: Array<{
    type: string;            // Action type (e.g., 'INCREMENT')
    handler: string;         // Handler code (e.g., 'return { ...state, count: state.count + 1 }')
  }>;
}

export interface ASTAddContextProviderOperation {
  type: 'AST_ADD_CONTEXT_PROVIDER';
  contextName: string;       // Context name (e.g., 'AuthContext')
  providerName?: string;     // Provider component name (default: {contextName}Provider)
  hookName?: string;         // Hook name (default: use{contextName})
  initialValue: string;      // Initial context value (e.g., '{ user: null, login: () => {}, logout: () => {} }')
  valueType?: string;        // TypeScript type for context value
  includeState?: boolean;    // Whether to include useState in provider (default: true)
  stateVariables?: Array<{
    name: string;
    initialValue: string;
    type?: string;
  }>;
}

export interface ASTAddZustandStoreOperation {
  type: 'AST_ADD_ZUSTAND_STORE';
  storeName: string;         // Store hook name (e.g., 'useAppStore')
  storeFile?: string;        // File path to create store in (e.g., 'src/store/appStore.ts')
  initialState: Record<string, any>; // Initial state object
  actions?: Array<{
    name: string;            // Action name (e.g., 'increment')
    params?: Array<{name: string; type?: string}>;
    body: string;            // Action implementation
  }>;
  persist?: boolean;         // Use zustand persist middleware (default: false)
  persistKey?: string;       // LocalStorage key for persistence
}

export interface ASTExtractComponentOperation {
  type: 'AST_EXTRACT_COMPONENT';
  targetJSX: string;         // JSX code to extract or element selector
  componentName: string;     // New component name
  componentFile?: string;    // File to create component in (default: same directory)
  extractProps?: boolean;    // Auto-detect and extract props (default: true)
  propTypes?: Record<string, string>; // Explicit prop types
}

export type ASTOperation =
  | ASTWrapElementOperation
  | ASTAddStateOperation
  | ASTAddImportOperation
  | ASTModifyClassNameOperation
  | ASTInsertJSXOperation
  | ASTAddUseEffectOperation
  | ASTModifyPropOperation
  | ASTAddAuthenticationOperation
  | ASTAddRefOperation
  | ASTAddMemoOperation
  | ASTAddCallbackOperation
  | ASTAddReducerOperation
  | ASTAddContextProviderOperation
  | ASTAddZustandStoreOperation
  | ASTExtractComponentOperation;

/**
 * Result of executing an AST operation
 */
export interface ASTExecutionResult {
  success: boolean;
  code?: string;
  errors?: string[];
  operation?: string; // Description of what was done
}

/**
 * Execute a single AST operation on code
 * 
 * @param code - The source code to modify
 * @param operation - The AST operation to perform
 * @returns Result with modified code or errors
 */
export async function executeASTOperation(
  code: string,
  operation: ASTOperation
): Promise<ASTExecutionResult> {
  try {
    // Initialize AST Modifier
    const modifier = new ASTModifier(code);
    await modifier.initialize();
    
    const tree = modifier.getTree();
    const parser = modifier.getParser();
    
    // Execute operation based on type
    switch (operation.type) {
      case 'AST_WRAP_ELEMENT': {
        // Find the target JSX element
        const element = parser.findComponent(tree, operation.targetElement);
        
        if (!element) {
          return {
            success: false,
            errors: [`Could not find JSX element: ${operation.targetElement}`]
          };
        }
        
        // Build wrapper spec
        const wrapperSpec: WrapperSpec = {
          component: operation.wrapperComponent,
          props: operation.wrapperProps
        };
        
        // Add import if specified
        if (operation.import) {
          wrapperSpec.import = {
            source: operation.import.source,
            defaultImport: operation.import.defaultImport,
            namedImports: operation.import.namedImports,
            namespaceImport: operation.import.namespaceImport
          };
        }
        
        // Apply wrapper
        modifier.wrapElement(element, wrapperSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Wrapped ${operation.targetElement} in ${operation.wrapperComponent}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_STATE': {
        // Build state variable spec
        const stateSpec: StateVariableSpec = {
          name: operation.name,
          setter: operation.setter,
          initialValue: operation.initialValue
        };
        
        // Add state variable
        modifier.addStateVariable(stateSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Added state variable: ${operation.name}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_IMPORT': {
        // Build import spec
        const importSpec: ImportSpec = {
          source: operation.source,
          defaultImport: operation.defaultImport,
          namedImports: operation.namedImports,
          namespaceImport: operation.namespaceImport
        };
        
        // Add import
        modifier.addImport(importSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Added import from ${operation.source}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_MODIFY_CLASSNAME': {
        // Find the target JSX element
        const element = parser.findComponent(tree, operation.targetElement);
        
        if (!element) {
          return {
            success: false,
            errors: [`Could not find JSX element: ${operation.targetElement}`]
          };
        }
        
        // Build className spec
        const classNameSpec = {
          staticClasses: operation.staticClasses,
          template: operation.template,
          rawTemplate: operation.rawTemplate
        };
        
        // Apply className modification
        modifier.modifyClassName(element, classNameSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Modified className on ${operation.targetElement}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_INSERT_JSX': {
        // Find the target JSX element
        const element = parser.findComponent(tree, operation.targetElement);
        
        if (!element) {
          return {
            success: false,
            errors: [`Could not find JSX element: ${operation.targetElement}`]
          };
        }
        
        // Build insert spec
        const insertSpec = {
          jsx: operation.jsx,
          position: operation.position
        };
        
        // Apply JSX insertion
        modifier.insertJSX(element, insertSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Inserted JSX ${operation.position} ${operation.targetElement}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_USEEFFECT': {
        // Build useEffect spec
        const effectSpec = {
          body: operation.body,
          dependencies: operation.dependencies,
          cleanup: operation.cleanup
        };
        
        // Add useEffect
        modifier.addUseEffect(effectSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: 'Added useEffect hook'
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_MODIFY_PROP': {
        // Find the target JSX element
        const element = parser.findComponent(tree, operation.targetElement);
        
        if (!element) {
          return {
            success: false,
            errors: [`Could not find JSX element: ${operation.targetElement}`]
          };
        }
        
        // Build prop spec
        const propSpec = {
          name: operation.propName,
          value: operation.propValue,
          action: operation.action
        };
        
        // Apply prop modification
        modifier.modifyProp(element, propSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Modified prop ${operation.propName} on ${operation.targetElement}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_REF': {
        // Build ref spec
        const refSpec = {
          name: operation.name,
          initialValue: operation.initialValue
        };
        
        // Add ref
        modifier.addRef(refSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Added ref variable: ${operation.name}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_MEMO': {
        // Build memo spec
        const memoSpec = {
          name: operation.name,
          computation: operation.computation,
          dependencies: operation.dependencies
        };
        
        // Add memo
        modifier.addMemo(memoSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Added memoized variable: ${operation.name}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_CALLBACK': {
        // Build callback spec
        const callbackSpec = {
          name: operation.name,
          params: operation.params,
          body: operation.body,
          dependencies: operation.dependencies
        };
        
        // Add callback
        modifier.addCallback(callbackSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Added callback function: ${operation.name}`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_REDUCER': {
        // Build reducer spec
        const reducerSpec = {
          name: operation.name,
          dispatchName: operation.dispatchName,
          reducerName: operation.reducerName,
          initialState: operation.initialState,
          actions: operation.actions
        };
        
        // Add reducer
        modifier.addReducer(reducerSpec);
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: `Added useReducer with ${operation.actions.length} actions`
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }
      
      case 'AST_ADD_AUTHENTICATION': {
        // Composed operation that adds complete authentication
        const includeEmail = operation.includeEmailField !== false;
        const style = operation.loginFormStyle || 'styled';
        
        // Step 1: Add state for authentication
        modifier.addStateVariable({
          name: 'isLoggedIn',
          setter: 'setIsLoggedIn',
          initialValue: 'false'
        });
        
        // Step 2: Add state for credentials (if email included)
        if (includeEmail) {
          modifier.addStateVariable({
            name: 'email',
            setter: 'setEmail',
            initialValue: "''"
          });
        }
        
        modifier.addStateVariable({
          name: 'password',
          setter: 'setPassword',
          initialValue: "''"
        });
        
        // Step 3: Add login handler function
        const loginBody = includeEmail
          ? `if (email && password) {\n      setIsLoggedIn(true);\n    }`
          : `if (password) {\n      setIsLoggedIn(true);\n    }`;
        
        modifier.addFunction({
          name: 'handleLogin',
          params: ['e'],
          body: `e.preventDefault();\n    ${loginBody}`,
          isArrow: true
        });
        
        // Step 4: Add logout handler function
        modifier.addFunction({
          name: 'handleLogout',
          params: [],
          body: `setIsLoggedIn(false);\n    ${includeEmail ? 'setEmail(\'\');\n    ' : ''}setPassword('');`,
          isArrow: true
        });
        
        // Step 5: Build login form JSX based on style
        let loginFormJSX: string;
        if (style === 'simple') {
          loginFormJSX = `<div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          ${includeEmail ? '<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />' : ''}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>`;
        } else {
          // Styled form
          loginFormJSX = `<div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            ${includeEmail ? '<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />' : ''}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">Login</button>
          </form>
        </div>
      </div>`;
        }
        
        // Step 6: Wrap existing return in conditional
        modifier.wrapInConditional({
          condition: 'isLoggedIn',
          type: 'if-return',
          fallback: loginFormJSX
        });
        
        // Step 7: Find the main return element and add logout button
        // This will be inside the authenticated section
        const mainElement = parser.findDefaultExportedFunction(tree);
        if (mainElement) {
          // Find the return statement and its JSX
          for (const child of mainElement.children) {
            if (child.type === 'statement_block') {
              for (const stmt of child.children) {
                if (stmt.type === 'return_statement') {
                  // Find the JSX element being returned
                  for (const returnChild of stmt.children) {
                    if (returnChild.type === 'jsx_element' || returnChild.type === 'jsx_fragment') {
                      // Insert logout button at the start of this element
                      const logoutButton = style === 'simple'
                        ? '<button onClick={handleLogout}>Logout</button>'
                        : '<button onClick={handleLogout} className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>';
                      
                      modifier.insertJSX(returnChild, {
                        jsx: logoutButton,
                        position: 'inside_start'
                      });
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
        }
        
        // Generate modified code
        const result = await modifier.generate();
        
        if (result.success) {
          return {
            success: true,
            code: result.code,
            operation: 'Added authentication system with login/logout'
          };
        } else {
          return {
            success: false,
            errors: result.errors
          };
        }
      }

      case 'AST_ADD_CONTEXT_PROVIDER': {
        // Generate Context Provider code
        const contextName = operation.contextName;
        const providerName = operation.providerName || `${contextName}Provider`;
        const hookName = operation.hookName || `use${contextName}`;
        const includeState = operation.includeState !== false;

        // Build context file content
        let contextCode = `import React, { createContext, useContext, useState, ReactNode } from 'react';\n\n`;

        // Add TypeScript type if specified
        if (operation.valueType) {
          contextCode += `type ${contextName}Value = ${operation.valueType};\n\n`;
        }

        // Create context
        contextCode += `const ${contextName} = createContext<${operation.valueType || 'any'}>(${operation.initialValue});\n\n`;

        // Create provider component
        contextCode += `export function ${providerName}({ children }: { children: ReactNode }) {\n`;

        // Add state variables if specified
        if (includeState && operation.stateVariables) {
          for (const stateVar of operation.stateVariables) {
            contextCode += `  const [${stateVar.name}, set${stateVar.name.charAt(0).toUpperCase() + stateVar.name.slice(1)}] = useState${stateVar.type ? `<${stateVar.type}>` : ''}(${stateVar.initialValue});\n`;
          }
          contextCode += `\n`;
        }

        // Build context value
        const  valueParts: string[] = [];
        if (operation.stateVariables) {
          for (const stateVar of operation.stateVariables) {
            valueParts.push(`${stateVar.name}`);
            valueParts.push(`set${stateVar.name.charAt(0).toUpperCase() + stateVar.name.slice(1)}`);
          }
        }

        const valueStr = valueParts.length > 0
          ? `{ ${valueParts.join(', ')} }`
          : operation.initialValue;

        contextCode += `  const value = ${valueStr};\n\n`;
        contextCode += `  return (\n`;
        contextCode += `    <${contextName}.Provider value={value}>\n`;
        contextCode += `      {children}\n`;
        contextCode += `    </${contextName}.Provider>\n`;
        contextCode += `  );\n`;
        contextCode += `}\n\n`;

        // Create hook
        contextCode += `export function ${hookName}() {\n`;
        contextCode += `  const context = useContext(${contextName});\n`;
        contextCode += `  if (context === undefined) {\n`;
        contextCode += `    throw new Error('${hookName} must be used within a ${providerName}');\n`;
        contextCode += `  }\n`;
        contextCode += `  return context;\n`;
        contextCode += `}\n`;

        return {
          success: true,
          code: contextCode,
          operation: `Created Context Provider: ${contextName}`
        };
      }

      case 'AST_ADD_ZUSTAND_STORE': {
        // Generate Zustand store code
        const storeName = operation.storeName;
        const persist = operation.persist || false;

        let storeCode = `import { create } from 'zustand';\n`;

        if (persist) {
          storeCode += `import { persist } from 'zustand/middleware';\n`;
        }

        storeCode += `\n`;

        // Build state interface
        const stateKeys = Object.keys(operation.initialState);
        const actionNames = (operation.actions || []).map(a => a.name);

        storeCode += `interface StoreState {\n`;
        // Add state properties
        for (const [key, value] of Object.entries(operation.initialState)) {
          const type = typeof value === 'string' ? 'string'
                     : typeof value === 'number' ? 'number'
                     : typeof value === 'boolean' ? 'boolean'
                     : Array.isArray(value) ? 'any[]'
                     : 'any';
          storeCode += `  ${key}: ${type};\n`;
        }
        // Add action methods
        if (operation.actions) {
          for (const action of operation.actions) {
            const params = action.params || [];
            const paramStr = params.map(p => `${p.name}: ${p.type || 'any'}`).join(', ');
            storeCode += `  ${action.name}: (${paramStr}) => void;\n`;
          }
        }
        storeCode += `}\n\n`;

        // Create store
        if (persist) {
          storeCode += `export const ${storeName} = create<StoreState>()(persist(\n`;
          storeCode += `  (set) => ({\n`;
        } else {
          storeCode += `export const ${storeName} = create<StoreState>((set) => ({\n`;
        }

        // Add initial state
        for (const [key, value] of Object.entries(operation.initialState)) {
          const valueStr = JSON.stringify(value);
          storeCode += `  ${key}: ${valueStr},\n`;
        }

        storeCode += `\n`;

        // Add actions
        if (operation.actions) {
          for (const action of operation.actions) {
            const params = action.params || [];
            const paramStr = params.map(p => p.name).join(', ');
            storeCode += `  ${action.name}: (${params.map(p => `${p.name}: ${p.type || 'any'}`).join(', ')}) => set((state) => ${action.body}),\n`;
          }
        }

        if (persist) {
          storeCode += `}),\n`;
          storeCode += `  {\n`;
          storeCode += `    name: '${operation.persistKey || storeName + '-storage'}',\n`;
          storeCode += `  }\n`;
          storeCode += `));\n`;
        } else {
          storeCode += `}));\n`;
        }

        return {
          success: true,
          code: storeCode,
          operation: `Created Zustand store: ${storeName}`
        };
      }

      case 'AST_EXTRACT_COMPONENT': {
        // Extract component from JSX
        const componentName = operation.componentName;
        const extractProps = operation.extractProps !== false;

        // For now, generate a basic extracted component template
        // In a real implementation, this would parse the targetJSX and extract variables
        let componentCode = `import React from 'react';\n\n`;

        // Add prop types if specified
        if (operation.propTypes && Object.keys(operation.propTypes).length > 0) {
          componentCode += `interface ${componentName}Props {\n`;
          for (const [propName, propType] of Object.entries(operation.propTypes)) {
            componentCode += `  ${propName}: ${propType};\n`;
          }
          componentCode += `}\n\n`;

          componentCode += `export function ${componentName}(props: ${componentName}Props) {\n`;
        } else {
          componentCode += `export function ${componentName}() {\n`;
        }

        componentCode += `  return (\n`;
        componentCode += `    ${operation.targetJSX}\n`;
        componentCode += `  );\n`;
        componentCode += `}\n`;

        return {
          success: true,
          code: componentCode,
          operation: `Extracted component: ${componentName}`
        };
      }

      default:
        return {
          success: false,
          errors: [`Unknown AST operation type: ${(operation as any).type}`]
        };
    }
    
  } catch (error) {
    return {
      success: false,
      errors: [
        'AST operation failed',
        error instanceof Error ? error.message : String(error)
      ]
    };
  }
}

/**
 * Execute multiple AST operations in sequence
 * 
 * @param code - The source code to modify
 * @param operations - Array of AST operations to perform
 * @returns Result with final modified code or errors
 */
export async function executeASTOperations(
  code: string,
  operations: ASTOperation[]
): Promise<ASTExecutionResult> {
  let currentCode = code;
  const appliedOperations: string[] = [];
  
  for (const operation of operations) {
    const result = await executeASTOperation(currentCode, operation);
    
    if (!result.success) {
      return {
        success: false,
        errors: [
          `Failed after ${appliedOperations.length} operations`,
          ...(result.errors || [])
        ]
      };
    }
    
    currentCode = result.code!;
    if (result.operation) {
      appliedOperations.push(result.operation);
    }
  }
  
  return {
    success: true,
    code: currentCode,
    operation: appliedOperations.join('; ')
  };
}

/**
 * Check if an operation is an AST operation
 */
export function isASTOperation(operation: any): operation is ASTOperation {
  return operation && typeof operation.type === 'string' && operation.type.startsWith('AST_');
}
