import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Vehicle Maintenance",
  description: "Vehicle Maintenance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <GlobalStateProvider>
          {children}
          <Toaster />
        </GlobalStateProvider>
      </body>
    </html>
  );
}
