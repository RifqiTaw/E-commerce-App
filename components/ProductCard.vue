<script setup lang="ts">
import type { Product } from "~/types";

const props = defineProps<{
  product: Product;
}>();

const { addToCart, loadCart } = useCart();
const adding = ref(false);

const handleAddToCart = async () => {
  adding.value = true;

  const success = await addToCart(
    {
      id: props.product.id,
      title: props.product.title,
      price: props.product.price,
      image: props.product.image,
    },
    1
  );

  if (success) {
    await loadCart();
  }

  adding.value = false;
};
</script>

<template>
  <div class="card overflow-hidden group">
    <NuxtLink :to="`/products/${product.id}`" class="block">
      <div class="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          :src="product.image"
          :alt="product.title"
          class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div
          class="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md"
        >
          <div class="flex items-center space-x-1">
            <svg
              class="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
              />
            </svg>
            <span class="text-sm font-semibold text-gray-700">{{
              product.rating.rate
            }}</span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <div class="p-4">
      <NuxtLink :to="`/products/${product.id}`">
        <p
          class="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1"
        >
          {{ product.category }}
        </p>
        <h3
          class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
        >
          {{ product.title }}
        </h3>
      </NuxtLink>

      <div class="flex items-center justify-between mt-4">
        <p class="text-2xl font-bold text-gray-900">
          ${{ product.price.toFixed(2) }}
        </p>
        <button
          @click="handleAddToCart"
          :disabled="adding"
          class="btn-primary text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="!adding"
            class="w-5 h-5"
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
          <svg
            v-else
            class="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ adding ? "Adding..." : "Add" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
