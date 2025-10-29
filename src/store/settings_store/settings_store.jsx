import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NYT_SECTIONS } from "../../constants/sections";

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Initialize all categories as enabled by default
      enabledCategories: {
        ...NYT_SECTIONS.reduce((acc, { section }) => {
          acc[section] = true;
          return acc;
        }, {}),
        "popular-today": true,
        "popular-week": true,
        "popular-month": true,
      },

      toggleCategory: (categoryId) => {
        const { enabledCategories } = get();
        set({
          enabledCategories: {
            ...enabledCategories,
            [categoryId]: !enabledCategories[categoryId],
          },
        });
      },

      isCategoryEnabled: (categoryId) => {
        return get().enabledCategories[categoryId] ?? true;
      },
    }),
    {
      name: "headliner-settings",
    }
  )
);
