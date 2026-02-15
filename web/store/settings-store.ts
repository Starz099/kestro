import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  defaultFilterPreferences,
  modes,
  type FilterPreferences,
} from "@/lib/filter-options";

type SettingsStore = {
  settings: FilterPreferences;
  setSettings: (settings: FilterPreferences) => void;
};

const normalizeSettings = (settings: FilterPreferences): FilterPreferences => {
  if (modes.includes(settings.mode)) {
    return settings;
  }

  return { ...settings, mode: defaultFilterPreferences.mode };
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultFilterPreferences,
      setSettings: (settings) => set({ settings: normalizeSettings(settings) }),
    }),
    {
      name: "kestro-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: normalizeSettings(state.settings),
      }),
    },
  ),
);
