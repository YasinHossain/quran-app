import fs from 'fs';
import path from 'path';
import { docMappings } from './scanner';

export interface Prop {
  name: string;
  optional: boolean;
  type: string;
}

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

  const scan = (currentDir: string) => {
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

function parseComponent(filePath: string): Component | null {
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

function parseProps(propsString: string): Prop[] {
  const props: Prop[] = [];
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

export async function scanServices(): Promise<Service[]> {
  const services: Service[] = [];
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

    if (entityMatch) {
      entities.push({
        name: entityMatch[1],
        file: file,
        methods: extractMethods(content),
      });
    }
  }

  return entities;
}

export function extractMethods(content: string): string[] {
  const methods: string[] = [];
  const methodMatches = content.matchAll(/(?:public\s+)?(\w+)\s*\([^)]*\)(?:\s*:\s*[^{]+)?(?:\s*{|\s*;)/g);

  for (const match of methodMatches) {
    if (!['constructor'].includes(match[1])) {
      methods.push(match[1]);
    }
  }

  return methods;
}

export function generateServicesSection(services: Service[]): string {
  return services.map((service) => `- **${service.name}Service**: ${service.methods.join(', ')}`).join('\n');
}

export function generateEntitiesSection(entities: Entity[]): string {
  return entities.map((entity) => `- **${entity.name}**: ${entity.methods.join(', ')}`).join('\n');
}

export function updateArchitectureMapContent(
  currentMap: string,
  services: Service[],
  entities: Entity[],
): string {
  const servicesSection = generateServicesSection(services);
  const servicesPattern = /(### Available Services[\s\S]*?)(\n###|\n##|$)/;

  if (servicesPattern.test(currentMap)) {
    currentMap = currentMap.replace(servicesPattern, `### Available Services\n${servicesSection}$2`);
  }

  const entitiesSection = generateEntitiesSection(entities);
  const entitiesPattern = /(### Domain Entities[\s\S]*?)(\n###|\n##|$)/;

  if (entitiesPattern.test(currentMap)) {
    currentMap = currentMap.replace(entitiesPattern, `### Domain Entities\n${entitiesSection}$2`);
  }

  return currentMap;
}
