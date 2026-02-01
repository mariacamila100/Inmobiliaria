import { useEffect, useState } from 'react';
import { Plus, Tag, Pencil, Trash2, ChevronLeft, ChevronRight, Search, Home } from 'lucide-react';
import { getInmuebles, inactivateInmueble } from '../services/inmuebles.services';
import { alertSuccess, alertConfirm } from '../components/Alert';
import InmuebleModal from '../components/InmuebleModal';

const ITEMS_PER_PAGE = 5;

const InmueblesPage = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const loadInmuebles = async () => {
    const data = await getInmuebles();
    setInmuebles(data);
  };

  useEffect(() => { loadInmuebles(); }, []);

  const handleDelete = async (id) => {
    const ok = await alertConfirm('Inactivar inmueble', 'La propiedad ya no será visible en el catálogo público');
    if (ok) {
      await inactivateInmueble(id);
      alertSuccess('Actualizado', 'Inmueble retirado del catálogo');
      loadInmuebles();
    }
  };

  const filtered = inmuebles.filter(i => 
    i.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = page > totalPages ? 1 : page;
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      
      {/* HEADER */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-100/70">
        <h3 className="font-bold text-slate-800 text-lg">Catálogo Venta / Renta</h3>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Buscar por título o tipo..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
              value={searchTerm} 
              onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
            />
          </div>
          <button 
            onClick={() => { setSelected(null); setOpen(true); }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex gap-2 transition items-center shadow-md shadow-blue-200"
          >
            <Plus size={18} /> Nuevo Inmueble
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/60 border-b border-slate-100">
            <tr className="text-[11px] text-slate-500 uppercase tracking-wide">
              <th className="px-8 py-4 text-left font-semibold">Inmueble</th>
              <th className="px-8 py-4 text-left font-semibold">Precio</th>
              <th className="px-8 py-4 text-left font-semibold">Estado</th>
              <th className="px-8 py-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition duration-200">
                <td className="px-8 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{item.titulo}</span>
                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">{item.tipo}</span>
                  </div>
                </td>
                <td className="px-8 py-4 font-bold text-slate-600">
                  ${Number(item.precio).toLocaleString()}
                </td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    item.estado === 'Disponible' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {item.estado}
                  </span>
                </td>
                <td className="px-8 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => { setSelected(item); setOpen(true); }} 
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-slate-50/60 flex justify-between items-center border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium ml-4">
          Mostrando {currentItems.length} de {filtered.length} resultados
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2 mr-4">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setPage(p => p - 1)} 
              className="p-2 hover:bg-white rounded-lg disabled:opacity-30 border border-transparent hover:border-slate-200 transition"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-2">
              {currentPage} / {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setPage(p => p + 1)} 
              className="p-2 hover:bg-white rounded-lg disabled:opacity-30 border border-transparent hover:border-slate-200 transition"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </div>
        )}
      </div>

      {open && <InmuebleModal inmueble={selected} onClose={() => setOpen(false)} onSaved={loadInmuebles} />}
    </div>
  );
};

export default InmueblesPage;