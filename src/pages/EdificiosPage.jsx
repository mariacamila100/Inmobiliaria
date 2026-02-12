import { useEffect, useState } from 'react';
import { Plus, MapPin, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getEdificios, inactivateEdificio } from '../services/edificios.services';
import { alertSuccess, alertConfirm } from '../components/Alert';
import EdificioModal from '../components/EdificioModal';

const ITEMS_PER_PAGE = 5;

const EdificiosPage = () => {
  const [edificios, setEdificios] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const loadEdificios = async () => {
    try {
      const data = await getEdificios();
      setEdificios(data);
    } catch (error) {
      console.error("Error al cargar edificios:", error);
    }
  };

  useEffect(() => { loadEdificios(); }, []);

  const handleDelete = async (id) => {
    const ok = await alertConfirm('Inactivar edificio', 'El edificio quedará inactivo');
    if (ok) {
      await inactivateEdificio(id);
      alertSuccess('Edificio inactivado', 'Actualizado correctamente');
      loadEdificios();
    }
  };

  const filteredEdificios = edificios.filter(edi => {
    const nombre = edi.nombre?.toLowerCase() || "";
    const ciudad = edi.ciudad?.toLowerCase() || "";
    const busqueda = searchTerm.toLowerCase();
    return nombre.includes(busqueda) || ciudad.includes(busqueda);
  });

  const totalPages = Math.ceil(filteredEdificios.length / ITEMS_PER_PAGE);
  const currentPage = page > totalPages ? 1 : page;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredEdificios.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm overflow-hidden animate-fadeIn">

      {/* HEADER - Ajustado para móvil */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-100/70">
        <h3 className="font-bold text-slate-800 whitespace-nowrap text-lg w-full md:w-auto text-center md:text-left">Copropiedades</h3>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar copropiedad o ciudad..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex gap-2 transition items-center justify-center shadow-md shadow-blue-200"
          >
            <Plus size={18} /> <span className="whitespace-nowrap">Nuevo edificio</span>
          </button>
        </div>
      </div>

      {/* TABLE - Con scroll horizontal suave para móvil */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] md:w-full text-sm">
          <thead className="bg-slate-50/60 border-b border-slate-100">
            <tr className="text-[11px] text-slate-500 uppercase tracking-wide">
              <th className="px-4 md:px-8 py-4 text-left font-semibold">Nombre</th>
              <th className="px-4 md:px-8 py-4 text-left font-semibold">Ciudad</th>
              <th className="px-4 md:px-8 py-4 text-left font-semibold">Estado</th>
              <th className="px-4 md:px-8 py-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {currentItems.map((edi) => (
              <tr key={edi.id} className="hover:bg-slate-50/50 transition duration-200">
                <td className="px-4 md:px-8 py-4 font-bold text-slate-700">{edi.nombre}</td>
                <td className="px-4 md:px-8 py-4 text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-blue-500/70" />
                    {edi.ciudad || <span className="text-slate-300 italic">No definida</span>}
                  </div>
                </td>
                <td className="px-4 md:px-8 py-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-600">
                    Activo
                  </span>
                </td>
                <td className="px-4 md:px-8 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => { setSelected(edi); setOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(edi.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER - Ajustado para apilarse en móvil si es necesario */}
      <div className="p-4 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium sm:ml-4 order-2 sm:order-1">
          Mostrando {currentItems.length} de {filteredEdificios.length} resultados
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 sm:mr-4 order-1 sm:order-2">
            <button disabled={currentPage === 1} onClick={() => setPage(p => p - 1)} className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition border border-transparent hover:border-slate-200">
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-2">
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition border border-transparent hover:border-slate-200">
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </div>
        )}
      </div>

      {open && <EdificioModal edificio={selected} onClose={() => setOpen(false)} onSaved={loadEdificios} />}
    </div>
  );
};

export default EdificiosPage;