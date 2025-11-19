# Phase-Driven AI Builder Integration

## Overview

The build plan system now drives actual AI code generation! When you create an implementation plan in the Guided Build view, you can send individual phases to the AI builder, and the AI will build your app **precisely according to the phase specifications**.

## What's New

### 1. Enhanced Phase Prompts

When you start a phase from the Guided Build view, the system now generates a comprehensive AI prompt that includes:

- **Phase Objectives**: Clear goals for what this phase should accomplish
- **Feature Context**: Details about which features to implement, including priority levels
- **Dependencies**: Information about completed phases and their files
- **Technical Context**: App concept, authentication needs, database requirements
- **UI/UX Guidelines**: Style preferences, color schemes, layout patterns
- **Previous Phase Results**: Files created in earlier phases for reference
- **Complexity Estimate**: Time estimates and complexity level
- **Implementation Notes**: Any custom notes you've added to the phase

### 2. Automated Phase Tracking

The system now tracks:
- **Active Phase**: Which BuildPhase is currently being implemented
- **Start Time**: When the phase build started
- **Created Files**: Automatically extracted from the AI response
- **Actual Hours**: Real time spent building the phase
- **Completion Status**: Auto-updates to 'completed' when files are generated

### 3. Build Plan Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Create Implementation Plan (Guided Build View)          │
│     - Define app concept, features, technical requirements  │
│     - System generates phased implementation plan            │
│     - Edit phases, add notes, adjust objectives             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Start Phase (Click "Start Phase" button)                │
│     - System marks phase as 'in-progress'                   │
│     - Generates enhanced AI prompt with full context        │
│     - Tracks phase start time                               │
│     - Switches to AI Builder chat                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. AI Builds Phase                                          │
│     - AI receives comprehensive phase context               │
│     - Generates code following phase objectives             │
│     - Creates files according to phase specifications        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Auto-Update Phase Results                                │
│     - System extracts created files from AI response        │
│     - Calculates actual hours spent                         │
│     - Updates BuildPhase.result with:                       │
│       • filesCreated: Array of file paths                   │
│       • actualHours: Time spent on phase                    │
│       • completedAt: Timestamp                              │
│       • code: Generated code                                │
│     - Marks phase as 'completed'                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Next Phase or Completion                                 │
│     - If more phases: Shows "Ready for Phase X" message     │
│     - Return to Guided Build to start next phase            │
│     - If all complete: Shows completion summary             │
└─────────────────────────────────────────────────────────────┘
```

## How to Use

### Creating a Build Plan

1. **Open Guided Build View**
   - Click the "Guided Build" button in the AI Builder
   - Or use the App Concept Wizard to generate a plan

2. **Define Your App**
   - Enter app name, description, purpose, target users
   - Select core features with priorities
   - Set UI/UX preferences (style, colors, layout)
   - Configure technical requirements (auth, database, API)

3. **Review Generated Plan**
   - System generates a phased implementation plan
   - Each phase has objectives, features, and dependencies
   - Phases are ordered logically based on dependencies

4. **Customize Phases (Optional)**
   - Click "Edit Phases" to modify the plan
   - Add custom objectives or notes
   - Adjust time estimates
   - Reorder phases (respecting dependencies)
   - Add or remove phases

### Building Phase by Phase

1. **Start First Phase**
   - In Guided Build view, click "Start Phase" on Phase 1
   - System generates enhanced prompt and switches to chat
   - AI receives full context about your app and phase goals

2. **Review Generated Code**
   - AI builds according to phase specifications
   - Preview the generated files
   - Test the implementation

3. **Continue to Next Phase**
   - Return to Guided Build view
   - Click "Start Phase" on the next phase
   - AI has context from previous phases (completed files, etc.)

4. **Track Progress**
   - View completed phases with green checkmarks
   - See actual time spent vs. estimates
   - Review files created in each phase

### Enhanced Prompt Example

When you start a phase, the AI receives a prompt like this:

```
## Phase 1: Core Authentication System

Setup user authentication with email/password login, registration, and protected routes.

### Objectives:
- Implement secure authentication flow with Supabase
- Create login and registration forms with validation
- Setup protected route middleware
- Add session management and persistence

### Features to Implement:
- **User Authentication** (high priority): Allow users to sign up, log in, and manage sessions

### Technical Context:
- **App Name:** TaskMaster Pro
- **Purpose:** Help teams manage tasks collaboratively
- **Target Users:** Small to medium teams
- **Authentication:** email
- **Database:** Required
  Data models: User, Task, Team

### UI/UX Guidelines:
- **Style:** modern
- **Color Scheme:** dark
- **Primary Color:** #3b82f6
- **Layout:** dashboard

### Estimated Complexity: moderate
Estimated time: 8 hours

### Implementation Notes:
Use Supabase Auth for secure authentication. Include email verification.

### Implementation Instructions:
Create authentication components, setup Supabase client, implement protected routes...

