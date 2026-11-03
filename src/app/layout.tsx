import type { Metadata } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "Prospection Longrich",
  description: "Plateforme de gestion pour les partenaires et stockistes Longrich en Côte d'Ivoire",
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full antialiased bg-cream ${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="min-h-full flex flex-col items-center">
        <Providers>{children}</Providers>
      </body>

    </html>
  );
}
