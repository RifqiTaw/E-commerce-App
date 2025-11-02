export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },

  modules: ["@nuxt/image"],

  runtimeConfig: {
    public: {
      fakeStoreBaseUrl: process.env.NUXT_BASE_API_URL_FAKESTOREAPI,
    },
  },

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
