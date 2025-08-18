/**
 * ESLint rule to prevent theme conditionals in JSX className props
 * Encourages use of CSS classes and semantic tokens instead
 */

export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow theme conditionals in JSX className props',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noThemeConditional:
        'Avoid theme conditionals in className. Use CSS classes with "dark:" prefix or semantic design tokens instead.',
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

          // Check for template literals or conditional expressions containing theme checks
          if (expression.type === 'TemplateLiteral') {
            const source = context.getSourceCode().getText(expression);
            if (source.includes("theme === 'light'") || source.includes("theme === 'dark'")) {
              context.report({
                node: expression,
                messageId: 'noThemeConditional',
              });
            }
          }

          // Check for conditional expressions
          if (expression.type === 'ConditionalExpression') {
            const source = context.getSourceCode().getText(expression);
            if (source.includes("theme === 'light'") || source.includes("theme === 'dark'")) {
              context.report({
                node: expression,
                messageId: 'noThemeConditional',
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
