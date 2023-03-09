import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'

export default defineConfig({
  shortcuts: [
    ['btn', 'rounded cursor-pointer hover:bg-opacity-80 disabled:cursor-default disabled:opacity-50 active:opacity-80'],
    ['flex-center', 'flex items-center justify-center'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
    presetDaisy(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
