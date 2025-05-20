const stylelint = require('stylelint');

const ruleName = '@apostrophecms/stylelint-no-mixed-decls';
const messages = stylelint.utils.ruleMessages(ruleName, {
  mixed: 'Cannot mix declarations and nested rules. Group them together or wrap declarations in a nested "& { }" block. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/'
});

module.exports = stylelint.createPlugin(ruleName, (primary, secondaryOptions = {}) => {
  return (root, result) => {
    const mixinsWithNestedRules = {};

    root.walkRules(rule => {
      if (
        rule.type === 'rule' &&
        rule.selector.startsWith('&') &&
        rule.parent.type === 'atrule' &&
        rule.parent.name === 'mixin'
      ) {
        mixinsWithNestedRules[rule.parent.params] = true;
      }

      let seenNested = false;
      let seenMixinWithNested = false;

      rule.each(node => {
        if (
          node.type === 'decl' &&
          (seenNested || seenMixinWithNested)
        ) {
          stylelint.utils.report({
            message: messages.mixed,
            node,
            result,
            ruleName
          });
        }

        if (node.type === 'rule' && node.selector.startsWith('&')) {
          seenNested = true;
        }

        if (
          node.type === 'atrule' &&
          node.name === 'include' &&
          mixinsWithNestedRules[node.params]
        ) {
          seenMixinWithNested = true;
        }
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
