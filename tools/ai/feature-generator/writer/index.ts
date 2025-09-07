import {
  controllerTemplate,
  entityTemplate,
  repositoryTemplate,
  useCaseTemplate,
} from '../templates';
import { ensureDirectories, writeFile } from './file-system';
import { capitalize } from './format';

const actions = ['get', 'create', 'update', 'delete'] as const;

export async function generateFeature(featureName: string): Promise<void> {
  const name = capitalize(featureName);
  console.log(`🚀 Generating feature: ${featureName}\n`);

  try {
    ensureDirectories([
      'src/domain/entities',
      'src/domain/repositories',
      'src/application/use-cases',
      'src/presentation/controllers',
    ]);

    writeFile(`src/domain/entities/${name}.ts`, entityTemplate(featureName), `${name} entity`);
    writeFile(
      `src/domain/repositories/I${name}Repository.ts`,
      repositoryTemplate(featureName),
      `I${name}Repository interface`
    );

    for (const action of actions) {
      const useCaseName = `${capitalize(action)}${name}`;
      writeFile(
        `src/application/use-cases/${useCaseName}UseCase.ts`,
        useCaseTemplate(featureName, action),
        `${useCaseName}UseCase`
      );
    }

    writeFile(
      `src/presentation/controllers/${name}Controller.ts`,
      controllerTemplate(featureName),
      `${name}Controller`
    );

    console.log(`✅ Feature "${featureName}" generated successfully!`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Feature generation failed:', message);
    throw error;
  }
}
