"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import FilterDialog from "@/components/filter-dialog";
import { useState } from "react";
import {
  defaultFilterPreferences,
  EditorMode,
  Language,
  Timer,
  Mode,
  WordCount,
} from "@/lib/filter-options";

// Mock data - replace with actual API call
const mockLeaderboardData = [
  {
    rank: 1,
    name: "teddy1",
    wpm: 251.37,
    accuracy: 98.13,
    raw: 256.98,
    consistency: 88.2,
    date: "29 Dec 2025",
  },
  {
    rank: 2,
    name: "CJasonP",
    wpm: 251.18,
    accuracy: 98.17,
    raw: 262.38,
    consistency: 92.56,
    date: "25 Aug 2024",
  },
  {
    rank: 3,
    name: "nofap",
    wpm: 250.38,
    accuracy: 99.06,
    raw: 254.38,
    consistency: 90.53,
    date: "01 Oct 2025",
  },
  {
    rank: 4,
    name: "colamck",
    wpm: 250.37,
    accuracy: 100.0,
    raw: 250.37,
    consistency: 91.63,
    date: "24 Apr 2025",
  },
  {
    rank: 5,
    name: "henryyy",
    wpm: 250.35,
    accuracy: 99.06,
    raw: 255.95,
    consistency: 95.26,
    date: "22 Feb 2025",
  },
  {
    rank: 6,
    name: "escapism",
    wpm: 250.07,
    accuracy: 100.0,
    raw: 250.07,
    consistency: 93.03,
    date: "07 Aug 2022",
  },
  {
    rank: 7,
    name: "lcj",
    wpm: 249.57,
    accuracy: 98.75,
    raw: 255.17,
    consistency: 93.25,
    date: "27 Aug 2025",
  },
  {
    rank: 8,
    name: "MTH_Influensane",
    wpm: 249.52,
    accuracy: 99.06,
    raw: 255.12,
    consistency: 92.04,
    date: "26 Aug 2025",
  },
  {
    rank: 9,
    name: "FamBoy32",
    wpm: 247.99,
    accuracy: 98.46,
    raw: 259.19,
    consistency: 89.47,
    date: "25 May 2025",
  },
  {
    rank: 10,
    name: "speedmaster",
    wpm: 245.82,
    accuracy: 97.23,
    raw: 251.45,
    consistency: 87.15,
    date: "12 Jan 2025",
  },
];

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter preferences
  const [editorMode, setEditorMode] = useState<EditorMode>(
    defaultFilterPreferences.editorMode,
  );
  const [language, setLanguage] = useState<Language>(
    defaultFilterPreferences.language,
  );
  const [timer, setTimer] = useState<Timer>(defaultFilterPreferences.timer);
  const [mode, setMode] = useState<Mode>(defaultFilterPreferences.mode);
  const [wordCount, setWordCount] = useState<WordCount>(
    defaultFilterPreferences.wordCount,
  );

  const totalPages = 10; // Replace with actual calculation

  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between">
      <div className="w-full">
        <Navbar />
        {/* Header */}
        <div className="my-8 flex items-center justify-between">
          <FilterDialog
            editorMode={editorMode}
            language={language}
            timer={timer}
            mode={mode}
            wordCount={wordCount}
            onEditorModeChange={setEditorMode}
            onLanguageChange={setLanguage}
            onTimerChange={setTimer}
            onModeChange={setMode}
            onWordCountChange={setWordCount}
          />
          <h1 className="text-2xl font-bold tracking-[0.25em] uppercase">
            Leaderboard
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="shadow-md"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
            <span className="min-w-[5rem] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="shadow-md"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </Button>
          </div>
        </div>

        {/* Selected Filters Display */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium">Active Filters:</span>
          <span className="bg-muted px-2 py-0.5 shadow-md">{editorMode}</span>
          <span className="bg-muted px-2 py-0.5 shadow-md">{language}</span>
          <span className="bg-muted px-2 py-0.5 shadow-md">{mode}</span>
          {mode === "timer" && (
            <span className="bg-muted px-2 py-0.5 shadow-md">{timer}s</span>
          )}
          {mode === "words" && (
            <span className="bg-muted px-2 py-0.5 shadow-md">
              {wordCount} words
            </span>
          )}
        </div>
      </div>
      <div className="no-scrollbar mt-8 mb-4 h-full w-full overflow-y-auto">
        {/* Leaderboard Table */}
        <div className="no-scrollbar h-full overflow-y-auto border">
          <table className="w-full">
            <thead className="bg-background sticky top-0 z-10">
              <tr className="bg-muted/50 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  WPM
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Accuracy
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Raw
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Consistency
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboardData.map((entry) => (
                <tr
                  key={entry.rank}
                  className="hover:bg-muted/30 border-b transition-colors"
                >
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    {entry.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                        <span className="text-xs">
                          {entry.name[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {entry.wpm.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {entry.accuracy.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {entry.raw.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {entry.consistency.toFixed(2)}%
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-right text-sm">
                    {entry.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
