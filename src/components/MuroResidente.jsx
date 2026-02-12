import React, { useState, useEffect } from 'react';
import { 
  collection, query, where, orderBy, 
  onSnapshot, addDoc, serverTimestamp, doc, getDoc 
} from 'firebase/firestore';
import { db } from '../api/firebaseConfig';
import { MessageCircle, Send, Check, History, EyeOff, AlertCircle } from 'lucide-react';
import { alertError, alertSuccess } from '../components/Alert'; 

const MuroResidente = ({ user, edificioId }) => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (!edificioId) return;

    const q = query(
      collection(db, 'mensajes'),
      where('edificioId', '==', edificioId),
      orderBy('fecha', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      // 1. Mapeamos las promesas para obtener nombres reales
      const mensajesPromesas = snapshot.docs.map(async (documento) => {
        const data = documento.data();
        let nombreParaMostrar = "Residente"; 

        // 2. Lógica de Filtrado por ID: Buscamos siempre en la colección 'usuarios'
        if (data.usurioId) {
          try {
            const userSnap = await getDoc(doc(db, 'usuarios', data.usurioId));
            if (userSnap.exists()) {
              // Si el usuario existe, usamos su nombre real de la DB
              nombreParaMostrar = userSnap.data().nombreApellido || "Residente";
            } else {
              // Si no existe el doc de usuario, usamos el backup que traiga el mensaje
              nombreParaMostrar = data.usuarioNombre !== "Anónimo" ? data.usuarioNombre : "Residente";
            }
          } catch (e) { 
            console.error("Error al cruzar nombre por ID:", e); 
          }
        }

        return {
          id: documento.id,
          ...data,
          usuarioNombre: nombreParaMostrar, // Sobrescribimos el "Anónimo" con el nombre real
          fechaLegible: data.fecha?.toDate().toLocaleString([], { 
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
          })
        };
      });

      const resultados = await Promise.all(mensajesPromesas);
      setMensajes(resultados);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [edificioId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    
    if (!user || !user.uid) {
      alertError("Sesión no válida", "Reingresa a la app para publicar.");
      return;
    }

    try {
      const payload = {
        mensaje: nuevoMensaje,
        edificioId: edificioId,
        apto: user.unidad || "N/A",
        usurioId: user.uid, 
        // Aunque guardamos esto, el useEffect de arriba lo corregirá al mostrarlo
        usuarioNombre: user.nombreApellido || "Anónimo", 
        fecha: serverTimestamp(),
        status: 'pendiente',
        tipo: 'convivencia',
        respuestaAdmin: "" 
      };

      await addDoc(collection(db, 'mensajes'), payload);
      setNuevoMensaje('');
      alertSuccess("¡Enviado!", "Tu mensaje ha sido publicado.");
    } catch (error) {
      alertError("Error", "No se pudo publicar.");
    }
  };

  const mensajesFiltrados = showResolved 
    ? mensajes 
    : mensajes.filter(m => m.status !== 'resuelto');

  return (
    <div className="relative bg-white rounded-[3rem] shadow-2xl shadow-slate-200/30 border border-slate-50 overflow-hidden flex flex-col h-[700px]">
      
      {/* HEADER */}
      <div className="p-8 bg-white border-b border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Muro de Comunidad</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              {mensajes.filter(m => m.status !== 'resuelto').length} reportes activos
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowResolved(!showResolved)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            showResolved ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {showResolved ? <EyeOff size={14} /> : <History size={14} />}
          {showResolved ? 'Historial' : 'Ver Activos'}
        </button>
      </div>

      {/* INPUT */}
      <div className="px-8 py-4 bg-white border-b border-slate-50">
        <div className="relative">
          <textarea
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe un reporte o aviso..."
            className="w-full p-4 pr-16 bg-slate-50 rounded-2xl border-none text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 resize-none h-20 outline-none"
          />
          <button 
            onClick={handleSubmit}
            disabled={!nuevoMensaje.trim()}
            className="absolute right-3 bottom-3 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* LISTADO */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FBFBFF]">
        {loading ? (
          <div className="flex justify-center py-20 animate-pulse text-slate-300 font-bold">Cargando...</div>
        ) : mensajesFiltrados.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
            <Check size={40} className="text-emerald-500" />
            <p className="text-sm font-semibold italic">Todo al día en tu edificio</p>
          </div>
        ) : (
          mensajesFiltrados.map((m) => (
            <div key={m.id} className={`flex flex-col items-start animate-fadeIn ${m.status === 'resuelto' ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2 mb-2 px-2">
                <span className="text-xs font-bold text-slate-700">{m.usuarioNombre}</span>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Apto {m.apto}</span>
                <span className="text-[10px] text-slate-400 font-medium">{m.fechaLegible}</span>
              </div>

              <div className={`w-fit max-w-[95%] p-5 rounded-[2.5rem] rounded-tl-none border shadow-sm ${
                m.status === 'resuelto' ? 'bg-slate-50 border-slate-200' : 
                m.tipo === 'convivencia' ? 'bg-rose-50/50 border-rose-100' : 'bg-amber-50/50 border-amber-100'
              }`}>
                <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">
                  {m.mensaje}
                </p>

                {m.respuestaAdmin && (
                  <div className="mt-3 p-3 bg-white/80 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Admin:</p>
                    <p className="text-xs text-slate-600 italic">"{m.respuestaAdmin}"</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5 gap-8">
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{m.tipo}</span>
                  <span className={`px-3 py-1 rounded-xl font-bold text-[9px] uppercase ${
                    m.status !== 'resuelto' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MuroResidente;