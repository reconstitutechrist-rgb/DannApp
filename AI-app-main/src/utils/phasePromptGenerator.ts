/**
 * Generate AI prompts from BuildPhase for precise, phase-driven development
 */

import type { BuildPhase, ImplementationPlan } from '../types/appConcept';

export interface PhasePromptContext {
  phase: BuildPhase;
  plan: ImplementationPlan;
  previousPhases?: BuildPhase[];
  completedFiles?: string[];
}

/**
 * Generate a detailed AI prompt from a BuildPhase
 */
export function generatePhasePrompt(context: PhasePromptContext): string {
  const { phase, plan, previousPhases = [], completedFiles = [] } = context;

  // Start with the base prompt from the phase
  let prompt = `## Phase ${phase.phaseNumber}: ${phase.name}\n\n`;
  prompt += `${phase.description}\n\n`;

  // Add objectives
  if (phase.objectives && phase.objectives.length > 0) {
    prompt += `### Objectives:\n`;
    phase.objectives.forEach(obj => {
      prompt += `- ${obj}\n`;
    });
    prompt += '\n';
  }

  // Add feature context
  if (phase.features && phase.features.length > 0) {
    prompt += `### Features to Implement:\n`;
    phase.features.forEach(featureId => {
      const feature = plan.concept.coreFeatures.find(f => f.id === featureId);
      if (feature) {
        prompt += `- **${feature.name}** (${feature.priority} priority): ${feature.description}\n`;
      } else {
        prompt += `- ${featureId}\n`;
      }
    });
    prompt += '\n';
  }

  // Add dependency context
  if (phase.dependencies && phase.dependencies.length > 0) {
    prompt += `### Dependencies (Already Implemented):\n`;
    phase.dependencies.forEach(depId => {
      const depPhase = plan.phases.find(p => p.id === depId);
      if (depPhase) {
        prompt += `- Phase ${depPhase.phaseNumber}: ${depPhase.name}\n`;
        if (depPhase.result?.filesCreated) {
          prompt += `  Files available: ${depPhase.result.filesCreated.join(', ')}\n`;
        }
      }
    });
    prompt += '\n';
  }

  // Add technical context from app concept
  prompt += `### Technical Context:\n`;
  prompt += `- **App Name:** ${plan.concept.name}\n`;
  prompt += `- **Purpose:** ${plan.concept.purpose}\n`;
  prompt += `- **Target Users:** ${plan.concept.targetUsers}\n`;

  if (plan.concept.technical.needsAuth) {
    prompt += `- **Authentication:** ${plan.concept.technical.authType || 'required'}\n`;
  }
  if (plan.concept.technical.needsDatabase) {
    prompt += `- **Database:** Required\n`;
    if (plan.concept.technical.dataModels && plan.concept.technical.dataModels.length > 0) {
      prompt += `  Data models: ${plan.concept.technical.dataModels.map(m => m.name).join(', ')}\n`;
    }
  }
  prompt += '\n';

  // Add UI/UX preferences
  prompt += `### UI/UX Guidelines:\n`;
  prompt += `- **Style:** ${plan.concept.uiPreferences.style}\n`;
  prompt += `- **Color Scheme:** ${plan.concept.uiPreferences.colorScheme}\n`;
  if (plan.concept.uiPreferences.primaryColor) {
    prompt += `- **Primary Color:** ${plan.concept.uiPreferences.primaryColor}\n`;
  }
  prompt += `- **Layout:** ${plan.concept.uiPreferences.layout}\n`;
  prompt += '\n';

  // Add context from previous phases
  if (previousPhases.length > 0) {
    prompt += `### Previous Phase Results:\n`;
    previousPhases.forEach(prevPhase => {
      if (prevPhase.result?.filesCreated && prevPhase.result.filesCreated.length > 0) {
        prompt += `- Phase ${prevPhase.phaseNumber} (${prevPhase.name}) created: ${prevPhase.result.filesCreated.join(', ')}\n`;
      }
    });
    prompt += '\n';
  }

  // Add complexity estimate
  prompt += `### Estimated Complexity: ${phase.estimatedComplexity}\n`;
  if (phase.estimatedHours) {
    prompt += `Estimated time: ${phase.estimatedHours} hours\n`;
  }
  prompt += '\n';

  // Add implementation notes if available
  if (phase.notes) {
    prompt += `### Implementation Notes:\n${phase.notes}\n\n`;
  }

  // Add the specific prompt from the phase (AI instructions)
  prompt += `### Implementation Instructions:\n${phase.prompt}\n\n`;

  // Add output requirements
  prompt += `### Output Requirements:\n`;
  prompt += `Please generate a complete, production-ready implementation for this phase. `;
  prompt += `Include all necessary files, imports, type definitions, and error handling. `;
  prompt += `Follow React and TypeScript best practices. `;
  prompt += `Ensure the code integrates seamlessly with the existing application structure.\n`;

  return prompt;
}

