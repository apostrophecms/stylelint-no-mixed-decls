const stylelint = require('stylelint');

const ruleName = '@apostrophecms/stylelint-no-mixed-decls';
const messages = stylelint.utils.ruleMessages(ruleName, {
  mixed: 'Cannot mix declarations and nested rules/at-rules. Group them together or wrap declarations in a nested "& { }" block. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/'
});

module.exports = stylelint.createPlugin(ruleName, () => {
  return (root, result) => {
    root.walkRules(rule => {
      let seenDeclaration = false;
      let seenNested = false;

      rule.each(node => {
        if (node.type === 'decl') {
          if (seenNested) {
            stylelint.utils.report({
              message: messages.mixed,
              node,
              result,
              ruleName
            });
          }
          seenDeclaration = true;
        }

        if (
          (node.type === 'rule') ||
          (node.type === 'atrule' && (node.name === 'include' || node.name === 'extend'))
        ) {
          if (seenDeclaration) {
            stylelint.utils.report({
              message: messages.mixed,
              node,
              result,
              ruleName
            });
          }
          seenNested = true;
        }
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
