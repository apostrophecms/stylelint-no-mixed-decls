const stylelint = require('stylelint');

const ruleName = '@apostrophecms/stylelint-no-mixed-decls';
const messages = stylelint.utils.ruleMessages(ruleName, {
  mixed: 'Cannot mix declarations and nested rules. Group them together or wrap declarations in a nested "& { }" block. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/'
});

module.exports = stylelint.createPlugin(ruleName, () => {
  return (root, result) => {
    root.walkRules(rule => {
      let seenNestedRule = false;

      rule.each(node => {
        if (isNestedRule(node)) {
          seenNestedRule = true;
          return;
        }

        if (isDecl(node) && seenNestedRule) {
          stylelint.utils.report({
            message: messages.mixed,
            node,
            result,
            ruleName
          });
        }

        if (isInclude(node)) {
          root.walkAtRules('mixin', mixinRule => {
            // Skip other mixins that don't match
            // the name of the current include:
            if (mixinRule.params !== node.params) {
              return;
            }
            console.log('mixinRule', mixinRule.params);
            mixinRule.each(mixinNode => {
              if (isNestedRule(mixinNode)) {
                console.log('mixinNode.selector', mixinNode.selector);
                seenNestedRule = true;
                return;
              }

              if (isDecl(mixinNode) && seenNestedRule) {
                stylelint.utils.report({
                  message: messages.mixed,
                  node,
                  result,
                  ruleName
                });
              }
            });
          });
        }
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;

function isDecl(node) {
  return node.type === 'decl';
}

// Note, a `.` in the selector is not considered a nested rule,
// at least not a problem in Sass.
function isNestedRule(node) {
  return node.type === 'rule' && /^&([^.])*$/.test(node.selector);
}

function isInclude(node) {
  return node.type === 'atrule' && node.name === 'include';
}
