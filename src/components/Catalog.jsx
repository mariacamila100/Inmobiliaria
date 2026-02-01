import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Loader2, Sofa, Car, Ruler, Home as HomeIcon, X } from 'lucide-react';
import { getInmuebles } from '../services/inmuebles.services';
import InmuebleDetalle from './InmuebleDetalle'; // Asegúrate de que la ruta sea correcta

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop";

const Catalog = ({ filtrosHero }) => {
  const [inmuebles, setInmuebles] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtros
  const [tipo, setTipo] = useState('');
  const [estrato, setEstrato] = useState('');
  const [areaMin, setAreaMin] = useState('');
  const [soloAmoblado, setSoloAmoblado] = useState(false);
  const [conParqueadero, setConParqueadero] = useState(false);
  
  // Estado para el Modal
  const [selectedInmueble, setSelectedInmueble] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getInmuebles();
        setInmuebles(res);
        setFiltrados(res);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    loadData();
  }, []);

  useEffect(() => {
    let resultado = inmuebles.filter(item => {
      const matchTexto = !filtrosHero || 
        item.titulo?.toLowerCase().includes(filtrosHero.toLowerCase()) || 
        item.barrio?.toLowerCase().includes(filtrosHero.toLowerCase());
      
      const matchTipo = !tipo || item.tipo === tipo;
      const matchEstrato = !estrato || item.estrato?.toString() === estrato;
      const matchArea = !areaMin || Number(item.area) >= Number(areaMin);
      const matchAmoblado = !soloAmoblado || item.amoblado === true;
      const matchParqueo = !conParqueadero || item.parqueadero === true;

      return matchTexto && matchTipo && matchEstrato && matchArea && matchAmoblado && matchParqueo;
    });
    setFiltrados(resultado);
  }, [filtrosHero, tipo, estrato, areaMin, soloAmoblado, conParqueadero, inmuebles]);

  const limpiarFiltros = () => {
    setTipo(''); setEstrato(''); setAreaMin(''); setSoloAmoblado(false); setConParqueadero(false);
  };

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-orange-500" size={50} /></div>;

  return (
    <div className="w-full">
      {/* BARRA DE FILTROS */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-12">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Operación</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer">
              <option value="">Todas</option>
              <option value="venta">Venta</option>
              <option value="renta">Renta</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Estrato</label>
            <select value={estrato} onChange={(e) => setEstrato(e.target.value)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer">
              <option value="">Cualquier estrato</option>
              {[1,2,3,4,5,6].map(e => <option key={e} value={e}>Estrato {e}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Área Mínima (m²)</label>
            <input 
              type="number" 
              placeholder="Ej: 80" 
              value={areaMin}
              onChange={(e) => setAreaMin(e.target.value)}
              className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none w-32 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <button 
              onClick={() => setSoloAmoblado(!soloAmoblado)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${soloAmoblado ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
            >
              <Sofa size={14} /> AMOBLADO
            </button>
            <button 
              onClick={() => setConParqueadero(!conParqueadero)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${conParqueadero ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
            >
              <Car size={14} /> PARQUEADERO
            </button>
          </div>

          <button onClick={limpiarFiltros} className="mt-5 ml-auto text-slate-400 hover:text-red-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors">
            <X size={14} /> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* RESULTADOS (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtrados.length > 0 ? filtrados.map(item => (
          <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={item.fotos && item.fotos !== "" ? item.fotos : DEFAULT_IMAGE} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={item.titulo} 
              />
              <span className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${item.tipo === 'venta' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                {item.tipo}
              </span>
            </div>
            
            <div className="p-8">
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors cursor-pointer" onClick={() => setSelectedInmueble(item)}>
                {item.titulo}
              </h3>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold mb-6">
                <MapPin size={14} className="text-orange-500" /> {item.barrio}
              </div>

              <div className="flex justify-between py-5 border-y border-slate-50 mb-6">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-slate-300" />
                  <span className="font-bold text-slate-700 text-sm">{item.area}m²</span>
                </div>
                <div className="flex items-center gap-2">
                  <HomeIcon size={16} className="text-slate-300" />
                  <span className="font-bold text-slate-700 text-sm">Estrato {item.estrato}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Inversión</p>
                  <p className="text-2xl font-black text-blue-900 tracking-tighter">
                    ${Number(item.precio).toLocaleString('es-CO')}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedInmueble(item)}
                  className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-all shadow-lg active:scale-90"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold text-lg">No encontramos inmuebles con esos filtros.</p>
          </div>
        )}
      </div>

      {/* MODAL DE DETALLE (Fuera del grid para evitar errores de renderizado) */}
      {selectedInmueble && (
        <InmuebleDetalle 
          inmueble={selectedInmueble} 
          onClose={() => setSelectedInmueble(null)} 
        />
      )}
    </div>
  );
};

export default Catalog;