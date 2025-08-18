export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw Tailwind color utilities',
    },
    schema: [],
    messages: {
      noRaw: 'Avoid using raw color utility "{{utility}}". Use design tokens instead.',
    },
  },
  create(context) {
    const regex = /(text-gray-\d+|dark:[^\s"']+)/g;

    function report(node, value) {
      let match;
      while ((match = regex.exec(value)) !== null) {
        context.report({ node, messageId: 'noRaw', data: { utility: match[0] } });
      }
    }

    function check(node) {
      if (!node) return;
      if (node.type === 'Literal' && typeof node.value === 'string') {
        report(node, node.value);
      } else if (node.type === 'TemplateLiteral') {
        node.quasis.forEach((q) => report(q, q.value.raw));
      }
    }

    return {
      JSXAttribute(node) {
        if (!node.name || (node.name.name !== 'className' && node.name.name !== 'class')) return;
        const value = node.value;
        if (!value) return;
        if (value.type === 'Literal' && typeof value.value === 'string') {
          report(value, value.value);
        } else if (value.type === 'JSXExpressionContainer') {
          const expr = value.expression;
          if (expr.type === 'ConditionalExpression') {
            check(expr.consequent);
            check(expr.alternate);
          } else {
            check(expr);
          }
        }
      },
    };
  },
};
