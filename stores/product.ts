import { defineStore } from "pinia";
import type { Product } from "~/types";
import { useApi } from "~/lib/axios";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    selectedProduct: null as Product | null,
    loading: false,
    error: "" as string | null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      const api = useApi();

      try {
        const { data } = await api.get<Product[]>("/products");
        this.products = data;
      } catch (err: any) {
        this.error = err.message || "Failed to load products";
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id: number) {
      this.loading = true;
      this.error = null;
      const api = useApi();

      try {
        const { data } = await api.get<Product>(`/products/${id}`);
        this.selectedProduct = data;
      } catch (err: any) {
        this.error = err.message || "Failed to load product detail";
        this.selectedProduct = null;
      } finally {
        this.loading = false;
      }
    },

    async fetchProductsByCategory(category: string) {
      const api = useApi();
      try {
        const { data } = await api.get<Product[]>(
          `/products/category/${category}`
        );
        return data;
      } catch (err) {
        console.error(err);
        return [];
      }
    },

    async getCategories() {
      const api = useApi();
      try {
        const { data } = await api.get<string[]>("/products/categories");
        return data;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
});
