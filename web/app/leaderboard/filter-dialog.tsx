"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
  EditorMode,
  Language,
  FontSize,
  Timer,
  Mode,
  WordCount,
} from "@/lib/filter-options";

// Reusable Dropdown Component
interface SettingDropdownProps<T> {
  icon: ReactNode;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  label: string;
}

const SettingDropdown = <T extends string | number>({
  icon,
  value,
  options,
  onChange,
  label,
}: SettingDropdownProps<T>) => (
  <div className="flex items-center justify-between gap-4">
    <label className="font-press-start-2p text-muted-foreground flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase">
      {icon}
      <span>{label}</span>
    </label>
    <DropdownMenu>
      <DropdownMenuTrigger className="border-muted bg-background hover:bg-muted font-press-start-2p border px-3 py-1.5 text-[0.6rem] shadow-sm">
        {value}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background text-primary border-muted font-press-start-2p text-[0.6rem] shadow-lg">
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

interface FilterDialogProps {
  editorMode: EditorMode;
  language: Language;
  fontSize?: FontSize;
  timer: Timer;
  mode: Mode;
  wordCount: WordCount;
  soundEnabled?: boolean;
  onEditorModeChange: (value: EditorMode) => void;
  onLanguageChange: (value: Language) => void;
  onFontSizeChange?: (value: FontSize) => void;
  onTimerChange: (value: Timer) => void;
  onModeChange: (value: Mode) => void;
  onWordCountChange: (value: WordCount) => void;
  onSoundEnabledChange?: (value: boolean) => void;
}

const FilterDialog = ({
  editorMode,
  language,
  fontSize,
  timer,
  mode,
  wordCount,
  soundEnabled,
  onEditorModeChange,
  onLanguageChange,
  onFontSizeChange,
  onTimerChange,
  onModeChange,
  onWordCountChange,
  onSoundEnabledChange,
}: FilterDialogProps) => {
  const editorOptions = language === "english" ? (["text"] as const) : editor;

  const handleLanguageChange = (value: Language) => {
    onLanguageChange(value);
    if (value === "english" && editorMode !== "text") {
      onEditorModeChange("text");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          size="sm"
          className="border-muted bg-background hover:bg-muted/80 font-press-start-2p text-[0.6rem] tracking-[0.25em] uppercase shadow-md"
        >
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="border-muted bg-background font-press-start-2p shadow-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-[0.65rem] tracking-[0.3em] uppercase">
            Filter Options
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Editor Mode */}
          <SettingDropdown
            icon={<Keyboard />}
            value={editorMode}
            options={editorOptions}
            onChange={onEditorModeChange}
            label="Editor"
          />

          {/* Language */}
          <SettingDropdown
            icon={<File />}
            value={language}
            options={languages}
            onChange={handleLanguageChange}
            label="Language"
          />

          {/* Mode Selection */}
          <div className="flex items-center justify-between gap-4">
            <label className="font-press-start-2p text-muted-foreground text-[0.6rem] tracking-[0.2em] uppercase">
              Mode
            </label>
            <div className="flex gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  className={`px-3 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase shadow-sm transition-colors ${
                    mode === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Timer or Word Count based on mode */}
          {mode === "timer" && (
            <SettingDropdown
              icon={<Clock />}
              value={timer}
              options={timers}
              onChange={onTimerChange}
              label="Time"
            />
          )}

          {mode === "words" && (
            <SettingDropdown
              icon={<Hash />}
              value={wordCount}
              options={wordCounts}
              onChange={onWordCountChange}
              label="Word Count"
            />
          )}

          {/* Font Size - Optional */}
          {fontSize !== undefined && onFontSizeChange && (
            <SettingDropdown
              icon={<TextSize />}
              value={fontSize}
              options={fontSizes}
              onChange={onFontSizeChange}
              label="Font Size"
            />
          )}

          {/* Sound Toggle - Optional */}
          {soundEnabled !== undefined && onSoundEnabledChange && (
            <div className="flex items-center justify-between gap-4">
              <label className="font-press-start-2p text-muted-foreground flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase">
                {soundEnabled ? <Volume /> : <VolumeOff />}
                <span>Sound</span>
              </label>
              <button
                onClick={() => onSoundEnabledChange(!soundEnabled)}
                className={`px-3 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase shadow-sm transition-colors ${
                  soundEnabled
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {soundEnabled ? "On" : "Off"}
              </button>
            </div>
          )}
        </div>

        <DialogFooter showCloseButton={true} />
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
