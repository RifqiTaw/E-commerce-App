import { defineStore } from "pinia";
import type { Product } from "~/types";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = "pinia_cart_items";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    loadCart() {
      if (!process.client) return;
      const saved = localStorage.getItem(CART_KEY);
      this.items = saved ? JSON.parse(saved) : [];
    },

    saveCart() {
      if (process.client) {
        localStorage.setItem(CART_KEY, JSON.stringify(this.items));
      }
    },

    addToCart(product: Product, quantity = 1) {
      const existing = this.items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
        });
      }
      this.saveCart();
    },

    updateQuantity(id: number, quantity: number) {
      const item = this.items.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        this.saveCart();
      }
    },

    removeFromCart(id: number) {
      this.items = this.items.filter((i) => i.id !== id);
      this.saveCart();
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },
  },
});
