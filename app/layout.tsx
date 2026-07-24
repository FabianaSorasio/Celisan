import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import VisitTracker from "@/components/VisitTracker";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Celisan — Sabor auténtico, 100% libre de gluten",
  description:
    "Tienda sin gluten en San Francisco. Waffles artesanales, viandas y productos Celisan. Pedí online y retirá sin preocupaciones.",
  verification: {
    google: "LKrWEW1NjQ4S0uS8HgrGSRHa-nLe3-KCKkztVJV0g9M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.className} min-h-screen bg-cream text-gray-800 antialiased`}>
        <CartProvider>
          <VisitTracker />
          <Header />
          {children}
          <WhatsAppFloatingButton />
        </CartProvider>
      </body>
    </html>
  );
}
