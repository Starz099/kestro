// app/providers.tsx
"use client";
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function Providers({ children }: ThemeProviderProps) {
  // Set defaultTheme="dark" to make dark mode the default
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
}
