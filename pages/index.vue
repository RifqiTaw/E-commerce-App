<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useProductStore } from "~/stores/product";
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/types";
import BaseSpinner from "~/components/BaseSpinner.vue";

const productStore = useProductStore();
const cartStore = useCartStore();

const { products, loading, error } = storeToRefs(productStore);
const displayedProducts = ref<Product[]>([]);
const categories = ref<string[]>([]);
const selectedCategory = ref<string | null>(null);

const loadProducts = async () => {
  await productStore.fetchProducts();
  displayedProducts.value = products.value;
};

const filterByCategory = async (category: string | null) => {
  selectedCategory.value = category;
  displayedProducts.value =
    category === null
      ? products.value
      : await productStore.fetchProductsByCategory(category);
};

onMounted(async () => {
  await loadProducts();
  categories.value = await productStore.getCategories();
  cartStore.loadCart();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Featured Products</h1>
      <p class="text-gray-600">
        Discover our latest collection of premium products
      </p>
    </div>

    <!-- Categories -->
    <div v-if="!loading && categories.length > 0" class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          @click="filterByCategory(null)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-gray-200',
          ]"
        >
          All Products
        </button>
        <button
          v-for="category in categories"
          :key="category"
          @click="filterByCategory(category)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors capitalize cursor-pointer',
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-gray-100',
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Loader -->
    <template v-if="loading">
      <BaseSpinner size="lg" text="Loading products..." />
    </template>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-500 text-xl mb-4">{{ error }}</div>
      <button @click="loadProducts" class="btn btn-primary">Try Again</button>
    </div>

    <!-- Empty -->
    <div v-else-if="displayedProducts.length === 0" class="text-center py-20">
      <p class="text-gray-500 text-xl">No products found</p>
    </div>

    <!-- Product Card -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in displayedProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="cartStore.addToCart(product)"
      />
    </div>
  </div>
</template>
