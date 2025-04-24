# @apostrophecms/require-nested-after-include 

A stylelint plugin that enforces nested rules to be defined after a `@include` rule.

> CSS is changing the way it handles declarations mixed with nested rules,
> and we want to make sure Sass matches its behavior.
_https://sass-lang.com/documentation/breaking-changes/mixed-decls/_

Sass will print a `mixed-decls` warning if rules following an `@include` rules are not nested in a `& { ... }` block.
This is a breaking change in Sass since 1.77.7.

## Installation

```sh
npm install @apostrophecms/require-nested-after-include --save-dev
```

## Usage

If you've installed `@apostrophecms/require-nested-after-include` locally within your project, add it to the `plugins` array and activate the rule in your `stylelint` config:

```js
{
  "plugins": [
    // ...
    "@apostrophecms/require-nested-after-include"
  ],
  "rules": {
    // ...
    "@apostrophecms/require-nested-after-include": true
  }
}
```
