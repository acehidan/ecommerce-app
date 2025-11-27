import { create } from 'zustand';

// Cache duration: 5 minutes (300000 ms)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

export const useHomeCacheStore = create((set, get) => ({
  banners: null,
  products: null,
  categories: null,

  setBanners: (data) =>
    set({
      banners: {
        data,
        timestamp: Date.now(),
      },
    }),

  setProducts: (data) =>
    set({
      products: {
        data,
        timestamp: Date.now(),
      },
    }),

  setCategories: (data) =>
    set({
      categories: {
        data,
        timestamp: Date.now(),
      },
    }),

  clearCache: () =>
    set({
      banners: null,
      products: null,
      categories: null,
    }),

  getBanners: () => {
    const { banners, isBannersStale } = get();
    if (!banners || isBannersStale()) return null;
    return banners.data;
  },

  getProducts: () => {
    const { products, isProductsStale } = get();
    if (!products || isProductsStale()) return null;
    return products.data;
  },

  getCategories: () => {
    const { categories, isCategoriesStale } = get();
    if (!categories || isCategoriesStale()) return null;
    return categories.data;
  },

  isBannersStale: (maxAge = DEFAULT_CACHE_DURATION) => {
    const { banners } = get();
    if (!banners) return true;
    return Date.now() - banners.timestamp > maxAge;
  },

  isProductsStale: (maxAge = DEFAULT_CACHE_DURATION) => {
    const { products } = get();
    if (!products) return true;
    return Date.now() - products.timestamp > maxAge;
  },

  isCategoriesStale: (maxAge = DEFAULT_CACHE_DURATION) => {
    const { categories } = get();
    if (!categories) return true;
    return Date.now() - categories.timestamp > maxAge;
  },
}));

