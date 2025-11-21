# ❓ Frequently Asked Questions (FAQ)

Quick answers to common questions about DannApp's AI App Builder.

---

## 🚀 Getting Started

### Q: What is DannApp's AI App Builder?

**A:** An AI-powered tool that generates complete React applications from natural language descriptions. Simply describe what you want to build, and the AI creates working code with a live preview.

### Q: Do I need coding experience?

**A:** No! The AI App Builder is designed for both developers and non-developers. You describe what you want in plain English, and the AI writes the code. However, coding knowledge helps with advanced customizations.

### Q: What technologies does it use?

**A:** Built with:
- **React 19** for UI
- **Next.js 16** for framework
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Claude AI** (Anthropic) for code generation

### Q: Is it free?

**A:** You need an Anthropic API key to use the AI features. API usage costs depend on your usage and Anthropic's pricing.

---

## 🎨 Building Apps

### Q: What kind of apps can I build?

**A:** You can build:
- Landing pages and portfolios
- Todo lists and task managers
- Dashboards and admin panels
- E-commerce storefronts
- Blog interfaces
- Games (2048, Tic-Tac-Toe, etc.)
- Forms and surveys
- Data visualization tools
- Social media feeds
- And much more!

### Q: How long does it take to build an app?

**A:** 
- **Simple apps**: 30 seconds - 2 minutes
- **Medium apps**: 2 - 5 minutes
- **Complex apps**: 5 - 15 minutes (built in stages)

### Q: Can I build multi-page apps?

**A:** Yes! The AI can create apps with:
- Multiple routes/pages
- Navigation systems
- Shared layouts
- Dynamic routing

### Q: What if I want to modify my app?

**A:** Use the modification system to make changes:
1. Describe what you want to change
2. Review the proposed changes
3. Apply or reject
4. Changes happen instantly

See the USER_MODIFICATION_GUIDE.md for details.

---

## 🔧 Features & Capabilities

### Q: Can it add authentication?

**A:** Yes! Just say "add authentication" and the AI creates:
- Login/logout system
- State management
- Protected content
- User session handling

Note: This is UI-only. For real authentication, you'll need to connect to a backend.

### Q: Can it connect to a database?

**A:** The AI can generate code that interfaces with databases, but you need to:
- Set up your own backend/database
- Provide API endpoints
- Configure authentication

The AI helps with the frontend integration.

### Q: Does it support dark mode?

**A:** Yes! You can:
- Request dark mode during initial build
- Add dark mode to existing apps
- Customize theme colors
- Use system preferences

### Q: Can it make responsive designs?

**A:** Yes! All generated apps are mobile-responsive by default using Tailwind CSS responsive utilities.

### Q: What about accessibility?

**A:** The AI includes basic accessibility features:
- Semantic HTML
- ARIA labels where appropriate
- Keyboard navigation
- Color contrast

For advanced accessibility, you may need to request specific features.

---

## 💻 Technical Questions

### Q: Where is my code stored?

**A:** 
- Code is generated and stored **locally in your browser**
- Nothing is saved to external servers by default
- You can download your code anytime
- Optional: Save to Supabase for persistence

### Q: Can I export my code?

**A:** Yes! Export options:
- **Download as ZIP**: Get all files ready to run
- **Copy to clipboard**: Get code for specific files
- **View source**: See any file's content

### Q: Can I use the exported code in my own projects?

**A:** Absolutely! The generated code is yours to use:
- No restrictions
- No attribution required
- Modify freely
- Deploy anywhere

### Q: Does it work offline?

**A:** Partially:
- Preview works offline
- Code editing works offline
- AI generation requires internet (calls Anthropic API)
- Initial load requires internet

### Q: What browsers are supported?

**A:**
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (limited)

---

## 🛠️ Modifications & Editing

### Q: How do I make changes to my app?

