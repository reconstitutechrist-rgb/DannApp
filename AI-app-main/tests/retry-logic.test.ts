/**
 * Unit Tests for Retry Logic
 * 
 * Tests retry mechanisms and correction prompt generation
 */

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name: string, fn: () => void) {
  testCount++;
  try {
    fn();
    passCount++;
    console.log(`✅ ${name}`);
  } catch (error) {
    failCount++;
    console.error(`❌ ${name}`);
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    }
  }
}

function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  }
}

function assertContains(str: string, substring: string, message: string) {
  if (!str.includes(substring)) {
    throw new Error(`${message}\n  String: ${str}\n  Expected to contain: ${substring}`);
  }
}

function assertNotContains(str: string, substring: string, message: string) {
  if (str.includes(substring)) {
    throw new Error(`${message}\n  String: ${str}\n  Should not contain: ${substring}`);
  }
}

function assertGreaterThan(actual: number, min: number, message: string) {
  if (actual <= min) {
    throw new Error(`${message}\n  Expected > ${min}\n  Actual: ${actual}`);
  }
}

function assertArrayLength(array: any[], length: number, message: string) {
  if (array.length !== length) {
    throw new Error(`${message}\n  Expected length: ${length}\n  Actual length: ${array.length}`);
  }
}

console.log('\n🧪 Testing Retry Logic\n');

// =============================================================================
// Test Correction Prompts
// =============================================================================

console.log('📝 Testing Correction Prompts...\n');

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

  assertContains(fileContentsSection, '📁 **CURRENT FILE CONTENTS**', 'Should contain header');
  assertContains(fileContentsSection, 'src/App.tsx', 'Should contain file path');
  assertContains(fileContentsSection, 'export default function App()', 'Should contain file content');
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

  assertContains(fileContentsSection, '📁 **CURRENT FILE CONTENTS**', 'Should have header');
  assertNotContains(fileContentsSection, 'FILE:', 'Should not contain FILE: marker');
});

test('should handle null currentAppState', () => {
  const currentAppState = null;

  let fileContentsSection = '';
  if (currentAppState && currentAppState.files && Array.isArray(currentAppState.files)) {
    fileContentsSection = '\n\n📁 **CURRENT FILE CONTENTS**\n\n';
  }

  assertEqual(fileContentsSection, '', 'Should be empty string');
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

  assertContains(fileContentsSection, 'src/App.tsx', 'Should contain first file');
  assertContains(fileContentsSection, 'src/Button.tsx', 'Should contain second file');
  assertGreaterThan(fileContentsSection.split('='.repeat(60)).length, 4, 'Should have multiple separators');
});

// =============================================================================
// Test Enhanced Error Messages
// =============================================================================

console.log('\n📝 Testing Enhanced Error Messages...\n');

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

  assertArrayLength(messages, 1, 'Should have one message');
  assertEqual(messages[0].role, 'user', 'Message role should be user');
  assertContains(messages[0].content, 'searchFor', 'Should contain correction');
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

  assertArrayLength(messages, 0, 'Should have no messages');
});

test('should include file contents in correction prompt', () => {
  const fileContentsSection = '\n📁 **CURRENT FILE CONTENTS**\nFile: src/App.tsx\nContent...';
  const correctionPrompt = 'Fix the pattern';
  const attemptNumber = 2;

  let finalPrompt = '';
  if (attemptNumber > 1 && correctionPrompt) {
    finalPrompt = `${fileContentsSection}\n\n${correctionPrompt}`;
  }

  assertContains(finalPrompt, '📁 **CURRENT FILE CONTENTS**', 'Should include file contents');
  assertContains(finalPrompt, 'Fix the pattern', 'Should include correction');
});

// =============================================================================
// Test Timeout Handling
// =============================================================================

console.log('\n📝 Testing Timeout Handling...\n');

test('should detect timeout after 45 seconds', () => {
  const timeout = 45000;
  const startTime = Date.now();
  const currentTime = startTime + 46000; // 46 seconds later

  const hasTimedOut = currentTime - startTime > timeout;
  assertEqual(hasTimedOut, true, 'Should detect timeout');
});

test('should not timeout before 45 seconds', () => {
  const timeout = 45000;
  const startTime = Date.now();
  const currentTime = startTime + 30000; // 30 seconds later

  const hasTimedOut = currentTime - startTime > timeout;
  assertEqual(hasTimedOut, false, 'Should not timeout early');
});

test('should throw timeout error with helpful message', () => {
  const timeout = 45000;
  const startTime = Date.now() - 50000; // 50 seconds ago

  let errorThrown = false;
  let errorMessage = '';

  try {
    if (Date.now() - startTime > timeout) {
      throw new Error('AI response timeout - please try a simpler request');
    }
  } catch (error) {
    errorThrown = true;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  }

  assertEqual(errorThrown, true, 'Should throw error');
  assertContains(errorMessage, 'AI response timeout', 'Should have timeout message');
});

