/* eslint-disable n/handle-callback-err */

// NOTE: tried https://stylelint.io/developer-guide/plugins/#testing but it would not work with our CommonJS usage.

const { exec } = require('node:child_process');

const ERROR_MESSAGE =
  'Cannot mix declarations and nested rules/at-rules. Group them together or wrap declarations in a nested "& { }" block. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/';

describe('@apostrophecms/stylelint-no-mixed-decls stylelint rule', function() {
  this.timeout(10000);

  it('should fail when css contains nested rules and declarations mixed together', async function() {
    const { stdout, stderr } = await runStylelint('test/bad-1.scss');

    if (stdout) {
      throw new Error(`Unexpected output: ${stdout}`);
    }

    if (!stderr.includes(ERROR_MESSAGE)) {
      throw new Error(`Expected error message: ${ERROR_MESSAGE}`);
    }
  });

  it('should fail when css contains nested rules and declarations mixed together (mixins)', async function() {
    const { stdout, stderr } = await runStylelint('test/bad-2.scss');

    if (stdout) {
      throw new Error(`Unexpected output: ${stdout}`);
    }

    if (!stderr.includes(ERROR_MESSAGE)) {
      throw new Error(`Expected error message: ${ERROR_MESSAGE}`);
    }
  });

  it('should pass when css contains nested rules and scoped declarations', async function() {
    const { stdout, stderr } = await runStylelint('test/good.scss');

    if (stdout) {
      throw new Error(`Unexpected output: ${stdout}`);
    }

    if (stderr.includes(ERROR_MESSAGE)) {
      throw new Error(`Unexpected error message: ${ERROR_MESSAGE}`);
    }
  });
});

function runStylelint(filePath) {
  return new Promise((resolve, reject) => {
    exec(`npx stylelint ${filePath}`, (error, stdout, stderr) => {
      resolve({
        stdout,
        stderr
      });
    });
  });
}
