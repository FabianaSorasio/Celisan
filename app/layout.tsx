import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Celisan - Waffles Artesanales",
  description: "Pedidos Martes y Viernes. Take Away. Waffles salados, dulces y listos para tostar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.className} min-h-screen bg-cream text-gray-800 antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
