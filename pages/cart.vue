<script setup lang="ts">
import type { CartItem } from '~/types'

const { cartItems, cartLoading, loadCart, updateQuantity, removeFromCart, getCartTotal } = useCart()

const subtotal = computed(() => getCartTotal())
const shipping = computed(() => subtotal.value > 0 ? 10 : 0)
const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + shipping.value + tax.value)

const increaseQuantity = async (item: CartItem) => {
  await updateQuantity(item.id!, item.quantity + 1)
}

const decreaseQuantity = async (item: CartItem) => {
  if (item.quantity > 1) {
    await updateQuantity(item.id!, item.quantity - 1)
  }
}

const handleRemoveItem = async (itemId: string) => {
  await removeFromCart(itemId)
}

onMounted(async () => {
  await loadCart()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

    <div v-if="cartLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="cartItems.length === 0" class="text-center py-20">
      <div class="flex justify-center mb-6">
        <svg class="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
      <p class="text-gray-500 mb-8">Add some products to get started!</p>
      <NuxtLink to="/" class="btn-primary inline-block">Browse Products</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
        >
          <div class="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-contain p-2"
            />
          </div>

          <div class="flex-grow">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-2xl font-bold text-gray-900 mb-4">${{ item.price.toFixed(2) }}</p>

            <div class="flex items-center justify-between">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="decreaseQuantity(item)"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  :disabled="item.quantity <= 1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="px-4 py-1 font-semibold text-gray-900 border-x border-gray-300">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item)"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <button
                @click="handleRemoveItem(item.id!)"
                class="text-red-500 hover:text-red-700 font-medium transition-colors flex items-center space-x-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Remove</span>
              </button>
            </div>

            <p class="text-sm text-gray-600 mt-2">
              Subtotal: <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-20">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

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
              <div class="flex justify-between text-gray-900">
                <span class="text-lg font-bold">Total</span>
                <span class="text-2xl font-bold">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <NuxtLink to="/checkout" class="btn-primary w-full block text-center mb-3">
            Proceed to Checkout
          </NuxtLink>

          <NuxtLink to="/" class="btn-secondary w-full block text-center">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>


