export function useCaseTemplate(name: string, action: string): string {
  const entity = capitalize(name);
  const useCase = `${capitalize(action)}${entity}`;
  return `/**
 * ${useCase} use case
 */
import { I${entity}Repository } from '../repositories/I${entity}Repository';

export class ${useCase}UseCase {
  constructor(private readonly repo: I${entity}Repository) {}

  async execute(
    ...args: Parameters<I${entity}Repository['${action}']>
  ): Promise<ReturnType<I${entity}Repository['${action}']>> {
    return this.repo.${action}(...(args as any));
  }
}
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
