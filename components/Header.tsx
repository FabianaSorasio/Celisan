"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import Cart from "./Cart";
import { useCart } from "./CartProvider";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/#productos" },
  { label: "Nuestra Historia", href: "/#historia" },
  { label: "Contacto", href: "/#contacto" },
] as const;

function isActive(pathname: string, hash: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" && (hash === "" || hash === "#" || hash === "#inicio");
  }
  const targetHash = href.includes("#") ? href.split("#")[1] : "";
  return pathname === "/" && hash === `#${targetHash}`;
}

export default function Header() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleNavClick = (href: string) => {
    closeMobile();
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
        setHash(`#${id}`);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 min-h-[4.25rem]">
            {/* Izquierda: logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center"
              aria-label="Celisan - Inicio"
            >
              <img
                src="/logo-celisan.png"
                alt="Celisan"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </Link>

            {/* Centro: navegación desktop */}
            <nav
              className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 flex-1"
              aria-label="Principal"
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, hash, link.href);
                const isProductos = link.label === "Productos";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith("/#")) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }
                    }}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      active
                        ? isProductos
                          ? "text-celisan-red font-semibold"
                          : "text-celisan-red"
                        : "text-gray-700 hover:text-olive"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Derecha: utilidades */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-olive transition-colors"
                aria-label={`Carrito${count > 0 ? `, ${count} productos` : ""}`}
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                {count > 0 && (
                  <span className="absolute top-1 right-1 min-w-[1.125rem] h-[1.125rem] px-0.5 flex items-center justify-center rounded-full bg-celisan-red text-white text-[10px] font-bold leading-none">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="lg:hidden p-2.5 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          {mobileOpen && (
            <nav
              className="lg:hidden border-t border-gray-100 py-4 flex flex-col gap-1"
              aria-label="Principal móvil"
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, hash, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith("/#")) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      } else {
                        closeMobile();
                      }
                    }}
                    className={`px-3 py-2.5 rounded-lg text-base font-medium ${
                      active
                        ? "bg-celisan-red/10 text-celisan-red"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </>
  );
}
