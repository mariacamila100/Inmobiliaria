import React, { useState, useEffect } from 'react';
import { MessageCircle, Filter, Plus, Check, X, History, Eye, EyeOff } from 'lucide-react';
import { getMensajesEnVivo, cambiarEstadoMensaje, responderMensaje } from '../services/mensajes.service';

const MuroComunidad = ({ edificios }) => {
  const [mensajes, setMensajes] = useState([]);
  const [filtroEdificio, setFiltroEdificio] = useState('all');
  const [showResolved, setShowResolved] = useState(false); // Estado para ocultar/mostrar resueltos
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');

  useEffect(() => {
    const unsubscribe = getMensajesEnVivo(filtroEdificio, setMensajes);
    return () => unsubscribe();
  }, [filtroEdificio]);

  // Filtramos los mensajes según el estado del interruptor
  const mensajesFiltrados = showResolved 
    ? mensajes 
    : mensajes.filter(m => m.status !== 'resuelto');

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nuevo = currentStatus === 'resuelto' ? 'pendiente' : 'resuelto';
      await cambiarEstadoMensaje(id, nuevo);
    } catch (e) { console.error(e); }
  };

  const handleEnviarRespuesta = async () => {
    if (!respuestaTexto.trim()) return;
    try {
      await responderMensaje(selectedMsg.id, respuestaTexto);
      setSelectedMsg(null);
      setRespuestaTexto('');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/30 border border-slate-50 overflow-hidden flex flex-col h-[650px] transition-all">
      
      {/* HEADER DINÁMICO */}
      <div className="p-8 bg-white border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Muro de Comunidad</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              {mensajes.filter(m => m.status !== 'resuelto').length} reportes pendientes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* BOTÓN HISTORIAL: Permite limpiar la vista de lo resuelto */}
          <button 
            onClick={() => setShowResolved(!showResolved)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              showResolved 
              ? 'bg-slate-800 text-white border-slate-800' 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showResolved ? <EyeOff size={14} /> : <History size={14} />}
            {showResolved ? 'Ocultar Resueltos' : 'Ver Historial'}
          </button>

          <div className="h-8 w-[1px] bg-slate-100 mx-1" />

          <div className="relative flex items-center">
            <Filter size={14} className="absolute left-3 text-slate-400" />
            <select 
              value={filtroEdificio}
              onChange={(e) => setFiltroEdificio(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
            >
              <option value="all">Global</option>
              {edificios && edificios.map(ed => (
                <option key={ed.id} value={ed.id}>{ed.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ÁREA DE MENSAJES CON SCROLL OPTIMIZADO */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FBFBFF] scrollbar-thin scrollbar-thumb-slate-200">
        {mensajesFiltrados.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                <Check size={40} className="text-emerald-500" />
            </div>
            <p className="text-sm font-semibold italic">Todo está al día en este edificio</p>
          </div>
        ) : (
          mensajesFiltrados.map((m) => (
            <MessageItem 
              key={m.id} 
              m={m} 
              onToggle={() => handleToggleStatus(m.id, m.status)}
              onResponder={() => setSelectedMsg(m)}
            />
          ))
        )}
      </div>

      {/* MODAL DE RESPUESTA (Sin cambios, es funcional) */}
      {selectedMsg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Responder Reporte</h3>
              <button onClick={() => setSelectedMsg(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20}/></button>
            </div>
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 italic">
               "{selectedMsg.mensaje}"
            </div>
            <textarea
              className="w-full h-32 p-4 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none mb-4"
              placeholder="Escribe la solución dada..."
              autoFocus
              value={respuestaTexto}
              onChange={(e) => setRespuestaTexto(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMsg(null)}
                className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarRespuesta}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
              >
                Enviar y Resolver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageItem = ({ m, onToggle, onResponder }) => {
  const isResuelto = m.status === 'resuelto';

  return (
    <div className={`flex flex-col items-start animate-fadeIn transition-all duration-300 ${isResuelto ? 'opacity-50' : 'opacity-100'}`}>
      
      {/* Info superior alineada al inicio del mensaje */}
      <div className="flex items-center gap-2 mb-2 px-2">
        <span className="text-xs font-bold text-slate-700">{m.usuarioNombre}</span>
        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Apto {m.apto}</span>
        <span className="text-[10px] text-slate-400 font-medium">{m.fechaLegible}</span>
        {!isResuelto && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ml-1" />}
      </div>

      {/* BURBUJA CORREGIDA: w-fit y max-w para evitar el espacio sobrante */}
      <div className={`w-fit max-w-[90%] sm:max-w-[600px] p-5 rounded-[2.5rem] rounded-tl-none border shadow-sm transition-all ${
        isResuelto ? 'bg-slate-50 border-slate-200' : 
        m.tipo === 'convivencia' ? 'bg-rose-50/50 border-rose-100' : 'bg-amber-50/50 border-amber-100'
      }`}>
        
        <p className={`text-sm leading-relaxed mb-3 ${isResuelto ? 'text-slate-500 italic' : 'text-slate-800 font-medium'}`}>
          {m.mensaje}
        </p>

        {m.respuestaAdmin && (
          <div className="mt-3 p-3 bg-white/80 rounded-2xl border border-dashed border-slate-200">
            <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Solución Administrativa:</p>
            <p className="text-xs text-slate-600 italic leading-snug">"{m.respuestaAdmin}"</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5 gap-8">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{m.tipo}</span>
          <div className="flex gap-2">
            {!m.respuestaAdmin && !isResuelto && (
              <button onClick={onResponder} className="text-[9px] font-bold text-blue-600 hover:underline px-2">RESPONDER</button>
            )}
            <button 
              onClick={onToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-bold text-[9px] uppercase tracking-wider ${
                !isResuelto ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {m.status}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MuroComunidad;