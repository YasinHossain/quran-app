import fs from 'fs';

import {
  updateDocContent,
  scanComponents,
  generateComponentEntry,
  scanServices,
  scanEntities,
  updateArchitectureMapContent,
} from './parser';

export async function updateDocFile(docPath: string, changedFiles: string[]): Promise<void> {
  console.log(`📄 Updating ${docPath}...`);

  if (!fs.existsSync(docPath)) {
    console.log(`   Document not found: ${docPath}`);
    return;
  }

  const content = fs.readFileSync(docPath, 'utf8');
  const updatedContent = updateDocContent(content, changedFiles);
  fs.writeFileSync(docPath, updatedContent);
  console.log(`   ✅ Updated ${docPath}`);
}

export async function updateComponentRegistry(): Promise<void> {
  console.log('🔍 Scanning for new components...');

  const registryPath = 'docs/ai/component-registry.md';
  if (!fs.existsSync(registryPath)) return;

  const components = await scanComponents();
  const currentRegistry = fs.readFileSync(registryPath, 'utf8');

  const newEntries: string[] = [];

  for (const component of components) {
    if (!currentRegistry.includes(component.name)) {
      newEntries.push(generateComponentEntry(component));
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

export async function updateArchitectureMap(): Promise<void> {
  console.log('🏗️  Updating architecture map...');

  const mapPath = 'docs/ai/architecture-map.md';
  if (!fs.existsSync(mapPath)) return;

  const services = await scanServices();
  const entities = await scanEntities();

  const currentMap = fs.readFileSync(mapPath, 'utf8');
  const updatedMap = updateArchitectureMapContent(currentMap, services, entities);
  fs.writeFileSync(mapPath, updatedMap);
  console.log('   ✅ Architecture map updated');
}
