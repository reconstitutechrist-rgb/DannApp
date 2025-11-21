# 🚀 AI App Builder - Conversation-First Full-Stack Generator

Build complete React and Next.js applications through natural conversation with Claude AI. No coding required - just describe what you want to build!

![Version](https://img.shields.io/badge/version-2.5-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204.5-purple)

---

## ✨ Key Features

### 🤖 **Conversation-First Interface**
- Chat with AI like you're talking to a developer
- Natural language app generation
- Iterative refinements through conversation
- Q&A mode for programming questions

### 🎯 **PLAN/ACT Dual Mode System**
- **PLAN Mode**: Discussion and planning without code generation
  - Design app architecture and requirements
  - Create roadmaps and feature specifications
  - Ask clarifying questions and explore ideas
  - Perfect for initial planning phase
- **ACT Mode**: Programming assistance and app generation
  - Answer coding questions
  - Generate complete apps
  - Iterate and refine through conversation
  - Apply modifications to existing code
- **Toggle anytime**: Switch modes based on your needs

### 🏗️ **Full-Stack Support**
- **Frontend-only apps**: Instant preview in browser
- **Full-stack apps**: Next.js with database, auth, APIs
- Prisma ORM, NextAuth.js, API routes included
- One-click export with deployment instructions

### 🔄 **Smart Modification System**
- Diff-based surgical edits (Phase 2 complete)
- Only changes what you request - preserves everything else
- Simple changes: Auto-applied instantly
- Complex changes: Review and approve before applying
- Staged modifications for big features

### 📸 **Image-Inspired Designs with Layout Preview**
- Upload screenshots, mockups, or design references
- AI extracts colors, styles, patterns, and layout structure
- Visual layout preview during wizard (mobile/tablet/desktop)
- Recreates the aesthetic with Tailwind CSS
- Perfect for replicating existing designs or prototypes

### 🕒 **Advanced Version Control**
- Automatic version saving on every change
- Unlimited undo/redo (Ctrl+Z / Ctrl+Shift+Z)
- Fork/branch to create alternative versions
- Compare versions side-by-side
- One-click revert to any previous version

### 📦 **Export & Deploy**
- Download as ZIP with complete project structure
- Includes package.json, configuration, README
- Deployment instructions for Vercel/Netlify
- Ready for production use

### 🔐 **Password Protected**
- Built-in authentication
- Default password: "Nerd" (change in `.env.local`)
- Multi-user ready

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/takk387/AI-app.git
cd AI-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run the development server
npm run dev

# Open http://localhost:3000
```

### Environment Setup

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
SITE_PASSWORD=Nerd
```

---

## 💡 How to Use

### 1. **Choose Your Mode**
- **PLAN Mode**: Design and plan your app without generating code
- **ACT Mode**: Generate code and build your app
- Toggle between modes anytime using the mode selector

### 2. **Start a Conversation**
Just describe what you want to build:
- "Build a todo app with priorities"
- "Create a blog with dark mode"
- "Make a dashboard with charts"

### 3. **Upload Design References (Optional)**
- Upload screenshots or mockups for design inspiration
- AI extracts colors, styles, and layout structure
- See visual layout preview before building

### 4. **Iterative Refinement**
Continue the conversation to improve:
- "Add a dark mode toggle"
- "Make the buttons blue"
- "Add export to CSV functionality"

### 5. **Preview & Test**
- Frontend apps: Instant live preview
- Full-stack apps: Download and run locally
- Fullscreen mode available
- View/edit code in browser

### 6. **Version Control**
- **Ctrl+Z**: Undo last change
- **Ctrl+Shift+Z**: Redo
- Click **🕒 History** to see all versions
- Fork to create alternative versions

### 7. **Export & Deploy**
- Click **📦 Export** for deployment instructions
- Download ZIP with complete project
- Deploy to Vercel, Netlify, or anywhere

---

## 🎯 What Can You Build?

### Frontend-Only Apps (Instant Preview)
- ✅ Todo lists, calculators, games
- ✅ Dashboards, charts, data visualizations  
- ✅ Landing pages, portfolios
- ✅ UI components, design systems

### Full-Stack Apps (Download Required)
- ⚡ Blogs with CMS
- ⚡ E-commerce platforms
- ⚡ SaaS applications
- ⚡ Social media apps
- ⚡ CRM systems
- ⚡ Project management tools

---

## 🛠️ Technology Stack

### Core
- **AI**: Claude Sonnet 4.5-20250929 (Anthropic)
- **Framework**: Next.js 16.0.1 with App Router
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 4.0.0

### Preview System
- **Sandpack**: Browser-based React preview (v2.20.0)
- **Live Editing**: Real-time code updates
- **Resizable Panels**: react-resizable-panels 3.0.0

### Code Parsing & Modification
- **AST Operations**: tree-sitter 0.25.0
- **JavaScript/TypeScript**: tree-sitter-javascript, tree-sitter-typescript
- **Surgical Edits**: Custom AST modifier for precise code changes
- **Smart Diffs**: Only modifies what you request

### Full-Stack Capabilities
- **Database**: Prisma ORM (PostgreSQL, MySQL, MongoDB, SQLite)
- **Authentication**: NextAuth.js (OAuth, JWT) + Supabase Auth
- **File Upload**: Local storage or cloud (S3, Cloudinary)
- **Real-time**: Pusher, Server-Sent Events
- **Email**: Resend, Nodemailer

---

## 📚 Documentation

- **[Current Features](./CURRENT_FEATURES.md)** - Complete feature list
- **[Keyboard Shortcuts](./KEYBOARD_SHORTCUTS.md)** - Hidden shortcuts
- **[Modification Guide](./MODIFICATION_GUIDE.md)** - How diff system works
- **[Version Control](./VERSION_CONTROL.md)** - Undo/redo/fork/compare
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues
- **[Full-Stack Guide](./FULL_STACK_GUIDE.md)** - Backend features
- **[Deployment](./DEPLOYMENT_GUIDE.md)** - How to deploy

---

## 🏗️ Architecture & Code Organization

### Component Architecture
The app is built with a clean, modular architecture:

**Core Components:**
- **AIBuilder.tsx** - Main orchestrator (refactored: 4131 → 581 lines)
- **BuilderHeader.tsx** - Navigation, mode toggle, layout controls
- **ChatPanel.tsx** - Conversation interface with PLAN/ACT toggle
- **PreviewPanel.tsx** - Code/preview tabs with version controls
- **LayoutPreview.tsx** - Visual layout mockups during planning

**State Management Hooks:**
- **useAIBuilderState.ts** - Centralized state with reducer pattern
- **useChatSystem.ts** - Chat logic with conversation memory
- **useBuilderSettings.ts** - Settings persistence with localStorage

**Type Organization:**
- **aiBuilderTypes.ts** - Builder state and UI types
- **appConcept.ts** - App planning and phase types

**Benefits:**
- 85% reduction in main component complexity
- Improved testability and maintainability
- Better code organization and reusability
- Cleaner separation of concerns

---

## 🔑 Features in Detail

### PLAN/ACT Dual Mode System
The app offers two distinct conversation modes:

**PLAN Mode (Discussion & Planning):**
- Design app architecture without generating code
- Create roadmaps and feature specifications
- Ask clarifying questions and explore ideas
- Perfect for requirements gathering and planning

**ACT Mode (Code Generation):**
- Answer programming questions
- Generate complete applications
- Apply modifications to existing code
- Iterate and refine through conversation

**Smart Mode Detection:**
- AI automatically understands context
- Toggle manually anytime using the mode selector
- Seamless switching between planning and building

### Modification System with AST
Smart diff-based modifications using Abstract Syntax Trees:
- **Simple changes**: Color, text, styling → Auto-applied instantly
- **Medium changes**: New features, dark mode → Auto-applied with preview
- **Complex changes**: Auth, major refactors → Requires approval
- **Surgical precision**: Only changes what you request, preserves everything else
- **Enhanced phase review**: Side-by-side comparison of planned vs implemented phases

### Image Upload with Layout Preview
Upload any image and AI will:
- Extract color palette and design tokens
- Identify design style and patterns
- Generate visual layout preview (mobile/tablet/desktop)
- Recreate the aesthetic with Tailwind CSS
- Match fonts, spacing, and component layouts
- Perfect for replicating existing designs or prototypes

---

## ⌨️ Keyboard Shortcuts

### Version Control
- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` - Redo
- `Ctrl+Y` / `Cmd+Y` - Redo (alternative)

### Interface
- `Enter` - Send message
- `Esc` - Close modals

---

## 🐛 Known Issues

### ~~Complex Modifications~~ ✅ SOLVED IN PHASE 5
**Update:** Authentication and complex modifications now work reliably via AST operations!

**Try it:** Just say "add authentication" - works automatically in one command.

**What works now:**
- ✅ Complete authentication system (login/logout)
- ✅ State management with hooks
- ✅ Component wrapping and conditional rendering
- ✅ Function injection and JSX modifications

### Token Limits
Very large apps may approach the 16K token limit. **Solution**: Build incrementally through conversation stages.

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more.

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# ANTHROPIC_API_KEY=your-key
# SITE_PASSWORD=your-password
```

### Netlify
```bash
# Install Netlify CLI  
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

See [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📊 Current Status

- ✅ **Phase 0**: Planning (Complete)
- ✅ **Phase 1**: Tree-sitter Parser (Complete)
- ✅ **Phase 2**: AST Modifier System (Complete)
- ✅ **Phase 3**: AI Integration (Complete)
- ✅ **Phase 5**: Authentication Support (Complete)
- ✅ **Phase 6**: Enhanced Phase Review System (Complete)
- 🔄 **Phase 7**: Component Architecture Refactoring (In Progress)
- 📝 **Phase 4**: Skipped/Merged with Phase 3

**Latest Updates:**
- Enhanced phase review with side-by-side plan vs implementation comparison
- Image upload support for design-based generation
- PLAN/ACT dual-mode conversation system
- Component refactoring for improved maintainability (AIBuilder.tsx: 4131 → 581 lines)
- UI modernization with futuristic theme
- Tailwind CSS v4 upgrade with modern features

---

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Built with [Claude](https://anthropic.com) by Anthropic
- Preview powered by [Sandpack](https://sandpack.codesandbox.io/)
- UI inspired by Base44's clean design philosophy

---

## 📞 Support

- 📖 [Documentation](./CURRENT_FEATURES.md)
- 🐛 [Report Issues](https://github.com/takk387/AI-app/issues)
- 💬 [Discussions](https://github.com/takk387/AI-app/discussions)

---

**Built with ❤️ using AI-powered development**
