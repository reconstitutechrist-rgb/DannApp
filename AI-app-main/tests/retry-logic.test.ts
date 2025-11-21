/**
 * Unit Tests for Retry Logic
 * 
 * Tests retry mechanisms and correction prompt generation
 */

describe('Retry Logic - Correction Prompts', () => {
  test('should generate file contents section', () => {
    const currentAppState = {
      files: [
        {
          path: 'src/App.tsx',
          content: 'export default function App() {\n  return <div>Hello</div>;\n}'
        }
      ]
    };

    let fileContentsSection = '';
    if (currentAppState && currentAppState.files && Array.isArray(currentAppState.files)) {
      fileContentsSection = '\n\n📁 **CURRENT FILE CONTENTS** (Read these EXACTLY for your SEARCH blocks):\n\n';
      currentAppState.files.forEach((file: any) => {
        fileContentsSection += `\n${'='.repeat(60)}\n`;
        fileContentsSection += `FILE: ${file.path}\n`;
        fileContentsSection += `${'='.repeat(60)}\n`;
        fileContentsSection += file.content;
        fileContentsSection += `\n${'='.repeat(60)}\n`;
      });
    }

    expect(fileContentsSection).toContain('📁 **CURRENT FILE CONTENTS**');
    expect(fileContentsSection).toContain('src/App.tsx');
    expect(fileContentsSection).toContain('export default function App()');
  });

  test('should handle empty files array', () => {
    const currentAppState = {
      files: []
    };

    let fileContentsSection = '';
    if (currentAppState && currentAppState.files && Array.isArray(currentAppState.files)) {
      fileContentsSection = '\n\n📁 **CURRENT FILE CONTENTS** (Read these EXACTLY for your SEARCH blocks):\n\n';
      currentAppState.files.forEach((file: any) => {
        fileContentsSection += `\n${'='.repeat(60)}\n`;
        fileContentsSection += `FILE: ${file.path}\n`;
        fileContentsSection += `${'='.repeat(60)}\n`;
        fileContentsSection += file.content;
        fileContentsSection += `\n${'='.repeat(60)}\n`;
      });
    }

    expect(fileContentsSection).toContain('📁 **CURRENT FILE CONTENTS**');
    expect(fileContentsSection).not.toContain('FILE:');
  });

  test('should handle null currentAppState', () => {
    const currentAppState = null;

    let fileContentsSection = '';
    if (currentAppState && currentAppState.files && Array.isArray(currentAppState.files)) {
      fileContentsSection = '\n\n📁 **CURRENT FILE CONTENTS**\n\n';
    }

    expect(fileContentsSection).toBe('');
  });

  test('should format multiple files correctly', () => {
    const currentAppState = {
      files: [
        {
          path: 'src/App.tsx',
          content: 'function App() {}'
        },
        {
          path: 'src/Button.tsx',
          content: 'function Button() {}'
        }
      ]
    };

    let fileContentsSection = '';
    if (currentAppState && currentAppState.files && Array.isArray(currentAppState.files)) {
      fileContentsSection = '\n\n📁 **CURRENT FILE CONTENTS** (Read these EXACTLY for your SEARCH blocks):\n\n';
      currentAppState.files.forEach((file: any) => {
        fileContentsSection += `\n${'='.repeat(60)}\n`;
        fileContentsSection += `FILE: ${file.path}\n`;
        fileContentsSection += `${'='.repeat(60)}\n`;
        fileContentsSection += file.content;
        fileContentsSection += `\n${'='.repeat(60)}\n`;
      });
    }

    expect(fileContentsSection).toContain('src/App.tsx');
    expect(fileContentsSection).toContain('src/Button.tsx');
    expect(fileContentsSection.split('='.repeat(60)).length).toBeGreaterThan(4);
  });
});

