# Design System Guide

This guide explains how to work with design tokens and theme variants for the Quran app.

## Tokens

Tokens live in `design-system.json`. Each top-level key contains a set of tokens, such as `colors`, `spacing`, `typography`, and `components`.

To add or modify a token:

1. Open `design-system.json`.
2. Add or update the token under the appropriate category.
3. Run `npm run format` to keep JSON style consistent.
4. Expose new tokens in `tailwind.config.mjs` if Tailwind should use them.

### Example

Adding a new spacing token:

```json
{
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem" // new token
  }
}
```

## Theme variants

The design system can define multiple themes such as light, dark, or an alternate theme. Tokens for each variant sit under a `themes` key:

```json
{
  "themes": {
    "light": {
      "colors": { "background": "#ffffff", "foreground": "#111111" }
    },
    "dark": {
      "colors": { "background": "#111111", "foreground": "#ffffff" }
    },
    "alt-theme": {
      "colors": { "background": "#fef3c7", "foreground": "#78350f" }
    }
  }
}
```

### Mapping themes in Tailwind

Expose tokens to Tailwind by mapping a variant from `design-system.json` inside `tailwind.config.mjs`:

```js
import tokens from './design-system.json' assert { type: 'json' };

const theme = tokens.themes;

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ...theme.light.colors, // default theme
      },
    },
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('dark', '&:is(.dark, [data-theme="dark"])');
      addVariant('alt-theme', '&:is(.alt-theme, [data-theme="alt-theme"])');
    },
  ],
};
```

Switch themes by toggling the corresponding class or `data-theme` attribute on the `<html>` element.
