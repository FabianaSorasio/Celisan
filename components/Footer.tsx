"use client";

import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { socialLinks } from "@/lib/social";

const iconSize = 26;

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-gray-200/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600 text-sm mb-5">
          Seguinos en redes
        </p>
        <div className="flex justify-center gap-8">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-olive transition-colors hover:text-celisan-red focus:outline-none focus-visible:ring-2 focus-visible:ring-celisan-red/50 rounded-full p-1"
            aria-label="Instagram"
          >
            <Instagram size={iconSize} strokeWidth={1.8} />
          </a>
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-olive transition-colors hover:text-celisan-red focus:outline-none focus-visible:ring-2 focus-visible:ring-celisan-red/50 rounded-full p-1"
            aria-label="Facebook"
          >
            <Facebook size={iconSize} strokeWidth={1.8} />
          </a>
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-olive transition-colors hover:text-celisan-red focus:outline-none focus-visible:ring-2 focus-visible:ring-celisan-red/50 rounded-full p-1"
            aria-label="WhatsApp"
          >
            <MessageCircle size={iconSize} strokeWidth={1.8} />
          </a>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
  <p>© {new Date().getFullYear()} Celisan - Todos los derechos reservados.</p>
  <div className="mt-4 flex flex-col items-center gap-2">
    <span>Creado por</span>
    <img 
      src="/iso-disenadora.png" 
      alt="Iso Fabiana Sorasio" 
      className="h-10 w-auto" 
    />
    <span className="font-semibold text-olive">
      Fabiana Sorasio – Diseñadora Gráfica
    </span>
  </div>
</div><p className="text-center text-gray-500 text-xs mt-6">
          Celisan — Waffles sin gluten
        </p>
      </div>
    </footer>
  );
}
