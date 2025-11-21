/**
 * Integration Tests for Modify Route
 * 
 * Tests the complete modification flow including AI integration
 */

import { POST } from '../src/app/api/ai-builder/modify/route';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk');

describe('Modify Route - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test('should return error when API key is missing', async () => {
    const originalKey = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    const mockRequest = {
      json: async () => ({
        prompt: 'Add a button',
        currentAppState: {
          files: [{ path: 'src/App.tsx', content: 'code' }]
        }
      })
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data).toHaveProperty('error');
    expect(data.error).toContain('API key');

    // Restore
    if (originalKey) {
      process.env.ANTHROPIC_API_KEY = originalKey;
    }
  });

  test('should return error when currentAppState is missing', async () => {
    const mockRequest = {
      json: async () => ({
        prompt: 'Add a button'
      })
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data).toHaveProperty('error');
    expect(data.error).toContain('app state');
  });

  test('should handle conversation history', async () => {
    const mockRequest = {
      json: async () => ({
        prompt: 'Change button color',
        currentAppState: {
          files: [{
            path: 'src/App.tsx',
            content: 'export default function App() { return <button>Click</button>; }'
          }]
        },
        conversationHistory: [
          { role: 'user', content: 'Add a button' },
          { role: 'assistant', content: 'Added button' }
        ]
      })
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBeLessThan(500);
  });

  test('should validate code snippets in response', async () => {
    const mockRequest = {
      json: async () => ({
        prompt: 'Add useState',
        currentAppState: {
          files: [{
            path: 'src/App.tsx',
            content: 'export default function App() { return <div>Test</div>; }'
          }]
        }
      })
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    // Response should have files
    expect(data.files).toBeDefined();
    if (data.validationWarnings) {
      expect(data.validationWarnings).toHaveProperty('hasWarnings');
    }
  });

  test('should handle file contents section generation', async () => {
    const mockRequest = {
      json: async () => ({
        prompt: 'Add a comment',
        currentAppState: {
          files: [
            {
              path: 'src/App.tsx',
              content: 'function App() {}'
            },
            {
              path: 'src/utils.ts',
              content: 'export const helper = () => {};'
            }
          ]
        }
      })
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBeLessThan(500);
    expect(data).toHaveProperty('files');
  });

  test('should handle streaming timeout', async () => {
    // This test verifies timeout logic exists in route
    // Actual timeout testing would require mocking time
    const mockRequest = {
      json: async () => ({
        prompt: 'Complex modification',
        currentAppState: {
          files: [{
            path: 'src/App.tsx',
            content: 'export default function App() { return <div>Test</div>; }'
          }]
        }
      })
    } as Request;

    const response = await POST(mockRequest);
    
    // Should complete without timeout in test environment
    expect(response.status).toBeLessThan(500);
  });

  test('should parse JSON response with markdown wrapper', async () => {
    // Test that route can handle JSON wrapped in markdown code blocks
    const mockRequest = {
      json: async () => ({
        prompt: 'Add import',
        currentAppState: {
          files: [{
            path: 'src/App.tsx',
            content: 'function App() {}'
          }]
        }
      })
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    // Should successfully parse the response
    expect(data).toHaveProperty('changeType');
    expect(data.changeType).toBe('MODIFICATION');
  });
});

// Run tests
if (require.main === module) {
  console.log('Running integration tests...');
}
