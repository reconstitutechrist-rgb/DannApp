/**
 * Context Compression Utility
 *
 * Compresses conversation history to fit within token limits while preserving
 * the most important context. Uses intelligent summarization to maintain 2-3x
 * more effective conversation history.
 */

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface CompressionResult {
  messages: ChatMessage[];
  compressionRatio: number;
  summaryCount: number;
}

/**
 * Compress conversation history intelligently
 *
 * Strategy:
 * - Keep first 2 messages (system initialization + first request)
 * - Keep last 5 messages (recent context)
 * - Summarize middle messages into key points
 *
 * @param messages - Full conversation history
 * @param maxMessages - Maximum number of messages to keep (default: 15)
 * @returns Compressed conversation with summaries
 */
export function compressConversationHistory(
  messages: ChatMessage[],
  maxMessages: number = 15
): CompressionResult {
  // If already within limit, no compression needed
  if (messages.length <= maxMessages) {
    return {
      messages,
      compressionRatio: 1,
      summaryCount: 0
    };
  }

  // Keep first 2 messages (system + initial context)
  const start = messages.slice(0, 2);

  // Keep last 5 messages (recent conversation)
  const recent = messages.slice(-5);

  // Get middle messages to summarize
  const middle = messages.slice(2, -5);

  if (middle.length === 0) {
    return {
      messages,
      compressionRatio: 1,
      summaryCount: 0
    };
  }

  // Create summary of middle messages
  const summary = summarizeMessages(middle);
  const summaryMessage: ChatMessage = {
    id: `summary-${Date.now()}`,
    role: 'system',
    content: `[Conversation Summary - ${middle.length} messages compressed]\n\n${summary}`,
    timestamp: new Date().toISOString()
  };

  const compressed = [...start, summaryMessage, ...recent];

  return {
    messages: compressed,
    compressionRatio: messages.length / compressed.length,
    summaryCount: middle.length
  };
}

/**
 * Summarize a sequence of messages into key points
 */
function summarizeMessages(messages: ChatMessage[]): string {
  const userRequests: string[] = [];
  const aiActions: string[] = [];
  const keyFeatures: Set<string> = new Set();

  for (const message of messages) {
    if (message.role === 'user') {
      // Extract key requests from user messages
      const request = extractKeyRequest(message.content);
      if (request) {
        userRequests.push(request);
      }
    } else if (message.role === 'assistant') {
      // Extract actions from AI responses
      const action = extractAction(message.content);
      if (action) {
        aiActions.push(action);
      }
    }

    // Extract feature mentions
    const features = extractFeatures(message.content);
    features.forEach(f => keyFeatures.add(f));
  }

  let summary = '';

  if (userRequests.length > 0) {
    summary += `User Requests:\n${userRequests.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n`;
  }

  if (aiActions.length > 0) {
    summary += `Actions Taken:\n${aiActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n`;
  }

  if (keyFeatures.size > 0) {
    summary += `Features Discussed: ${Array.from(keyFeatures).join(', ')}`;
  }

  return summary || 'General conversation about app development';
}

/**
 * Extract key request from user message
 */
function extractKeyRequest(content: string): string | null {
  const lower = content.toLowerCase();

  // Check for common request patterns
  if (lower.includes('add') || lower.includes('create') || lower.includes('build')) {
    // Extract what they want to add/create/build
    const match = content.match(/(?:add|create|build)\s+(?:a\s+)?([^.!?\n]+)/i);
    return match ? `Add ${match[1].trim()}` : null;
  }

  if (lower.includes('change') || lower.includes('modify') || lower.includes('update')) {
    const match = content.match(/(?:change|modify|update)\s+([^.!?\n]+)/i);
    return match ? `Change ${match[1].trim()}` : null;
  }

  if (lower.includes('remove') || lower.includes('delete')) {
    const match = content.match(/(?:remove|delete)\s+([^.!?\n]+)/i);
    return match ? `Remove ${match[1].trim()}` : null;
  }

  // For questions
  if (lower.startsWith('how') || lower.startsWith('what') || lower.startsWith('why')) {
    return content.split('\n')[0].trim();
  }

  // Default: first sentence
  const firstSentence = content.split(/[.!?]/)[0];
  if (firstSentence.length < 100) {
    return firstSentence.trim();
  }

  return null;
}

/**
 * Extract action from AI message
 */
function extractAction(content: string): string | null {
  const lower = content.toLowerCase();

  if (lower.includes('generated') || lower.includes('created')) {
    return 'Generated code';
  }

  if (lower.includes('modified') || lower.includes('updated')) {
    return 'Modified existing code';
  }

  if (lower.includes('added')) {
    const match = content.match(/added\s+([^.!?\n]+)/i);
    return match ? `Added ${match[1].trim()}` : 'Added feature';
  }

  return null;
}

/**
 * Extract feature names mentioned in content
 */
function extractFeatures(content: string): string[] {
  const features: string[] = [];
  const lower = content.toLowerCase();

  // Common features to detect
  const featureKeywords = [
    'authentication', 'auth', 'login', 'logout',
    'database', 'storage',
    'dark mode', 'theme',
    'navigation', 'navbar', 'sidebar',
    'form', 'validation',
    'api', 'endpoint',
    'search', 'filter',
    'pagination',
    'chart', 'graph',
    'modal', 'dialog',
    'notification', 'alert',
    'file upload',
    'real-time', 'websocket'
  ];

  for (const keyword of featureKeywords) {
    if (lower.includes(keyword)) {
      features.push(keyword);
    }
  }

  return features;
}

/**
 * Calculate estimated token count for messages
 * (Rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokenCount(messages: ChatMessage[]): number {
  const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
  return Math.ceil(totalChars / 4);
}

/**
 * Compress messages to fit within target token limit
 */
export function compressToTokenLimit(
  messages: ChatMessage[],
  targetTokens: number = 4000
): CompressionResult {
  let compressed = compressConversationHistory(messages);
  let estimatedTokens = estimateTokenCount(compressed.messages);

  // Keep compressing if still over limit
  let iterations = 0;
  while (estimatedTokens > targetTokens && compressed.messages.length > 7 && iterations < 5) {
    compressed = compressConversationHistory(compressed.messages, compressed.messages.length - 2);
    estimatedTokens = estimateTokenCount(compressed.messages);
    iterations++;
  }

  return compressed;
}
