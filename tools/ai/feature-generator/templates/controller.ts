export function controllerTemplate(name: string): string {
  const entity = capitalize(name);
  return `/**
 * ${entity} HTTP controller
 */
import { Request, Response } from 'express';
import { ${entity}Service } from '../services/${entity}Service';

export class ${entity}Controller {
  constructor(private readonly service: ${entity}Service) {}

  async create(req: Request, res: Response): Promise<void> {
    // TODO: implement
    res.status(201).json({});
  }
}
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
