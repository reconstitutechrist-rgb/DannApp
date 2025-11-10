import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeComponent,
  generateTests,
  generateTestConfig,
  generateTestSetup,
  getTestDependencies,
  type TestConfiguration,
  type TestFramework
} from '@/utils/testGenerator';

export async function POST(request: NextRequest) {
  try {
    const { code, filePath, framework, config } = await request.json();

    // Validate required parameters
    if (!code || !filePath) {
      return NextResponse.json({
        error: 'Missing required parameters: code and filePath'
      }, { status: 400 });
    }

    // Default framework to vitest if not specified
    const testFramework: TestFramework = framework || 'vitest';

    // Default configuration
    const testConfig: TestConfiguration = {
      framework: testFramework,
      includeSnapshots: config?.includeSnapshots !== false,
      includeAccessibility: config?.includeAccessibility !== false,
      includeIntegration: config?.includeIntegration || false,
      testLibrary: config?.testLibrary || 'react-testing-library'
    };

    // Analyze component
    const analysis = analyzeComponent(code, filePath);

    // Generate tests
    const tests = generateTests(analysis, testConfig);

    // Generate test file path
    const testFilePath = filePath.replace(/\.(tsx?|jsx?)$/, `.test.$1`);

    // Get dependencies
    const dependencies = getTestDependencies(testFramework);

    // Generate configuration files
    const configFile = generateTestConfig(testFramework);
    const setupFile = generateTestSetup(testFramework);

    return NextResponse.json({
      success: true,
      testCode: tests,
      testFilePath,
      analysis: {
        componentName: analysis.name,
        hasProps: analysis.hasProps,
        propCount: analysis.propNames.length,
        hasState: analysis.hasState,
        stateCount: analysis.stateVariables.length,
        hasEffects: analysis.hasEffects,
        hasEventHandlers: analysis.hasEventHandlers,
        eventHandlerCount: analysis.eventHandlers.length
      },
      config: {
        framework: testFramework,
        configFile,
        setupFile,
        dependencies
      }
    });

  } catch (error) {
    console.error('Error generating tests:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate tests'
      },
      { status: 500 }
    );
  }
}
