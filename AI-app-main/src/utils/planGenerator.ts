/**
 * Implementation Plan Generator
 *
 * Analyzes an AppConcept and generates a detailed, step-by-step
 * implementation plan that can be executed by the AI Builder.
 */

import type { AppConcept, ImplementationPlan, BuildPhase, Feature } from '../types/appConcept';

/**
 * Generate a complete implementation plan from an app concept
 */
export function generateImplementationPlan(concept: AppConcept): ImplementationPlan {
  const phases: BuildPhase[] = [];
  let phaseNumber = 1;

  // Phase 1: Foundation & Layout
  phases.push(createFoundationPhase(concept, phaseNumber++));

  // Phase 2: Core UI Components (if needed)
  if (shouldCreateUIComponentsPhase(concept)) {
    phases.push(createUIComponentsPhase(concept, phaseNumber++));
  }

  // Phase 3: Data Models & State Management
  if (concept.technical.needsDatabase || concept.technical.dataModels?.length) {
    phases.push(createDataModelsPhase(concept, phaseNumber++));
  }

  // Phase 4: Authentication (if needed)
  if (concept.technical.needsAuth) {
    phases.push(createAuthenticationPhase(concept, phaseNumber++));
  }

  // Phase 5-N: Feature Implementation (one phase per high-priority feature)
  const sortedFeatures = sortFeaturesByDependencies(concept.coreFeatures);

  for (const feature of sortedFeatures) {
    if (feature.priority === 'high') {
      phases.push(createFeaturePhase(concept, feature, phaseNumber++));
    }
  }

  // Phase N+1: Medium priority features (combined)
  const mediumFeatures = sortedFeatures.filter(f => f.priority === 'medium');
  if (mediumFeatures.length > 0) {
    phases.push(createCombinedFeaturesPhase(concept, mediumFeatures, phaseNumber++, 'Medium Priority Features'));
  }

  // Phase N+2: Polish & Refinement
  phases.push(createPolishPhase(concept, phaseNumber++));

  // Set dependencies between phases
  setPhaseDependencies(phases);

  return {
    concept,
    phases,
    estimatedSteps: phases.length,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Phase 1: Create foundation and basic layout
 */
function createFoundationPhase(concept: AppConcept, phaseNumber: number): BuildPhase {
  const layoutType = concept.uiPreferences.layout;
  const style = concept.uiPreferences.style;

  let layoutDescription = '';
  switch (layoutType) {
    case 'single-page':
      layoutDescription = 'single-page layout with smooth scrolling sections';
      break;
    case 'multi-page':
      layoutDescription = 'multi-page layout with navigation between pages';
      break;
    case 'dashboard':
      layoutDescription = 'dashboard layout with sidebar navigation and main content area';
      break;
    default:
      layoutDescription = 'flexible layout';
  }

  const prompt = `Build the foundation for "${concept.name}".

**App Purpose**: ${concept.purpose}
**Target Users**: ${concept.targetUsers}

Create a ${layoutDescription} with a ${style} design style. Include:
- Header with app name and navigation
- Main content area (placeholder for now)
- Footer with basic info
${concept.uiPreferences.primaryColor ? `- Use ${concept.uiPreferences.primaryColor} as the primary color` : ''}
${concept.uiPreferences.colorScheme !== 'auto' ? `- Use ${concept.uiPreferences.colorScheme} mode` : ''}

Make it visually appealing with Tailwind CSS and ensure it's responsive.`;

  return {
    id: `phase-${phaseNumber}`,
    phaseNumber,
    name: 'Foundation & Layout',
    description: 'Create the basic app structure, layout, and navigation',
    objectives: [
      'Establish app layout and structure',
      'Create navigation system',
      'Set up color scheme and styling',
      'Ensure responsive design',
    ],
    prompt,
    dependencies: [],
    features: [],
    estimatedComplexity: 'simple',
    status: 'pending',
  };
}

/**
 * Create UI Components phase if needed
 */
function shouldCreateUIComponentsPhase(concept: AppConcept): boolean {
  // Check if the app needs reusable components
  const hasMultipleFeatures = concept.coreFeatures.length >= 3;
  const needsComplexUI = concept.uiPreferences.layout === 'dashboard';
  return hasMultipleFeatures || needsComplexUI;
}

function createUIComponentsPhase(concept: AppConcept, phaseNumber: number): BuildPhase {
  const prompt = `Create reusable UI components for "${concept.name}".

Build these core components:
- Button component (primary, secondary, danger variants)
- Card component for displaying content
- Input components (text, textarea, select)
- Modal/Dialog component
- Loading/Spinner component

Use Tailwind CSS and make them consistent with the ${concept.uiPreferences.style} design style.
${concept.uiPreferences.primaryColor ? `Use ${concept.uiPreferences.primaryColor} for primary elements.` : ''}`;

  return {
    id: `phase-${phaseNumber}`,
    phaseNumber,
    name: 'Reusable UI Components',
    description: 'Build core reusable components for the app',
    objectives: [
      'Create button components',
      'Build form input components',
      'Add modal/dialog components',
      'Create loading states',
    ],
    prompt,
    dependencies: [`phase-${phaseNumber - 1}`],
    features: [],
    estimatedComplexity: 'moderate',
    status: 'pending',
  };
}

/**
 * Create Data Models phase
 */
function createDataModelsPhase(concept: AppConcept, phaseNumber: number): BuildPhase {
  const dataModels = concept.technical.dataModels || [];

  const modelsDescription = dataModels.map(model => {
    const fields = model.fields.map(f => `  - ${f.name}: ${f.type}${f.required ? ' (required)' : ''}`).join('\n');
    return `**${model.name}**:\n${fields}`;
  }).join('\n\n');

  const prompt = `Set up state management and data structures for "${concept.name}".

Create these data models using React state (useState/useReducer):

${modelsDescription || 'Create appropriate data structures based on the app features.'}

Implement CRUD operations (Create, Read, Update, Delete) for each model.
Use proper TypeScript types and interfaces.`;

  return {
    id: `phase-${phaseNumber}`,
    phaseNumber,
    name: 'Data Models & State',
    description: 'Set up data structures and state management',
    objectives: [
      'Define TypeScript interfaces for data models',
      'Implement state management',
      'Create CRUD operations',
      'Add data validation',
    ],
    prompt,
    dependencies: [`phase-${phaseNumber - 1}`],
    features: [],
    estimatedComplexity: 'moderate',
    status: 'pending',
  };
}

/**
 * Create Authentication phase
 */
function createAuthenticationPhase(concept: AppConcept, phaseNumber: number): BuildPhase {
  const authType = concept.technical.authType || 'simple';

  let authDescription = '';
  switch (authType) {
    case 'simple':
      authDescription = 'simple password-based authentication';
      break;
    case 'email':
      authDescription = 'email and password authentication with validation';
      break;
    case 'oauth':
      authDescription = 'OAuth-based authentication (prepare structure for provider integration)';
      break;
  }

  const prompt = `Add ${authDescription} to "${concept.name}".

Implement:
- Login form with proper validation
- Logout functionality
- Protected routes/content (show only when authenticated)
- Auth state management
${authType === 'email' ? '- Email validation and password strength requirements' : ''}

Make the auth UI match the ${concept.uiPreferences.style} design style.`;

  return {
    id: `phase-${phaseNumber}`,
    phaseNumber,
    name: 'Authentication',
    description: `Implement ${authType} authentication`,
    objectives: [
      'Create login form',
      'Implement auth logic',
      'Add protected routes',
      'Handle auth state',
    ],
    prompt,
    dependencies: [`phase-${phaseNumber - 1}`],
    features: [],
    estimatedComplexity: 'moderate',
    status: 'pending',
  };
}

/**
 * Create a phase for a single feature
 */
function createFeaturePhase(concept: AppConcept, feature: Feature, phaseNumber: number): BuildPhase {
  const prompt = `Implement the "${feature.name}" feature for "${concept.name}".

**Feature Description**: ${feature.description}

**Context**: ${concept.purpose}

Build this feature with:
- User interface that matches the ${concept.uiPreferences.style} design
- Proper state management and data handling
- Error handling and validation
- Responsive design

Make sure it integrates seamlessly with the existing app structure.`;

  return {
    id: `phase-${phaseNumber}`,
    phaseNumber,
    name: feature.name,
    description: feature.description,
    objectives: [
      `Implement ${feature.name} functionality`,
      'Create user interface',
      'Add data handling',
      'Ensure proper integration',
    ],
    prompt,
    dependencies: feature.dependencies?.map(depId => {
      const depFeature = concept.coreFeatures.find(f => f.id === depId);
      // Find the phase for this dependency
      return `phase-feature-${depId}`;
    }) || [`phase-${phaseNumber - 1}`],
    features: [feature.id],
    estimatedComplexity: 'moderate',
    status: 'pending',
  };
}

/**
 * Create a combined phase for multiple features
 */
function createCombinedFeaturesPhase(
  concept: AppConcept,
  features: Feature[],
  phaseNumber: number,
  phaseName: string
): BuildPhase {
  const featuresList = features.map(f => `- **${f.name}**: ${f.description}`).join('\n');

  const prompt = `Add these additional features to "${concept.name}":

${featuresList}

**Context**: ${concept.purpose}

Implement all these features with:
- Consistent ${concept.uiPreferences.style} design
- Proper integration with existing functionality
- Good user experience
- Responsive layouts

Make them work together harmoniously.`;

  return {
    id: `phase-${phaseNumber}`,
    phaseNumber,
    name: phaseName,
    description: `Implement ${features.length} additional features`,
    objectives: features.map(f => `Add ${f.name}`),
    prompt,
    dependencies: [`phase-${phaseNumber - 1}`],
    features: features.map(f => f.id),
    estimatedComplexity: 'complex',
    status: 'pending',
  };
}

/**
 * Create final polish phase
 */
function createPolishPhase(concept: AppConcept, phaseNumber: number): BuildPhase {
  const prompt = `Polish and refine "${concept.name}".

**Final touches**:
- Improve overall visual consistency
- Add smooth transitions and animations
- Enhance user feedback (loading states, success messages, errors)
- Optimize performance
- Add accessibility features (ARIA labels, keyboard navigation)
- Final responsive design adjustments
${concept.uiPreferences.inspiration ? `- Incorporate inspiration from: ${concept.uiPreferences.inspiration}` : ''}

Make the app feel polished and production-ready.`;

  return {
    id: `phase-${phaseNumber}`,
    phaseNumber,
    name: 'Polish & Refinement',
    description: 'Final polish, animations, and UX improvements',
    objectives: [
      'Add animations and transitions',
      'Improve loading states',
      'Enhance accessibility',
      'Final UX improvements',
    ],
    prompt,
    dependencies: [`phase-${phaseNumber - 1}`],
    features: [],
    estimatedComplexity: 'simple',
    status: 'pending',
  };
}

/**
 * Sort features by dependencies (topological sort)
 */
function sortFeaturesByDependencies(features: Feature[]): Feature[] {
  const sorted: Feature[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(feature: Feature) {
    if (visited.has(feature.id)) return;
    if (visiting.has(feature.id)) {
      // Circular dependency - just add it anyway
      return;
    }

    visiting.add(feature.id);

    // Visit dependencies first
    if (feature.dependencies) {
      for (const depId of feature.dependencies) {
        const dep = features.find(f => f.id === depId);
        if (dep) {
          visit(dep);
        }
      }
    }

    visiting.delete(feature.id);
    visited.add(feature.id);
    sorted.push(feature);
  }

  for (const feature of features) {
    visit(feature);
  }

  return sorted;
}

/**
 * Set proper dependencies between phases
 */
function setPhaseDependencies(phases: BuildPhase[]) {
  // Most phases depend on the previous phase
  for (let i = 1; i < phases.length; i++) {
    if (phases[i].dependencies.length === 0) {
      phases[i].dependencies = [phases[i - 1].id];
    }
  }
}

/**
 * Get the next phase to work on
 */
export function getNextPhase(plan: ImplementationPlan): BuildPhase | null {
  // Find first pending phase whose dependencies are all completed
  for (const phase of plan.phases) {
    if (phase.status === 'pending') {
      const depsSatisfied = phase.dependencies.every(depId => {
        const dep = plan.phases.find(p => p.id === depId);
        return dep?.status === 'completed';
      });

      if (depsSatisfied || phase.dependencies.length === 0) {
        return phase;
      }
    }
  }

  return null;
}

/**
 * Calculate build progress
 */
export function calculateProgress(plan: ImplementationPlan) {
  const completed = plan.phases.filter(p => p.status === 'completed').length;
  const total = plan.phases.length;
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percentComplete,
    currentPhase: plan.phases.find(p => p.status === 'in-progress'),
    nextPhase: getNextPhase(plan),
  };
}
