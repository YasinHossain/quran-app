import { FeatureTemplates } from '../templates';
import { appendFile, ensureDirectories, fileExists, readFile, resolvePaths, writeFile } from './file-system';
import { capitalize, useCaseNames } from './format';

class FeatureWriter {
  private featureName = '';
  private paths = { featurePath: '', domainPath: '' };
  private templates = new FeatureTemplates('');

  async generateFeature(featureName: string): Promise<void> {
    this.featureName = featureName;
    this.paths = resolvePaths(featureName);
    this.templates = new FeatureTemplates(featureName);
    console.log(`🚀 Generating feature: ${featureName}\n`);
    try {
      await this.createDirectoryStructure();
      await this.generateDomainLayer();
      await this.generateApplicationLayer();
      await this.generateInfrastructureLayer();
      await this.generatePresentationLayer();
      await this.generateTests();
      await this.updateConfiguration();
      console.log(`✅ Feature "${featureName}" generated successfully!`);
      console.log('\n📋 Next steps:');
      console.log('1. Update the domain entity with business logic');
      console.log('2. Implement repository with actual API calls');
      console.log('3. Add feature-specific styling and responsiveness');
      console.log('4. Run tests: npm run test');
      console.log('5. Add to navigation if needed');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('❌ Feature generation failed:', message);
      throw error;
    }
  }

  private async createDirectoryStructure(): Promise<void> {
    console.log('📁 Creating directory structure...');
    const { featurePath } = this.paths;
    const dirs = [
      featurePath,
      `${featurePath}/components`,
      `${featurePath}/components/atoms`,
      `${featurePath}/components/molecules`,
      `${featurePath}/components/organisms`,
      `${featurePath}/hooks`,
      `${featurePath}/__tests__`,
      'src/domain/entities',
      'src/domain/repositories',
      'src/domain/services',
      'src/application/use-cases',
      'src/application/dto',
      'src/infrastructure/repositories',
      'tests/unit/domain/entities',
      'tests/unit/domain/services',
      'tests/integration/repositories',
      `tests/e2e/${this.featureName}`,
    ];
    ensureDirectories(dirs);
  }

  private async generateDomainLayer(): Promise<void> {
    console.log('🏗️ Generating domain layer...');
    const name = capitalize(this.featureName);
    writeFile(`src/domain/entities/${name}.ts`, this.templates.generateEntityTemplate(), `${name} entity`);
    writeFile(`src/domain/repositories/I${name}Repository.ts`, this.templates.generateRepositoryInterfaceTemplate(), `I${name}Repository interface`);
    writeFile(`src/domain/services/${name}Service.ts`, this.templates.generateDomainServiceTemplate(), `${name}Service`);
  }

  private async generateApplicationLayer(): Promise<void> {
    console.log('⚙️ Generating application layer...');
    const name = capitalize(this.featureName);
    for (const useCase of useCaseNames(this.featureName)) {
      writeFile(`src/application/use-cases/${useCase}UseCase.ts`, this.templates.generateUseCaseTemplate(useCase), `${useCase}UseCase`);
    }
    writeFile(`src/application/dto/${name}Dto.ts`, this.templates.generateDtoTemplate(), `${name}Dto`);
  }

  private async generateInfrastructureLayer(): Promise<void> {
    console.log('🔌 Generating infrastructure layer...');
    const name = capitalize(this.featureName);
    writeFile(`src/infrastructure/repositories/${name}Repository.ts`, this.templates.generateRepositoryImplementationTemplate(), `${name}Repository implementation`);
  }

  private async generatePresentationLayer(): Promise<void> {
    console.log('🎨 Generating presentation layer...');
    const { featurePath } = this.paths;
    const name = capitalize(this.featureName);
    writeFile(`${featurePath}/page.tsx`, this.templates.generatePageTemplate(), 'page.tsx');
    writeFile(`${featurePath}/layout.tsx`, this.templates.generateLayoutTemplate(), 'layout.tsx');
    writeFile(`${featurePath}/components/atoms/${name}Card.tsx`, this.templates.generateAtomTemplate());
    writeFile(`${featurePath}/components/molecules/${name}List.tsx`, this.templates.generateMoleculeTemplate());
    writeFile(`${featurePath}/components/organisms/${name}Manager.tsx`, this.templates.generateOrganismTemplate());
    writeFile(`${featurePath}/hooks/use${name}.ts`, this.templates.generateHookTemplate());
    console.log('   Created: atomic design components and hooks');
  }

  private async generateTests(): Promise<void> {
    console.log('🧪 Generating tests...');
    const { featurePath } = this.paths;
    const name = capitalize(this.featureName);
    writeFile(`tests/unit/domain/entities/${name}.test.ts`, this.templates.generateEntityTestTemplate());
    writeFile(`tests/unit/domain/services/${name}Service.test.ts`, this.templates.generateServiceTestTemplate());
    writeFile(`tests/integration/repositories/${name}Repository.test.ts`, this.templates.generateRepositoryTestTemplate());
    writeFile(`${featurePath}/__tests__/${name}Manager.test.tsx`, this.templates.generateComponentTestTemplate());
    writeFile(`tests/e2e/${this.featureName}/${this.featureName}.spec.ts`, this.templates.generateE2ETestTemplate(), 'comprehensive test suite');
  }

  private async updateConfiguration(): Promise<void> {
    console.log('⚙️ Updating configuration...');
    const typesIndexPath = 'types/index.ts';
    if (fileExists(typesIndexPath)) {
      const content = readFile(typesIndexPath);
      if (!content.includes(capitalize(this.featureName))) {
        appendFile(typesIndexPath, `export * from './${this.featureName}';\n`);
      }
    }
    console.log('   Updated: configuration files');
  }
}

export async function generateFeature(featureName: string): Promise<void> {
  const writer = new FeatureWriter();
  await writer.generateFeature(featureName);
}
