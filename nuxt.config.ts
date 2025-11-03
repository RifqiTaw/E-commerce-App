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
      fakeStoreBaseUrl: process.env.URL_FAKESTOREAPI,
      stripeCheckoutUrl: process.env.STRIPE_CHECKOUT_URL,
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
      link: [{ rel: "icon", type: "image/x-icon", href: "/e-commerce.png" }],
    },
  },
});
