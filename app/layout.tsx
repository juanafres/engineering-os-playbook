import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engineering OS",
  description: "Internal Engineering OS demo dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
