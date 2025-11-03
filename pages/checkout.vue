<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useOrderStore } from "~/stores/order";
import type { CheckoutForm } from "~/types";
import FormInput from "~/components/FormInput.vue";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";

const config = useRuntimeConfig();

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const { cartItems, getCartTotal, loadCart } = cartStore;

const form = reactive<CheckoutForm>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
});

const errors = reactive<Partial<Record<keyof CheckoutForm, string>>>({});
const processing = ref(false);
const orderSuccess = ref(false);
const orderNumber = ref("");

const subtotal = computed(() => getCartTotal);
const shipping = computed(() => 10);
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + shipping.value + tax.value);

const countries = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "GB" },
  { label: "Australia", value: "AU" },
  { label: "Indonesia", value: "ID" },
];

const validateForm = (): boolean => {
  const fields: (keyof CheckoutForm)[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "postalCode",
    "country",
  ];

  fields.forEach((key) => (errors[key] = ""));
  let valid = true;

  if (!form.firstName.trim())
    (errors.firstName = "First name is required"), (valid = false);
  if (!form.lastName.trim())
    (errors.lastName = "Last name is required"), (valid = false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim() || !emailRegex.test(form.email))
    (errors.email = "Valid email is required"), (valid = false);

  if (!form.phone.trim())
    (errors.phone = "Phone number is required"), (valid = false);
  if (!form.address.trim())
    (errors.address = "Address is required"), (valid = false);
  if (!form.city.trim()) (errors.city = "City is required"), (valid = false);
  if (!form.postalCode.trim())
    (errors.postalCode = "Postal code is required"), (valid = false);
  if (!form.country.trim())
    (errors.country = "Country is required"), (valid = false);

  return valid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  if (cartItems.length === 0) {
    alert("Your cart is empty");
    return;
  }

  processing.value = true;

  try {
    const newOrder = await orderStore.placeOrder(form);
    orderNumber.value = newOrder.order_number;

    window.scrollTo({ top: 0, behavior: "smooth" });

    window.location.href = config.public.stripeCheckoutUrl;
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order. Please try again.");
  } finally {
    processing.value = false;
  }
};

onMounted(async () => {
  await loadCart();
  if (cartItems.length === 0) router.push("/cart");
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back Button -->
    <button
      @click="$router.back()"
      class="flex items-center space-x-2 text-gray-600 hover: mb-6 transition-colors cursor-pointer"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      <span class="font-medium">Back to Cart</span>
    </button>

    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <!-- Success Message -->
    <div v-if="orderSuccess" class="max-w-2xl mx-auto">
      <div
        class="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
      >
        <CheckCircleIcon class="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
        <p class="text-gray-700 mb-1">Thank you for your purchase.</p>
        <p class="text-gray-600 text-sm mb-6">
          Order Number: <span class="font-semibold">{{ orderNumber }}</span>
        </p>
        <p class="text-gray-600 mb-8">
          A confirmation email has been sent to your email.
        </p>
        <NuxtLink to="/" class="btn btn-primary inline-block"
          >Continue Shopping</NuxtLink
        >
      </div>
    </div>

    <!-- Checkout Form -->
    <form
      v-else
      @submit.prevent="handleSubmit"
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div class="lg:col-span-2">
        <!-- Contact Info -->
        <div class="rounded-lg shadow-md p-6 bg-white mb-4">
          <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              v-model="form.firstName"
              label="First Name *"
              required
              :error="errors.firstName"
            />
            <FormInput
              v-model="form.lastName"
              label="Last Name *"
              required
              :error="errors.lastName"
            />
            <FormInput
              v-model="form.email"
              type="email"
              label="Email *"
              required
              :error="errors.email"
            />
            <FormInput
              v-model="form.phone"
              type="tel"
              label="Phone *"
              required
              :error="errors.phone"
            />
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Shipping Address</h2>
          <div class="space-y-4">
            <FormInput
              v-model="form.address"
              label="Address *"
              required
              :error="errors.address"
            />
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                v-model="form.city"
                label="City *"
                required
                :error="errors.city"
              />
              <FormInput
                v-model="form.postalCode"
                label="Postal Code *"
                required
                :error="errors.postalCode"
              />
              <FormInput
                v-model="form.country"
                label="Country *"
                type="select"
                :options="countries"
                required
                :error="errors.country"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-20">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

          <div class="space-y-3 mb-6">
            <div
              v-for="item in cartItems"
              :key="item.product.id"
              class="flex items-center space-x-3"
            >
              <NuxtImg
                :src="item.product.image"
                :alt="item.product.title"
                class="w-16 h-16 object-contain"
                format="webp"
                quality="80"
                width="150"
                height="150"
              />
              <div class="flex-grow">
                <p class="text-sm font-medium truncate">
                  {{ item.product.title }}
                </p>
                <p class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-2 mb-4 border-t border-gray-200 pt-4">
            <div class="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span class="font-semibold">${{ shipping.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Tax</span>
              <span class="font-semibold">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-300 pt-2">
              <div class="flex justify-between">
                <span class="text-lg font-bold">Total</span>
                <span class="text-2xl font-bold">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="processing"
            class="btn btn-success w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon
              v-if="processing"
              class="w-5 h-5 mr-2 animate-spin"
            />
            <span>{{ processing ? "Processing..." : "Place Order" }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
