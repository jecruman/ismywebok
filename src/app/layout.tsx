import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IsMyWebOk",
  description: "Check if your website is OK in 30 seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-brand-dark antialiased">
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
