# FEG NDS Tokens

Design tokens for the FEG NDS design system in Tokens Studio JSON format. The tokens are synced to the NDS Variables Library in Figma.

This repo continues from `feg-tokens/repo`.

- `themes/`: token sets and theme config.
  - `Global` holds the Base collection.
  - `BASE/Dark` and `BASE/Light` hold the Theme collection.
  - `FTN`, `CP` and `PSK` with `Dark` and `Light` hold the Brand collection.
  - `$themes.json` maps each theme to its Figma collection, mode and variable keys.
- `docs/`: change notes for each update.
- `scripts/resolve-tokens.mjs`: resolves every token to its final colour (references, expressions and Tokens Studio modifiers). Use it to check the sets against Figma. It needs Node 18+ and has no dependencies.

Latest update: [Colour Foundation V2](docs/NDS_COLOUR_V2_CHANGES.md).