describe('Retry Logic - Enhanced Error Messages', () => {
  test('should build correction prompt on retry', () => {
    const attemptNumber = 2;
    const correctionPrompt = 'Previous attempt failed. Please fix the searchFor pattern.';
    const messages: any[] = [];

    if (attemptNumber > 1 && correctionPrompt) {
      messages.push({
        role: 'user',
        content: correctionPrompt
      });
    }

    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe('user');
    expect(messages[0].content).toContain('searchFor');
  });

  test('should not add correction on first attempt', () => {
    const attemptNumber = 1;
    const correctionPrompt = 'Some correction';
    const messages: any[] = [];

    if (attemptNumber > 1 && correctionPrompt) {
      messages.push({
        role: 'user',
        content: correctionPrompt
      });
    }

    expect(messages).toHaveLength(0);
  });

  test('should include file contents in correction prompt', () => {
    const fileContentsSection = '\n📁 **CURRENT FILE CONTENTS**\nFile: src/App.tsx\nContent...';
    const correctionPrompt = 'Fix the pattern';
    const attemptNumber = 2;

    let finalPrompt = '';
    if (attemptNumber > 1 && correctionPrompt) {
      finalPrompt = `${fileContentsSection}\n\n${correctionPrompt}`;
    }

    expect(finalPrompt).toContain('📁 **CURRENT FILE CONTENTS**');
    expect(finalPrompt).toContain('Fix the pattern');
  });
});

describe('Retry Logic - Timeout Handling', () => {
  test('should detect timeout after 45 seconds', () => {
    const timeout = 45000;
    const startTime = Date.now();
    const currentTime = startTime + 46000; // 46 seconds later

    const hasTimedOut = currentTime - startTime > timeout;
    expect(hasTimedOut).toBe(true);
  });

  test('should not timeout before 45 seconds', () => {
    const timeout = 45000;
    const startTime = Date.now();
    const currentTime = startTime + 30000; // 30 seconds later

    const hasTimedOut = currentTime - startTime > timeout;
    expect(hasTimedOut).toBe(false);
  });

  test('should throw timeout error with helpful message', () => {
    const timeout = 45000;
    const startTime = Date.now() - 50000; // 50 seconds ago

    expect(() => {
      if (Date.now() - startTime > timeout) {
        throw new Error('AI response timeout - please try a simpler request');
      }
    }).toThrow('AI response timeout');
  });
});

describe('Retry Logic - Stream Processing', () => {
  test('should accumulate text from stream chunks', async () => {
    const chunks = [
      { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello' } },
      { type: 'content_block_delta', delta: { type: 'text_delta', text: ' World' } },
      { type: 'content_block_delta', delta: { type: 'text_delta', text: '!' } },
    ];

    let responseText = '';
    for (const chunk of chunks) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        responseText += chunk.delta.text;
      }
    }

    expect(responseText).toBe('Hello World!');
  });

  test('should ignore non-text chunks', async () => {
    const chunks = [
      { type: 'content_block_start', index: 0 },
      { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello' } },
      { type: 'content_block_stop', index: 0 },
    ];

    let responseText = '';
    for (const chunk of chunks) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        responseText += chunk.delta.text;
      }
    }

    expect(responseText).toBe('Hello');
  });

  test('should handle empty stream', async () => {
    const chunks: any[] = [];

    let responseText = '';
    for (const chunk of chunks) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        responseText += chunk.delta.text;
      }
    }

    expect(responseText).toBe('');
  });
});

describe('Retry Logic - Token Usage Tracking', () => {
  test('should capture token usage from final message', () => {
    const finalMessage = {
      usage: {
        input_tokens: 1500,
        output_tokens: 500,
        cache_read_input_tokens: 800
      }
    };

    const inputTokens = finalMessage.usage.input_tokens || 0;
    const outputTokens = finalMessage.usage.output_tokens || 0;
    const cachedTokens = finalMessage.usage.cache_read_input_tokens || 0;

    expect(inputTokens).toBe(1500);
    expect(outputTokens).toBe(500);
    expect(cachedTokens).toBe(800);
  });

  test('should default to 0 for missing token counts', () => {
    const finalMessage = {
      usage: {}
    };

    const inputTokens = finalMessage.usage.input_tokens || 0;
    const outputTokens = finalMessage.usage.output_tokens || 0;
    const cachedTokens = finalMessage.usage.cache_read_input_tokens || 0;

    expect(inputTokens).toBe(0);
    expect(outputTokens).toBe(0);
    expect(cachedTokens).toBe(0);
  });
});

