"use client";

import React from 'react';
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { socialLinks } from "@/lib/social";

const iconSize = 24;

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-10">
        
        {/* SECCIÓN QUIÉNES SOMOS */}
        <div
          id="historia"
          className="max-w-3xl mx-auto text-center mb-12 scroll-mt-[4.25rem]"
        >
          <h2 className="text-2xl font-bold text-olive mb-6">Nació en 2019. Volvimos con todo.</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            En 2019 iniciamos un hermoso camino: acercar las mejores opciones sin gluten para la comunidad celíaca de San Francisco y la zona. 🌽❤️
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            En 2026 volvimos, renovamos todo y seguimos mejorando día a día, escuchando lo que preferís y evolucionando junto a tus gustos a cada paso. 👣✨ Por eso, manteniendo esa esencia intacta, hoy te traemos una invitación totalmente renovada y original: ¡descubrir la magia de nuestros waffles artesanales, hechos por nosotros mismos! 👩‍🍳👨‍🍳🧇✨
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Para abrir el abanico de posibilidades y adaptarnos a tu rutina, sumamos a nuestra propuesta la venta de:
          </p>
          <ul className="text-lg text-gray-700 text-left inline-block mb-4 space-y-1">
            <li>🥡 Viandas congeladas prácticas y riquísimas.</li>
            <li>🍞 Panificados tentadores.</li>
            <li>🍝 Pastas congeladas listas para disfrutar.</li>
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            ¡Y eso no es todo! Nos encanta ser parte de tus festejos, por eso incorporamos nuestros desayunos de waffles para regalar y viandas para cumpleaños infantiles, ideales para llenar de sabor tus eventos y fechas especiales. 🎁🎈🎂
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Celisan es sabor, cuidado y autenticidad en cada bocado. Detrás de cada waffle hay una receta propia, pensada con mucho amor para convertir cualquier momento en una celebración, sin límites. Dulces o salados... ¡son el placer seguro que estabas esperando! 🍫🍓🧀
          </p>
        </div>

        {/* CONTACTO */}
        <div
          id="contacto"
          className="max-w-xl mx-auto text-center mb-12 scroll-mt-[4.25rem]"
        >
          <h2 className="text-2xl font-bold text-olive mb-4">Contacto</h2>
          <p className="text-gray-600 mb-4">
            Pedidos y consultas por WhatsApp. Estamos en San Francisco, Córdoba.
          </p>
          <a
            href="https://wa.me/5493564626508"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light transition-colors"
          >
            <MessageCircle size={20} />
            3564 626508
          </a>
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
      </div>

      {/* FIRMA Y DERECHOS — forma negativa */}
      <div className="bg-black text-white text-center py-10 px-4">
        <img
          src="/iso-fps.png"
          alt="Fabiana Sorasio – Diseñadora Gráfica"
          className="h-12 w-auto mx-auto mb-4"
        />
        <p className="text-sm text-white/90">
          © {new Date().getFullYear()} Celisan - Todos los derechos reservados.
        </p>
        <p className="text-xs text-white/70 mt-2 italic">
          Diseño y Desarrollo por Fabiana Sorasio
        </p>
      </div>
    </footer>
  );
}