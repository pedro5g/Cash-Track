import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { RootProvider } from "@/components/providers/root-providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Budget Tracker an app for you",
};

export default function RootLayout({
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
      <ClerkProvider signInForceRedirectUrl={"/wizard"}>
        <Toaster richColors position="bottom-right" />
        <body className={inter.className}>
          <RootProvider>{children}</RootProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
