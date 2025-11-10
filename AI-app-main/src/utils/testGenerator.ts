/**
 * Test Generator - Automatically generates unit tests for React components
 *
 * Features:
 * - Analyzes component structure
 * - Generates Jest/Vitest tests
 * - Tests rendering, props, events, and state
 * - Supports both Jest and Vitest
 *
 * @version 1.0.0
 */

export type TestFramework = 'jest' | 'vitest';

export interface ComponentAnalysis {
  name: string;
  filePath: string;
  hasProps: boolean;
  propNames: string[];
  hasState: boolean;
  stateVariables: string[];
  hasEffects: boolean;
  hasEventHandlers: boolean;
  eventHandlers: string[];
  imports: string[];
  dependencies: string[];
}

export interface TestConfiguration {
  framework: TestFramework;
  includeSnapshots: boolean;
  includeAccessibility: boolean;
  includeIntegration: boolean;
  testLibrary: 'react-testing-library' | 'enzyme';
}

/**
 * Analyze a React component to determine what tests to generate
 */
export function analyzeComponent(code: string, filePath: string): ComponentAnalysis {
  const componentName = extractComponentName(code, filePath);

  return {
    name: componentName,
    filePath,
    hasProps: /\(.*props.*\)|interface.*Props/.test(code),
    propNames: extractPropNames(code),
    hasState: /useState|useReducer/.test(code),
    stateVariables: extractStateVariables(code),
    hasEffects: /useEffect/.test(code),
    hasEventHandlers: /onClick|onChange|onSubmit|on[A-Z]\w+/.test(code),
    eventHandlers: extractEventHandlers(code),
    imports: extractImports(code),
    dependencies: extractDependencies(code)
  };
}

/**
 * Extract component name from code or file path
 */
function extractComponentName(code: string, filePath: string): string {
  // Try to find export default function/const
  const exportMatch = code.match(/export\s+default\s+(?:function\s+)?(\w+)/);
  if (exportMatch) return exportMatch[1];

  // Try to find export function
  const funcMatch = code.match(/export\s+function\s+(\w+)/);
  if (funcMatch) return funcMatch[1];

  // Fall back to file name
  const fileName = filePath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '');
  return fileName || 'Component';
}

/**
 * Extract prop names from component
 */
function extractPropNames(code: string): string[] {
  const props: Set<string> = new Set();

  // Extract from interface
  const interfaceMatch = code.match(/interface\s+\w+Props\s*\{([^}]+)\}/);
  if (interfaceMatch) {
    const propsBlock = interfaceMatch[1];
    const propMatches = propsBlock.matchAll(/(\w+)[?:]:/g);
    for (const match of propMatches) {
      props.add(match[1]);
    }
  }

  // Extract from destructuring
  const destructureMatch = code.match(/\(\s*\{([^}]+)\}\s*\)/);
  if (destructureMatch) {
    const propsStr = destructureMatch[1];
    const propNames = propsStr.split(',').map(p => p.trim().split(':')[0].trim());
    propNames.forEach(p => props.add(p));
  }

  return Array.from(props);
}

/**
 * Extract state variables
 */
function extractStateVariables(code: string): string[] {
  const states: string[] = [];
  const stateMatches = code.matchAll(/const\s+\[(\w+),\s*set\w+\]\s*=\s*useState/g);

  for (const match of stateMatches) {
    states.push(match[1]);
  }

  return states;
}

/**
 * Extract event handlers
 */
function extractEventHandlers(code: string): string[] {
  const handlers: Set<string> = new Set();

  // Find onClick, onChange, etc.
  const handlerMatches = code.matchAll(/(on[A-Z]\w+)=/g);
  for (const match of handlerMatches) {
    handlers.add(match[1]);
  }

  return Array.from(handlers);
}

/**
 * Extract imports
 */
function extractImports(code: string): string[] {
  const imports: string[] = [];
  const importMatches = code.matchAll(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g);

  for (const match of importMatches) {
    imports.push(match[1]);
  }

  return imports;
}

/**
 * Extract dependencies (external libraries)
 */