/**
 * Generate a continuation prompt for the next phase
 */
export function generateNextPhasePrompt(
  currentPhase: BuildPhase,
  nextPhase: BuildPhase,
  plan: ImplementationPlan
): string {
  let prompt = `✅ **Phase ${currentPhase.phaseNumber} Complete!**\n\n`;
  prompt += `Successfully implemented: ${currentPhase.name}\n\n`;

  if (currentPhase.result?.filesCreated) {
    prompt += `Files created:\n`;
    currentPhase.result.filesCreated.forEach(file => {
      prompt += `- ${file}\n`;
    });
    prompt += '\n';
  }

  prompt += `---\n\n`;
  prompt += `**Ready for Phase ${nextPhase.phaseNumber}: ${nextPhase.name}**\n\n`;
  prompt += `${nextPhase.description}\n\n`;

  if (nextPhase.objectives && nextPhase.objectives.length > 0) {
    prompt += `Objectives:\n`;
    nextPhase.objectives.forEach(obj => {
      prompt += `- ${obj}\n`;
    });
  }

  return prompt;
}

/**
 * Extract file paths from AI response
 * Attempts to identify created/modified files from the response data
 */
export function extractCreatedFiles(responseData: any): string[] {
  // Guard against null/undefined
  if (!responseData) {
    return [];
  }

  const files: string[] = [];

  // Check if response has explicit files array
  if (responseData.files && Array.isArray(responseData.files)) {
    responseData.files.forEach((file: any) => {
      if (file.path) {
        files.push(file.path);
      } else if (typeof file === 'string') {
        files.push(file);
      }
    });
  }

  // Check for file map structure
  if (responseData.fileMap && typeof responseData.fileMap === 'object') {
    files.push(...Object.keys(responseData.fileMap));
  }

  // Check for components array
  if (responseData.components && Array.isArray(responseData.components)) {
    responseData.components.forEach((comp: any) => {
      if (comp.path) {
        files.push(comp.path);
      }
    });
  }

  return Array.from(new Set(files)); // Remove duplicates
}

/**
 * Calculate estimated completion time for remaining phases
 */
export function estimateRemainingTime(plan: ImplementationPlan): {
  remainingHours: number;
  remainingPhases: number;
  completedPhases: number;
} {
  const completedPhases = plan.phases.filter(p => p.status === 'completed').length;
  const remainingPhases = plan.phases.filter(p => p.status === 'pending').length;

  const remainingHours = plan.phases
    .filter(p => p.status === 'pending')
    .reduce((sum, phase) => {
      if (phase.estimatedHours) return sum + phase.estimatedHours;
      // Default estimates based on complexity
      switch (phase.estimatedComplexity) {
        case 'simple': return sum + 4;
        case 'moderate': return sum + 8;
        case 'complex': return sum + 16;
        default: return sum + 8;
      }
    }, 0);

  return {
    remainingHours,
    remainingPhases,
    completedPhases,
  };
}
