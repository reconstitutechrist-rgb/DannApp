/**
 * Unit Tests for Code Validator
 * 
 * Tests all validation functions and auto-fix capabilities
 */

import {
  hasNestedFunctionDeclarations,
  hasBalancedJSXTags,
  hasTypeScriptInJSX,
  hasUnclosedStrings,
  validateGeneratedCode,
  autoFixCode,
  ValidationError,
} from '../src/utils/codeValidator';

describe('Code Validator - hasNestedFunctionDeclarations', () => {
  test('should detect nested function declaration', () => {
    const code = `
      function App() {
        function Helper() {
          return <div>Test</div>;
        }
        return <div><Helper /></div>;
      }
    `;
    const errors = hasNestedFunctionDeclarations(code);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('NESTED_FUNCTION');
    expect(errors[0].message).toContain('Helper');
    expect(errors[0].message).toContain('App');
  });

  test('should NOT detect arrow function inside function (valid)', () => {
    const code = `
      function App() {
        const Helper = () => {
          return <div>Test</div>;
        };
        return <div><Helper /></div>;
      }
    `;
    const errors = hasNestedFunctionDeclarations(code);
    expect(errors).toHaveLength(0);
  });

  test('should NOT detect function declared before export', () => {
    const code = `
      function Helper() {
        return <div>Test</div>;
      }
      
      export default function App() {
        return <div><Helper /></div>;
      }
    `;
    const errors = hasNestedFunctionDeclarations(code);
    expect(errors).toHaveLength(0);
  });

  test('should detect multiple nested functions', () => {
    const code = `
      export default function App() {
        function Helper1() {
          return <div>Test</div>;
        }
        function Helper2() {
          return <span>Test</span>;
        }
        return <div><Helper1 /><Helper2 /></div>;
      }
    `;
    const errors = hasNestedFunctionDeclarations(code);
    expect(errors).toHaveLength(2);
  });

  test('should ignore function keyword in comments', () => {
    const code = `
      // This function does something
      function App() {
        // function Helper() would be nested
        return <div>Test</div>;
      }
    `;
    const errors = hasNestedFunctionDeclarations(code);
    expect(errors).toHaveLength(0);
  });

  test('should ignore function keyword in strings', () => {
    const code = `
      function App() {
        const message = "function Helper() {}";
        return <div>{message}</div>;
      }
    `;
    const errors = hasNestedFunctionDeclarations(code);
    expect(errors).toHaveLength(0);
  });
});

describe('Code Validator - hasBalancedJSXTags', () => {
  test('should detect unclosed JSX tag', () => {
    const code = `
      export default function App() {
        return (
          <div>
            <span>Hello
          </div>
        );
      }
    `;
    const errors = hasBalancedJSXTags(code);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should detect mismatched JSX tags', () => {
    const code = `
      export default function App() {
        return (
          <div>
            <span>Hello</div>
          </span>
        );
      }
    `;
    const errors = hasBalancedJSXTags(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('UNBALANCED_JSX');
  });

  test('should NOT flag balanced JSX', () => {
    const code = `
      export default function App() {
        return (
          <div>
            <span>Hello</span>
          </div>
        );
      }
    `;
    const errors = hasBalancedJSXTags(code);
    expect(errors).toHaveLength(0);
  });

  test('should handle self-closing tags correctly', () => {
    const code = `
      export default function App() {
        return (
          <div>
            <img src="test.png" />
            <br />
          </div>
        );
      }
    `;
    const errors = hasBalancedJSXTags(code);
    expect(errors).toHaveLength(0);
  });
});

describe('Code Validator - hasTypeScriptInJSX', () => {
  test('should detect interface in .jsx file', () => {
    const code = `
      interface Props {
        name: string;
      }
      
      export default function App(props: Props) {
        return <div>Test</div>;
      }
    `;
    const errors = hasTypeScriptInJSX(code, 'src/App.jsx');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('TYPESCRIPT_IN_JSX');
  });

  test('should NOT detect TypeScript in .tsx file', () => {
    const code = `
      interface Props {
        name: string;
      }
      
      export default function App(props: Props) {
        return <div>Test</div>;
      }
    `;
    const errors = hasTypeScriptInJSX(code, 'src/App.tsx');
    expect(errors).toHaveLength(0);
  });

  test('should detect type alias in .jsx file', () => {
    const code = `
      type Status = 'active' | 'inactive';
      
      export default function App() {
        const status: Status = 'active';
        return <div>{status}</div>;
      }
    `;
    const errors = hasTypeScriptInJSX(code, 'src/App.jsx');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should detect type annotations in .js file', () => {
    const code = `
      function greet(name: string) {
        return "Hello " + name;
      }
    `;
    const errors = hasTypeScriptInJSX(code, 'src/utils.js');
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('Code Validator - hasUnclosedStrings', () => {
  test('should detect unclosed double quote', () => {
    const code = `
      const message = "Hello World;
      console.log(message);
    `;
    const errors = hasUnclosedStrings(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('UNCLOSED_STRING');
    expect(errors[0].message).toContain('double');
  });

  test('should detect unclosed single quote', () => {
    const code = `
      const message = 'Hello World;
      console.log(message);
    `;
    const errors = hasUnclosedStrings(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('UNCLOSED_STRING');
    expect(errors[0].message).toContain('single');
  });

  test('should detect unclosed template literal', () => {
    const code = `
      const message = \`Hello World;
      console.log(message);
    `;
    const errors = hasUnclosedStrings(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('UNCLOSED_STRING');
    expect(errors[0].message).toContain('template');
  });

  test('should NOT flag properly closed strings', () => {
    const code = `
      const msg1 = "Hello";
      const msg2 = 'World';
      const msg3 = \`Test\`;
    `;
    const errors = hasUnclosedStrings(code);
    expect(errors).toHaveLength(0);
  });
});

describe('Code Validator - validateGeneratedCode', () => {
  test('should return valid for clean code', () => {
    const code = `
      export default function App() {
        return <div>Hello World</div>;
      }
    `;
    const result = validateGeneratedCode(code, 'src/App.tsx');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should return invalid with multiple error types', () => {
    const code = `
      function App() {
        function Helper() {}
        const msg = "unclosed string;
        return <div><span>test</div></span>;
      }
    `;
    const result = validateGeneratedCode(code, 'src/App.tsx');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('Code Validator - autoFixCode', () => {
  test('should auto-fix unclosed double quote', () => {
    const code = `const msg = "Hello;`;
    const errors: ValidationError[] = [{
      type: 'UNCLOSED_STRING',
      message: 'Unclosed double-quoted string',
      line: 1,
      severity: 'error'
    }];
    const fixed = autoFixCode(code, errors);
    expect(fixed).toContain('"Hello"');
  });

  test('should auto-fix unclosed single quote', () => {
    const code = `const msg = 'Hello;`;
    const errors: ValidationError[] = [{
      type: 'UNCLOSED_STRING',
      message: 'Unclosed single-quoted string',
      line: 1,
      severity: 'error'
    }];
    const fixed = autoFixCode(code, errors);
    expect(fixed).toContain("'Hello'");
  });

  test('should return unchanged code when no fix available', () => {
    const code = `function App() { function Helper() {} }`;
    const errors: ValidationError[] = [{
      type: 'NESTED_FUNCTION',
      message: 'Nested function',
      line: 1,
      severity: 'error'
    }];
    const fixed = autoFixCode(code, errors);
    expect(fixed).toBe(code);
  });
});

// Run tests
if (require.main === module) {
  console.log('Running code validator tests...');
}
