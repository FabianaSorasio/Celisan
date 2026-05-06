"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, Send, Trash2, X, Check } from 'lucide-react';

export default function SoySinGlutenPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const panificacion = [
    { id: 'soy-8', name: "Tipo Pan Lactal x 700gr.", description: "Ideal para sándwiches.", options: [] },
    { id: 'soy-9', name: "Pan Baguette x 200gr.", description: "Crocante y artesanal.", options: [] },
    { id: 'soy-10', name: "Pan Hamburguesa 130gr.", description: "Perfecto para tus burgers.", options: [] },
    { id: 'soy-6', name: "Medialunas x 50gr.", description: "Tiernas y deliciosas.", options: [] },
    { id: 'soy-7', name: "Mafalda x unidad", description: "Factura tradicional.", options: [] }
  ];

  const pastasYMas = [
    { id: 'soy-3', name: "Sorrentinos", description: "Crudos x 8 unidades.", options: ["Jamón y Queso", "Verduras"] },
    { id: 'soy-4', name: "Hamburguesas de Legumbres", description: "Pack de 4 unidades nutritivas.", options: ["Soja", "Lentejas", "Garbanzos", "Arvejas"] },
    { id: 'soy-5', name: "Empanadas", description: "Crudas x 4 unidades.", options: ["Saladas", "Dulces", "Árabes"] },
    { id: 'soy-1', name: "Pre pizzas", description: "Base artesanal sin gluten.", options: [] },
    { id: 'soy-2', name: "Ñoquis", description: "Crudos x 250gr.", options: [] }
  ];

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const addToCart = (product: any) => {
    if (product.options.length > 0 && !selectedOptions[product.id]) {
      alert("Por favor, seleccioná una opción antes de agregar.");
      return;
    }
    const qty = quantities[product.id] || 1;
    setCart([...cart, { ...product, quantity: qty, flavor: selectedOptions[product.id] || "" }]);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const sendToWhatsApp = () => {
    const numeroCelisan = "5493564000000"; 
    let mensaje = "¡Hola Celisan! 👋 Pedido de la Línea Soy Sin Gluten:\n\n";
    cart.forEach((item) => {
      mensaje += `✅ *${item.name}*\n   Cant: ${item.quantity}\n`;
      if (item.flavor) mensaje += `   Gusto: ${item.flavor}\n`;
      mensaje += `   $0\n\n`;
    });
    mensaje += `*Total: $0*`;
    window.open(`https://wa.me/${numeroCelisan}?text=${encodeURIComponent(mensaje)}`, '_blank');
    setIsModalOpen(false);
  };

  const renderProduct = (p: any) => (
    <div key={p.id} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-lg">
      <div className="relative h-56 bg-gray-50 flex items-center justify-center text-gray-300 font-medium italic">
        Sin Gluten
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-[#1a2e35] mb-1">{p.name}</h3>
        <p className="text-[#8c3d3d] text-sm mb-4 leading-snug">{p.description}</p>
        
        {p.options.length > 0 && (
          <div className="mb-4">
            <div className="bg-gray-100 p-1 rounded-xl flex flex-wrap gap-1">
              {p.options.map((opt: string) => (
                <button 
                  key={opt} 
                  onClick={() => setSelectedOptions({...selectedOptions, [p.id]: opt})}
                  className={`flex-1 px-2 py-1.5 text-[11px] font-bold rounded-lg transition-all ${selectedOptions[p.id] === opt ? 'bg-[#5c6b34] text-white' : 'bg-white text-gray-600'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
          <button onClick={() => updateQuantity(p.id, -1)} className="text-[#5c6b34] p-1"><Minus size={16} /></button>
          <span className="font-bold text-gray-800 w-6 text-center">{quantities[p.id] || 1}</span>
          <button onClick={() => updateQuantity(p.id, 1)} className="text-[#5c6b34] p-1"><Plus size={16} /></button>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-[#8c3d3d]">$0</span>
          <button onClick={() => addToCart(p)} className="bg-[#5c6b34] text-white px-6 py-2 rounded-xl font-bold text-sm">
            Agregar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8 bg-[#fdfcf8] min-h-screen relative font-sans">
      
      {/* HEADER CON DUAL LOGO - Respetando ubicación en public */}
      <header className="mb-12 text-center pt-8 px-4 flex flex-col items-center">
        <div className="flex flex-row items-center justify-center gap-6 md:gap-12 mb-8">
          {/* Logo Celisan (Marca Madre) */}
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image 
              src="/logo-celisan.png" // Ajustar extensión (.png o .jpg) según tu archivo en public
              alt="Logo Celisan" 
              fill
              className="object-contain"
            />
          </div>
          
          <div className="h-16 w-[1px] bg-gray-300 hidden md:block"></div>

          {/* Logo Soy Sin Gluten */}
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image 
              src="/Logo Soy Sin gluten.jpg" 
              alt="Logo Soy Sin Gluten" 
              fill
              className="object-contain rounded-full shadow-sm"
              priority 
            />
          </div>
        </div>
        <div className="w-20 h-1 bg-[#5c6b34] opacity-30 rounded-full"></div>
      </header>

      {/* BOTONERA FLOTANTE */}
      <div className="fixed top-6 right-6 z-40 flex flex-col gap-2 items-end">
        <button 
          onClick={() => { if(window.confirm("¿Vaciar carrito?")) setCart([]); }} 
          className="bg-[#5c6b34] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
        >
          <ShoppingCart size={18} />
          <span className="text-xs uppercase">Carrito ({cart.length})</span>
        </button>
        {cart.length > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
          >
            <Check size={18} />
            <span className="text-xs uppercase">Confirmar Pedido</span>
          </button>
        )}
      </div>

      {/* MODAL DE REVISIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#5c6b34] p-5 text-white flex justify-between items-center">
              <h2 className="font-bold uppercase text-sm tracking-widest">Revisar Pedido</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between mb-3 pb-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-bold text-gray-800">
                    {item.quantity}x {item.name} {item.flavor && `(${item.flavor})`}
                  </span>
                  <span className="text-sm font-bold text-[#8c3d3d]">$0</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-400 bg-white border border-gray-200 text-xs uppercase">Volver</button>
              <button onClick={sendToWhatsApp} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#5c6b34] text-xs uppercase flex items-center justify-center gap-2">Enviar WhatsApp <Send size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* SECCIONES */}
      <section className="mb-20">
        <h2 className="text-[#5c6b34] text-2xl font-bold mb-8 italic border-l-4 border-[#5c6b34] pl-4">Panificación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {panificacion.map(renderProduct)}
        </div>
      </section>

      <section className="pb-16">
        <h2 className="text-[#5c6b34] text-2xl font-bold mb-8 italic border-l-4 border-[#5c6b34] pl-4">Pastas y Congelados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pastasYMas.map(renderProduct)}
        </div>
      </section>
    </main>
  );
}