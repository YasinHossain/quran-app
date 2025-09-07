export function repositoryTemplate(name: string): string {
  const entity = capitalize(name);
  return `/**
 * Repository contract for ${entity}
 */
import { ${entity} } from '../entities/${entity}';

export interface I${entity}Repository {
  create(data: ${entity}): Promise<${entity}>;
  findById(id: string): Promise<${entity} | null>;
}
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
