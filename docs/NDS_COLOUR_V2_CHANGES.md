# NDS colour update: Colour Foundation V2

This branch brings the token sets in `themes/` in line with the NDS Variables Library in Figma (file `RKduL8UHSJyIMVyotTzSZS`, collections Base `1:2`, Theme `1:115` and Brand `1:154`) as of 2026-10-19.

`main` was last synced on 2026-09-23. Since then the library gained the Level 1 additions (sub-header, offer badge, LobBet palette, button regular surfaces) and Colour Foundation V2 (violet and lime scales, SafeBet, contrast fixes).

## Summary

| | Count |
|---|---|
| Changed values (token x mode) | 24 |
| New palette tokens (Global) | 39 |
| New semantic tokens | 16 tokens, 76 token x mode entries |
| New Figma variable references in `$themes.json` | 121 |

Nothing was deleted or renamed. Existing Figma variable keys were checked and all still match.

A full list with reasons is in [`nds-colour-v2-changes.csv`](nds-colour-v2-changes.csv).

## Changed values

| Token set | Token | Before | After |
|---|---|---|---|
| Global | `palette.brand.ftn-secondary` | #0125FF | #5507DA |
| Global | `palette.brand.ftn-secondary-dark` | #00169E | #260C60 |
| Global | `palette.brand.psk-secondary` | #EB0011 | #FF0013 |
| Global | `palette.brand.ftn-secondary-light` | #1F3EFF | #A6A3F6 |
| BASE/Light | `color.surface.input` | #E3E3E9 | #EBEBEF |
| BASE/Dark | `color.border.input` | #363644 | #7F7F9C |
| BASE/Light | `color.border.input` | #B0B0BF | #8888A0 |
| FTN/Light | `color.content.selected` | #FFDB01 | #5507DA |
| CP/Dark | `color.content.selected` | #FFDB01 | #FFEC00 |
| FTN/Light | `color.content.active` | #0125FF | #5507DA |
| CP/Dark | `color.content.active` | #FFDB01 | #FFEC00 |
| FTN/Light | `color.content.on-active` | #FFFFFF | #000000 |
| FTN/Dark | `color.content.on-money` | #000000 | #FFFFFF |
| FTN/Light | `color.content.on-money` | #000000 | #FFFFFF |
| CP/Light | `color.content.on-money` | #000000 | #FFFFFF |
| CP/Dark | `color.content.on-money` | #000000 | #FFFFFF |
| PSK/Light | `color.content.on-money` | #000000 | #FFFFFF |
| PSK/Dark | `color.content.on-money` | #000000 | #FFFFFF |
| FTN/Dark | `color.meaning-hover.positive` | #119522 | #0D741B |
| CP/Dark | `color.meaning-hover.positive` | #119522 | #0D741B |
| PSK/Dark | `color.meaning-hover.positive` | #119522 | #0D741B |
| FTN/Light | `color.border.selected` | #0125FF | #5507DA |
| CP/Light | `color.border.selected` | #0125FF | #D2252A |
| PSK/Dark | `color.border.selected` | #1752BF | #75A6FF |

Notes:
- `palette.brand.ftn-secondary` (and its `-light` and `-dark` versions) now point at the new violet scale. Fortuna secondary moves from blue `#0125FF` to violet `#5507DA`. Every token that references it changes with it.
- `color.meaning-hover.positive` in the Dark sets now uses the same modifier as Light (`darken {scale.hsl-light}`), giving `#0D741B`. White text on the previous `#119522` failed contrast (3.92:1).
- `color.content.on-money` is now white in all brands.

## New palette tokens (Global)

violet 10 to 140, lime 10 to 140, `brand.casa-yellow`, `brand.ftn-sub-header`, the LobBet brand colours (`lob-*`), `badge.green / blue / red` and `grey.black`.

