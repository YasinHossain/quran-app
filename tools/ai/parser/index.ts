import fs from 'fs';
import path from 'path';

import {
  parseComponent,
  extractMethods,
  generateServicesSection,
  generateEntitiesSection,
  Component,
  Service,
  Entity,
} from './tokens';

export { updateDocContent, generateComponentEntry } from './tokens';
export type { Component, Service, Entity } from './tokens';

export async function scanComponents(): Promise<Component[]> {
  const components: Component[] = [];
  const componentDirs = ['src/presentation/components', 'app/(features)', 'app/shared'];

  for (const dir of componentDirs) {
    if (!fs.existsSync(dir)) continue;

    const files = getComponentFiles(dir);
    for (const file of files) {
      const component = parseComponent(file);
      if (component) {
        components.push(component);
      }
    }
  }

  return components;
}

function getComponentFiles(dir: string): string[] {
  const files: string[] = [];

  const scan = (currentDir: string): void => {
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

export async function scanServices(): Promise<Service[]> {
  const services: Service[] = [];
  const servicesDir = 'src/domain/services';

  if (!fs.existsSync(servicesDir)) return services;

  const files = fs.readdirSync(servicesDir).filter((f) => f.endsWith('.ts'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
    const serviceMatch = content.match(/export\s+class\s+(\w+Service)/);

    if (serviceMatch && serviceMatch[1]) {
      services.push({
        name: serviceMatch[1],
        file: file,
        methods: extractMethods(content),
      });
    }
  }

  return services;
}

export async function scanEntities(): Promise<Entity[]> {
  const entities: Entity[] = [];
  const entitiesDir = 'src/domain/entities';

  if (!fs.existsSync(entitiesDir)) return entities;

  const files = fs.readdirSync(entitiesDir).filter((f) => f.endsWith('.ts'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(entitiesDir, file), 'utf8');
    const entityMatch = content.match(/export\s+class\s+(\w+)/);

    if (entityMatch && entityMatch[1]) {
      entities.push({
        name: entityMatch[1],
        file: file,
        methods: extractMethods(content),
      });
    }
  }

  return entities;
}

export function updateArchitectureMapContent(
  currentMap: string,
  services: Service[],
  entities: Entity[]
): string {
  const servicesSection = generateServicesSection(services);
  const servicesPattern = /(### Available Services[\s\S]*?)(\n###|\n##|$)/;

  if (servicesPattern.test(currentMap)) {
    currentMap = currentMap.replace(
      servicesPattern,
      `### Available Services\n${servicesSection}$2`
    );
  }

  const entitiesSection = generateEntitiesSection(entities);
  const entitiesPattern = /(### Domain Entities[\s\S]*?)(\n###|\n##|$)/;

  if (entitiesPattern.test(currentMap)) {
    currentMap = currentMap.replace(entitiesPattern, `### Domain Entities\n${entitiesSection}$2`);
  }

  return currentMap;
}
