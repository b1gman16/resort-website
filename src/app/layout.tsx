import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Azure Cove Resort",
  description:
    "A quiet beachfront resort with ocean-view suites, garden villas, and private bungalows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)] bg-[var(--color-foam)] text-[var(--color-ink)]">
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}