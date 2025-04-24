/* eslint-disable n/handle-callback-err */

// NOTE: tried https://stylelint.io/developer-guide/plugins/#testing but it would not work with our CommonJS usage.

const { exec } = require('node:child_process');

const ERROR_MESSAGE =
  'Expected "& { ... }" block after "@include" at-rule if declarations are present. See https://sass-lang.com/documentation/breaking-changes/mixed-decls/';

describe('@apostrophecms/stylelint-no-mixed-decls stylelint rule', function() {
  this.timeout(10000);

  it('should fail when css contains nested rules and declarations mixed together', function(done) {
    exec('npx stylelint test/bad-1.scss', (error, stdout, stderr) => {
      if (!stderr.includes(ERROR_MESSAGE)) {
        throw new Error(`Expected error message: ${ERROR_MESSAGE}`);
      }
      done();
    });
  });

  it('should fail when css contains @includes and declarations mixed together', function(done) {
    exec('npx stylelint test/bad-2.scss', (error, stdout, stderr) => {
      if (!stderr.includes(ERROR_MESSAGE)) {
        throw new Error(`Expected error message: ${ERROR_MESSAGE}`);
      }
      done();
    });
  });

  it('should pass when css contains nested rules and scoped declarations', function(done) {
    exec('npx stylelint test/good.scss', (error, stdout, stderr) => {
      if (stderr.includes(ERROR_MESSAGE)) {
        throw new Error(`Unexpected error message: ${ERROR_MESSAGE}`);
      }
      done();
    });
  });
});
