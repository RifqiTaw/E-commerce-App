<script setup lang="ts">
const { getCartCount } = useCart();
const cartCount = ref(0);
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

onMounted(async () => {
  cartCount.value = await getCartCount();
});

watch(
  () => cartCount.value,
  async () => {
    cartCount.value = await getCartCount();
  },
  { deep: true }
);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span class="text-xl font-bold text-gray-900">E-Shop</span>
          </NuxtLink>

          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Products
            </NuxtLink>
            <NuxtLink
              to="/cart"
              class="relative text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <div class="flex items-center space-x-1">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span
                  v-if="cartCount > 0"
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {{ cartCount }}
                </span>
              </div>
            </NuxtLink>
          </div>

          <button @click="toggleMobileMenu" class="md:hidden text-gray-700">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t">
          <div class="flex flex-col space-y-4">
            <NuxtLink
              to="/"
              @click="toggleMobileMenu"
              class="text-gray-700 hover:text-blue-600 font-medium"
            >
              Products
            </NuxtLink>
            <NuxtLink
              to="/cart"
              @click="toggleMobileMenu"
              class="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2"
            >
              <span>Cart</span>
              <span
                v-if="cartCount > 0"
                class="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">E-Shop</h3>
            <p class="text-gray-400">
              Your trusted online shopping destination
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-gray-400">
              <li>
                <NuxtLink to="/" class="hover:text-white transition-colors"
                  >Products</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/cart" class="hover:text-white transition-colors"
                  >Cart</NuxtLink
                >
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <p class="text-gray-400">Email: support@eshop.com</p>
            <p class="text-gray-400">Phone: +1 234 567 890</p>
          </div>
        </div>
        <div
          class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2025 E-Shop. Built with Nuxt 3 & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  </div>
</template>
