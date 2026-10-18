// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  modules: ['@nuxt/content'],
  css: ['~/assets/css/blog.css'],
  app: {
    head: {
      titleTemplate: '%s - Blog de Noticias',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Blog de noticias nacionales' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:400,300,600' }
      ]
    }
  }
})