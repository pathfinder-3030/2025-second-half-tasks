import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天気予報ダッシュボード",
  description: "複数都市の天気予報を確認できるダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
