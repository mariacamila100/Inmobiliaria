import React, { useState } from 'react';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import Footer from '../components/Footer';
import { 
  ShieldCheck, ChevronRight, MessageCircle, Mail, Building2, Key 
} from 'lucide-react';

const Home = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const handleSearch = (val) => {
    setTerminoBusqueda(val);
    const catalogSection = document.getElementById('seccion-explorar');
    catalogSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="bg-white min-h-screen relative">
      <Hero onSearch={handleSearch} />

      {/* SECCIÓN CATÁLOGO: Bajamos un poco (-mt-24) para que el Hero respire */}
      <section id="seccion-explorar" className="relative z-20 -mt-24 pb-10">
        <div className="container mx-auto px-4 md:px-10">
          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-900/10 p-6 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Explorar Edificios en Venta y Renta
              </span>
            </div>
            <Catalog filtrosHero={terminoBusqueda} />
          </div>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS: py-12 para eliminar el hueco gigante */}
      <section className="bg-slate-50/30 py-12 border-y border-slate-100/50">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Gestión <span className="text-orange-500 font-black italic">Inmobiliaria</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Building2 size={24} />, title: "Venta de Edificios", desc: "Asesoría especializada en la compra y venta de unidades completas." },
              { icon: <Key size={24} />, title: "Renta Corporativa", desc: "Gestión integral de alquileres para edificios residenciales." },
              { icon: <ShieldCheck size={24} />, title: "Garantía Jurídica", desc: "Seguridad total en cada transacción con protocolos de alto nivel." }
            ].map((service, index) => (
              <div key={index} className="flex flex-col group items-center text-center p-8 bg-white rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="mb-5 text-blue-600 group-hover:text-orange-500 transition-colors bg-slate-50 p-4 rounded-2xl">
                  {service.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h4>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.desc}</p>
                <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-orange-500 transition-colors">
                  CONSULTAR <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* SECCIÓN CONTACTO: Compacta y Persuasiva */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Texto de invitación añadido */}
            
            <h3 className="text-5xl md:text-6xl font-black text-slate-800 leading-[1.1] mb-7 tracking-tighter">
              ¿Listo para transformar <br />
              tu <span className="text-orange-500 italic">copropiedad?</span>
            </h3>

            {/* Nuevo texto de llamado a la acción */}
            <p className="text-slate-500 text-lg md:text-xl font-normal mb-10 max-w-2xl mx-auto leading-relaxed">
              Ya sea que busques el hogar de tus sueños o necesites una administración experta para tu edificio, nuestro equipo está listo para brindarte asesoría técnica y comercial personalizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a href="https://wa.me/tu-numero" className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-sm hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1">
                <MessageCircle size={20} /> 
                Hablar con un Asesor
              </a>
              
              <a href="mailto:contacto@edificioscol.com" className="flex items-center gap-3 text-slate-900 px-10 py-5 rounded-full font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all">
                <Mail size={20} /> 
                Solicitar Información
              </a>
            </div>

            {/* Indicador de confianza/disponibilidad */}
            <div className="flex items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[11px] font-medium uppercase tracking-widest">Disponible Ahora</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <span className="text-[11px] font-medium uppercase tracking-widest">Bucaramanga, Santander</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;