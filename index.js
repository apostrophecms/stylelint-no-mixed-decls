const stylelint = require('stylelint');

const ruleName = '@apostrophecms/stylelint-no-mixed-decls';
const messages = stylelint.utils.ruleMessages(ruleName, {
  mixed: 'Cannot mix declarations and nested rules. Group them together or wrap declarations in a nested "& { }" block. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/'
});

module.exports = stylelint.createPlugin(ruleName, () => {
  return (root, result) => {
    root.walkRules(rule => {
      let seenNested = false;

      rule.each(node => {
        if (isNested(node)) {
          seenNested = true;
          return;
        }

        if (isDecl(node) && seenNested) {
          stylelint.utils.report({
            message: messages.mixed,
            node,
            result,
            ruleName
          });
        }

        // Inspect the included mixin
        if (isInclude(node)) {
          root.walkAtRules('mixin', mixinRule => {
            // Skip other mixins that don't match
            // the name of the current include:
            if (mixinRule.params !== node.params) {
              return;
            }

            mixinRule.each(mixinNode => {
              if (isNested(mixinNode)) {
                seenNested = true;
                return;
              }

              if (isDecl(mixinNode) && seenNested) {
                stylelint.utils.report({
                  message: messages.mixed,
                  node: mixinNode,
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

// Note: a `.` in the selector is not considered a nested rule,
// at least, it's not considered as mixed content in Sass.
function isNested(node) {
  return node.type === 'rule' && /^&([^.])*$/.test(node.selector);
}

function isInclude(node) {
  return node.type === 'atrule' && node.name === 'include';
}
