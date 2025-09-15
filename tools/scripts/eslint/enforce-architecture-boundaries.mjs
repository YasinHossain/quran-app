/**
 * ESLint rule to enforce clean architecture layer boundaries
 *
 * Layer hierarchy (from inner to outer):
 * 1. src/domain/ - Core business logic (no external dependencies)
 * 2. src/application/ - Use cases (can import from domain)
 * 3. src/infrastructure/ - External interfaces (can import from domain and application)
 * 4. app/ - Next.js presentation layer (can import from all layers)
 *
 * Rules:
 * - Domain layer cannot import from application, infrastructure, or app
 * - Application layer cannot import from infrastructure or app
 * - Infrastructure layer cannot import from app
 * - App layer can import from any layer
 */

const LAYERS = {
  DOMAIN: 'domain',
  APPLICATION: 'application',
  INFRASTRUCTURE: 'infrastructure',
  APP: 'app',
};

const LAYER_HIERARCHY = {
  [LAYERS.DOMAIN]: 0,
  [LAYERS.APPLICATION]: 1,
  [LAYERS.INFRASTRUCTURE]: 2,
  [LAYERS.APP]: 3,
};

/**
 * Determine which layer a file belongs to based on its path
 */
function getLayerFromPath(filePath) {
  if (filePath.includes('/src/domain/')) return LAYERS.DOMAIN;
  if (filePath.includes('/src/application/')) return LAYERS.APPLICATION;
  if (filePath.includes('/src/infrastructure/')) return LAYERS.INFRASTRUCTURE;
  if (filePath.includes('/app/')) return LAYERS.APP;
  return null;
}

/**
 * Determine which layer an import is from based on the import path
 */
function getLayerFromImport(importPath) {
  if (importPath.startsWith('@/src/domain/')) return LAYERS.DOMAIN;
  if (importPath.startsWith('@/src/application/')) return LAYERS.APPLICATION;
  if (importPath.startsWith('@/src/infrastructure/')) return LAYERS.INFRASTRUCTURE;
  if (importPath.startsWith('@/app/')) return LAYERS.APP;

  // Handle relative imports
  if (importPath.includes('/domain/')) return LAYERS.DOMAIN;
  if (importPath.includes('/application/')) return LAYERS.APPLICATION;
  if (importPath.includes('/infrastructure/')) return LAYERS.INFRASTRUCTURE;
  if (importPath.includes('/app/')) return LAYERS.APP;

  return null;
}

/**
 * Check if an import violates layer boundaries
 */
function violatesLayerBoundary(fromLayer, toLayer) {
  if (!fromLayer || !toLayer) return false;

  const fromLevel = LAYER_HIERARCHY[fromLayer];
  const toLevel = LAYER_HIERARCHY[toLayer];

  // Inner layers cannot import from outer layers
  return fromLevel < toLevel;
}

const enforceArchitectureBoundariesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce clean architecture layer boundaries',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    const currentLayer = getLayerFromPath(filename);

    if (!currentLayer) {
      // File is not in a layer we care about
      return {};
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const importLayer = getLayerFromImport(importPath);

        if (violatesLayerBoundary(currentLayer, importLayer)) {
          context.report({
            node: node.source,
            message: `Layer boundary violation: ${currentLayer} layer cannot import from ${importLayer} layer. Import path: "${importPath}"`,
          });
        }
      },
    };
  },
};

export default enforceArchitectureBoundariesRule;
