const stylelint = require('stylelint');

const ruleName = '@apostrophecms/require-nested-after-include';
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected "& { ... }" block after "@include" at-rule if declarations are present. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/'
});

module.exports = stylelint.createPlugin(ruleName, () => {
  return (root, result) => {
    root.walkRules((rule) => {
      rule.walkAtRules('include', (atRule) => {
        console.log('atRule', atRule);
        const nextNode = atRule.next();
        console.log('nextNode', nextNode);
        console.log('nextNode.type', nextNode?.type);

        if (nextNode?.type === 'decl') {
          stylelint.utils.report({
            message: messages.expected,
            node: atRule,
            result,
            ruleName
          });
        }
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
