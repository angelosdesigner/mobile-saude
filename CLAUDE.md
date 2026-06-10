# CLAUDE.md

Frontend: **Vue 3 + TypeScript (Vite)** with **Element Plus** for UI components
and **Tailwind CSS v4** for layout, spacing, and color utilities.

## Installed versions

| Package                   | Version |
| ------------------------- | ------- |
| vue                       | 3.5.35  |
| element-plus              | 2.14.1  |
| tailwindcss               | 4.3.0   |
| @tailwindcss/vite         | 4.3.0   |
| vite                      | 8.0.16  |
| unplugin-auto-import      | 21.0.0  |
| unplugin-vue-components   | 32.1.0  |

Element Plus 2.14.x targets Vue 3.2+, so it is compatible with Vue 3.5 — no peer
dependency conflicts.

## Conventions

- **UI components come from Element Plus via auto-import.** Write `<el-button>`,
  `<el-input>`, `<el-card>`, etc. directly in templates — do **not** add manual
  `import { ElButton } from 'element-plus'` lines. `unplugin-vue-components` +
  `unplugin-auto-import` (configured with `ElementPlusResolver`) register the
  components and APIs (`ElMessage`, `ElLoading`, …) on demand.
- **Layout, spacing, and color use Tailwind utilities** (`flex`, `gap-*`,
  `p-*`, `mt-*`, `shadow-*`, `text-*`, `bg-*`, …). Prefer utilities over custom
  CSS for arrangement and theming, including when decorating an `<el-*>`.
- **Never disable Tailwind's preflight.** The Element Plus ↔ preflight conflict
  is resolved entirely with **native CSS cascade layers** (see below), not by
  turning off the reset.

## The CSS-layer rule (do not change without re-testing)

`src/style.css` declares the layer order **before** any `@import`, so priority
is governed by declaration order, not source order or selector specificity:

```css
@layer theme, base, element-plus, components, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css' layer(utilities);
@import 'element-plus/dist/index.css' layer(element-plus);
```

Priority (low → high): `theme` < `base` (preflight) < `element-plus` <
`components` < `utilities`.

- Element Plus is **above** `base`, so the preflight reset
  (`button { background: transparent; border-width: 0 }`) does **not** flatten
  EP components.
- Tailwind `utilities` is **on top**, so utility classes win when applied to an
  `<el-*>` (e.g. `bg-emerald-500`, `text-red-500`, `mt-4`, `shadow-lg`).

### Why `importStyle: false` in `vite.config.ts`

The `ElementPlusResolver` is configured with `importStyle: false`. With the more
common `importStyle: 'css'`, the resolver injects each component's CSS as an
**unlayered** stylesheet, and unlayered rules outrank **every** `@layer` — which
makes it impossible for Tailwind utilities to override Element Plus. By
disabling per-component injection and importing `element-plus/dist/index.css`
once into the `element-plus` layer, the declared layer order stays authoritative.

> Trade-off: the full Element Plus stylesheet ships (no per-component CSS
> tree-shaking). This is the price of an authoritative cascade. If you ever
> switch back to `importStyle: 'css'`, you must instead rely on Tailwind's
> `!important` modifier (e.g. `!bg-emerald-500`) to beat Element Plus, and the
> layer import above becomes ineffective.

## Scripts

- `npm run dev` — Vite dev server (http://localhost:5173)
- `npm run build` — `vue-tsc -b && vite build`
- `npm run preview` — preview the production build
