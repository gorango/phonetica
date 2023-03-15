// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    GPT_KEY: process.env.GPT_KEY,
    public: {},
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
  ],
  experimental: {
    reactivityTransform: true,
    inlineSSRStyles: false,
    payloadExtraction: false,
  },
  css: [
    '@unocss/reset/tailwind.css',
    '@kidonng/daisyui/base/index.css',
    '@kidonng/daisyui/themes/index.css',
    '~/styles/typography.css',
  ],
  colorMode: {
    preference: 'system',
    dataValue: 'theme',
    classSuffix: '',
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Phonetica',
      short_name: 'Phonetica',
      theme_color: '#2A303C',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