function extractDependencies(code: string): string[] {
  const deps: Set<string> = new Set();
  const imports = extractImports(code);

  for (const imp of imports) {
    // External packages (not relative imports)
    if (!imp.startsWith('.') && !imp.startsWith('/')) {
      const packageName = imp.split('/')[0];
      deps.add(packageName);
    }
  }

  return Array.from(deps);
}

/**
 * Generate test file content
 */
export function generateTests(
  analysis: ComponentAnalysis,
  config: TestConfiguration
): string {
  const { framework, includeSnapshots, includeAccessibility, testLibrary } = config;

  let testCode = '';

  // Imports
  testCode += generateTestImports(analysis, framework, testLibrary);
  testCode += '\n';

  // Test suite
  testCode += `describe('${analysis.name}', () => {\n`;

  // Basic rendering test
  testCode += generateRenderTest(analysis, testLibrary);

  // Prop tests
  if (analysis.hasProps && analysis.propNames.length > 0) {
    testCode += generatePropTests(analysis, testLibrary);
  }

  // Event handler tests
  if (analysis.hasEventHandlers && analysis.eventHandlers.length > 0) {
    testCode += generateEventHandlerTests(analysis, testLibrary);
  }

  // State tests
  if (analysis.hasState && analysis.stateVariables.length > 0) {
    testCode += generateStateTests(analysis, testLibrary);
  }

  // Snapshot test
  if (includeSnapshots) {
    testCode += generateSnapshotTest(analysis, testLibrary);
  }

  // Accessibility test
  if (includeAccessibility) {
    testCode += generateAccessibilityTest(analysis, testLibrary);
  }

  testCode += '});\n';

  return testCode;
}

/**
 * Generate test imports
 */
function generateTestImports(
  analysis: ComponentAnalysis,
  framework: TestFramework,
  testLibrary: string
): string {
  let imports = '';

  if (framework === 'vitest') {
    imports += `import { describe, it, expect, vi } from 'vitest';\n`;
  } else {
    imports += `import { describe, it, expect, jest } from '@jest/globals';\n`;
  }

  if (testLibrary === 'react-testing-library') {
    imports += `import { render, screen, fireEvent, waitFor } from '@testing-library/react';\n`;
    imports += `import '@testing-library/jest-dom';\n`;
  }

  // Import component
  const importPath = analysis.filePath.replace(/\.(tsx?|jsx?)$/, '');
  imports += `import ${analysis.name} from '${importPath}';\n`;

  return imports;
}

/**
 * Generate basic render test
 */
function generateRenderTest(analysis: ComponentAnalysis, testLibrary: string): string {
  return `
  it('renders without crashing', () => {
    const { container } = render(<${analysis.name} />);
    expect(container).toBeInTheDocument();
  });
\n`;
}

/**
 * Generate prop tests
 */
function generatePropTests(analysis: ComponentAnalysis, testLibrary: string): string {
  let tests = `
  describe('Props', () => {\n`;

  for (const prop of analysis.propNames.slice(0, 3)) {
    const testValue = getTestValueForProp(prop);
    tests += `    it('renders with ${prop} prop', () => {
      render(<${analysis.name} ${prop}={${testValue}} />);
      expect(screen.getByRole('complementary')).toBeInTheDocument();
    });
\n`;
  }

  tests += `  });\n`;
  return tests;
}

/**
 * Generate event handler tests
 */
function generateEventHandlerTests(analysis: ComponentAnalysis, testLibrary: string): string {
  let tests = `
  describe('Event Handlers', () => {\n`;

  for (const handler of analysis.eventHandlers.slice(0, 3)) {
    const mockFn = handler.replace('on', 'handle');
    tests += `    it('calls ${handler} when triggered', () => {
      const ${mockFn} = vi ? vi.fn() : jest.fn();
      render(<${analysis.name} ${handler}={${mockFn}} />);

      const element = screen.getByRole('button');
      fireEvent.click(element);

      expect(${mockFn}).toHaveBeenCalled();
    });
\n`;
  }

  tests += `  });\n`;
  return tests;
}

