import React, { useState } from 'react';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import Footer from '../components/Footer';
import { 
  ShieldCheck, Headset, PenTool as Tool, ArrowRight, 
  ChevronRight, MessageCircle, Mail, Building2, Key,
  Phone // Importamos el icono de teléfono
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
      
      {/* SECCIÓN CATÁLOGO */}
      <section id="seccion-explorar" className="relative z-20 -mt-24 pb-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-900/10 p-6 md:p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-12 bg-blue-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Explorar Edificios en Venta y Renta
              </span>
            </div>
            <Catalog filtrosHero={terminoBusqueda} />
          </div>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS COMERCIALES */}
      <section className="bg-white pt-20 pb-20">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-24 border-b border-slate-100 pb-12">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[0.9]">
                Gestión <span className="text-orange-500 font-black italic">Inmobiliaria</span>
              </h2>
              <p className="text-slate-500 mt-8 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                Expertos en la comercialización y administración de edificios premium para venta y renta.
              </p>
            </div>
            <button className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
              Ver portafolio de edificios 
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Building2 size={32} />, 
                title: "Venta de Edificios", 
                desc: "Asesoría especializada en la compra y venta de unidades completas y copropiedades." 
              },
              { 
                icon: <Key size={32} />, 
                title: "Renta Corporativa", 
                desc: "Gestión integral de alquileres para edificios residenciales y de oficinas." 
              },
              { 
                icon: <ShieldCheck size={32} />, 
                title: "Garantía Jurídica", 
                desc: "Seguridad total en cada transacción con protocolos legales de alto nivel." 
              }
            ].map((service, index) => (
              <div key={index} className="group relative p-10 bg-slate-50 hover:bg-white rounded-[2.5rem] border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-500">
                <div className="mb-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600 text-white group-hover:bg-orange-500 transition-all">
                  {service.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-5">{service.title}</h4>
                <p className="text-slate-500 text-base mb-10 leading-relaxed">{service.desc}</p>
                <button className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-orange-600 transition-all">
                  Consultar Disponibilidad <ChevronRight size={16} className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE CONTACTO (Ajustada: Botones más pequeños y refinados) */}
      <section className="bg-white pb-32">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="bg-[#0F172A] rounded-[3.5rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl shadow-slate-900/20">
            {/* Círculos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="max-w-xl text-center lg:text-left relative z-10">
              <h3 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
                ¿Listo para transformar tu <span className="text-blue-500">copropiedad?</span>
              </h3>
              <p className="text-slate-400 text-lg font-medium">
                Nuestro equipo está listo para brindarte la asesoría que necesitas. Contáctanos por el canal de tu preferencia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
              {/* Email Button (Reducido) */}
              <a href="mailto:contacto@edificioscol.com" className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                <Mail size={18} />
                Enviar Email
              </a>
              
              {/* WhatsApp Button (Reducido) */}
              <a href="https://wa.me/tu-numero" className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-500 shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all">
                <MessageCircle size={18} />
                WhatsApp Directo
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 border-t border-slate-100">
          <Footer />
      </div>
    </main>
  );
};

export default Home;