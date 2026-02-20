import type { Metadata } from "next";
import { Press_Start_2P, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kestro.starzz.dev"),

  title: "Kestro — Where syntax becomes instinct",
  description:
    "Practice real programming syntax to build coding muscle memory. Designed for beginners who learn best by doing.",

  openGraph: {
    title: "Kestro — Where syntax becomes instinct",
    description:
      "Practice real programming syntax to build coding muscle memory. Designed for beginners who learn best by doing.",
    url: "https://kestro.starzz.dev",
    siteName: "Kestro",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Kestro — Where syntax becomes instinct",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kestro — Where syntax becomes instinct",
    description:
      "Practice real programming syntax and build coding muscle memory from day one.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pressStart2P.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>
          <div className="h-screen w-screen">
            <div className="font-press-start-2p text-primary flex h-full w-full flex-col items-center p-6">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
