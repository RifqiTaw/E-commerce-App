<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/types";
import BaseSpinner from "~/components/BaseSpinner.vue";

import {
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const cartStore = useCartStore();
const { cartItems } = storeToRefs(cartStore);

const cartLoading = ref(true);

onMounted(() => {
  cartStore.loadCart();
  cartLoading.value = false;
});

const subtotal = computed(() =>
  cartStore.cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )
);

const shipping = computed(() => (subtotal.value > 0 ? 10 : 0));
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + shipping.value + tax.value);

const increaseQuantity = (product: Product) => {
  const item = cartStore.cartItems.find((i) => i.product.id === product.id);
  if (item) {
    item.quantity++;
    cartStore.saveCart();
  }
};

const decreaseQuantity = (product: Product) => {
  const item = cartStore.cartItems.find((i) => i.product.id === product.id);
  if (item && item.quantity > 1) {
    item.quantity--;
    cartStore.saveCart();
  }
};

const handleRemoveItem = (productId: number) => {
  cartStore.removeFromCart(productId);
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

    <!-- Loader -->
    <template v-if="cartLoading">
      <BaseSpinner size="lg" text="Loading cart" />
    </template>

    <!-- Empty Cart -->
    <div v-else-if="cartItems.length === 0" class="text-center py-20">
      <div class="flex justify-center mb-6">
        <ShoppingCartIcon class="w-24 h-24" />
      </div>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        Your cart is empty
      </h2>
      <p class="text-gray-500 mb-8">Add some products to get started!</p>
      <NuxtLink to="/" class="btn btn-primary inline-block">
        Browse Products
      </NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Section -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.product.id"
          class="rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 bg-white"
        >
          <div
            class="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
          >
            <NuxtImg
              :src="item.product.image"
              :alt="item.product.title"
              class="w-full h-full object-contain p-2"
              format="webp"
              quality="80"
              width="150"
              height="150"
            />
          </div>

          <div class="flex-grow">
            <h3 class="text-lg font-semibold mb-2">
              {{ item.product.title }}
            </h3>
            <p class="text-2xl font-bold mb-4">
              ${{ item.product.price.toFixed(2) }}
            </p>

            <div class="flex items-center justify-between">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="decreaseQuantity(item.product)"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  :disabled="item.quantity <= 1"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                <span
                  class="px-4 py-1 font-semibold text-gray-900 border-x border-gray-300"
                  >{{ item.quantity }}</span
                >
                <button
                  @click="increaseQuantity(item.product)"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>

              <button
                @click="handleRemoveItem(item.product.id)"
                class="text-red-500 hover:text-red-700 font-medium transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <TrashIcon class="w-5 h-5" />
                <span>Remove</span>
              </button>
            </div>

            <p class="text-sm text-gray-600 mt-2">
              Subtotal:
              <span class="font-semibold">
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Section (Order Summary) -->
      <div class="lg:col-span-1">
        <div class="rounded-lg shadow-md p-6 sticky top-20 bg-white">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span class="font-semibold">${{ shipping.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Tax (10%)</span>
              <span class="font-semibold">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-300 pt-3">
              <div class="flex justify-between">
                <span class="text-lg font-bold">Total</span>
                <span class="text-2xl font-bold">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/checkout"
            class="btn btn-primary w-full block text-center mb-3"
          >
            Proceed to Checkout
          </NuxtLink>

          <NuxtLink to="/" class="btn btn-secondary w-full block text-center">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
