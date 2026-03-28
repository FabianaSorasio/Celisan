"use client";

import React from 'react';
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { socialLinks } from "@/lib/social";

const iconSize = 24;

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* SECCIÓN QUIÉNES SOMOS */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-olive mb-6 italic">Nuestra Historia</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            En 2019 iniciamos un camino: revender opciones sin TACC para la comunidad celíaca de San Francisco y zona. Hoy,
            mantenemos esa esencia intacta pero te traemos una invitación renovada y original: ¡descubrir la magia de nuestros
            waffles artesanales hechos por nosotros mismos!
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Celisan es sabor, cuidado y autenticidad en cada bocado. Detrás de cada waffle hay una receta propia, pensada
            para convertir cualquier momento en una celebración, sin límites. Dulces o salados, son el placer seguro que
            estabas esperando.
          </p>
        </div>

        {/* REDES SOCIALES */}
        <div className="flex justify-center gap-8 mb-10">
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-olive hover:text-celisan-red transition-colors" aria-label="Instagram">
            <Instagram size={iconSize} />
          </a>
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-olive hover:text-celisan-red transition-colors" aria-label="Facebook">
            <Facebook size={iconSize} />
          </a>
          <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-olive hover:text-celisan-red transition-colors" aria-label="WhatsApp">
            <MessageCircle size={iconSize} />
          </a>
        </div>

        {/* FIRMA Y DERECHOS */}
        <div className="text-center border-t border-gray-200 pt-8">
          <img 
            src="/iso-fps.png" 
            alt="Fabiana Sorasio – Diseñadora Gráfica" 
            className="h-12 w-auto mx-auto mb-4" 
          />
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Celisan - Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-400 mt-2 italic">
            Diseño y Desarrollo por Fabiana Sorasio
          </p>
        </div>

      </div>
    </footer>
  );
}