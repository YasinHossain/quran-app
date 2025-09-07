import fs from 'fs';

import { docMappings } from '../scanner';
import { Prop, parseProps } from './args';

export interface Component {
  name: string;
  path: string;
  type: string;
  props: Prop[];
  description: string;
}

export interface Service {
  name: string;
  file: string;
  methods: string[];
}

export interface Entity {
  name: string;
  file: string;
  methods: string[];
}

export function updateDocContent(content: string, changedFiles: string[]): string {
  let updatedContent = content;

  const timestamp = new Date().toISOString().split('T')[0];
  const timestampPattern = /Last updated: \d{4}-\d{2}-\d{2}/;

  if (timestampPattern.test(updatedContent)) {
    updatedContent = updatedContent.replace(timestampPattern, `Last updated: ${timestamp}`);
  } else {
    updatedContent += `\n\n---\n*Last updated: ${timestamp}*\n`;
  }

  const changedFilesNote = `\n<!-- Recent changes: ${changedFiles
    .filter((f) => Object.keys(docMappings).some((pattern) => f.includes(pattern)))
    .join(', ')} -->\n`;

  if (!updatedContent.includes('<!-- Recent changes:')) {
    updatedContent += changedFilesNote;
  }

  return updatedContent;
}

export function parseComponent(filePath: string): Component | null {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    const nameMatch = content.match(/export\s+const\s+(\w+).*React\.FC/);
    if (!nameMatch) return null;

    const name = nameMatch[1];

    const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]*)}/s);
    const props = propsMatch ? parseProps(propsMatch[2]) : [];

    const type = determineComponentType(filePath);

    return {
      name,
      path: filePath,
      type,
      props,
      description: extractDescription(content),
    };
  } catch {
    console.warn(`   ⚠️  Could not parse component: ${filePath}`);
    return null;
  }
}

function determineComponentType(filePath: string): string {
  if (filePath.includes('/atoms/')) return 'Atom';
  if (filePath.includes('/molecules/')) return 'Molecule';
  if (filePath.includes('/organisms/')) return 'Organism';
  if (filePath.includes('/templates/')) return 'Template';
  if (filePath.includes('/(features)/')) return 'Feature';
  return 'Component';
}

function extractDescription(content: string): string {
  const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);
  if (commentMatch) {
    return commentMatch[1];
  }
  return 'Component description not available';
}

export function generateComponentEntry(component: Component): string {
  const propsString = component.props
    .map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
    .join(', ');

  return `### ${component.name} (${component.type})\n- **Location**: \`${component.path}\`\n- **Purpose**: ${component.description}\n- **Props**: \`${propsString || 'No props'}\`\n- **Usage**: Standard ${component.type.toLowerCase()} component following atomic design`;
}

export function extractMethods(content: string): string[] {
  const methods: string[] = [];
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

export function generateServicesSection(services: Service[]): string {
  return services
    .map((service) => `- **${service.name}Service**: ${service.methods.join(', ')}`)
    .join('\n');
}

export function generateEntitiesSection(entities: Entity[]): string {
  return entities.map((entity) => `- **${entity.name}**: ${entity.methods.join(', ')}`).join('\n');
}
