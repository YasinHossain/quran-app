import { controllerTemplate } from './controller';
import { entityTemplate } from './entity';
import { repositoryTemplate } from './repository';
import { useCaseTemplate } from './use-case';

export const templates = {
  entity: entityTemplate,
  useCase: useCaseTemplate,
  repository: repositoryTemplate,
  controller: controllerTemplate,
};

export {
  entityTemplate,
  useCaseTemplate,
  repositoryTemplate,
  controllerTemplate,
};
