# @apostrophecms/stylelint-no-mixed-decls 

A Stylelint plugin that enforces Sass's `mixed-decls` rule — requiring declarations and nested rules to be ordered according to Sass's updated behavior.

>⚠️Since Sass `1.77.0+`, CSS blocks can no longer freely mix declarations and nested rules.  
> If you want to declare additional styles after nested rules, those declarations must be placed inside a `& { }` block.
>
> See: https://sass-lang.com/documentation/breaking-changes/mixed-decls/

## What this plugin does

- Prevents declarations appearing after nested rules within a CSS block unless they're wrapped in a `& { }` block.
- Reports if a declaration follows a `@include` mixin when the mixin is not known to be "safe" (i.e. it contains nested rules inside).
- Allows configuring "safe" mixins — mixins you know contain only flat declarations and no nested rules.

## Installation

```bash
npm install @apostrophecms/stylelint-no-mixed-decls --save-dev
```

## Usage

Add it to your Stylelint configuration:

```js
{
  "plugins": [
    // ...
    "@apostrophecms/stylelint-no-mixed-decls"
  ],
  "rules": {
    // ...
    "@apostrophecms/stylelint-no-mixed-decls": true
  }
}
```

## Options

You can optionally pass an object with a `safeMixins` array to declare which mixins are considered safe:

```js
{
  "rules": {
    "@apostrophecms/stylelint-no-mixed-decls": [
      true,
      {
        safeMixins: [
          "my-safe-mixin",
          "another-safe-mixin"
        ]
      }
    ]
  }
}
```

### Safe Mixins

Safe mixins are mixins that only contain flat declarations — no nested rules or nested includes.

If you have a mixin that you know is safe, you can add it to the `safeMixins` array in the options.

Safe mixins example:

```scss
@mixin clearfix {
  display: block;
  clear: both;
}
```

Unsafe mixins example:

```scss
@mixin border-radius {
  border-radius: 4px;

  &:hover {
    border-radius: 8px;
  }
}
```

Unless explicitly listed in `safeMixins`, the plugin assumes all mixins could contain nested rules and treats them cautiously.

## Example: Correct Usage

```scss
.foo {
  color: red;

  &--large {
    font-size: 24px;
  }

  & {
    font-weight: bold;
  }
}
```

## Example: Incorrect Usage (will report)

```scss
.foo {
  color: red;

  &--large {
    font-size: 24px;
  }

  font-weight: bold; // ❌ not inside a & block
}
```

Or

```scss
.foo {
  @include border-radius;

  color: red; // ❌ if `border-radius` is not listed as a safe mixin
}
```

## Why this matters

This plugin ensures your Sass code adheres to modern CSS nesting behavior, prevents breaking builds on newer Sass versions, and keeps your codebase cleanly structured.
