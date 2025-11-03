<script setup lang="ts">
import { computed } from "vue";

interface Option {
  label: string;
  value: string;
}

interface Props {
  modelValue: string;
  label?: string;
  type?: "text" | "email" | "password" | "tel" | "number" | "select";
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxlength?: number;
  autocomplete?: string;
  options?: Option[];
  id?: string;
  onInput?: (e: Event) => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue", val),
});

const onInput = (e: Event) => {
  if (props.onInput) props.onInput(e);
};
</script>

<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 mb-1"
      :for="id"
    >
      <span>{{ label.replace("*", "") }}</span>
      <span v-if="label.includes('*')" class="text-red-500">*</span>
    </label>  

    <template v-if="type !== 'select'">
      <input
        :id="id"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        class="input-field"
        :class="{ 'border-red-500': error }"
        @input="onInput"
      />
    </template>

    <template v-else>
      <select
        :id="id"
        v-model="inputValue"
        :required="required"
        class="input-field"
        :class="{ 'border-red-500': error }"
      >
        <option value="">Select Country</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </template>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>
