<script setup lang="ts">
// Ícones de "chrome" reutilizados em mais de um lugar (chevrons, busca, etc.),
// centralizados para evitar SVGs duplicados pelos templates. Ilustrações de uso
// único continuam inline no componente que as usa — não há ganho em centralizá-las.
//
// Uso: <AppIcon name="chevron-left" class="h-4 w-4" />
// A classe passa direto para o <svg> (fall-through), controlando tamanho/cor.

// Cada ícone é uma lista de elementos SVG (sem v-html → sem risco de XSS).
type SvgEl = { tag: 'path' | 'circle' } & Record<string, string | number>

const icons: Record<string, SvgEl[]> = {
  'chevron-left': [{ tag: 'path', d: 'm15 18-6-6 6-6' }],
  'chevron-right': [{ tag: 'path', d: 'm9 18 6-6-6-6' }],
  'chevron-down': [{ tag: 'path', d: 'm6 9 6 6 6-6' }],
  search: [
    { tag: 'circle', cx: 11, cy: 11, r: 8 },
    { tag: 'path', d: 'm21 21-4.3-4.3' },
  ],
  close: [{ tag: 'path', d: 'M18 6 6 18M6 6l12 12' }],
  plus: [{ tag: 'path', d: 'M12 5v14M5 12h14' }],
  sun: [
    { tag: 'circle', cx: 12, cy: 12, r: 4 },
    {
      tag: 'path',
      d: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    },
  ],
  moon: [{ tag: 'path', d: 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z' }],
}

withDefaults(defineProps<{ name: keyof typeof icons; size?: number | string }>(), { size: 16 })

function attrsOf({ tag: _tag, ...rest }: SvgEl) {
  return rest
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <component :is="el.tag" v-for="(el, i) in icons[name]" :key="i" v-bind="attrsOf(el)" />
  </svg>
</template>
