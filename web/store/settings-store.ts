import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  defaultFilterPreferences,
  getAllowedEditorModes,
  getAllowedModes,
  modes,
  type FilterPreferences,
} from "@/lib/filter-options";

type SettingsStore = {
  settings: FilterPreferences;
  setSettings: (settings: FilterPreferences) => void;
};

const normalizeSettings = (settings: FilterPreferences): FilterPreferences => {
  let normalized = { ...settings };

  const allowedModes = getAllowedModes(normalized.language);
  if (!allowedModes.includes(normalized.mode)) {
    normalized.mode = allowedModes[0];
  }

  const allowedEditorModes = getAllowedEditorModes(normalized.language);
  if (!allowedEditorModes.includes(normalized.editorMode)) {
    normalized.editorMode = allowedEditorModes[0];
  }

  if (normalized.snippetCount === undefined) {
    normalized.snippetCount = defaultFilterPreferences.snippetCount;
  }

  return normalized;
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
