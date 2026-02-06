"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, ReactNode } from "react";
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

const SettingsPanel = () => {
  const [editorMode, setEditorMode] = useState<(typeof editor)[number]>("text");
  const [language, setLanguage] =
    useState<(typeof languages)[number]>("english");
  const [fontSize, setFontSize] = useState<number>(16);
  const [timer, setTimer] = useState<number>(30);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mode, setMode] = useState<(typeof modes)[number]>("timer");
  const [wordCount, setWordCount] = useState<number>(25);

  return (
    <div className="bg-muted mx-auto flex w-max items-center gap-2 border p-1.5 text-xs shadow-md">
      <div className="flex items-center gap-1.5">
        <SettingDropdown
          icon={<Keyboard />}
          value={editorMode}
          options={editor}
          onChange={setEditorMode}
        />
        <SettingDropdown
          icon={<File />}
          value={language}
          options={languages}
          onChange={setLanguage}
        />
      </div>

      <span className="text-muted-foreground text-xs">|</span>

      <div className="flex w-full items-center justify-evenly gap-2">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs transition-colors ${
              mode === m
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
        {mode === "timer" && (
          <SettingDropdown
            icon={<Clock />}
            value={timer}
            options={timers}
            onChange={setTimer}
          />
        )}
        {mode === "words" && (
          <SettingDropdown
            icon={<Hash />}
            value={wordCount}
            options={wordCounts}
            onChange={setWordCount}
          />
        )}
        <SettingDropdown
          icon={<TextSize />}
          value={fontSize}
          options={fontSizes}
          onChange={setFontSize}
        />
      </div>

      <span className="text-muted-foreground text-xs">|</span>

      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="flex px-1 transition-opacity hover:opacity-70"
        aria-label="Toggle sound"
      >
        {soundEnabled ? (
          <Volume />
        ) : (
          <VolumeOff className="text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export default SettingsPanel;
