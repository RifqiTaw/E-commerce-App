import { defineStore } from "pinia";
import type { Product } from "~/types";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [] as CartItem[],
  }),

  getters: {
    total: (state) =>
      state.cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    itemCount: (state) =>
      state.cartItems.reduce((count, item) => count + item.quantity, 0),
    getCartTotal: (state) =>
      state.cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
  },

  actions: {
    loadCart() {
      const saved = localStorage.getItem("cart");
      if (saved) this.cartItems = JSON.parse(saved);
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cartItems));
    },

    addToCart(product: Product, quantity = 1) {
      const existing = this.cartItems.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.cartItems.push({ product, quantity });
      }
      this.saveCart();
      toast.success(`${product.title} added to cart`);
    },

    removeFromCart(id: number) {
      this.cartItems = this.cartItems.filter((i) => i.product.id !== id);
      this.saveCart();
      toast.info("Item removed from cart");
    },

    clearCart() {
      this.cartItems = [];
      this.saveCart();
      toast.info("Cart cleared");
    },
  },
});
