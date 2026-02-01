import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import imagenFondo from '../assets/edi.jpeg';

const Hero = ({ onSearch }) => {
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Fondo con Overlay Oscuro para contraste máximo */}
      <div className="absolute inset-0 z-0">
        <img src={imagenFondo} alt="Fondo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/50" /> {/* Overlay sutil */}
      </div>

      <div className="relative z-10 text-center px-4 w-full max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl uppercase">
          Encuentra tu <span className="text-orange-500">Hogar</span>
        </h1>
        
        <p className="text-white text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto drop-shadow-lg opacity-95">
          La plataforma integral para vivir, invertir y conectar con tu comunidad.
        </p>
        
        {/* Buscador Simplificado */}
        <div className="bg-white rounded-full p-2 max-w-3xl mx-auto flex flex-col md:flex-row items-center shadow-2xl border border-white/20">
          <div className="flex-1 flex items-center gap-4 px-6 w-full">
            <MapPin className="text-orange-500" size={24} />
            <input
              type="text"
              placeholder="Barrio o nombre del edificio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-semibold py-4 text-lg"
            />
          </div>
          <button
            onClick={() => onSearch(busqueda)}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto px-10 py-4 rounded-full font-black uppercase text-sm tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Search size={20} /> Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;