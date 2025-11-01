export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // modules: ['@nuxtjs/tailwindcss'],

  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  // runtimeConfig: {
  //   public: {
  //     supabaseUrl: process.env.VITE_SUPABASE_URL,
  //     supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  //   }
  // },

  app: {
    head: {
      title: "E-Commerce Store",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Modern e-commerce store built with Nuxt 3",
        },
      ],
    },
  },
});
