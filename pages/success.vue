<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
</script>
<template>
  <div class="flex items-center justify-center py-30">
    <div class="max-w-2xl text-center p-6 rounded-lg">
      <CheckCircleIcon class="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 class="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
      <p class="text-gray-700 mb-4">Thank you for your purchase.</p>
      <NuxtLink to="/" class="btn btn-primary inline-block mt-2">
        Continue Shopping
      </NuxtLink>
    </div>
  </div>
</template>
