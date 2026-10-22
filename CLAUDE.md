# Rules for updating FEG NDS Tokens from Figma

These rules apply to every update of this repo. Follow them in order. The
engineering team builds the npm token package from this repo with Style
Dictionary, and checks every release against Figma with the token-verify skill,
so anything that drifts from Figma here ends up in production or fails their
check.

## 1. Source of truth

- The only source is the **published** NDS Tokens & Variables library:
  https://www.figma.com/design/RKduL8UHSJyIMVyotTzSZS/NDS---Tokens---Variables-library
  (file key `RKduL8UHSJyIMVyotTzSZS`).
- Before reading anything, ask the user to confirm the library has just been
  published and that nobody will change it until this PR is merged. If they
  cannot confirm, stop.
- Read Figma only. Never edit the Figma file.

| Figma | Repo file |
| --- | --- |
| Base collection (mode Base) | `themes/Global.json` |
| Theme collection, modes Dark and Light | `themes/BASE/Dark.json`, `themes/BASE/Light.json` |
| Brand collection, modes FTN, CP, PSK × Dark, Light | `themes/<BRAND>/Dark.json`, `themes/<BRAND>/Light.json` |
| Gradient paint styles (`<Brand Theme>/gradient…`) | gradient tokens in the matching BASE and brand sets |
| Brand mode LobBet | `LobBet` branch only, unless the user says otherwise |

Read variables (names, values per mode, aliases, keys, IDs) and gradient paint
styles with read-only calls, for example through the Figma connector.

## 2. Writing tokens

1. **Names.** A token path is the Figma variable name with `/` replaced by
   nesting, spelled exactly as in Figma, including existing typos such as
   `suface-alpha`. Names become CSS variable names downstream, so a rename here
   breaks product code.
2. **Aliases.** Where Figma aliases another variable, write a reference to the
   matching token. Where Figma has a raw value, write the value.
3. **Reference syntax.** Use `{a.b.c}` only. Never write `$a.b.c`: the
   engineering build does not resolve it.
4. **Modifiers.** Keep an existing Tokens Studio modifier only if the resolved
   result still equals Figma. Do not add new modifiers unless the user asks.
5. **Gradients.** Write valid CSS: `linear-gradient(<angle>deg, <stop> <pos>%, …)`
   with no space before the bracket. Take direction, stop colours (as
   references) and positions from the Figma paint style; follow the direction
   rules on the Figma Documentation page.
6. **No silent deletions or renames.** Only remove or rename a token if Figma
   did. Tokens that exist here but not in Figma (legacy) stay, and are listed
   in the change note as "not a Figma variable".
7. **`$themes.json`.** Keep each theme's Figma collection ID, mode ID and
   variable keys in sync. Add a key for every new variable. Update
   `$metadata.json` only if a token set is added.
8. Do not change the colour maths in `scripts/resolve-tokens.mjs` unless the
   user asks.

## 3. Parity check (must pass before the PR)

1. Resolve every colour token for every theme in `$themes.json` with
   `scripts/resolve-tokens.mjs`, and compare with the Figma resolved value for
   the same variable and mode. The target is zero differences.
2. Compare every Figma gradient paint style with its token: direction, stop
   count, stop colours and positions. Today there are 48 (8 gradients × FTN,
   CP, PSK × Dark, Light).
3. If something cannot be made to match, do not hide it. List it in the change
   note and the PR description with the reason.

## 4. Files every PR must include

| File | When | Content |
| --- | --- | --- |
| `themes/**/*.json` | Always | The token changes |
| `themes/$themes.json` | When variables, keys or modes change | IDs and keys in sync with Figma |
| `docs/<UPDATE_NAME>_CHANGES.md` | Always | What changed and why, in the same shape as `NDS_COLOUR_V2_CHANGES.md`: a summary table with counts, a "Changed values" table (token set, token, before, after), new tokens, removed or renamed tokens, notes |
| `docs/change-manifest.csv` | Always | One row per changed token, with the existing columns: File, Token path, Action, main value, PR value, Figma key, Figma variable ID, Figma resolved, PR resolved, Parity, Reason / evidence, Confidence, Potential breaking impact |
| `figma-source.json` | Always, generated last | See step 5 |

## 5. Record the Figma version (last step)

After the parity check passes, ask the user to set `FIGMA_TOKEN` in their own
terminal (never paste it into the chat or a file), then run:

```bash
node scripts/write-figma-source.mjs
```

This writes `figma-source.json` with the library's file key and current version.
Do not edit it by hand. If the library changed during the update, it will no
longer match: re-run the parity check first.

## 6. Pull request

Open a PR against `main`. Do not merge it. Use this description:

```
## <Update name>

Figma library: <figma_file_name>, version <figma_version> (<figma_last_modified>)

Parity: <n>/<n> colour values, <n>/<n> gradients

| | Count |
| --- | --- |
| Changed values | |
| New tokens | |
| Removed or renamed | |

Breaking changes for consumers: <none, or list with CSS variable names>
Not aligned with Figma: <none, or list with reasons>
Change note: docs/<UPDATE_NAME>_CHANGES.md
```

Then tell the user the PR link, so they can let the engineering team know a new
version is ready to build and verify.
