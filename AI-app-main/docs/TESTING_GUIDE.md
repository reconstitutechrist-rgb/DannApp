# 🧪 Testing Guide

Comprehensive guide to testing DannApp's AI App Builder.

---

## 📋 Overview

DannApp includes a robust testing infrastructure to ensure code quality and reliability. This guide covers how to run tests, understand test results, and contribute new tests.

---

## 🚀 Quick Start

### Running All Tests

```bash
# Run all tests
npm test

# Run all tests including integration tests
npm run test:all
```

### Running Specific Test Suites

```bash
# Run code validator tests only
npm run test:validator

# Run retry logic tests only
npm run test:retry

# Run integration tests only
npm run test:integration
```

---

## 🏗️ Test Infrastructure

### Test Framework

**Jest** - JavaScript testing framework
- Fast and reliable
- Great mocking capabilities
- Snapshot testing
- Code coverage reports

**ts-jest** - TypeScript support for Jest
- Type checking in tests
- Import path resolution
- TSX/JSX support

**tsx** - TypeScript execution
- Run TypeScript tests directly
- No build step required
- Fast execution

### Test Structure

```
AI-app-main/
├── tests/
│   ├── __mocks__/           # Mock implementations
│   │   └── @anthropic-ai/
│   │       └── sdk.ts       # Anthropic SDK mock
│   ├── setup.ts             # Test environment setup
│   ├── code-validator.test.ts       # Validator unit tests (25 tests)
│   ├── retry-logic.test.ts          # Retry logic unit tests (27 tests)
│   └── integration-modify-route.test.ts  # Integration tests (8 tests)
├── jest.config.js           # Jest configuration
└── package.json             # Test scripts
```

---

## 📊 Test Suites

### 1. Code Validator Tests (25 tests)

**Location:** `tests/code-validator.test.ts`

**What it tests:**
- Nested function detection
- JSX tag balance validation
- TypeScript syntax in JSX files
- Unclosed string detection
- Auto-fix capabilities

**Run:**
```bash
npm run test:validator
```

**Key test groups:**
- `hasNestedFunctionDeclarations` - 6 tests
- `hasBalancedJSXTags` - 4 tests
- `hasTypeScriptInJSX` - 4 tests
- `hasUnclosedStrings` - 4 tests
- `validateGeneratedCode` - 2 tests
- `autoFixCode` - 3 tests

**Example test:**
```typescript
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
});
```

### 2. Retry Logic Tests (27 tests)

**Location:** `tests/retry-logic.test.ts`

**What it tests:**
- Correction prompt generation
- File contents section formatting
- Timeout handling
- Stream processing
- Token usage tracking
- Conversation history handling
- Error recovery

**Run:**
```bash
npm run test:retry
```

**Key test groups:**
- Correction Prompts - 4 tests
- Enhanced Error Messages - 3 tests
- Timeout Handling - 3 tests
- Stream Processing - 3 tests
- Token Usage Tracking - 2 tests
- Conversation History - 3 tests
- Enhanced Prompt Building - 2 tests
- Error Recovery - 3 tests

**Example test:**
```typescript
test('should detect timeout after 45 seconds', () => {
  const timeout = 45000;
  const startTime = Date.now();
  const currentTime = startTime + 46000; // 46 seconds later

  const hasTimedOut = currentTime - startTime > timeout;
  expect(hasTimedOut).toBe(true);
});
```

### 3. Integration Tests (8 tests)

**Location:** `tests/integration-modify-route.test.ts`

**What it tests:**
- Complete modification flow
- API route handling
- Request/response cycle
- Error handling
- Validation integration
- File contents processing

**Run:**
```bash
npm run test:integration
```

**Key test scenarios:**
- Valid modification requests
- Missing API key handling
- Missing app state handling
- Conversation history support
- Code validation integration
- Multi-file modifications
- Streaming timeout behavior
- JSON parsing with markdown

**Example test:**
```typescript
test('should handle valid modification request', async () => {
  const mockRequest = {
    json: async () => ({
      prompt: 'Add a button',
      currentAppState: {
        files: [{
          path: 'src/App.tsx',
          content: 'export default function App() { return <div>Hello</div>; }'
        }]
      },
      conversationHistory: []
    })
  } as Request;

  const response = await POST(mockRequest);
  const data = await response.json();

  expect(data).toHaveProperty('changeType');
  expect(data).toHaveProperty('summary');
  expect(data).toHaveProperty('files');
});
```

---

## 🎯 Test Coverage

### Current Coverage

**Total Tests:** 60
- Unit Tests: 52 (25 validator + 27 retry)
- Integration Tests: 8

**Coverage Areas:**
- ✅ Code validation logic
- ✅ Retry mechanisms
- ✅ Error handling
- ✅ Auto-fix capabilities
- ✅ API routes
- ✅ Request processing
- ✅ Timeout handling
- ✅ Token tracking

### Viewing Coverage Report

```bash
# Generate coverage report
npm test -- --coverage

# View detailed HTML report
npm test -- --coverage --coverageReporters=html
open coverage/index.html
```

---

## 🔧 Running Tests

### Basic Commands

```bash
# Run all unit tests (validator + retry)
npm test

# Run all tests including integration
npm run test:all

# Run specific suite
npm run test:validator
npm run test:retry
npm run test:integration
```

