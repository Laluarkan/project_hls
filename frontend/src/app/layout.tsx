import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "PT HLS Transport | Sewa Alat Berat & Logistik",
  description: "Jasa angkutan pengiriman barang, pindahan, dan penyewaan alat berat Crane, Forklift, Excavator di Mataram, Lombok, NTB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans bg-hls-bg text-hls-text antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}