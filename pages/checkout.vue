<script setup lang="ts">
import type { CheckoutForm } from "~/types";

const router = useRouter();
const supabase = useSupabase();
const { cartItems, getCartTotal, clearCart, loadCart } = useCart();

const form = reactive<CheckoutForm>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
});

const errors = reactive<Partial<Record<keyof CheckoutForm, string>>>({});
const processing = ref(false);
const orderSuccess = ref(false);
const orderNumber = ref("");

const subtotal = computed(() => getCartTotal());
const shipping = computed(() => 10);
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + shipping.value + tax.value);

const formatCardNumber = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let value = input.value.replace(/\s/g, "");
  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
  form.cardNumber = formattedValue;
};

const formatExpiry = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }
  form.cardExpiry = value;
};

const validateForm = (): boolean => {
  Object.keys(errors).forEach(
    (key) => delete errors[key as keyof CheckoutForm]
  );

  let isValid = true;

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required";
    isValid = false;
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim() || !emailRegex.test(form.email)) {
    errors.email = "Valid email is required";
    isValid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  }

  if (!form.address.trim()) {
    errors.address = "Address is required";
    isValid = false;
  }

  if (!form.city.trim()) {
    errors.city = "City is required";
    isValid = false;
  }

  if (!form.postalCode.trim()) {
    errors.postalCode = "Postal code is required";
    isValid = false;
  }

  if (!form.country) {
    errors.country = "Country is required";
    isValid = false;
  }

  const cardNumber = form.cardNumber.replace(/\s/g, "");
  if (!cardNumber || cardNumber.length < 13) {
    errors.cardNumber = "Valid card number is required";
    isValid = false;
  }

  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!form.cardExpiry || !expiryRegex.test(form.cardExpiry)) {
    errors.cardExpiry = "Valid expiry date is required (MM/YY)";
    isValid = false;
  }

  if (!form.cardCvc || form.cardCvc.length < 3) {
    errors.cardCvc = "Valid CVC is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  if (cartItems.value.length === 0) {
    alert("Your cart is empty");
    return;
  }

  processing.value = true;

  try {
    const generatedOrderNumber = `ORD-${Date.now()}`;

    const { error } = await supabase.from("orders").insert([
      {
        order_number: generatedOrderNumber,
        user_email: form.email,
        user_name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        shipping_address: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        total_amount: total.value,
        status: "confirmed",
        items: cartItems.value.map((item) => ({
          product_id: item.product_id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      },
    ]);

    if (error) throw error;

    await clearCart();

    orderNumber.value = generatedOrderNumber;
    orderSuccess.value = true;

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order. Please try again.");
  } finally {
    processing.value = false;
  }
};

onMounted(async () => {
  await loadCart();

  if (cartItems.value.length === 0) {
    router.push("/cart");
  }
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
      <span class="font-medium">Back to Cart</span>
    </button>

    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

    <div v-if="orderSuccess" class="max-w-2xl mx-auto">
      <div
        class="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
      >
        <div class="flex justify-center mb-4">
          <svg
            class="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h2>
        <p class="text-gray-700 mb-1">Thank you for your purchase.</p>
        <p class="text-gray-600 text-sm mb-6">
          Order Number: <span class="font-semibold">{{ orderNumber }}</span>
        </p>
        <p class="text-gray-600 mb-8">
          A confirmation email has been sent to your email address.
        </p>
        <NuxtLink to="/" class="btn-primary inline-block"
          >Continue Shopping</NuxtLink
        >
      </div>
    </div>

    <form
      v-else
      @submit.prevent="handleSubmit"
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >First Name *</label
              >
              <input
                v-model="form.firstName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.firstName }"
              />
              <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">
                {{ errors.firstName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Last Name *</label
              >
              <input
                v-model="form.lastName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.lastName }"
              />
              <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">
                {{ errors.lastName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email *</label
              >
              <input
                v-model="form.email"
                type="email"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                {{ errors.email }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone *</label
              >
              <input
                v-model="form.phone"
                type="tel"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.phone }"
              />
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
                {{ errors.phone }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Shipping Address
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Address *</label
              >
              <input
                v-model="form.address"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.address }"
              />
              <p v-if="errors.address" class="text-red-500 text-sm mt-1">
                {{ errors.address }}
              </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >City *</label
                >
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="input-field"
                  :class="{ 'border-red-500': errors.city }"
                />
                <p v-if="errors.city" class="text-red-500 text-sm mt-1">
                  {{ errors.city }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Postal Code *</label
                >
                <input
                  v-model="form.postalCode"
                  type="text"
                  required
                  class="input-field"
                  :class="{ 'border-red-500': errors.postalCode }"
                />
                <p v-if="errors.postalCode" class="text-red-500 text-sm mt-1">
                  {{ errors.postalCode }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Country *</label
                >
                <select
                  v-model="form.country"
                  required
                  class="input-field"
                  :class="{ 'border-red-500': errors.country }"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="ID">Indonesia</option>
                </select>
                <p v-if="errors.country" class="text-red-500 text-sm mt-1">
                  {{ errors.country }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Payment Information
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Card Number *</label
              >
              <input
                v-model="form.cardNumber"
                type="text"
                placeholder="4242 4242 4242 4242"
                required
                maxlength="19"
                class="input-field"
                :class="{ 'border-red-500': errors.cardNumber }"
                @input="formatCardNumber"
              />
              <p v-if="errors.cardNumber" class="text-red-500 text-sm mt-1">
                {{ errors.cardNumber }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                Test card: 4242 4242 4242 4242
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Expiry Date *</label
                >
                <input
                  v-model="form.cardExpiry"
                  type="text"
                  placeholder="MM/YY"
                  required
                  maxlength="5"
                  class="input-field"
                  :class="{ 'border-red-500': errors.cardExpiry }"
                  @input="formatExpiry"
                />
                <p v-if="errors.cardExpiry" class="text-red-500 text-sm mt-1">
                  {{ errors.cardExpiry }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >CVC *</label
                >
                <input
                  v-model="form.cardCvc"
                  type="text"
                  placeholder="123"
                  required
                  maxlength="4"
                  class="input-field"
                  :class="{ 'border-red-500': errors.cardCvc }"
                />
                <p v-if="errors.cardCvc" class="text-red-500 text-sm mt-1">
                  {{ errors.cardCvc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-20">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div class="space-y-3 mb-6">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center space-x-3"
            >
              <div class="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-contain p-1"
                />
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.title }}
                </p>
                <p class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
              </div>
              <p class="text-sm font-semibold text-gray-900">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </p>
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
              <div class="flex justify-between text-gray-900">
                <span class="text-lg font-bold">Total</span>
                <span class="text-2xl font-bold">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="processing"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="processing"
              class="w-5 h-5 mr-2 animate-spin"
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
            <span>{{ processing ? "Processing..." : "Place Order" }}</span>
          </button>

          <p class="text-xs text-gray-500 text-center mt-4">
            By placing your order, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
