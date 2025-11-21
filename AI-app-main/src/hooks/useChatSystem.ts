import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/aiBuilderTypes';
import { compressToTokenLimit } from '../utils/contextCompression';
import { ConversationMemory } from '../utils/semanticMemory';

export function useChatSystem() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingProgress, setStreamingProgress] = useState<{
    phase: 'architecture' | 'files' | 'complete' | 'error';
    message: string;
    percentComplete: number;
    currentFile?: string;
    fileIndex?: number;
    totalFiles?: number;
    files: Array<{ path: string; status: 'pending' | 'generating' | 'complete'; content?: string }>;
  }>({
    phase: 'architecture',
    message: '',
    percentComplete: 0,
    files: []
  });

  const conversationMemory = useRef<ConversationMemory | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        conversationMemory.current = ConversationMemory.create();
    }
  }, []);

  const prepareConversationContext = (userPrompt: string): ChatMessage[] => {
    const compressed = compressToTokenLimit(chatMessages, 4000);
    if (conversationMemory.current) {
      const relevantContext = conversationMemory.current.getRelevantContext(userPrompt, 3);
      if (relevantContext.length > 0) {
        const contextMessages: ChatMessage[] = relevantContext.map(ctx => ({
          id: `context-${Date.now()}-${Math.random()}`,
          role: 'system' as const,
          content: `[Relevant past context]: ${ctx.content.substring(0, 200)}...`,
          timestamp: ctx.timestamp
        }));
        return [...compressed.messages.slice(0, -3), ...contextMessages, ...compressed.messages.slice(-3)];
      }
    }
    return compressed.messages;
  };

  const addMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
    if (conversationMemory.current && message.role !== 'system') {
        conversationMemory.current.addMemory(message);
    }
  };

  return {
    chatMessages,
    setChatMessages,
    userInput,
    setUserInput,
    isGenerating,
    setIsGenerating,
    generationProgress,
    setGenerationProgress,
    isStreaming,
    setIsStreaming,
    streamingProgress,
    setStreamingProgress,
    conversationMemory,
    prepareConversationContext,
    addMessage
  };
}
