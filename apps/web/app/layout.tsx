import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const plexDevanagari = IBM_Plex_Sans_Devanagari({
  variable: "--font-plex-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Maya Chat",
  description:
    "Don't talk to a boring AI chatbot. Chat with opinionated AI characters with real personality, or create your own in Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${bricolage.variable} ${plexDevanagari.variable} ${plexMono.variable} bg-night text-cream antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
