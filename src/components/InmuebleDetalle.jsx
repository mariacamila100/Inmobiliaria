
import React, { useEffect } from 'react';
import { X, Phone, Bed, Bath, Maximize, MapPin, Car, Hash, Info } from 'lucide-react';

const InmuebleDetalle = ({ inmueble, onClose }) => {
  // BLOQUEO DE SCROLL: Evita que el footer suba al mover el scroll de la página principal
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!inmueble) return null;

  const imagenMostrar = inmueble.foto || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000';
  const direccionCompleta = `${inmueble.direccionEdificio}, ${inmueble.ciudadEdificio}`;

  const contactarWhatsApp = () => {
    const mensaje = `Hola, estoy interesado en el inmueble: ${inmueble.titulo}. Ubicado en: ${inmueble.nombreEdificio}.`;
    window.open(`https://wa.me/573000000000?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      
      {/* Overlay con desenfoque */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in duration-300">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[110] bg-white shadow-lg p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
        >
          <X size={20} />
        </button>

        {/* COLUMNA IZQUIERDA: Imagen + Mapa */}
        <div className="w-full md:w-[45%] flex flex-col bg-slate-100 border-r border-slate-100">
          {/* Imagen */}
          <div className="h-48 md:h-1/2 relative overflow-hidden">
            <img src={imagenMostrar} className="w-full h-full object-cover" alt={inmueble.titulo} />
            <div className="absolute bottom-4 left-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                En {inmueble.tipo}
              </span>
            </div>
          </div>
          
          {/* Mapa y Dirección Detallada (Lo que faltaba) */}
          <div className="hidden md:block md:h-1/2 relative">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="grayscale-[0.2] contrast-[1.1]"
            ></iframe>
            {/* Cuadro de dirección flotante sobre el mapa */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-100">
              <p className="text-[11px] font-black text-slate-800 flex items-center gap-2">
                <MapPin size={14} className="text-orange-500" /> {inmueble.direccionEdificio}
              </p>
              <p className="text-[10px] text-slate-500 ml-5 font-bold uppercase tracking-tighter">
                {inmueble.barrio || 'Sector Residencial'}, {inmueble.ciudadEdificio}
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Información y Acción */}
        <div className="w-full md:w-[55%] flex flex-col bg-white">
          
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="flex gap-2 mb-4">
              <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                <Hash size={12} /> Estrato {inmueble.estrato}
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
              {inmueble.titulo}
            </h2>
            
            <div className="flex items-center gap-2 text-slate-700 mb-8">
              <MapPin size={18} className="text-orange-500 flex-shrink-0" />
              <p className="font-bold text-lg">
                {inmueble.nombreEdificio} <span className="text-slate-400 font-medium">— {inmueble.unidad}</span>
              </p>
            </div>

            {/* Grid de Atributos Compacto */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[
                { icon: <Bed size={18}/>, label: 'Hab', val: inmueble.habitaciones },
                { icon: <Bath size={18}/>, label: 'Baños', val: inmueble.baños },
                { icon: <Maximize size={18}/>, label: 'Área', val: `${inmueble.area}m²` },
                { icon: <Car size={18}/>, label: 'Parq', val: inmueble.parqueadero ? 'Sí' : 'No' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <div className="text-blue-500 mb-1 flex justify-center">{item.icon}</div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">{item.label}</p>
                  <p className="font-black text-slate-800 text-xs">{item.val}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="flex items-center gap-2 font-black text-slate-900 uppercase text-[10px] tracking-widest mb-3 text-blue-600">
                <Info size={14}/> Descripción de la propiedad
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {inmueble.descripcion || 'No hay descripción disponible para este inmueble.'}
              </p>
            </div>
          </div>

          {/* FOOTER DEL MODAL: Precio y Botón */}
          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precio Total</p>
                <p className="text-2xl font-black text-blue-900 leading-none">
                  ${Number(inmueble.precio).toLocaleString('es-CO')}
                </p>
              </div>
              
              <button 
                onClick={contactarWhatsApp}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95"
              >
                <Phone size={16} /> Agendar Cita
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InmuebleDetalle;