"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import Keyboard from "@/components/svgs/Keyboard";
import File from "@/components/svgs/File";
import Clock from "@/components/svgs/Clock";
import Hash from "@/components/svgs/Hash";
import TextSize from "@/components/svgs/TextSize";
import Volume from "@/components/svgs/Volume";
import VolumeOff from "@/components/svgs/VolumeOff";
import {
  editor,
  languages,
  fontSizes,
  timers,
  modes,
  wordCounts,
  snippetCounts,
  defaultFilterPreferences,
  getAllowedEditorModes,
  getAllowedModes,
  type FilterPreferences,
} from "@/lib/filter-options";

// Reusable Dropdown Component
interface SettingDropdownProps<T> {
  icon: ReactNode;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

const SettingDropdown = <T extends string | number>({
  icon,
  value,
  options,
  onChange,
}: SettingDropdownProps<T>) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1.5 px-1.5">
      {icon}
      <span className="border-b-muted-foreground border-b text-xs">
        {value}
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="text-primary font-mono text-xs">
      {options.map((option) => (
        <DropdownMenuItem key={option} onClick={() => onChange(option)}>
          {option}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

type SettingsPanelProps = {
  settings: FilterPreferences;
  onSettingsChange: (settings: FilterPreferences) => void;
};

const SettingsPanel = ({
  settings = defaultFilterPreferences,
  onSettingsChange,
}: SettingsPanelProps) => {
  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const editorOptions = getAllowedEditorModes(settings.language);
  const isCodeMode = settings.editorMode === "vscode";
  const allowedFontSizes = isCodeMode
    ? fontSizes.filter((s) => s <= 16)
    : fontSizes;

  const handleEditorModeChange = (value: (typeof settings)["editorMode"]) => {
    const nextSettings = {
      ...settings,
      editorMode: value,
    };

    onSettingsChange(nextSettings);
  };

  const handleLanguageChange = (value: (typeof settings)["language"]) => {
    const allowedEditorModes = getAllowedEditorModes(value);
    const allowedModes = getAllowedModes(value);
    const nextSettings = {
      ...settings,
      language: value,
      editorMode: allowedEditorModes.includes(settings.editorMode)
        ? settings.editorMode
        : allowedEditorModes[0],
      mode: allowedModes.includes(settings.mode)
        ? settings.mode
        : allowedModes[0],
    };

    onSettingsChange(nextSettings);
  };

  return (
    <div className="bg-muted mx-auto flex w-max items-center gap-2 border p-1.5 text-xs shadow-md">
      <div className="flex items-center gap-1.5">
        <SettingDropdown
          icon={<Keyboard />}
          value={settings.editorMode}
          options={editorOptions}
          onChange={handleEditorModeChange}
        />
        <SettingDropdown
          icon={<File />}
          value={settings.language}
          options={languages}
          onChange={handleLanguageChange}
        />
      </div>

      <span className="text-muted-foreground text-xs">|</span>

      <div className="flex w-full items-center justify-evenly gap-2">
        {getAllowedModes(settings.language).map((m) => (
          <button
            key={m}
            onClick={() => updateSetting("mode", m)}
            className={`text-xs transition-colors ${
              settings.mode === m
                ? "text-primary border-b-primary border-b"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <span className="text-muted-foreground text-xs">|</span>

      <div className="flex items-center gap-1.5">
        {(settings.mode === "timer" || settings.mode === "fix") && (
          <SettingDropdown
            icon={<Clock />}
            value={settings.timer}
            options={timers}
            onChange={(v) => updateSetting("timer", v)}
          />
        )}
        {settings.mode === "words" && (
          <SettingDropdown
            icon={<Hash />}
            value={settings.wordCount}
            options={wordCounts}
            onChange={(v) => updateSetting("wordCount", v)}
          />
        )}
        {settings.mode === "snippets" &&
          settings.snippetCount !== undefined && (
            <SettingDropdown
              icon={<Hash />}
              value={settings.snippetCount}
              options={snippetCounts}
              onChange={(v) => updateSetting("snippetCount", v)}
            />
          )}
        <SettingDropdown
          icon={<TextSize />}
          value={
            isCodeMode
              ? (Math.min(settings.fontSize, 16) as typeof settings.fontSize)
              : settings.fontSize
          }
          options={allowedFontSizes}
          onChange={(v) => updateSetting("fontSize", v)}
        />
      </div>

      <span className="text-muted-foreground text-xs">|</span>

      <button
        onClick={() => updateSetting("soundEnabled", !settings.soundEnabled)}
        className="flex px-1 transition-opacity hover:opacity-70"
        aria-label="Toggle sound"
      >
        {settings.soundEnabled ? (
          <Volume />
        ) : (
          <VolumeOff className="text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export default SettingsPanel;
