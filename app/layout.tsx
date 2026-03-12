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
    <html lang="en" style={{ width: '100%', height: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <body style={{ width: '100%', height: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
