// Conversation export utilities

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  componentCode?: string;
}

export interface ExportOptions {
  includeTimestamps?: boolean;
  includeCode?: boolean;
  includeMetadata?: boolean;
  format?: 'markdown' | 'json' | 'html' | 'txt';
}

/**
 * Export conversation to markdown format
 */
export function exportToMarkdown(
  messages: ChatMessage[],
  options: ExportOptions = {}
): string {
  const {
    includeTimestamps = true,
    includeCode = true,
    includeMetadata = true,
  } = options;

  let markdown = '';

  // Add header
  if (includeMetadata) {
    markdown += `# AI Builder Conversation\n\n`;
    markdown += `**Exported:** ${new Date().toLocaleString()}\n`;
    markdown += `**Messages:** ${messages.length}\n\n`;
    markdown += `---\n\n`;
  }

  // Add messages
  messages.forEach((message, index) => {
    const roleEmoji = {
      user: '👤',
      assistant: '🤖',
      system: '⚙️',
    }[message.role];

    const roleName = message.role.charAt(0).toUpperCase() + message.role.slice(1);

    markdown += `## ${roleEmoji} ${roleName}`;

    if (includeTimestamps && message.timestamp) {
      const date = new Date(message.timestamp);
      markdown += ` · ${date.toLocaleString()}`;
    }

    markdown += '\n\n';
    markdown += message.content + '\n\n';

    // Add code if present
    if (includeCode && message.componentCode) {
      markdown += '```tsx\n';
      markdown += message.componentCode;
      markdown += '\n```\n\n';
    }

    // Add separator between messages (except last one)
    if (index < messages.length - 1) {
      markdown += '---\n\n';
    }
  });

  // Add footer
  if (includeMetadata) {
    markdown += `\n---\n\n`;
    markdown += `*Generated with AI Builder - ${new Date().toISOString()}*\n`;
  }

  return markdown;
}

/**
 * Export conversation to JSON format
 */
export function exportToJSON(
  messages: ChatMessage[],
  options: ExportOptions = {}
): string {
  const { includeMetadata = true } = options;

  const data = includeMetadata
    ? {
        metadata: {
          exportedAt: new Date().toISOString(),
          messageCount: messages.length,
          version: '1.0',
        },
        messages,
      }
    : { messages };

  return JSON.stringify(data, null, 2);
}

/**
 * Export conversation to HTML format
 */
export function exportToHTML(
  messages: ChatMessage[],
  options: ExportOptions = {}
): string {
  const {
    includeTimestamps = true,
    includeCode = true,
    includeMetadata = true,
  } = options;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Builder Conversation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #e5e5e5;
      background: #0a0a0b;
      padding: 2rem;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border: 1px solid rgba(0, 255, 204, 0.2);
    }
    .header h1 {
      color: #00ffcc;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .metadata { color: #a0a0a0; font-size: 0.9rem; }
    .message {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }
    .message-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .role {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .user .role { color: #00ffcc; }
    .assistant .role { color: #a855f7; }
    .system .role { color: #60a5fa; }
    .timestamp {
      color: #666;
      font-size: 0.85rem;
      margin-left: auto;
    }
    .content {
      color: #e5e5e5;
      white-space: pre-wrap;
      word-break: break-word;
    }
    pre {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      margin-top: 1rem;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }
    code {
      color: #00ffcc;
      font-family: 'Courier New', monospace;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 0.85rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
`;

  if (includeMetadata) {
    html += `
    <div class="header">
      <h1>🤖 AI Builder Conversation</h1>
      <div class="metadata">
        <p>Exported: ${new Date().toLocaleString()}</p>
        <p>Messages: ${messages.length}</p>
      </div>
    </div>
`;
  }

  messages.forEach((message) => {
    const roleClass = message.role;
    const roleEmoji = {
      user: '👤',
      assistant: '🤖',
      system: '⚙️',
    }[message.role];

    html += `
    <div class="message ${roleClass}">
      <div class="message-header">
        <span class="role">${roleEmoji} ${message.role.toUpperCase()}</span>
`;

    if (includeTimestamps && message.timestamp) {
      const date = new Date(message.timestamp);
      html += `        <span class="timestamp">${date.toLocaleString()}</span>\n`;
    }

    html += `      </div>
      <div class="content">${escapeHtml(message.content)}</div>
`;

    if (includeCode && message.componentCode) {
      html += `      <pre><code>${escapeHtml(message.componentCode)}</code></pre>\n`;
    }

    html += `    </div>\n`;
  });

  if (includeMetadata) {
    html += `
    <div class="footer">
      Generated with AI Builder · ${new Date().toISOString()}
    </div>
`;
  }

  html += `
  </div>
</body>
</html>`;

  return html;
}

/**
 * Export conversation to plain text format
 */
export function exportToText(
  messages: ChatMessage[],
  options: ExportOptions = {}
): string {
  const {
    includeTimestamps = true,
    includeCode = true,
    includeMetadata = true,
  } = options;

  let text = '';

  if (includeMetadata) {
    text += '====================================\n';
    text += 'AI BUILDER CONVERSATION EXPORT\n';
    text += '====================================\n\n';
    text += `Exported: ${new Date().toLocaleString()}\n`;
    text += `Messages: ${messages.length}\n\n`;
    text += '====================================\n\n';
  }

  messages.forEach((message, index) => {
    const roleName = message.role.toUpperCase();
    text += `[${roleName}]`;

    if (includeTimestamps && message.timestamp) {
      const date = new Date(message.timestamp);
      text += ` - ${date.toLocaleString()}`;
    }

    text += '\n\n';
    text += message.content + '\n';

    if (includeCode && message.componentCode) {
      text += '\n--- CODE ---\n';
      text += message.componentCode + '\n';
      text += '--- END CODE ---\n';
    }

    text += '\n';
    text += '-'.repeat(60) + '\n\n';
  });

  if (includeMetadata) {
    text += '====================================\n';
    text += `Generated: ${new Date().toISOString()}\n`;
    text += '====================================\n';
  }

  return text;
}

/**
 * Download conversation as a file
 */
export function downloadConversation(
  messages: ChatMessage[],
  filename?: string,
  options: ExportOptions = {}
) {
  const format = options.format || 'markdown';
  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'json':
      content = exportToJSON(messages, options);
      mimeType = 'application/json';
      extension = 'json';
      break;
    case 'html':
      content = exportToHTML(messages, options);
      mimeType = 'text/html';
      extension = 'html';
      break;
    case 'txt':
      content = exportToText(messages, options);
      mimeType = 'text/plain';
      extension = 'txt';
      break;
    case 'markdown':
    default:
      content = exportToMarkdown(messages, options);
      mimeType = 'text/markdown';
      extension = 'md';
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const defaultFilename = `conversation_${new Date().toISOString().split('T')[0]}.${extension}`;
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy conversation to clipboard
 */
export async function copyConversationToClipboard(
  messages: ChatMessage[],
  options: ExportOptions = {}
): Promise<boolean> {
  try {
    const format = options.format || 'markdown';
    let content: string;

    switch (format) {
      case 'json':
        content = exportToJSON(messages, options);
        break;
      case 'html':
        content = exportToHTML(messages, options);
        break;
      case 'txt':
        content = exportToText(messages, options);
        break;
      case 'markdown':
      default:
        content = exportToMarkdown(messages, options);
        break;
    }

    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
