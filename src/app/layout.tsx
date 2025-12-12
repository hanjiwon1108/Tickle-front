import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/shared/lib/utils";
import { Sidebar } from "@/widgets/Sidebar";
import { Header } from "@/widgets/Header";
import { Tutorial } from "@/features/tutorial/ui/Tutorial";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tickle - AI Financial Advisor",
  description: "Small money, big dreams.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased flex")}>
        <Providers>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen relative md:ml-64 transition-all duration-300 ease-in-out">
            <Header />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-24 md:pb-6">
              {children}
            </main>
          </div>
          <Tutorial />
        </Providers>
      </body>
    </html>
  );
}
