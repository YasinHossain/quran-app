#!/usr/bin/env node

/**
 * AI Documentation Updater
 *
 * Automatically updates documentation when code changes are detected.
 * Maintains consistency between code and documentation.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class AIDocUpdater {
  constructor() {
    this.docMappings = {
      'src/domain/entities/': 'docs/ai/component-registry.md',
      'src/domain/services/': 'docs/ai/architecture-map.md',
      'src/presentation/components/': 'docs/ai/component-registry.md',
      'app/(features)/': 'docs/ai/component-registry.md',
      'types/': 'docs/ai/architecture-map.md',
    };
  }

  async updateDocs() {
    console.log('📚 Running AI Documentation Updates...\n');

    try {
      const changedFiles = this.getChangedFiles();
      const docsToUpdate = this.identifyDocsToUpdate(changedFiles);

      for (const docPath of docsToUpdate) {
        await this.updateDocFile(docPath, changedFiles);
      }

      await this.updateComponentRegistry();
      await this.updateArchitectureMap();

      console.log('✅ Documentation updates complete!');
    } catch (error) {
      console.error('❌ Documentation update error:', error.message);
      process.exit(1);
    }
  }

  getChangedFiles() {
    try {
      const output = execSync('git diff --name-only HEAD~1', { encoding: 'utf8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      // Fallback to staged files if no previous commit
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return output.trim().split('\n').filter(Boolean);
    }
  }

  identifyDocsToUpdate(changedFiles) {
    const docsToUpdate = new Set();

    for (const file of changedFiles) {
      for (const [pathPattern, docFile] of Object.entries(this.docMappings)) {
        if (file.includes(pathPattern)) {
          docsToUpdate.add(docFile);
        }
      }
    }

    return Array.from(docsToUpdate);
  }

  async updateDocFile(docPath, changedFiles) {
    console.log(`📄 Updating ${docPath}...`);

    if (!fs.existsSync(docPath)) {
      console.log(`   Document not found: ${docPath}`);
      return;
    }

    const content = fs.readFileSync(docPath, 'utf8');
    let updatedContent = content;

    // Add timestamp of last update
    const timestamp = new Date().toISOString().split('T')[0];
    const timestampPattern = /Last updated: \d{4}-\d{2}-\d{2}/;

    if (timestampPattern.test(updatedContent)) {
      updatedContent = updatedContent.replace(timestampPattern, `Last updated: ${timestamp}`);
    } else {
      // Add timestamp at the end
      updatedContent += `\n\n---\n*Last updated: ${timestamp}*\n`;
    }

    // Add note about changed files
    const changedFilesNote = `\n<!-- Recent changes: ${changedFiles
      .filter((f) => Object.keys(this.docMappings).some((pattern) => f.includes(pattern)))
      .join(', ')} -->\n`;

    if (!updatedContent.includes('<!-- Recent changes:')) {
      updatedContent += changedFilesNote;
    }

    fs.writeFileSync(docPath, updatedContent);
    console.log(`   ✅ Updated ${docPath}`);
  }

  async updateComponentRegistry() {
    console.log('🔍 Scanning for new components...');

    const registryPath = 'docs/ai/component-registry.md';
    if (!fs.existsSync(registryPath)) return;

    const components = await this.scanComponents();
    const currentRegistry = fs.readFileSync(registryPath, 'utf8');

    let newEntries = [];

    for (const component of components) {
      if (!currentRegistry.includes(component.name)) {
        newEntries.push(this.generateComponentEntry(component));
        console.log(`   📝 Found new component: ${component.name}`);
      }
    }

    if (newEntries.length > 0) {
      const newSection = `\n## Recently Added Components\n\n${newEntries.join('\n\n')}\n`;
      const updatedRegistry = currentRegistry + newSection;
      fs.writeFileSync(registryPath, updatedRegistry);
      console.log(`   ✅ Added ${newEntries.length} new component entries`);
    }
  }

  async scanComponents() {
    const components = [];
    const componentDirs = ['src/presentation/components', 'app/(features)', 'app/shared'];

    for (const dir of componentDirs) {
      if (!fs.existsSync(dir)) continue;

      const files = this.getComponentFiles(dir);
      for (const file of files) {
        const component = this.parseComponent(file);
        if (component) {
          components.push(component);
        }
      }
    }

    return components;
  }

  getComponentFiles(dir) {
    const files = [];

    const scan = (currentDir) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          scan(fullPath);
        } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) {
          files.push(fullPath);
        }
      }
    };

    scan(dir);
    return files;
  }

  parseComponent(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract component name
      const nameMatch = content.match(/export\s+const\s+(\w+).*React\.FC/);
      if (!nameMatch) return null;

      const name = nameMatch[1];

      // Extract props interface
      const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]*)}/s);
      const props = propsMatch ? this.parseProps(propsMatch[2]) : [];

      // Determine component type
      const type = this.determineComponentType(filePath);

      return {
        name,
        path: filePath,
        type,
        props,
        description: this.extractDescription(content),
      };
    } catch {
      console.warn(`   ⚠️  Could not parse component: ${filePath}`);
      return null;
    }
  }

  parseProps(propsString) {
    const props = [];
    const propMatches = propsString.matchAll(/(\w+)(\??):\s*([^;]+)/g);

    for (const match of propMatches) {
      props.push({
        name: match[1],
        optional: match[2] === '?',
        type: match[3].trim(),
      });
    }

    return props;
  }

  determineComponentType(filePath) {
    if (filePath.includes('/atoms/')) return 'Atom';
    if (filePath.includes('/molecules/')) return 'Molecule';
    if (filePath.includes('/organisms/')) return 'Organism';
    if (filePath.includes('/templates/')) return 'Template';
    if (filePath.includes('/(features)/')) return 'Feature';
    return 'Component';
  }

  extractDescription(content) {
    // Look for JSDoc comments
    const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);
    if (commentMatch) {
      return commentMatch[1];
    }

    // Fallback to component name description
    return 'Component description not available';
  }

  generateComponentEntry(component) {
    const propsString = component.props
      .map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
      .join(', ');

    return `### ${component.name} (${component.type})
- **Location**: \`${component.path}\`
- **Purpose**: ${component.description}
- **Props**: \`${propsString || 'No props'}\`
- **Usage**: Standard ${component.type.toLowerCase()} component following atomic design`;
  }

  async updateArchitectureMap() {
    console.log('🏗️  Updating architecture map...');

    const mapPath = 'docs/ai/architecture-map.md';
    if (!fs.existsSync(mapPath)) return;

    const services = await this.scanServices();
    const entities = await this.scanEntities();

    let currentMap = fs.readFileSync(mapPath, 'utf8');

    // Update services list
    const servicesSection = this.generateServicesSection(services);
    const servicesPattern = /(### Available Services[\s\S]*?)(\n###|\n##|$)/;

    if (servicesPattern.test(currentMap)) {
      currentMap = currentMap.replace(
        servicesPattern,
        `### Available Services\n${servicesSection}$2`
      );
    }

    // Update entities list
    const entitiesSection = this.generateEntitiesSection(entities);
    const entitiesPattern = /(### Domain Entities[\s\S]*?)(\n###|\n##|$)/;

    if (entitiesPattern.test(currentMap)) {
      currentMap = currentMap.replace(entitiesPattern, `### Domain Entities\n${entitiesSection}$2`);
    }

    fs.writeFileSync(mapPath, currentMap);
    console.log('   ✅ Architecture map updated');
  }

  async scanServices() {
    const services = [];
    const servicesDir = 'src/domain/services';

    if (!fs.existsSync(servicesDir)) return services;

    const files = fs.readdirSync(servicesDir).filter((f) => f.endsWith('.ts'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
      const serviceMatch = content.match(/export\s+class\s+(\w+Service)/);

      if (serviceMatch) {
        services.push({
          name: serviceMatch[1],
          file: file,
          methods: this.extractMethods(content),
        });
      }
    }

    return services;
  }

  async scanEntities() {
    const entities = [];
    const entitiesDir = 'src/domain/entities';

    if (!fs.existsSync(entitiesDir)) return entities;

    const files = fs.readdirSync(entitiesDir).filter((f) => f.endsWith('.ts'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(entitiesDir, file), 'utf8');
      const entityMatch = content.match(/export\s+class\s+(\w+)/);

      if (entityMatch) {
        entities.push({
          name: entityMatch[1],
          file: file,
          methods: this.extractMethods(content),
        });
      }
    }

    return entities;
  }

  extractMethods(content) {
    const methods = [];
    const methodMatches = content.matchAll(
      /(?:public\s+)?(\w+)\s*\([^)]*\)(?:\s*:\s*[^{]+)?(?:\s*{|\s*;)/g
    );

    for (const match of methodMatches) {
      if (!['constructor'].includes(match[1])) {
        methods.push(match[1]);
      }
    }

    return methods;
  }

  generateServicesSection(services) {
    return services
      .map((service) => `- **${service.name}Service**: ${service.methods.join(', ')}`)
      .join('\n');
  }

  generateEntitiesSection(entities) {
    return entities
      .map((entity) => `- **${entity.name}**: ${entity.methods.join(', ')}`)
      .join('\n');
  }
}

// CLI interface
if (require.main === module) {
  const updater = new AIDocUpdater();
  updater.updateDocs().catch(console.error);
}

module.exports = AIDocUpdater;
