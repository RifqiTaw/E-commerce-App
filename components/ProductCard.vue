<script setup lang="ts">
import { ref } from "vue";
import type { Product } from "~/types";
import { useCartStore } from "~/stores/cart";
import { StarIcon, ShoppingCartIcon } from "@heroicons/vue/24/solid";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{ product: Product }>();
const cartStore = useCartStore();
const adding = ref(false);

const handleAddToCart = async () => {
  adding.value = true;
  await new Promise((r) => setTimeout(r, 400));
  cartStore.addToCart(props.product, 1);
  adding.value = false;
};
</script>

<template>
  <div
    class="card flex flex-col overflow-hidden group rounded-2xl shadow hover:shadow-lg transition-shadow"
  >
    <NuxtLink :to="`/products/${product.id}`" class="block">
      <div class="relative aspect-square bg-gray-100 overflow-hidden">
        <NuxtImg
          :src="product.image"
          :alt="product.title"
          format="webp"
          width="400"
          height="400"
          class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div
          class="absolute top-2 right-2 px-2 py-1 rounded-full shadow-md flex items-center space-x-1"
        >
          <StarIcon class="w-4 h-4 text-yellow-400" />
          <span class="text-sm font-semibold">
            {{ product.rating.rate }}
          </span>
        </div>
      </div>
    </NuxtLink>

    <!-- Konten Card -->
    <div class="flex flex-col flex-grow p-4">
      <NuxtLink :to="`/products/${product.id}`" class="flex-grow">
        <p
          class="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1"
        >
          {{ product.category }}
        </p>
        <h3
          class="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
        >
          {{ product.title }}
        </h3>
      </NuxtLink>

      <div class="flex-grow"></div>

      <div class="flex items-center justify-between mt-4">
        <p class="text-2xl font-bold">${{ product.price.toFixed(2) }}</p>

        <button
          @click="handleAddToCart"
          :disabled="adding"
          class="btn btn-primary text-sm flex items-center space-x-2"
        >
          <ShoppingCartIcon v-if="!adding" class="w-5 h-5" />
          <ArrowPathIcon v-else class="w-5 h-5 animate-spin" />
          <span>{{ adding ? "Adding..." : "Add" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
