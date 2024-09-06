import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { RootProvider } from "@/components/providers/root-providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cash Track",
  description: "Budget Tracker an app for you",
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
      <ClerkProvider signInForceRedirectUrl={"/wizard"}>
        <body className={inter.className}>
          <RootProvider>{children}</RootProvider>
          <Toaster richColors position="bottom-right" />
        </body>
      </ClerkProvider>
    </html>
  );
}
