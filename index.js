const stylelint = require('stylelint');

const ruleName = '@apostrophecms/stylelint-no-mixed-decls';
const messages = stylelint.utils.ruleMessages(ruleName, {
  mixed: 'Cannot mix declarations and nested rules/at-rules. Group them together or wrap declarations in a nested "& { }" block. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/'
});

module.exports = stylelint.createPlugin(ruleName, (primary, secondaryOptions = {}) => {
  return (root, result) => {
    const mixinsWithNestedRules = [];

    root.walkRules(rule => {
      if (
        rule.type === 'rule' &&
        rule.selector.startsWith('&') &&
        rule.parent.type === 'atrule' &&
        rule.parent.name === 'mixin'
      ) {
        mixinsWithNestedRules.push(rule.parent.params);
      }

      /* console.log(); */
      /* console.log('-------------'); */
      /* console.log(); */
      /* console.log('rule.type', rule.type); */
      /* console.log('rule.selector', rule.selector); */
      /* console.log('rule.parent.type', rule.parent.type); */
      /* console.log('rule.parent.name', rule.parent.name); */
      /* console.log('rule.parent.params', rule.parent.params); */
      let seenNested = false;
      let seenMixinWithNested = false;

      rule.each(node => {
        /* console.log(); */
        /* console.log('node.type', node.type); */
        /* console.log('node.name', node.name); */
        /* console.log('node.params', node.params); */
        /* console.log('node.selector', node.selector); */
        /* console.log('node.prop', node.prop); */
        /* console.log('node.value', node.value); */
        /* console.log('---'); */
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
          mixinsWithNestedRules.includes(node.params)
        ) {
          seenMixinWithNested = true;
        }
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
