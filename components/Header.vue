<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "~/stores/cart";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  Bars3Icon,
} from "@heroicons/vue/24/outline";

const cartStore = useCartStore();
const { cartItems } = storeToRefs(cartStore);

const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value);

const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

onMounted(() => {
  cartStore.loadCart();
});
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <ShoppingBagIcon class="w-8 h-8 text-blue-600" />
          <span class="text-xl font-bold text-gray-900">E-Shop</span>
        </NuxtLink>

        <!-- Desktop Menu -->
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
              <ShoppingCartIcon class="w-6 h-6" />

              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ cartCount }}
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Mobile Toggle -->
        <button @click="toggleMobileMenu" class="md:hidden text-gray-700">
          <Bars3Icon class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
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
            <ShoppingCartIcon class="w-5 h-5" />
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
</template>
