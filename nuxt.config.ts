// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    GPT_KEY: process.env.GPT_KEY,
    public: {},
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  experimental: {
    reactivityTransform: true,
    inlineSSRStyles: false,
  },
  css: [
    '@unocss/reset/tailwind.css',
    '@kidonng/daisyui/base/index.css',
    '@kidonng/daisyui/themes/index.css',
  ],
  colorMode: {
    preference: 'system',
    dataValue: 'theme',
    classSuffix: '',
  },
})
