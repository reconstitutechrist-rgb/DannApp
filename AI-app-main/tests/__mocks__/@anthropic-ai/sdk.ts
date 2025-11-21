/**
 * Mock for @anthropic-ai/sdk
 * 
 * Provides mock implementation of Anthropic SDK for testing
 */

export class Anthropic {
  apiKey: string;

  constructor(config: { apiKey?: string }) {
    this.apiKey = config.apiKey || '';
  }

  messages = {
    stream: jest.fn().mockImplementation(async (params: any) => {
      // Mock stream response
      const mockResponse = {
        changeType: 'MODIFICATION',
        summary: 'Test modification',
        files: [{
          path: 'src/App.tsx',
          action: 'MODIFY',
          changes: [{
            type: 'ADD_IMPORT',
            content: "import { useState } from 'react';"
          }]
        }]
      };

      const mockStream = {
        async *[Symbol.asyncIterator]() {
          yield {
            type: 'content_block_delta',
            delta: {
              type: 'text_delta',
              text: '```json\n'
            }
          };
          yield {
            type: 'content_block_delta',
            delta: {
              type: 'text_delta',
              text: JSON.stringify(mockResponse, null, 2)
            }
          };
          yield {
            type: 'content_block_delta',
            delta: {
              type: 'text_delta',
              text: '\n```'
            }
          };
          yield {
            type: 'message_stop'
          };
        },
        finalMessage: jest.fn().mockResolvedValue({
          usage: {
            input_tokens: 100,
            output_tokens: 50,
            cache_read_input_tokens: 0
          }
        })
      };

      return mockStream;
    }),

    create: jest.fn().mockResolvedValue({
      content: [{
        type: 'text',
        text: JSON.stringify({
          changeType: 'MODIFICATION',
          summary: 'Test modification',
          files: []
        })
      }],
      usage: {
        input_tokens: 100,
        output_tokens: 50
      }
    })
  };
}

export default Anthropic;
