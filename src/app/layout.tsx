import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "i18n Infrastructure Demo",
  description: "Compliance-aware translation management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
