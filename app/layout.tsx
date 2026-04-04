import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sacred Currents",
  description: "A soft place to meet yourself across changing currents and seasons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
