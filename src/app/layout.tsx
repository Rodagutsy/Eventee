import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "EvenTee — Smart Event Management",
  description: "Your Events, Perfectly Managed. Guest lists, QR check-in, seating, Aso Ebi sales, and logistics — all in one place.",
  openGraph: {
    title: "EvenTee — Smart Event Management",
    description: "Your Events, Perfectly Managed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-sans antialiased min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
