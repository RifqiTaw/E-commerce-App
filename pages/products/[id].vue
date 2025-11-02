<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useProductStore } from "~/stores/product";
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/types";

import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const { loading, error } = storeToRefs(productStore);

const product = ref<Product | null>(null);
const quantity = ref<number>(1);
const adding = ref<boolean>(false);
const showSuccess = ref<boolean>(false);

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const handleAddToCart = async () => {
  if (!product.value) return;
  adding.value = true;

  cartStore.addToCart(product.value, quantity.value);
  cartStore.loadCart();

  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 3000);

  adding.value = false;
};

onMounted(async () => {
  const productId = parseInt(route.params.id as string);
  await productStore.fetchProductById(productId);
  product.value = productStore.selectedProduct;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back Button -->
    <button
      @click="$router.back()"
      class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      <span class="font-medium">Back to Products</span>
    </button>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-500 text-xl mb-4">{{ error }}</div>
      <NuxtLink to="/" class="btn-primary">Go Back</NuxtLink>
    </div>

    <!-- Not Found -->
    <div v-else-if="!product" class="text-center py-20">
      <div class="text-red-500 text-xl mb-4">Product not found</div>
      <NuxtLink to="/" class="btn-primary">Go to Products</NuxtLink>
    </div>

    <!-- Product Detail -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Image -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <div
          class="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center"
        >
          <NuxtImg
            :src="product.image"
            :alt="product.title"
            class="w-full h-full object-contain p-8"
            format="webp"
            quality="80"
            width="500"
            height="500"
          />
        </div>
      </div>

      <!-- Product Details -->
      <div class="flex flex-col">
        <div class="mb-4">
          <span
            class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
          >
            {{ product.category }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ product.title }}
        </h1>

        <!-- Rating -->
        <div class="flex items-center space-x-4 mb-6">
          <div class="flex items-center space-x-1">
            <div class="flex">
              <svg
                v-for="star in 5"
                :key="star"
                :class="[
                  'w-5 h-5',
                  star <= Math.round(product.rating.rate)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 fill-current',
                ]"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
              </svg>
            </div>
            <span class="text-gray-700 font-semibold">{{
              product.rating.rate
            }}</span>
          </div>
          <span class="text-gray-500">{{ product.rating.count }} reviews</span>
        </div>

        <!-- Price -->
        <div class="mb-8">
          <p class="text-4xl font-bold text-gray-900 mb-2">
            ${{ product.price.toFixed(2) }}
          </p>
          <p class="text-green-600 font-medium">In Stock</p>
        </div>

        <!-- Description -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Quantity -->
        <div class="flex items-center space-x-4 mb-8">
          <label class="font-semibold text-gray-900">Quantity:</label>
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button
              @click="decreaseQuantity"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              :disabled="quantity <= 1"
            >
              <MinusIcon class="w-4 h-4" />
            </button>
            <span
              class="px-6 py-2 font-semibold text-gray-900 border-x border-gray-300"
              >{{ quantity }}</span
            >
            <button
              @click="increaseQuantity"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <PlusIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="handleAddToCart"
            :disabled="adding"
            class="btn btn-primary flex-1 text-lg py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingCartIcon v-if="!adding" class="w-6 h-6" />
            <LockClosedIcon v-else class="w-6 h-6 animate-spin" />
            <span>{{ adding ? "Adding to Cart..." : "Add to Cart" }}</span>
          </button>

          <NuxtLink
            to="/cart"
            class="btn btn-secondary flex-1 text-lg py-3 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShoppingCartIcon class="w-6 h-6" />
            <span>View Cart</span>
          </NuxtLink>
        </div>

        <div
          v-if="showSuccess"
          class="mt-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-2"
        >
          <CheckCircleIcon class="w-5 h-5" />
          <span class="font-medium">Added to cart successfully!</span>
        </div>
      </div>
    </div>
  </div>
</template>
