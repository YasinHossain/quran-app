/**
 * Enhanced ESLint rules for design system compliance
 * Enforces use of design tokens and prevents anti-patterns
 */

const HARDCODED_COLORS = [
  'bg-white',
  'bg-slate-50',
  'bg-slate-100',
  'bg-slate-800',
  'bg-slate-900',
  'bg-gray-100',
  'bg-gray-800',
  'text-slate-900',
  'text-slate-800',
  'text-slate-700',
  'text-slate-600',
  'text-slate-500',
  'text-slate-400',
  'text-slate-300',
  'text-white',
  'border-slate-200',
  'border-slate-700',
  'border-gray-200',
];

const DESIGN_TOKENS = [
  'bg-surface',
  'bg-background',
  'bg-interactive',
  'bg-accent',
  'text-foreground',
  'text-muted',
  'text-accent',
  'text-on-accent',
  'border-border',
];

export const rules = {
  'no-theme-conditionals': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow theme conditionals in JSX className props',
        category: 'Best Practices',
        recommended: true,
      },
      fixable: 'code',
      schema: [],
      messages: {
        noThemeConditional:
          'Avoid theme conditionals in className. Use CSS classes with "dark:" prefix or semantic design tokens instead.',
        suggestDarkClass: 'Use "{{lightClass}} dark:{{darkClass}}" instead.',
      },
    },

    create(context) {
      return {
        JSXAttribute(node) {
          if (
            node.name &&
            node.name.name === 'className' &&
            node.value &&
            node.value.type === 'JSXExpressionContainer'
          ) {
            const expression = node.value.expression;
            const source = context.getSourceCode().getText(expression);

            // Check for theme conditionals
            if (source.includes("theme === 'light'") || source.includes("theme === 'dark'")) {
              context.report({
                node: expression,
                messageId: 'noThemeConditional',
                fix(fixer) {
                  // Simple auto-fix for basic conditionals
                  const ternaryMatch = source.match(/theme === 'light' \? '([^']+)' : '([^']+)'/);
                  if (ternaryMatch) {
                    const [, lightClass, darkClass] = ternaryMatch;
                    const replacement = `"${lightClass} dark:${darkClass}"`;
                    return fixer.replaceText(expression, replacement);
                  }
                  return null;
                },
              });
            }
          }
        },
      };
    },
  },

  'prefer-design-tokens': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Prefer design tokens over hardcoded color classes',
        category: 'Best Practices',
        recommended: true,
      },
      fixable: 'code',
      schema: [],
      messages: {
        preferToken: 'Use design token "{{token}}" instead of hardcoded class "{{hardcoded}}".',
      },
    },

    create(context) {
      const tokenMap = {
        'bg-white': 'bg-surface',
        'bg-slate-50': 'bg-surface',
        'bg-slate-100': 'bg-interactive',
        'bg-slate-800': 'bg-surface',
        'bg-slate-900': 'bg-background',
        'text-slate-900': 'text-foreground',
        'text-slate-400': 'text-muted',
        'border-slate-200': 'border-border',
      };

      return {
        JSXAttribute(node) {
          if (node.name && node.name.name === 'className' && node.value) {
            let classValue = '';

            if (node.value.type === 'Literal') {
              classValue = node.value.value;
            } else if (
              node.value.type === 'JSXExpressionContainer' &&
              node.value.expression.type === 'Literal'
            ) {
              classValue = node.value.expression.value;
            }

            if (typeof classValue === 'string') {
              const classes = classValue.split(/\s+/);

              for (const cls of classes) {
                if (tokenMap[cls]) {
                  context.report({
                    node: node.value,
                    messageId: 'preferToken',
                    data: {
                      hardcoded: cls,
                      token: tokenMap[cls],
                    },
                    fix(fixer) {
                      const newValue = classValue.replace(cls, tokenMap[cls]);
                      const replacement =
                        node.value.type === 'Literal' ? `"${newValue}"` : `{"${newValue}"}`;
                      return fixer.replaceText(node.value, replacement);
                    },
                  });
                }
              }
            }
          }
        },
      };
    },
  },

  'consistent-component-props': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce consistent component prop patterns',
        category: 'Best Practices',
        recommended: true,
      },
      schema: [],
      messages: {
        missingVariantType: 'Component interface should include variant prop with proper typing.',
        missingSizeType: 'Component interface should include size prop with proper typing.',
        missingClassName: 'Component interface should include className prop for composition.',
      },
    },

    create(context) {
      return {
        TSInterfaceDeclaration(node) {
          if (node.id.name.endsWith('Props')) {
            const properties = node.body.body;
            const propNames = properties
              .filter((prop) => prop.type === 'TSPropertySignature')
              .map((prop) => prop.key.name);

            if (!propNames.includes('variant')) {
              context.report({
                node,
                messageId: 'missingVariantType',
              });
            }

            if (!propNames.includes('className')) {
              context.report({
                node,
                messageId: 'missingClassName',
              });
            }
          }
        },
      };
    },
  },
};

// Export the original rule for backward compatibility
export const rule = rules['no-theme-conditionals'];

export default rule;
