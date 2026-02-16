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
        <p className="text-center text-gray-500 text-xs mt-6">
          Celisan — Waffles sin gluten
        </p>
      </div>
    </footer>
  );
}