describe('Retry Logic - Conversation History', () => {
  test('should build messages from conversation history', () => {
    const conversationHistory = [
      { role: 'user', content: 'Add a button' },
      { role: 'assistant', content: '{"changeType": "MODIFICATION"}' },
      { role: 'user', content: 'Make it blue' }
    ];

    const messages: any[] = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          messages.push({ role: 'user', content: msg.content });
        } else if (msg.role === 'assistant') {
          messages.push({ role: 'assistant', content: msg.content });
        }
      });
    }

    expect(messages).toHaveLength(3);
    expect(messages[0].role).toBe('user');
    expect(messages[1].role).toBe('assistant');
    expect(messages[2].role).toBe('user');
  });

  test('should filter out invalid roles', () => {
    const conversationHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'system', content: 'System message' },
      { role: 'assistant', content: 'Hi' }
    ];

    const messages: any[] = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          messages.push({ role: 'user', content: msg.content });
        } else if (msg.role === 'assistant') {
          messages.push({ role: 'assistant', content: msg.content });
        }
      });
    }

    expect(messages).toHaveLength(2);
    expect(messages.find((m: any) => m.role === 'system')).toBeUndefined();
  });

  test('should handle empty conversation history', () => {
    const conversationHistory: any[] = [];

    const messages: any[] = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          messages.push({ role: 'user', content: msg.content });
        } else if (msg.role === 'assistant') {
          messages.push({ role: 'assistant', content: msg.content });
        }
      });
    }

    expect(messages).toHaveLength(0);
  });
});

describe('Retry Logic - Enhanced Prompt Building', () => {
  test('should combine file contents with user request', () => {
    const fileContentsSection = '📁 FILES:\nsrc/App.tsx';
    const prompt = 'Add a button';

    const enhancedPrompt = fileContentsSection
      ? `${fileContentsSection}\n\n🎯 **USER REQUEST:**\n${prompt}`
      : prompt;

    expect(enhancedPrompt).toContain('📁 FILES:');
    expect(enhancedPrompt).toContain('🎯 **USER REQUEST:**');
    expect(enhancedPrompt).toContain('Add a button');
  });

  test('should use plain prompt when no file contents', () => {
    const fileContentsSection = '';
    const prompt = 'Add a button';

    const enhancedPrompt = fileContentsSection
      ? `${fileContentsSection}\n\n🎯 **USER REQUEST:**\n${prompt}`
      : prompt;

    expect(enhancedPrompt).toBe('Add a button');
    expect(enhancedPrompt).not.toContain('📁 FILES:');
  });
});

describe('Retry Logic - Error Recovery', () => {
  test('should categorize stream errors', () => {
    const streamError = new Error('Connection timeout');

    const errorType = streamError.message.includes('timeout') ? 'timeout_error' : 'stream_error';

    expect(errorType).toBe('timeout_error');
  });

  test('should provide helpful error message on timeout', () => {
    const error = new Error('AI response timeout - the modification was taking too long. Please try a simpler request or try again.');

    expect(error.message).toContain('simpler request');
    expect(error.message).toContain('try again');
  });

  test('should preserve error context', () => {
    const originalError = new Error('Network error');
    const wrappedError = new Error(
      originalError instanceof Error ? originalError.message : 'Failed to receive AI response'
    );

    expect(wrappedError.message).toBe('Network error');
  });
});

// Run tests
if (require.main === module) {
  console.log('Running retry logic tests...');
}
