import type { Metadata, Viewport } from "next";
import { Anton, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gimnasio Cris · Templo del fierro en González Catán",
  description:
    "27 años transformando vidas en Río de la Plata 7462, González Catán. Musculación, peso libre, cardio y entrenamiento guiado por profes. Vení a entrenar en serio.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gym Cris",
  },
  openGraph: {
    title: "Gimnasio Cris · Templo del fierro en González Catán",
    description:
      "Gym de barrio desde 1997. Hierro de verdad y profes que te acompañan. Río de la Plata 7462, González Catán.",
    url: "https://gymcris.com",
    siteName: "Gimnasio Cris",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${dmSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
