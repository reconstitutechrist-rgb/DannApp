/**
 * Semantic Memory System
 *
 * Stores and retrieves relevant conversation context using keyword-based
 * semantic search. Allows the AI to reference information from hours or
 * days ago, not just the last 50 messages.
 */

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface MemoryEntry {
  id: string;
  content: string;
  timestamp: string;
  keywords: string[];
  messageType: 'question' | 'request' | 'response' | 'general';
  importance: number; // 1-10 scale
}

interface RelevantContext {
  content: string;
  relevanceScore: number;
  timestamp: string;
  messageType: string;
}

/**
 * ConversationMemory class for storing and retrieving relevant context
 */
export class ConversationMemory {
  private storage: MemoryEntry[] = [];
  private readonly STORAGE_KEY = 'conversation_memory';
  private readonly MAX_ENTRIES = 500; // Keep last 500 important memories

  constructor() {
    this.load();
  }

  /**
   * Add a message to memory
   */
  addMemory(message: ChatMessage): void {
    const keywords = this.extractKeywords(message.content);
    const messageType = this.classifyMessage(message.content, message.role);
    const importance = this.calculateImportance(message, messageType);

    // Only store important messages (importance >= 3)
    if (importance < 3) {
      return;
    }

    const entry: MemoryEntry = {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      keywords,
      messageType,
      importance
    };

    this.storage.push(entry);

    // Prune old low-importance entries if over limit
    if (this.storage.length > this.MAX_ENTRIES) {
      this.pruneMemories();
    }

    this.persist();
  }

