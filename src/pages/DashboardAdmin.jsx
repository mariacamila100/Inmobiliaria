import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Building2, Users, Home, Settings,
  Bell, ShieldCheck, CheckCircle, Menu, FileText, 
  Clock, Droplets
} from 'lucide-react';

import EdificiosPage from '../pages/EdificiosPage';
import UsuariosPage from '../pages/UsuariosPage';
import InmueblePage from '../pages/InmueblePage';
import DocumentsPage from '../pages/DocumentosPage';
import ConsumosPage from '../pages/consumosPage.jsx';
import MuroComunidad from '../components/MuroComunidad'; // Importamos el nuevo componente
import { getUsuarios } from '../services/usuarios.service';
import { getEdificios } from '../services/edificios.services';

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [edificios, setEdificios] = useState([]);
  const [stats, setStats] = useState({ totalEdificios: 0, totalUsuarios: 0, activos: 0, inactivos: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, buildingsData] = await Promise.all([getUsuarios(), getEdificios()]);
        setEdificios(buildingsData);
        setStats({
          totalEdificios: buildingsData.length,
          totalUsuarios: usersData.length,
          activos: usersData.filter(u => u.estado).length,
          inactivos: usersData.filter(u => !u.estado).length
        });
      } catch (error) { console.error(error); }
    };
    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/40"><ShieldCheck className="text-white" size={20} /></div>
          <span className="text-white font-bold text-xl tracking-tight">Edificios<span className="text-blue-500">Col</span></span>
        </div>
        <nav className="px-4 space-y-2 mt-8">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Building2 size={18} />} label="Copropiedades" active={activeTab === 'edificios'} onClick={() => setActiveTab('edificios')} />
          <NavItem icon={<Users size={18} />} label="Usuarios" active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')} />
          <NavItem icon={<Home size={18} />} label="Inmuebles" active={activeTab === 'inmuebles'} onClick={() => setActiveTab('inmuebles')} />
          <NavItem icon={<Droplets size={18} />} label="Consumos" active={activeTab === 'consumos'} onClick={() => setActiveTab('consumos')} />
          <NavItem icon={<FileText size={18} />} label="Documentos" active={activeTab === 'documentos'} onClick={() => setActiveTab('documentos')} />
          <div className="pt-8 mt-8 border-t border-slate-800/50"><NavItem icon={<Settings size={18} />} label="Configuración" /></div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <button className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
          <div className="ml-auto flex items-center gap-6">
            <Bell className="text-slate-400" size={20}/>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</p>
                <p className="text-sm font-bold text-slate-700">Panel Central</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs">AD</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10">
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn">
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Building2 size={18} />} label="Edificios" value={stats.totalEdificios} color="text-blue-600" bg="bg-blue-50" />
                <StatCard icon={<Users size={18} />} label="Residentes" value={stats.totalUsuarios} color="text-indigo-600" bg="bg-indigo-50" />
                <StatCard icon={<CheckCircle size={18} />} label="Activos" value={stats.activos} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard icon={<Clock size={18} />} label="Pendientes" value="--" color="text-orange-600" bg="bg-orange-50" />
              </div>

              {/* EL MURO AHORA ES UN COMPONENTE SEPARADO */}
              <MuroComunidad edificios={edificios} />
            </div>
          )}

          {activeTab === 'edificios' && <EdificiosPage />}
          {activeTab === 'usuarios' && <UsuariosPage />}
          {activeTab === 'inmuebles' && <InmueblePage />}
          {activeTab === 'documentos' && <DocumentsPage user={{ role: 'admin', buildingId: 'default' }} />}
          {activeTab === 'consumos' && <ConsumosPage edificios={edificios} />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}>
    {icon} <span>{label}</span>
  </button>
);

const StatCard = ({ icon, label, value, color, bg }) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-sm">
    <div className="flex items-center gap-5">
      <div className={`p-4 ${bg} ${color} rounded-2xl shadow-inner`}>{icon}</div>
      <div>
        <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  </div>
);

export default DashboardAdmin;