### Watch Mode

```bash
# Watch for changes and re-run tests
npm test -- --watch

# Watch specific test file
npm run test:validator -- --watch
```

### Debug Mode

```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test file
npm test -- tests/code-validator.test.ts

# Run specific test by name
npm test -- -t "should detect nested function"
```

### CI/CD Integration

Tests run automatically in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:all
```

---

## 🐛 Debugging Tests

### Common Issues

#### Tests Fail with "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
npm install

# Clear Jest cache
npm test -- --clearCache
```

#### Mock Not Working

**Solution:**
- Check mock path matches import path
- Ensure mock is in `__mocks__` directory
- Verify jest.config.js has correct moduleNameMapper

#### TypeScript Errors in Tests

**Solution:**
- Check tsconfig.json includes test files
- Verify @types packages are installed
- Use proper type assertions

### Debugging Tips

1. **Add console.log()** to tests for debugging
2. **Use `--verbose`** flag for detailed output
3. **Run single test** to isolate issues
4. **Check mock implementations** match interfaces
5. **Verify test environment** setup is correct

---

## ✍️ Writing New Tests

### Test Structure

```typescript
describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Reset state before each test
  });

  // Cleanup
  afterEach(() => {
    // Clean up after each test
  });

  test('should do something specific', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Best Practices

1. **One assertion per test** when possible
2. **Clear test names** describing what's tested
3. **Arrange-Act-Assert** pattern
4. **Test edge cases** not just happy path
5. **Mock external dependencies** (APIs, etc.)
6. **Keep tests fast** (< 1 second each)
7. **Independent tests** (no shared state)

### Example: Adding a New Validator Test

```typescript
// In tests/code-validator.test.ts

describe('Code Validator - New Feature', () => {
  test('should detect new error type', () => {
    // Arrange
    const code = `
      // Code with error
    `;
    
    // Act
    const errors = newValidatorFunction(code);
    
    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('NEW_ERROR_TYPE');
    expect(errors[0].message).toContain('expected text');
  });

  test('should not flag valid code', () => {
    // Arrange
    const code = `
      // Valid code
    `;
    
    // Act
    const errors = newValidatorFunction(code);
    
    // Assert
    expect(errors).toHaveLength(0);
  });
});
```

### Example: Adding an Integration Test

```typescript
// In tests/integration-modify-route.test.ts

test('should handle new feature request', async () => {
  // Arrange
  const mockRequest = {
    json: async () => ({
      prompt: 'Test new feature',
      currentAppState: { /* ... */ }
    })
  } as Request;

  // Act
  const response = await POST(mockRequest);
  const data = await response.json();

  // Assert
  expect(response.status).toBeLessThan(500);
  expect(data).toHaveProperty('expectedField');
});
```

---

## 📈 Continuous Testing

### Pre-commit Hooks

Add tests to pre-commit hooks:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
```

### CI/CD Pipeline

Integrate tests in your pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:all
```

---

## 🎓 Advanced Topics

### Snapshot Testing

```typescript
test('should match snapshot', () => {
  const result = generateComponent();
  expect(result).toMatchSnapshot();
});
```

### Async Testing

```typescript
test('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Mocking Modules

```typescript
jest.mock('../src/utils/helper', () => ({
  helperFunction: jest.fn(() => 'mocked value')
}));
```

### Testing Errors

```typescript
test('should throw error for invalid input', () => {
  expect(() => {
    functionThatThrows();
  }).toThrow('Expected error message');
});
```

---

## 📚 Resources

### Documentation
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [ts-jest Guide](https://kulshekhar.github.io/ts-jest/)

### Best Practices
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)

---

## 🤝 Contributing Tests

### Guidelines

1. **Write tests for new features** before implementing
2. **Update existing tests** when changing functionality
3. **Aim for high coverage** (80%+ is good)
4. **Document complex test logic**
5. **Keep tests maintainable** and readable

### Test Checklist

Before submitting:
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] Tests are well-named
- [ ] No commented-out tests
- [ ] Mocks are properly configured
- [ ] Tests run in CI/CD

---

## 🎯 Test Strategy

### What to Test

**Always test:**
- ✅ Core business logic
- ✅ Edge cases and error handling
- ✅ Public API interfaces
- ✅ Critical user paths
- ✅ Data transformations

**Consider testing:**
- Utility functions
- Complex algorithms
- State management
- Form validation

**Don't over-test:**
- ❌ Third-party libraries
- ❌ Framework internals
- ❌ Simple getters/setters
- ❌ Constants

---

## 🔍 Troubleshooting

### Test Failures

**Random failures:**
- Check for async race conditions
- Verify mocks are reset between tests
- Look for shared state

**All tests fail:**
- Check test environment setup
- Verify dependencies are installed
- Clear Jest cache

**Timeout errors:**
- Increase timeout in jest.config.js
- Check for infinite loops
- Verify async operations complete

---

## ✨ Summary

**Testing is essential for:**
- 🐛 Catching bugs early
- 📚 Documenting behavior
- 🔒 Preventing regressions
- 🚀 Confident refactoring
- 📊 Code quality metrics

**Run tests:**
- Before committing code
- After making changes
- In CI/CD pipelines
- When debugging issues

**Happy testing! 🧪**
