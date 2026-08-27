<script setup lang="ts">
/* The Auterion mark — the real one.
 *
 * Path copied verbatim from `packages/brand/assets/auterion/mark-mono.svg`,
 * the master the brand package ships. It fills with `currentColor` exactly as
 * the manifest requires ("masters should use currentColor for fills so the
 * mono/inverse tones derive from one file"), which is what lets a single
 * element be the identity in all four themes: blue in light and dark, black in
 * sunlight, amber in darknight — because the caller paints it with `--brand`
 * and the theme decides what `--brand` means.
 *
 * The manifest's minSize for the mark is 16px; the bar renders it at 20.
 */
withDefaults(defineProps<{ size?: number }>(), { size: 20 });
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 380 380"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M327.102 266.371L369 379H285.204C278.221 379 272.087 374.57 269.823 367.973L250.195 310.197L327.102 266.371ZM347.862 213.214L142.336 278.718C133.182 281.64 124.784 272.498 128.37 263.638L175.175 149.972C179.138 140.265 193.01 140.736 196.407 150.632L222.735 228.483L303.511 202.752L232.926 13.0272C230.472 6.3355 224.15 2 216.978 2H166.304C159.416 2 153.188 6.147 150.545 12.556L11.263 355.626C6.7335 366.748 14.9432 379 27.0219 379H72.2227C78.7338 379 85.245 377.304 90.9069 374.005L352.958 224.713C355.695 223.205 356.827 219.906 355.789 216.984C354.657 213.874 351.165 212.178 347.862 213.214Z"
      fill="currentColor"
    />
  </svg>
</template>
