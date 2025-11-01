import { defineStore } from "pinia";
import type { Product } from "~/types";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProducts() {
      if (this.products.length > 0) return;

      this.loading = true;
      this.error = null;

      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        this.products = await res.json();
      } catch (err) {
        this.error = err instanceof Error ? err.message : "An error occurred";
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id: number): Promise<Product | null> {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        return await res.json();
      } catch (err) {
        this.error = err instanceof Error ? err.message : "An error occurred";
        return null;
      }
    },

    async fetchProductsByCategory(category: string): Promise<Product[]> {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(
          `https://fakestoreapi.com/products/category/${category}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        return await res.json();
      } catch (err) {
        this.error = err instanceof Error ? err.message : "An error occurred";
        return [];
      } finally {
        this.loading = false;
      }
    },

    async getCategories(): Promise<string[]> {
      try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        return await res.json();
      } catch {
        return [];
      }
    },
  },
});
