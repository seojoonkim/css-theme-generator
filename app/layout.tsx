import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSS Theme Generator",
  description: "Real-time CSS theme generator with live preview",
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
