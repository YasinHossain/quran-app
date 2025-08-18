export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw Tailwind color utilities and theme conditionals in JSX',
    },
    schema: [],
    messages: {
      noRaw: 'Avoid using raw color utility "{{utility}}". Use design tokens instead.',
      noThemeConditional: 'Avoid theme conditionals in className. Use semantic tokens instead.',
    },
  },
  create(context) {
    // Enhanced regex to catch more violations
    const rawColorRegex =
      /(bg-(?:gray|slate|zinc|neutral|stone)-\d+|text-(?:gray|slate|zinc|neutral|stone)-\d+|border-(?:gray|slate|zinc|neutral|stone)-\d+|ring-(?:gray|slate|zinc|neutral|stone)-\d+)/g;
    const themeConditionalRegex = /theme\s*===\s*['"`](?:dark|light)['"`]/;

    function reportRawColors(node, value) {
      let match;
      rawColorRegex.lastIndex = 0; // Reset regex
      while ((match = rawColorRegex.exec(value)) !== null) {
        context.report({ node, messageId: 'noRaw', data: { utility: match[0] } });
      }
    }

    function reportThemeConditional(node, value) {
      if (themeConditionalRegex.test(value)) {
        context.report({ node, messageId: 'noThemeConditional' });
      }
    }

    function check(node) {
      if (!node) return;
      if (node.type === 'Literal' && typeof node.value === 'string') {
        reportRawColors(node, node.value);
      } else if (node.type === 'TemplateLiteral') {
        node.quasis.forEach((q) => reportRawColors(q, q.value.raw));
      }
    }

    return {
      JSXAttribute(node) {
        if (!node.name || (node.name.name !== 'className' && node.name.name !== 'class')) return;
        const value = node.value;
        if (!value) return;
        if (value.type === 'Literal' && typeof value.value === 'string') {
          reportRawColors(value, value.value);
        } else if (value.type === 'JSXExpressionContainer') {
          const expr = value.expression;
          if (expr.type === 'ConditionalExpression') {
            // Check for theme conditionals in the test expression
            if (expr.test) {
              const sourceCode = context.getSourceCode();
              const testText = sourceCode.getText(expr.test);
              reportThemeConditional(expr.test, testText);
            }
            check(expr.consequent);
            check(expr.alternate);
          } else if (expr.type === 'TemplateLiteral') {
            // Check template literals for both raw colors and theme conditionals
            node.quasis?.forEach((q) => {
              reportRawColors(q, q.value.raw);
            });
            expr.expressions?.forEach((exp) => {
              const sourceCode = context.getSourceCode();
              const expText = sourceCode.getText(exp);
              reportThemeConditional(exp, expText);
            });
          } else {
            check(expr);
          }
        }
      },
    };
  },
};