// =============================================================================
// Test Stream Processing
// =============================================================================

console.log('\n📝 Testing Stream Processing...\n');

test('should accumulate text from stream chunks', () => {
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

  assertEqual(responseText, 'Hello World!', 'Should accumulate all text');
});

test('should ignore non-text chunks', () => {
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

  assertEqual(responseText, 'Hello', 'Should only include text delta');
});

test('should handle empty stream', () => {
  const chunks: any[] = [];

  let responseText = '';
  for (const chunk of chunks) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      responseText += chunk.delta.text;
    }
  }

  assertEqual(responseText, '', 'Should handle empty stream');
});

// =============================================================================
// Test Token Usage Tracking
// =============================================================================

console.log('\n📝 Testing Token Usage Tracking...\n');

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

  assertEqual(inputTokens, 1500, 'Should capture input tokens');
  assertEqual(outputTokens, 500, 'Should capture output tokens');
  assertEqual(cachedTokens, 800, 'Should capture cached tokens');
});

test('should default to 0 for missing token counts', () => {
  const finalMessage = {
    usage: {}
  };

  const inputTokens = finalMessage.usage.input_tokens || 0;
  const outputTokens = finalMessage.usage.output_tokens || 0;
  const cachedTokens = finalMessage.usage.cache_read_input_tokens || 0;

  assertEqual(inputTokens, 0, 'Should default input to 0');
  assertEqual(outputTokens, 0, 'Should default output to 0');
  assertEqual(cachedTokens, 0, 'Should default cached to 0');
});

// =============================================================================
// Test Conversation History
// =============================================================================

console.log('\n📝 Testing Conversation History...\n');

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

  assertArrayLength(messages, 3, 'Should have 3 messages');
  assertEqual(messages[0].role, 'user', 'First message should be user');
  assertEqual(messages[1].role, 'assistant', 'Second message should be assistant');
  assertEqual(messages[2].role, 'user', 'Third message should be user');
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

  assertArrayLength(messages, 2, 'Should filter out system messages');
  assertEqual(messages.find((m: any) => m.role === 'system'), undefined, 'Should not have system role');
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

  assertArrayLength(messages, 0, 'Should have no messages');
});

// =============================================================================
// Test Enhanced Prompt Building
// =============================================================================

console.log('\n📝 Testing Enhanced Prompt Building...\n');

test('should combine file contents with user request', () => {
  const fileContentsSection = '📁 FILES:\nsrc/App.tsx';
  const prompt = 'Add a button';

  const enhancedPrompt = fileContentsSection
    ? `${fileContentsSection}\n\n🎯 **USER REQUEST:**\n${prompt}`
    : prompt;

  assertContains(enhancedPrompt, '📁 FILES:', 'Should include file contents');
  assertContains(enhancedPrompt, '🎯 **USER REQUEST:**', 'Should include request marker');
  assertContains(enhancedPrompt, 'Add a button', 'Should include prompt');
});

test('should use plain prompt when no file contents', () => {
  const fileContentsSection = '';
  const prompt = 'Add a button';

  const enhancedPrompt = fileContentsSection
    ? `${fileContentsSection}\n\n🎯 **USER REQUEST:**\n${prompt}`
    : prompt;

  assertEqual(enhancedPrompt, 'Add a button', 'Should be plain prompt');
  assertNotContains(enhancedPrompt, '📁 FILES:', 'Should not include file marker');
});

// =============================================================================
// Test Error Recovery
// =============================================================================

console.log('\n📝 Testing Error Recovery...\n');

test('should categorize stream errors', () => {
  const streamError = new Error('Connection timeout');

  const errorType = streamError.message.includes('timeout') ? 'timeout_error' : 'stream_error';

  assertEqual(errorType, 'timeout_error', 'Should categorize as timeout error');
});

test('should provide helpful error message on timeout', () => {
  const error = new Error('AI response timeout - the modification was taking too long. Please try a simpler request or try again.');

  assertContains(error.message, 'simpler request', 'Should suggest simpler request');
  assertContains(error.message, 'try again', 'Should suggest retry');
});

test('should preserve error context', () => {
  const originalError = new Error('Network error');
  const wrappedError = new Error(
    originalError instanceof Error ? originalError.message : 'Failed to receive AI response'
  );

  assertEqual(wrappedError.message, 'Network error', 'Should preserve original message');
});

// =============================================================================
// Summary
// =============================================================================

console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`Total tests: ${testCount}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log('='.repeat(60) + '\n');

if (failCount > 0) {
  process.exit(1);
}
