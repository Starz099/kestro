import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  defaultFilterPreferences,
  type FilterPreferences,
} from "@/lib/filter-options";

type SettingsStore = {
  settings: FilterPreferences;
  setSettings: (settings: FilterPreferences) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultFilterPreferences,
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: "kestro-settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