### Output Requirements:
Please generate a complete, production-ready implementation for this phase...
```

## Key Features

### 1. Dependency Tracking

The system ensures phases are built in the correct order:
- Dependencies listed in each phase
- Previous phase files available as context
- AI knows what's already implemented

### 2. Context Preservation

Each phase build has full context:
- App concept and purpose
- UI/UX preferences
- Technical stack decisions
- Previously created files
- Feature priorities

### 3. Automatic File Tracking

The system automatically:
- Extracts file paths from AI responses
- Updates `BuildPhase.result.filesCreated`
- Makes files available to subsequent phases
- Tracks total files created across all phases

### 4. Time Tracking

Real development metrics:
- Phase start time recorded
- Actual hours calculated
- Compare estimates vs. actuals
- Improve future estimates

### 5. Phase Notes & Customization

Add implementation notes to any phase:
- Technical decisions
- Library choices
- Special requirements
- These notes are included in AI prompts

## File Structure

### New Files

- **`src/utils/phasePromptGenerator.ts`**: Core prompt generation logic
  - `generatePhasePrompt()`: Creates enhanced AI prompts from BuildPhase
  - `extractCreatedFiles()`: Extracts file paths from AI responses
  - `estimateRemainingTime()`: Calculates remaining work
  - `generateNextPhasePrompt()`: Creates transition messages

### Modified Files

- **`src/components/AIBuilder.tsx`**: Integrated phase-driven building
  - Added `activePhase` state to track current BuildPhase
  - Added `phaseStartTimeRef` to track build start time
  - Enhanced `handlePhaseStart()` to use detailed prompts
  - Added BuildPhase completion tracking in response handler
  - Auto-updates `BuildPhase.result` with files and metrics

- **`src/types/appConcept.ts`**: Extended BuildPhase type
  - Added `notes?: string` for phase-specific implementation notes
  - Added `estimatedHours?: number` for time estimates
  - Extended `result.actualHours` for tracking real time spent
  - Extended `result.filesCreated` for tracking generated files

## Benefits

### For Planning

- **Clear Structure**: Break complex apps into manageable phases
- **Dependency Management**: Ensure correct build order
- **Time Estimation**: Plan development timeline
- **Progress Tracking**: See completion percentage

### For Building

- **Focused Development**: AI builds one phase at a time
- **Better Context**: Each phase has full technical context
- **Quality**: AI understands objectives and requirements
- **Consistency**: UI/UX preferences applied across all phases

### For Teams

- **Documentation**: Build plan serves as technical spec
- **Handoffs**: Clear phase boundaries for team collaboration
- **Metrics**: Track actual vs. estimated time
- **Accountability**: See exactly what was built in each phase

## Advanced Usage

### Custom Phase Prompts

You can customize the prompt for any phase:
1. Edit the phase in Phase Editor
2. Update the "Prompt" field with specific instructions
3. Add detailed notes with technical requirements
4. These are included in the enhanced AI prompt

### Phase Dependencies

Manage complex dependencies:
- List prerequisite phases in `dependencies` array
- System ensures they're completed first
- AI receives context about dependent phase files

### Iterative Refinement

After building a phase:
1. Review the generated code
2. Request adjustments in the chat
3. Return to Guided Build for next phase
4. Previous phase context is maintained

### Partial Builds

You don't have to build all phases:
- Start any pending phase individually
- Skip optional phases
- Return to earlier phases for refinement

## Technical Implementation Details

### State Management

```typescript
// Track active BuildPhase
const [activePhase, setActivePhase] = useState<BuildPhase | null>(null);
const phaseStartTimeRef = useRef<number | null>(null);
```

### Enhanced Prompt Generation

```typescript
const enhancedPrompt = generatePhasePrompt({
  phase,
  plan: implementationPlan,
  previousPhases: completedPhases,
  completedFiles: completedPhases.flatMap(p => p.result?.filesCreated || []),
});
```

### Auto-Completion

```typescript
// When AI generates files
const createdFiles = extractCreatedFiles(data);
const actualHours = (Date.now() - phaseStartTimeRef.current) / (1000 * 60 * 60);

// Update phase with results
updatedPlan.phases.map(p =>
  p.id === activePhase.id
    ? {
        ...p,
        status: 'completed',
        result: {
          filesCreated: createdFiles,
          actualHours,
          completedAt: new Date().toISOString(),
          // ...
        },
      }
    : p
);
```

## Next Steps

Consider adding:
- **Undo/Redo** for phase editing (pending task)
- **Phase Templates** for common patterns
- **Batch Building** to auto-execute multiple phases
- **Phase Validation** to verify objectives were met
- **Export Build Log** showing all phases and files created

## Troubleshooting

### Phase Not Completing

If a phase doesn't auto-complete:
- Check that AI generated files (data.files exists)
- Verify `activePhase` is set when starting
- Check console for errors in `extractCreatedFiles()`

### Missing File Context

If AI doesn't see previous phase files:
- Ensure previous phase status is 'completed'
- Check `BuildPhase.result.filesCreated` is populated
- Verify `generatePhasePrompt()` includes `previousPhases`

### Time Tracking Issues

If actual hours seem wrong:
- Check `phaseStartTimeRef.current` is set in `handlePhaseStart()`
- Verify it's cleared after completion
- Time is in hours (milliseconds / 1000 / 60 / 60)

## Summary

The phase-driven AI builder integration makes your build plans **actionable**. Instead of just documentation, your implementation plan now directly controls how the AI builds your app, ensuring:

✅ **Structured Development**: Build in logical phases
✅ **Full Context**: AI understands your app's purpose and requirements
✅ **Progress Tracking**: See exactly what's been built and what remains
✅ **Quality Control**: Each phase has clear objectives and validation
✅ **Time Metrics**: Track estimates vs. actuals for better planning

Start building smarter with phase-driven development!