**A:** Three ways:
1. **AI modifications**: Describe changes in natural language
2. **Direct editing**: Edit code in the editor pane
3. **Combination**: Use AI for big changes, manual for tweaks

### Q: What if the AI makes a mistake?

**A:** Easy fixes:
- **Undo**: Press Ctrl+Z or click undo
- **Reject**: Don't apply the proposed changes
- **Rephrase**: Try asking differently
- **Manual fix**: Edit the code directly

### Q: Can I undo changes?

**A:** Yes! Full undo/redo support:
- **Undo**: Ctrl+Z (Cmd+Z on Mac)
- **Redo**: Ctrl+Shift+Z (Cmd+Shift+Z on Mac)
- Unlimited undo history per session

### Q: Why did my modification fail?

**Common reasons:**
- Request was too vague
- Pattern not found in code
- Request too complex
- Timeout (>45 seconds)

**Solutions:** Be more specific, break into smaller changes, or try rephrasing.

### Q: What are AST operations?

**A:** Advanced code modifications that use the code's structure (Abstract Syntax Tree) instead of text matching. More reliable for complex changes like adding hooks or restructuring components.

---

## 🎯 Best Practices

### Q: How should I describe my app?

**A:** 
- Be specific about functionality
- Mention design preferences
- List key features
- Provide examples if helpful

**Example:** "Build a todo list with add/delete functionality, dark blue theme, and categories"

### Q: Should I build everything at once or incrementally?

**A:** **Incremental is better:**
- Start with basic structure
- Add features one at a time
- Test as you go
- Easier to debug

### Q: How detailed should my requests be?

**A:** Balance is key:
- Too vague: "Make a website" ❌
- Too specific: Technical implementation details ❌
- Just right: "Build a landing page with hero section, features grid, and contact form" ✅

### Q: Can I see examples of good prompts?

**A:** Yes! Check the Examples section in this FAQ or USER_MODIFICATION_GUIDE.md for dozens of examples.

---

## 🐛 Troubleshooting

### Q: Preview isn't updating

**A:** Try:
1. Click the refresh button
2. Make a small change (add a space)
3. Check browser console for errors
4. Reload the page

### Q: AI requests are timing out

**A:** 
- Request is too complex - simplify
- Network issues - check connection
- Try again - temporary issue
- Break into smaller changes

### Q: Getting "Pattern not found" errors

**A:**
- Be more specific about what to change
- Reference exact text/elements
- Use simpler modifications
- Check if element exists in your code

### Q: Code has syntax errors

**A:**
- Auto-fix will try to correct
- Review validation warnings
- Reject and try again
- Manually fix in editor if needed

### Q: App crashes or shows errors

**A:**
1. Check browser console
2. Use undo to revert recent changes
3. Export code and check for issues
4. Start fresh if needed

---

## 📱 Deployment

### Q: How do I deploy my app?

**A:** Steps:
1. Export your code (Download ZIP)
2. Extract files locally
3. Run `npm install`
4. Deploy to your preferred platform

See DEPLOYMENT_GUIDE.md for detailed instructions.

### Q: Where can I deploy?

**A:** Compatible with:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ AWS Amplify
- ✅ GitHub Pages
- ✅ Any static host

### Q: Do I need to configure anything before deploying?

**A:** Usually minimal:
- Add environment variables if using APIs
- Configure build settings (usually auto-detected)
- Set up custom domain (optional)

### Q: Can I use my own backend?

**A:** Yes! You can:
- Connect to REST APIs
- Use GraphQL endpoints
- Integrate with Firebase
- Connect to Supabase
- Use any backend service

---

## 💰 Costs & Limits

### Q: What does it cost to use?

**A:**
- **App Builder**: Free (open source)
- **API Costs**: You pay for Anthropic API usage
- **Deployment**: Depends on hosting (many free tiers available)

### Q: How much are API costs?

**A:** Depends on usage:
- Simple app: ~$0.10 - $0.50
- Complex app: ~$0.50 - $2.00
- Modifications: ~$0.02 - $0.20 each

