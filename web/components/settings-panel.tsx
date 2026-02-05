"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, ReactNode } from "react";

const editor = ["text", "vscode", "vim"] as const;
const languages = ["english", "c++", "python", "javascript"] as const;
const fontSizes = [12, 14, 16, 18, 20, 22, 24] as const;
const timers = [15, 30, 60, 120] as const;
const modes = ["timer", "words", "zen"] as const;
const wordCounts = [10, 25, 50, 100] as const;

// SVG Icon Components
const IconBase = ({ children }: { children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const KeyboardIcon = () => (
  <IconBase>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M2 8a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2l0 -8" />
    <path d="M6 10l0 .01" />
    <path d="M10 10l0 .01" />
    <path d="M14 10l0 .01" />
    <path d="M18 10l0 .01" />
    <path d="M6 14l0 .01" />
    <path d="M18 14l0 .01" />
    <path d="M10 14l4 .01" />
  </IconBase>
);

const FileIcon = () => (
  <IconBase>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  </IconBase>
);

const ClockIcon = () => (
  <IconBase>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 7l0 5l3 3" />
  </IconBase>
);

const HashIcon = () => (
  <IconBase>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 9l14 0" />
    <path d="M5 15l14 0" />
    <path d="M11 4l-4 16" />
    <path d="M17 4l-4 16" />
  </IconBase>
);

const TextSizeIcon = () => (
  <IconBase>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 7v-2h13v2" />
    <path d="M10 5v14" />
    <path d="M12 19h-4" />
    <path d="M15 13v-1h6v1" />
    <path d="M18 12v7" />
    <path d="M17 19h2" />
  </IconBase>
);

const VolumeIcon = () => (
  <IconBase>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 8a5 5 0 0 1 0 8" />
    <path d="M17.7 5a9 9 0 0 1 0 14" />
    <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
  </IconBase>
);

const VolumeOffIcon = () => (
  <IconBase>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602a5 5 0 0 1 -.535 .464" />
    <path d="M17.7 5a9 9 0 0 1 2.362 11.086m-1.676 2.299a9 9 0 0 1 -.686 .615" />
    <path d="M9.069 5.054l.431 -.554a.8 .8 0 0 1 1.5 .5v2m0 4v8a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l1.294 -1.664" />
    <path d="M3 3l18 18" />
  </IconBase>
);

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
    <DropdownMenuTrigger className="flex px-2">
      {icon}
      <span className="border-b-muted-foreground ml-2 border-b-2">{value}</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="text-md text-primary font-press-start-2p">
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
    <div className="bg-muted text-md mx-auto flex w-4/6 items-center gap-4 border-2 p-2">
      <div className="flex items-center gap-2">
        <SettingDropdown
          icon={<KeyboardIcon />}
          value={editorMode}
          options={editor}
          onChange={setEditorMode}
        />
        <SettingDropdown
          icon={<FileIcon />}
          value={language}
          options={languages}
          onChange={setLanguage}
        />
      </div>

      <span className="text-muted-foreground">|</span>

      <div className="flex w-full items-center justify-evenly gap-4">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`transition-colors ${
              mode === m
                ? "text-primary border-b-primary border-b-2"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <span className="text-muted-foreground">|</span>

      <div className="flex items-center gap-2">
        {mode === "timer" && (
          <SettingDropdown
            icon={<ClockIcon />}
            value={timer}
            options={timers}
            onChange={setTimer}
          />
        )}
        {mode === "words" && (
          <SettingDropdown
            icon={<HashIcon />}
            value={wordCount}
            options={wordCounts}
            onChange={setWordCount}
          />
        )}
        <SettingDropdown
          icon={<TextSizeIcon />}
          value={fontSize}
          options={fontSizes}
          onChange={setFontSize}
        />
      </div>

      <span className="text-muted-foreground">|</span>

      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="flex transition-opacity hover:opacity-70"
        aria-label="Toggle sound"
      >
        {soundEnabled ? <VolumeIcon /> : <VolumeOffIcon />}
      </button>
    </div>
  );
};

export default SettingsPanel;
