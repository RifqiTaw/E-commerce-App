import { defineStore } from "pinia";
import { useCartStore } from "~/stores/cart";
import type { CheckoutForm } from "~/types";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async placeOrder(form: CheckoutForm) {
      const cartStore = useCartStore();

      if (cartStore.cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }

      this.loading = true;
      this.error = null;

      try {
        const generatedOrderNumber = `ORD-${Date.now()}`;
        const subtotal = cartStore.getCartTotal;
        const shipping = 10;
        const tax = subtotal * 0.1;

        const newOrder = {
          id: crypto.randomUUID(),
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
          total_amount: subtotal + shipping + tax,
          status: "confirmed",
          items: cartStore.cartItems.map((item) => ({
            product_id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
          })),
          created_at: new Date().toISOString(),
        };

        this.orders.push(newOrder);
        cartStore.clearCart();

        return newOrder;
      } catch (err: any) {
        this.error = err.message || "Failed to place order";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
