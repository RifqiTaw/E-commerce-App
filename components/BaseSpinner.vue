<!-- components/ui/BaseSpinner.vue -->
<template>
  <div class="flex flex-col justify-center items-center py-20">
    <ArrowPathIcon
      class="w-8 h-8 text-blue-600 animate-spin"
      :class="[sizeClass]"
    />
    <p v-if="text" class="mt-4 text-gray-600 text-sm">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  size: { type: String, default: "md" }, // sm, md, lg
  color: { type: String, default: "blue" },
  text: { type: String, default: "" },
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-6 h-6";
    case "lg":
      return "w-16 h-16";
    default:
      return "w-10 h-10";
  }
});
</script>
