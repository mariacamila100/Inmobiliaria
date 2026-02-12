import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Building2, Users, Home, Settings,
  Bell, ShieldCheck, CheckCircle, Menu, FileText,
  Clock, Droplets, X, LogOut
} from 'lucide-react';

import EdificiosPage from '../pages/EdificiosPage';
import UsuariosPage from '../pages/UsuariosPage';
import InmueblePage from '../pages/InmueblePage';
import DocumentsPage from '../pages/DocumentosPage';
import ConsumosPage from '../pages/consumosPage.jsx';
import MuroComunidad from '../components/MuroComunidad';

import { getUsuarios } from '../services/usuarios.service';
import { getEdificios } from '../services/edificios.services';

import { auth } from '../api/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [edificios, setEdificios] = useState([]);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEdificios: 0,
    totalUsuarios: 0,
    activos: 0,
    pendientes: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, buildingsData] = await Promise.all([
          getUsuarios(),
          getEdificios()
        ]);

        setEdificios(buildingsData);

        setStats({
          totalEdificios: buildingsData.length,
          totalUsuarios: usersData.length,
          activos: usersData.filter(u => u.estado === true).length,
          pendientes: 1
        });

      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    loadData();
  }, []);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">

      {/* OVERLAY MOBILE */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* SIDEBAR — SE MANTIENE OSCURO */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300
        transform transition-transform duration-300
        lg:relative lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* LOGO */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-md">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <span className="text-white font-semibold text-lg">
              Edificios<span className="text-blue-500">Col</span>
            </span>
          </div>

          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => navigateTo('dashboard')} />
          <NavItem icon={<Building2 size={18} />} label="Copropiedades" active={activeTab === 'edificios'} onClick={() => navigateTo('edificios')} />
          <NavItem icon={<Users size={18} />} label="Usuarios" active={activeTab === 'usuarios'} onClick={() => navigateTo('usuarios')} />
          <NavItem icon={<Home size={18} />} label="Inmuebles" active={activeTab === 'inmuebles'} onClick={() => navigateTo('inmuebles')} />
          <NavItem icon={<Droplets size={18} />} label="Consumos" active={activeTab === 'consumos'} onClick={() => navigateTo('consumos')} />
          <NavItem icon={<FileText size={18} />} label="Documentos" active={activeTab === 'documentos'} onClick={() => navigateTo('documentos')} />

          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavItem icon={<Settings size={18} />} label="Configuración" active={activeTab === 'config'} onClick={() => navigateTo('config')} />
          </div>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-slate-400 hover:text-orange-400 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER — MÁS DELGADO */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button
            className="lg:hidden p-2 rounded-md border border-slate-200 text-slate-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <Bell size={18} className="text-slate-400" />
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              AD
            </div>
          </div>
        </header>

        {/* CONTENT — MÁS LIVIANO */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">

            {activeTab === 'dashboard' && (
              <div className="space-y-8">

                {/* STATS — MINIMAL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <StatCard icon={<Building2 size={18} />} label="Edificios" value={stats.totalEdificios} />
                  <StatCard icon={<Users size={18} />} label="Residentes" value={stats.totalUsuarios} />
                  <StatCard icon={<CheckCircle size={18} />} label="Activos" value={stats.activos} />
                  <StatCard icon={<Clock size={18} />} label="Pendientes" value={stats.pendientes} />
                </div>

                {/* MURO — SIN TARJETA GIGANTE */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <MuroComunidad edificios={edificios} />
                </div>

              </div>
            )}

            {activeTab === 'edificios' && <EdificiosPage />}
            {activeTab === 'usuarios' && <UsuariosPage />}
            {activeTab === 'inmuebles' && <InmueblePage />}
            {activeTab === 'documentos' && <DocumentsPage user={{ role: 'admin', buildingId: 'default' }} />}
            {activeTab === 'consumos' && <ConsumosPage edificios={edificios} />}

          </div>
        </div>
      </main>
    </div>
  );
};

/* NAV ITEM — OSCURO PERO SUAVE */
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition
      ${active
        ? 'bg-blue-600 text-white'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
  >
    {icon} {label}
  </button>
);

/* STAT — MÁS LIGERO */
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4">
    <div className="p-2.5 bg-slate-100 rounded-md text-slate-700">
      {icon}
    </div>
    <div>
      <p className="text-[11px] uppercase text-slate-400 font-semibold tracking-wide">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  </div>
);

export default DashboardAdmin;
