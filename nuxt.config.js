export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'IndoorTrainer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/auth-next',
    'vue-sweetalert2/nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      home: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/user/login',
            method: 'post',
            propertyName: 'token',
          },
          logout: false,
          user: {
            url: '/api/user/get',
            method: 'get',
            propertyName: false,
          },
        },
        tokenRequired: false,
        tokenType: '',
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  ssr: false,

  /*
   ** modifying the loading indicator for spa  - https://nuxtjs.org/docs/2.x/features/loading
   */
  loadingIndicator: {
    name: 'circle',
    color: 'grey',
    background: 'Azure',
  },

  router: {
    middleware: ['auth'],
  },
  static: {
    prefix: false,
  },
  serverMiddleware: {
    '/api': '~/api',
  },
}
