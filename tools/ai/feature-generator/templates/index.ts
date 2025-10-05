import { controllerTemplate } from './controller';
import { entityTemplate } from './entity';
import { repositoryTemplate } from './repository';
import { buildUseCaseTemplate } from './use-case';

export const templates = {
  entity: entityTemplate,
  useCase: buildUseCaseTemplate,
  repository: repositoryTemplate,
  controller: controllerTemplate,
};

export {
  entityTemplate,
  buildUseCaseTemplate as useCaseTemplate,
  repositoryTemplate,
  controllerTemplate,
};