  /**
   * Get relevant context for a new prompt
   */
  getRelevantContext(currentPrompt: string, limit: number = 5): RelevantContext[] {
    if (this.storage.length === 0) {
      return [];
    }

    const promptKeywords = this.extractKeywords(currentPrompt);
    const promptType = this.classifyMessage(currentPrompt, 'user');

    // Score each memory by relevance
    const scored = this.storage.map(memory => ({
      memory,
      score: this.calculateRelevance(memory, promptKeywords, promptType)
    }));

    // Return top N most relevant, sorted by score
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => ({
        content: s.memory.content,
        relevanceScore: s.score,
        timestamp: s.memory.timestamp,
        messageType: s.memory.messageType
      }));
  }

  /**
   * Get recent memories within time window
   */
  getRecentMemories(minutesAgo: number = 60, limit: number = 10): MemoryEntry[] {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);

    return this.storage
      .filter(m => new Date(m.timestamp) > cutoffTime)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Search memories by keyword
   */
  searchMemories(query: string, limit: number = 10): MemoryEntry[] {
    const queryKeywords = this.extractKeywords(query);

    const scored = this.storage.map(memory => ({
      memory,
      score: this.calculateKeywordMatch(memory.keywords, queryKeywords)
    }));

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.memory);
  }

  /**
   * Clear all memories
   */
  clear(): void {
    this.storage = [];
    this.persist();
  }

  /**
   * Get memory statistics
   */
  getStats() {
    return {
      totalEntries: this.storage.length,
      oldestEntry: this.storage.length > 0 ? this.storage[0].timestamp : null,
      newestEntry: this.storage.length > 0 ? this.storage[this.storage.length - 1].timestamp : null,
      averageImportance: this.storage.reduce((sum, m) => sum + m.importance, 0) / this.storage.length || 0,
      typeBreakdown: this.getTypeBreakdown()
    };
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Convert to lowercase and extract words
    const words: string[] = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

    // Remove common stop words
    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was',
      'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new',
      'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put',
      'say', 'she', 'too', 'use', 'about', 'could', 'would', 'should', 'there',
      'their', 'what', 'which', 'when', 'where', 'with', 'this', 'that', 'have',
      'from', 'they', 'will', 'been', 'more', 'make', 'like', 'just', 'into',
      'want', 'need', 'please', 'thanks', 'hello'
    ]);

    const keywords = words.filter(w => !stopWords.has(w) && w.length > 3);

    // Return unique keywords
    return [...new Set(keywords)];
  }

  /**
   * Classify message type
   */
  private classifyMessage(content: string, role: string): 'question' | 'request' | 'response' | 'general' {
    const lower = content.toLowerCase();

    // Questions
    if (lower.startsWith('how') || lower.startsWith('what') || lower.startsWith('why') ||
        lower.startsWith('when') || lower.startsWith('where') || lower.includes('?')) {
      return 'question';
    }

    // Requests (if user message)
    if (role === 'user' && (
      lower.includes('add') || lower.includes('create') || lower.includes('build') ||
      lower.includes('change') || lower.includes('modify') || lower.includes('remove')
    )) {
      return 'request';
    }

    // Responses (if assistant message)
    if (role === 'assistant') {
      return 'response';
    }

    return 'general';
  }

  /**
   * Calculate importance of a message (1-10)
   */
  private calculateImportance(message: ChatMessage, messageType: string): number {
    let importance = 5; // Base importance

    // User requests are more important
    if (message.role === 'user') {
      importance += 2;
    }

    // Requests and questions are important
    if (messageType === 'request') {
      importance += 2;
    } else if (messageType === 'question') {
      importance += 1;
    }

    // Longer messages tend to be more important
    if (message.content.length > 200) {
      importance += 1;
    }

    // Messages with code are important
    if (message.content.includes('```') || message.content.includes('function') ||
        message.content.includes('const ') || message.content.includes('import ')) {
      importance += 1;
    }

    return Math.min(importance, 10);
  }

  /**
   * Calculate relevance score between memory and current prompt
   */
  private calculateRelevance(
    memory: MemoryEntry,
    promptKeywords: string[],
    promptType: string
  ): number {
    let score = 0;

    // Keyword match (most important)
    const keywordMatch = this.calculateKeywordMatch(memory.keywords, promptKeywords);
    score += keywordMatch * 10;

    // Type match (questions match questions, requests match requests)
    if (memory.messageType === promptType) {
      score += 3;
    }

    // Importance factor
    score += memory.importance * 0.5;

    // Recency bonus (messages from last hour get bonus)
    const ageMinutes = (Date.now() - new Date(memory.timestamp).getTime()) / (1000 * 60);
    if (ageMinutes < 60) {
      score += 5;
    } else if (ageMinutes < 1440) { // 24 hours
      score += 2;
    }

    return score;
  }

  /**
   * Calculate keyword match score
   */
  private calculateKeywordMatch(keywords1: string[], keywords2: string[]): number {
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = keywords1.filter(k => set2.has(k));

    if (keywords1.length === 0 || keywords2.length === 0) {
      return 0;
    }

    // Jaccard similarity
    const union = new Set([...keywords1, ...keywords2]);
    return intersection.length / union.size;
  }

  /**
   * Prune old low-importance memories
   */
  private pruneMemories(): void {
    // Sort by importance (descending) and timestamp (recent first)
    this.storage.sort((a, b) => {
      const importanceDiff = b.importance - a.importance;
      if (importanceDiff !== 0) return importanceDiff;

      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    // Keep top MAX_ENTRIES
    this.storage = this.storage.slice(0, this.MAX_ENTRIES);
  }

  /**
   * Get breakdown of message types
   */
  private getTypeBreakdown() {
    const breakdown: Record<string, number> = {
      question: 0,
      request: 0,
      response: 0,
      general: 0
    };

    for (const memory of this.storage) {
      breakdown[memory.messageType]++;
    }

    return breakdown;
  }

  /**
   * Save to localStorage
   */
  private persist(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.storage));
    } catch (error) {
      console.warn('Failed to persist conversation memory:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private load(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.storage = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load conversation memory:', error);
      this.storage = [];
    }
  }

  /**
   * Static factory method
   */
  static create(): ConversationMemory {
    return new ConversationMemory();
  }
}
