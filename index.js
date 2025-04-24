const stylelint = require('stylelint');

const ruleName = '@apostrophecms/stylelint-mixed-decls';
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected "& { ... }" block after "@include" at-rule if declarations are present. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/'
});

module.exports = stylelint.createPlugin(ruleName, () => {
  return (root, result) => {
    root.walkRules(rule => {
      let foundNestedSelectorOrInclude = false;

      rule.each(node => {
        if (node.type === 'atrule' && node.name === 'include') {
          foundNestedSelectorOrInclude = true;
          return;
        }

        if (node.type === 'rule') {
          foundNestedSelectorOrInclude = true;
          return;
        }

        if (node.type === 'decl' && foundNestedSelectorOrInclude) {
          stylelint.utils.report({
            message: messages.expected,
            node,
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