| Token set | Token | Before | After |
|---|---|---|---|
| Global | `palette.grey.black` |  | #000000 |
| Global | `palette.brand.ftn-sub-header` |  | #FAC228 |
| Global | `palette.brand.lob-primary` |  | #1B8751 |
| Global | `palette.brand.lob-primary-dark` |  | #167043 |
| Global | `palette.brand.lob-primary-light` |  | #2AD47F |
| Global | `palette.badge.green` |  | #C8E651 |
| Global | `palette.badge.blue` |  | #256FD2 |
| Global | `palette.badge.red` |  | #DD3107 |
| Global | `palette.brand.lob-mint` |  | #4CE588 |
| Global | `palette.brand.lob-green` |  | #0F2E22 |
| Global | `palette.violet.10` |  | #260C60 |
| Global | `palette.violet.20` |  | #410DA4 |
| Global | `palette.violet.30` |  | #4B0CBF |
| Global | `palette.violet.40` |  | #5507DA |
| Global | `palette.violet.50` |  | #600DF3 |
| Global | `palette.violet.60` |  | #6519FC |
| Global | `palette.violet.70` |  | #7352FC |
| Global | `palette.violet.80` |  | #775FF6 |
| Global | `palette.violet.90` |  | #7C6CF1 |
| Global | `palette.violet.100` |  | #897FF2 |
| Global | `palette.violet.110` |  | #9791F4 |
| Global | `palette.violet.120` |  | #A6A3F6 |
| Global | `palette.violet.130` |  | #B7B6F8 |
| Global | `palette.violet.140` |  | #ECEDFD |
| Global | `palette.brand.casa-yellow` |  | #FFEC00 |
| Global | `palette.lime.10` |  | #3E4719 |
| Global | `palette.lime.20` |  | #4A541E |
| Global | `palette.lime.30` |  | #566222 |
| Global | `palette.lime.40` |  | #627027 |
| Global | `palette.lime.50` |  | #6D7D2C |
| Global | `palette.lime.60` |  | #798B31 |
| Global | `palette.lime.70` |  | #859936 |
| Global | `palette.lime.80` |  | #91A63B |
| Global | `palette.lime.90` |  | #9DB43F |
| Global | `palette.lime.100` |  | #A9C244 |
| Global | `palette.lime.110` |  | #B8D44A |
| Global | `palette.lime.120` |  | #C8E651 |
| Global | `palette.lime.130` |  | #DFF092 |
| Global | `palette.lime.140` |  | #F3F9CE |

## New semantic tokens

| Token | Sets |
|---|---|
| `color.button.surface.regular.default` | BASE/Dark, BASE/Light |
| `color.button.surface.regular.hover` | BASE/Dark, BASE/Light |
| `color.button.surface.regular.disabled` | BASE/Dark, BASE/Light |
| `color.suface-alpha.primary-0` | BASE/Dark, BASE/Light |
| `color.surface.mk-offfer-card-time-badge` | BASE/Dark, BASE/Light |
| `color.surface.sub-header-item` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.content.on-sub-header` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.content.on-sub-header-active` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.border.brand` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.surface.offer-badge` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.content.offer-badge` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.border.offer-badge` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.content.on-offer-badge` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.surface.safebet` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.meaning.safebet` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |
| `color.content.on-safebet` | FTN/Dark, FTN/Light, CP/Light, CP/Dark, PSK/Light, PSK/Dark |

SafeBet is cross-brand and uses the same values in every brand:

| Token | Dark sets | Light sets |
|---|---|---|
| `color.surface.safebet` | lime/10 `#3E4719` | lime/140 `#F3F9CE` |
| `color.meaning.safebet` | lime/120 `#C8E651` | lime/30 `#566222` |
| `color.content.on-safebet` | white | lime/10 `#3E4719` |

## Not included, needs a decision

- **`color.border.alpha-10` and `alpha-20` in BASE/Light.** Figma has white at 10% and 20% in Light mode, and the repo has black. White borders on a light surface look like a Figma mistake, so the repo keeps black for now. Please confirm which is correct.
- **LobBet.** The Brand collection has a LobBet mode, but `main` has no LobBet token sets. There is a separate `LobBet` branch. The LobBet palette tokens are included in Global; the LobBet semantic set is not.
- **Typos in Figma names.** `color.surface.mk-offfer-card-time-badge` and `color.suface-alpha.primary-0` are written exactly as Figma names them so the sync matches. Renaming them should happen in Figma first.
- **Stale references in Brand themes.** The Brand themes in `$themes.json` reference 48 BASE tokens with keys that no longer exist in the library. These were already there and are left unchanged.
- **Live indicator.** A separate `meaning/live-indicator` token is on hold and is not part of this update.

## How this was checked

`scripts/resolve-tokens.mjs` resolves every token in every theme, including references, `rgba()` expressions and Tokens Studio modifiers. The results were compared with the resolved Figma value for each variable and mode. After the update, 574 of 576 colour values match. The 2 that do not match are the `alpha-10` and `alpha-20` borders listed above.
