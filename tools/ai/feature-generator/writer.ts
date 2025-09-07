import fs from 'fs';
import { FeatureTemplates } from './templates';

class FeatureWriter {
  private featureName = '';
  private featurePath = '';
  private domainPath = '';
  private templates: FeatureTemplates = new FeatureTemplates('');

  async generateFeature(featureName: string): Promise<void> {
    this.featureName = featureName;
    this.featurePath = `app/(features)/${featureName}`;
    this.domainPath = `src/domain/entities`;
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

    const directories = [
      // Feature directories
      this.featurePath,
      `${this.featurePath}/components`,
      `${this.featurePath}/components/atoms`,
      `${this.featurePath}/components/molecules`,
      `${this.featurePath}/components/organisms`,
      `${this.featurePath}/hooks`,
      `${this.featurePath}/__tests__`,

      // Domain directories
      `src/domain/entities`,
      `src/domain/repositories`,
      `src/domain/services`,

      // Application directories
      `src/application/use-cases`,
      `src/application/dto`,

      // Infrastructure directories
      `src/infrastructure/repositories`,

      // Test directories
      `tests/unit/domain/entities`,
      `tests/integration/repositories`,
      `tests/e2e/${this.featureName}`,
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   Created: ${dir}`);
      }
    }
  }

  private async generateDomainLayer(): Promise<void> {
    console.log('🏗️ Generating domain layer...');

    const entityContent = this.templates.generateEntityTemplate();
    fs.writeFileSync(`src/domain/entities/${this.capitalize(this.featureName)}.ts`, entityContent);
    console.log(`   Created: ${this.capitalize(this.featureName)} entity`);

    const repositoryContent = this.templates.generateRepositoryInterfaceTemplate();
    fs.writeFileSync(
      `src/domain/repositories/I${this.capitalize(this.featureName)}Repository.ts`,
      repositoryContent
    );
    console.log(`   Created: I${this.capitalize(this.featureName)}Repository interface`);

    const serviceContent = this.templates.generateDomainServiceTemplate();
    fs.writeFileSync(
      `src/domain/services/${this.capitalize(this.featureName)}Service.ts`,
      serviceContent
    );
    console.log(`   Created: ${this.capitalize(this.featureName)}Service`);
  }

  private async generateApplicationLayer(): Promise<void> {
    console.log('⚙️ Generating application layer...');

    const useCases = [
      `Get${this.capitalize(this.featureName)}`,
      `Create${this.capitalize(this.featureName)}`,
      `Update${this.capitalize(this.featureName)}`,
      `Delete${this.capitalize(this.featureName)}`,
    ];

    for (const useCase of useCases) {
      const content = this.templates.generateUseCaseTemplate(useCase);
      fs.writeFileSync(`src/application/use-cases/${useCase}UseCase.ts`, content);
      console.log(`   Created: ${useCase}UseCase`);
    }

    const dtoContent = this.templates.generateDtoTemplate();
    fs.writeFileSync(`src/application/dto/${this.capitalize(this.featureName)}Dto.ts`, dtoContent);
    console.log(`   Created: ${this.capitalize(this.featureName)}Dto`);
  }

  private async generateInfrastructureLayer(): Promise<void> {
    console.log('🔌 Generating infrastructure layer...');

    const repoImplContent = this.templates.generateRepositoryImplementationTemplate();
    fs.writeFileSync(
      `src/infrastructure/repositories/${this.capitalize(this.featureName)}Repository.ts`,
      repoImplContent
    );
    console.log(`   Created: ${this.capitalize(this.featureName)}Repository implementation`);
  }

  private async generatePresentationLayer(): Promise<void> {
    console.log('🎨 Generating presentation layer...');

    const pageContent = this.templates.generatePageTemplate();
    fs.writeFileSync(`${this.featurePath}/page.tsx`, pageContent);
    console.log(`   Created: page.tsx`);

    const layoutContent = this.templates.generateLayoutTemplate();
    fs.writeFileSync(`${this.featurePath}/layout.tsx`, layoutContent);
    console.log(`   Created: layout.tsx`);

    const atomContent = this.templates.generateAtomTemplate();
    fs.writeFileSync(
      `${this.featurePath}/components/atoms/${this.capitalize(this.featureName)}Card.tsx`,
      atomContent
    );

    const moleculeContent = this.templates.generateMoleculeTemplate();
    fs.writeFileSync(
      `${this.featurePath}/components/molecules/${this.capitalize(this.featureName)}List.tsx`,
      moleculeContent
    );

    const organismContent = this.templates.generateOrganismTemplate();
    fs.writeFileSync(
      `${this.featurePath}/components/organisms/${this.capitalize(this.featureName)}Manager.tsx`,
      organismContent
    );

    const hookContent = this.templates.generateHookTemplate();
    fs.writeFileSync(
      `${this.featurePath}/hooks/use${this.capitalize(this.featureName)}.ts`,
      hookContent
    );

    console.log(`   Created: atomic design components and hooks`);
  }

  private async generateTests(): Promise<void> {
    console.log('🧪 Generating tests...');

    const entityTestContent = this.templates.generateEntityTestTemplate();
    fs.writeFileSync(
      `tests/unit/domain/entities/${this.capitalize(this.featureName)}.test.ts`,
      entityTestContent
    );

    const serviceTestContent = this.templates.generateServiceTestTemplate();
    fs.writeFileSync(
      `tests/unit/domain/services/${this.capitalize(this.featureName)}Service.test.ts`,
      serviceTestContent
    );

    const repositoryTestContent = this.templates.generateRepositoryTestTemplate();
    fs.writeFileSync(
      `tests/integration/repositories/${this.capitalize(this.featureName)}Repository.test.ts`,
      repositoryTestContent
    );

    const componentTestContent = this.templates.generateComponentTestTemplate();
    fs.writeFileSync(
      `${this.featurePath}/__tests__/${this.capitalize(this.featureName)}Manager.test.tsx`,
      componentTestContent
    );

    const e2eTestContent = this.templates.generateE2ETestTemplate();
    fs.writeFileSync(`tests/e2e/${this.featureName}/${this.featureName}.spec.ts`, e2eTestContent);

    console.log(`   Created: comprehensive test suite`);
  }

  private async updateConfiguration(): Promise<void> {
    console.log('⚙️ Updating configuration...');

    const typesIndexPath = 'types/index.ts';
    if (fs.existsSync(typesIndexPath)) {
      const content = fs.readFileSync(typesIndexPath, 'utf8');
      if (!content.includes(this.capitalize(this.featureName))) {
        const newExport = `export * from './${this.featureName}';\n`;
        fs.appendFileSync(typesIndexPath, newExport);
      }
    }

    console.log(`   Updated: configuration files`);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export async function generateFeature(featureName: string): Promise<void> {
  const writer = new FeatureWriter();
  await writer.generateFeature(featureName);
}
