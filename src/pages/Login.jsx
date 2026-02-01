import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../api/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ArrowRight, Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false); // Nuevo: Estado para términos
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validación de seguridad para datos
    if (!acceptedTerms) {
      setError('Debes aceptar el tratamiento de datos para continuar.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let emailParaAuth = identifier.trim();

      if (!identifier.includes('@')) {
        const q = query(
          collection(db, 'usuarios'),
          where('unidad', '==', identifier.trim()),
          where('rol', '==', 'residente')
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) throw new Error();
        const userData = querySnapshot.docs[0].data();
        emailParaAuth = `${userData.unidad}${userData.nombreApellido
          .toLowerCase()
          .replace(/\s/g, '')}@${userData.edificioId}.com`;
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailParaAuth, password);
      const userDoc = await getDoc(doc(db, 'usuarios', userCredential.user.uid));

      userDoc.exists()
        ? userDoc.data().rol === 'admin'
          ? navigate('/admin')
          : navigate('/panel')
        : setError('El perfil no está configurado correctamente.');
    } catch {
      setError('Credenciales de acceso incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* SECCIÓN IZQUIERDA: IMAGEN (35%) */}
      <div className="hidden lg:flex w-[35%] bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
            alt="Corporate Building"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-slate-900" />
        </div>
        
        <div className="relative z-10 self-end p-12 w-full">
          <div className="h-1.5 w-16 bg-blue-600 mb-6" />
          <p className="text-white text-xl font-medium leading-relaxed opacity-90">
            Eficiencia y control total para su copropiedad.
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO */}
      <div className="w-full lg:w-[65%] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] flex flex-col">
          
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Acceso al <span className="text-orange-500">Portal</span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Ingrese sus credenciales de administración para acceder al panel de control.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p className="text-orange-800 text-xs font-bold uppercase tracking-wider">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Identificación</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="correo electrónico"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none text-slate-900 font-semibold text-sm"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Contraseña</label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Recuperar acceso
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none text-slate-900 font-semibold text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* AGG: CHECKBOX DE TÉRMINOS Y TRATAMIENTO DE DATOS */}
            <div className="flex items-start gap-3 px-1 py-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-[11px] leading-relaxed text-slate-500 font-medium cursor-pointer">
                Acepto los <span className="text-blue-600 font-bold hover:underline">Términos y Condiciones</span> y la <span className="text-blue-600 font-bold hover:underline">Política de Tratamiento de Datos Personales</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl mt-4
                ${acceptedTerms 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 active:scale-[0.98]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>ENTRAR AL SISTEMA <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <footer className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 pt-8 flex justify-between">
            <p>© 2026 Edificios Colombia</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600 transition-colors">Soporte</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Legal</a>
            </div>
          </footer>
        </div>
      </div>

    </div>
  );
};

export default Login;