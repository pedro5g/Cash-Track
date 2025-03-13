import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/components/providers/root-providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Cash Track", template: "%s | Cash Track" },
  description: "Cash Tracker your income and expenses app",
  icons: "./icon.svg",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{
        colorScheme: "dark",
      }}>
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