Check Anthropic's pricing for current rates.

### Q: Are there usage limits?

**A:** 
- **Rate limits**: Based on your Anthropic API tier
- **Timeout**: 45 seconds per AI request
- **Storage**: Browser localStorage limits (~10MB)

### Q: Can I use different AI models?

**A:** Currently uses Claude Sonnet 4.5. Support for other models may be added in future versions.

---

## 🔐 Security & Privacy

### Q: Is my code private?

**A:** 
- Code is generated locally
- Stored in browser only
- Not sent to external servers (except AI API for generation)
- Optional Supabase storage is your own instance

### Q: What data is sent to the AI?

**A:** When generating/modifying:
- Your prompt/request
- Current app code (for modifications)
- Conversation history (if applicable)

### Q: Can I use this for commercial projects?

**A:** Yes! The tool and generated code have no restrictions. Check Anthropic's terms for API usage.

### Q: How do I protect API keys?

**A:**
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Use separate keys for dev/prod

---

## 🔄 Updates & Support

### Q: How do I update to the latest version?

**A:** 
- Pull latest changes from GitHub
- Run `npm install`
- Check changelog for breaking changes

### Q: Where can I report bugs?

**A:** Open an issue on the GitHub repository with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Q: Can I contribute to the project?

**A:** Yes! Contributions welcome:
- Bug fixes
- New features
- Documentation improvements
- Examples and templates

See CONTRIBUTING.md (if available) for guidelines.

### Q: Is there a community?

**A:** Check the GitHub repository for:
- Discussions
- Issues
- Pull requests
- Community examples

---

## 🎓 Learning More

### Q: Where can I learn more about the features?

**A:** Documentation files:
- **USER_GUIDE.md** - Complete feature reference
- **USER_MODIFICATION_GUIDE.md** - How to modify apps
- **TESTING_GUIDE.md** - Quality assurance
- **DEPLOYMENT_GUIDE.md** - Publishing your app
- **ARCHITECTURE_TEMPLATES_GUIDE.md** - App patterns

### Q: Are there example apps I can try?

**A:** Yes! Try these prompts:
- "Build a todo list app"
- "Create a landing page for a SaaS product"
- "Make a 2048 game"
- "Build a weather dashboard"
- "Create a recipe book interface"

### Q: Can I see the prompt strategies?

**A:** Yes, check the `/src/prompts/` directory for:
- System prompts
- Modification strategies
- AST operation templates
- Validation rules

---

## 💡 Tips & Tricks

### Q: Any pro tips for better results?

**A:** 
1. **Start simple**: Basic app first, then iterate
2. **Be specific**: Clear details get better results
3. **One feature at a time**: Easier to debug
4. **Use examples**: "Like X but with Y" helps
5. **Review before applying**: Catch issues early
6. **Leverage undo**: Experiment freely
7. **Use conversation history**: AI remembers context
8. **Export often**: Keep backups of working versions

### Q: How do I make the AI understand my design vision?

**A:** 
- Reference specific colors (#hex codes)
- Mention design styles (minimalist, modern, etc.)
- Compare to existing sites/apps
- Specify layouts (grid, flex, etc.)
- Request specific components (cards, modals, etc.)

### Q: What if I want a very specific feature?

**A:** 
- Break it into smaller parts
- Provide detailed descriptions
- Give examples of similar features
- Iterate with modifications
- Combine AI + manual editing

---

## 🎉 Success Stories

### Q: What have people built with this?

**A:** Examples include:
- Portfolio websites
- Admin dashboards
- E-commerce stores
- Educational tools
- Games and entertainment
- Business landing pages
- Internal company tools

### Q: Can I share my creations?

**A:** Absolutely! Share:
- Screenshots on social media
- GitHub repos of exported code
- Live deployments
- Prompts that worked well

---

**Still have questions? Open an issue on GitHub or check the documentation!**
