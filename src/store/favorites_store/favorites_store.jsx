import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (article, category) => {
        const { favorites } = get();
        const exists = favorites.find((fav) => fav.url === article.url);

        if (exists) {
          set({
            favorites: favorites.filter((fav) => fav.url !== article.url),
          });
        } else {
          set({ favorites: [...favorites, { ...article, category }] });
        }
      },

      isFavorited: (articleUrl) => {
        return get().favorites.some((fav) => fav.url === articleUrl);
      },

      getFavoritesByCategory: (category) => {
        return get().favorites.filter((fav) => fav.category === category);
      },

      getAllCategories: () => {
        return [...new Set(get().favorites.map((fav) => fav.category))];
      },
    }),
    {
      name: "nyt-favorites",
    }
  )
);
