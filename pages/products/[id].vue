<script setup lang="ts">
import type { Product } from "~/types";

const route = useRoute();
const { fetchProductById } = useProducts();
const { addToCart, loadCart } = useCart();

const product = ref<Product | null>(null);
const loading = ref(true);
const quantity = ref(1);
const adding = ref(false);
const showSuccess = ref(false);

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (!product.value) return;

  adding.value = true;

  const success = await addToCart(
    {
      id: product.value.id,
      title: product.value.title,
      price: product.value.price,
      image: product.value.image,
    },
    quantity.value
  );

  if (success) {
    await loadCart();
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  }

  adding.value = false;
};

onMounted(async () => {
  const productId = parseInt(route.params.id as string);
  product.value = await fetchProductById(productId);
  loading.value = false;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button
      @click="$router.back()"
      class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span class="font-medium">Back to Products</span>
    </button>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="!product" class="text-center py-20">
      <div class="text-red-500 text-xl mb-4">Product not found</div>
      <NuxtLink to="/" class="btn-primary">Go to Products</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <div
          class="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="w-full h-full object-contain p-8"
          />
        </div>
      </div>

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

        <div class="mb-8">
          <p class="text-4xl font-bold text-gray-900 mb-2">
            ${{ product.price.toFixed(2) }}
          </p>
          <p class="text-green-600 font-medium">In Stock</p>
        </div>

        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <div class="flex items-center space-x-4 mb-8">
          <label class="font-semibold text-gray-900">Quantity:</label>
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button
              @click="decreaseQuantity"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
              :disabled="quantity <= 1"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span
              class="px-6 py-2 font-semibold text-gray-900 border-x border-gray-300"
              >{{ quantity }}</span
            >
            <button
              @click="increaseQuantity"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="handleAddToCart"
            :disabled="adding"
            class="btn-primary flex-1 text-lg py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="!adding"
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
            <svg
              v-else
              class="w-6 h-6 animate-spin"
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
            <span>{{ adding ? "Adding to Cart..." : "Add to Cart" }}</span>
          </button>

          <NuxtLink
            to="/cart"
            class="btn-secondary flex-1 text-lg py-3 flex items-center justify-center space-x-2"
          >
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>View Cart</span>
          </NuxtLink>
        </div>

        <div
          v-if="showSuccess"
          class="mt-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span class="font-medium">Added to cart successfully!</span>
        </div>
      </div>
    </div>
  </div>
</template>