/**
 * Generate state tests
 */
function generateStateTests(analysis: ComponentAnalysis, testLibrary: string): string {
  let tests = `
  describe('State Management', () => {\n`;

  for (const stateVar of analysis.stateVariables.slice(0, 2)) {
    tests += `    it('manages ${stateVar} state', () => {
      render(<${analysis.name} />);
      // Add state-specific assertions here
      expect(screen.getByRole('complementary')).toBeInTheDocument();
    });
\n`;
  }

  tests += `  });\n`;
  return tests;
}

/**
 * Generate snapshot test
 */
function generateSnapshotTest(analysis: ComponentAnalysis, testLibrary: string): string {
  return `
  it('matches snapshot', () => {
    const { container } = render(<${analysis.name} />);
    expect(container).toMatchSnapshot();
  });
\n`;
}

/**
 * Generate accessibility test
 */
function generateAccessibilityTest(analysis: ComponentAnalysis, testLibrary: string): string {
  return `
  it('has no accessibility violations', async () => {
    const { container } = render(<${analysis.name} />);
    // You can use jest-axe or similar library here
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
    expect(container).toBeInTheDocument();
  });
\n`;
}

/**
 * Get test value for a prop based on its name
 */
function getTestValueForProp(propName: string): string {
  const lowerName = propName.toLowerCase();

  if (lowerName.includes('title') || lowerName.includes('name') || lowerName.includes('label')) {
    return '"Test Title"';
  }
  if (lowerName.includes('count') || lowerName.includes('number') || lowerName.includes('index')) {
    return '42';
  }
  if (lowerName.includes('is') || lowerName.includes('has') || lowerName.includes('show')) {
    return 'true';
  }
  if (lowerName.includes('items') || lowerName.includes('data') || lowerName.includes('list')) {
    return '[]';
  }
  if (lowerName.includes('callback') || lowerName.includes('handler') || lowerName.includes('on')) {
    return '() => {}';
  }

  return '{}';
}

/**
 * Generate test configuration file (jest.config.js or vitest.config.ts)
 */
export function generateTestConfig(framework: TestFramework): string {
  if (framework === 'vitest') {
    return `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;
  } else {
    return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
`;
  }
}

/**
 * Generate test setup file
 */
export function generateTestSetup(framework: TestFramework): string {
  if (framework === 'vitest') {
    return `import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
`;
  } else {
    return `import '@testing-library/jest-dom';

// Global test setup
beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  // Cleanup after all tests
});
`;
  }
}

/**
 * Generate package.json scripts for testing
 */
export function generateTestScripts(framework: TestFramework): Record<string, string> {
  if (framework === 'vitest') {
    return {
      test: 'vitest',
      'test:ui': 'vitest --ui',
      'test:coverage': 'vitest --coverage',
    };
  } else {
    return {
      test: 'jest',
      'test:watch': 'jest --watch',
      'test:coverage': 'jest --coverage',
    };
  }
}

/**
 * Get required dependencies for testing
 */
export function getTestDependencies(framework: TestFramework): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const base = {
    dependencies: {},
    devDependencies: {
      '@testing-library/react': '^14.0.0',
      '@testing-library/jest-dom': '^6.1.0',
      '@testing-library/user-event': '^14.5.0',
    },
  };

  if (framework === 'vitest') {
    base.devDependencies = {
      ...base.devDependencies,
      vitest: '^1.0.0',
      '@vitest/ui': '^1.0.0',
      '@vitejs/plugin-react': '^4.2.0',
      'jsdom': '^23.0.0',
      '@vitest/coverage-v8': '^1.0.0',
    };
  } else {
    base.devDependencies = {
      ...base.devDependencies,
      jest: '^29.7.0',
      '@jest/globals': '^29.7.0',
      'ts-jest': '^29.1.0',
      '@types/jest': '^29.5.0',
      'jest-environment-jsdom': '^29.7.0',
      'identity-obj-proxy': '^3.0.0',
    };
  }

  return base;
}
