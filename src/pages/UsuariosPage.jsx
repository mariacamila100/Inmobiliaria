import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Home, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getUsuarios, toggleEstadoUsuario } from '../services/usuarios.service';
import { getEdificios } from '../services/edificios.services';
import { alertConfirm, alertSuccess } from '../components/Alert';
import UsuarioModal from '../components/UsuarioModal';

const ITEMS_PER_PAGE = 5;

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [edificios, setEdificios] = useState({});
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      const [usersData, edificiosData] = await Promise.all([getUsuarios(), getEdificios()]);
      const map = {};
      edificiosData.forEach(ed => { map[ed.id] = ed.nombre; });
      setEdificios(map);
      setUsuarios(usersData);
    } catch (e) { console.error("Error loadData:", e); }
  };

  useEffect(() => { loadData(); }, []);

  const handleInactivar = async (user) => {
    const estadoTxt = user.estado ? 'inactivar' : 'activar';
    const ok = await alertConfirm(`¿Deseas ${estadoTxt} este usuario?`, `Acción sobre ${user.nombreApellido}`);
    if (ok) {
      await toggleEstadoUsuario(user.id, user.estado);
      alertSuccess('Completado', `Usuario actualizado`);
      loadData();
    }
  };

  const filteredUsers = usuarios.filter(user => {
    const nombre = user.nombreApellido?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const unidad = user.unidad?.toString() || "";
    const busqueda = searchTerm.toLowerCase();
    return nombre.includes(busqueda) || email.includes(busqueda) || unidad.includes(busqueda);
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentPage = page > totalPages ? 1 : page;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredUsers.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      
      {/* HEADER */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-100/70">
        <h3 className="font-bold text-slate-800 whitespace-nowrap text-lg">Residentes</h3>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar residente..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>
          <button 
            onClick={() => { setSelected(null); setOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex gap-2 transition items-center shadow-md shadow-blue-200"
          >
            <Plus size={18} /> Nuevo residente
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/60 border-b border-slate-100">
            <tr className="text-[11px] text-slate-500 uppercase tracking-wide">
              <th className="px-8 py-4 text-left font-semibold">Residente</th>
              <th className="px-8 py-4 text-left font-semibold">Ubicación</th>
              <th className="px-8 py-4 text-left font-semibold">Estado</th>
              <th className="px-8 py-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition">
                <td className="px-8 py-4">
                  <div className="font-bold text-slate-700">{user.nombreApellido}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{user.email}</div>
                </td>
                <td className="px-8 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Home size={14} className="text-blue-500/70"/>
                    <span className="font-medium text-slate-700">
                      {edificios[user.edificioId] || <span className="text-slate-300 italic">No asignado</span>}
                    </span> 
                    <span className="text-slate-300">|</span> 
                    <span className="font-medium">Apt {user.unidad}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.estado ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {user.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-8 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => { setSelected(user); setOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleInactivar(user)} className={`p-1.5 rounded-lg transition ${user.estado ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}>
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
          Mostrando {currentItems.length} de {filteredUsers.length} resultados
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2 mr-4">
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

      {open && <UsuarioModal usuario={selected} onClose={() => setOpen(false)} onSaved={loadData} />}
    </div>
  );
};

export default UsuariosPage;