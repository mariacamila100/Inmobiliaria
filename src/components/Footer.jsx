import { Building2, Facebook, Bell, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decoración sutil para que no sea un bloque negro plano */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* Logo y Eslogan */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Building2 className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Edificios Colombia</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Transformando la experiencia de vivir en comunidad con tecnología, seguridad y elegancia corporativa.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-lg font-bold mb-8">Compañía</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Sobre Nosotros</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Portafolio</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Contacto</li>
            </ul>
          </div>

          {/* Residentes */}
          <div>
            <h4 className="text-lg font-bold mb-8">Residentes</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Portal de Acceso</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Pagos en Línea</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">PQRS</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold mb-8">Síguenos</h4>
            <div className="flex gap-4">
              {[Facebook, Bell, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group">
                  <Icon size={20} className="text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Línea final */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs">
            © 2026 Edificios Colombia. Todos los derechos reservados.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
            <span>Privacidad</span>
            <span>Términos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;