import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, CreditCard, Droplets,
  LogOut, FileText, ShieldCheck, Menu, UserCheck, X
} from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../api/firebaseConfig';

// Import de componentes
import MuroResidente from '../components/MuroResidente';
import DocumentosResidente from '../pages/DocumentosResidente'; 
import ConsumosResidente from '../components/ConsumoResidente';
import ServiciosPage from '../pages/Consergeria'; 

const DashboardResidente = ({ user }) => {
  const [nombreEdificio, setNombreEdificio] = useState('...');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [totalMensajes, setTotalMensajes] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user?.edificioId) {
        try {
          const docRef = doc(db, "edificios", user.edificioId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setNombreEdificio(docSnap.data().nombre);

          const mensajesRef = collection(db, "mensajes");
          const qMensajes = query(
            mensajesRef, 
            where("edificioId", "==", user.edificioId),
            where("status", "==", "pendiente")
          );
          const snapMensajes = await getDocs(qMensajes);
          setTotalMensajes(snapMensajes.size);
        } catch (e) {
          console.error("Error cargando datos:", e);
        }
      }
    };
    fetchDashboardData();
  }, [user]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR — SE MANTIENE EL BOTÓN DE CONSUMOS AQUÍ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-md"><ShieldCheck className="text-white" size={18} /></div>
            <span className="text-white font-semibold text-lg">Edificios<span className="text-blue-500">Col</span></span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Inicio" active={activeTab === 'inicio'} onClick={() => { setActiveTab('inicio'); setIsSidebarOpen(false); }} />
          <NavItem icon={<FileText size={18} />} label="Documentos" active={activeTab === 'documentos'} onClick={() => { setActiveTab('documentos'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Droplets size={18} />} label="Consumos" active={activeTab === 'consumos'} onClick={() => { setActiveTab('consumos'); setIsSidebarOpen(false); }} />
          <NavItem icon={<UserCheck size={18} />} label="Servicios" active={activeTab === 'servicios'} onClick={() => { setActiveTab('servicios'); setIsSidebarOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => signOut(auth).then(() => navigate('/'))} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-400 hover:text-orange-400 transition">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
          <div className="flex items-center gap-4 ml-auto">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{nombreEdificio}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase">Apto {user.unidad}</p>
             </div>
             <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
               {user.nombreApellido?.charAt(0)}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'inicio' && (
              <>
                {/* TARJETAS — SOLO DOS PARA EVITAR RUIDO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard 
                    icon={<CreditCard size={18} />} 
                    label="Administración" 
                    value="Ver Mis Facturas" 
                    sub="Revisar recibos de pago"
                    color="bg-blue-50 text-blue-600"
                    onClick={() => setActiveTab('documentos')}
                  />
                  <StatCard 
                    icon={<Bell size={18} />} 
                    label="Novedades" 
                    value={`${totalMensajes} Mensajes`} 
                    sub="Pendientes en el muro"
                    color="bg-slate-100 text-slate-700"
                    onClick={() => document.getElementById('muro-home')?.scrollIntoView({ behavior: 'smooth' })}
                  />
                </div>

                <div id="muro-home" className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Muro de Comunidad</h2>
                   </div>
                   <MuroResidente edificioId={user.edificioId} user={user} />
                </div>
              </>
            )}

            {activeTab === 'documentos' && <DocumentosResidente user={user} />}
            {activeTab === 'consumos' && <ConsumosResidente user={user} />}
            {activeTab === 'servicios' && <ServiciosPage user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ icon, label, value, sub, color, onClick }) => (
  <button onClick={onClick} className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4 shadow-sm hover:border-blue-200 transition-all text-left w-full group">
    <div className={`p-2.5 rounded-md transition-colors ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] uppercase text-slate-400 font-semibold tracking-wide">{label}</p>
      <p className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{value}</p>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
  </button>
);

export default DashboardResidente;