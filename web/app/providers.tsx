// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function Providers({ children }: ThemeProviderProps) {
  // Set defaultTheme="dark" to make dark mode the default
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
