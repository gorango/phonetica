import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'

export default defineConfig({
  shortcuts: [
    ['btn', 'rounded cursor-pointer hover:bg-opacity-80 disabled:cursor-default disabled:opacity-50 active:translate-y-[1px] transition'],
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
    presetWebFonts({
      fonts: {
        sans: 'Ubuntu',
        mono: 'Ubuntu Mono',
      },
      provider: 'google',
    }),
    presetDaisy(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
