import React, { useState } from 'react';
import { auth, db } from '../api/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Validar que el correo exista en la colección 'usuarios'
      const q = query(
        collection(db, 'usuarios'), 
        where('email', '==', email.trim().toLowerCase())
      );
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Este correo no se encuentra registrado en nuestra base de datos.');
        setLoading(false);
        return;
      }

      // 2. Si existe, enviar el correo de recuperación
      await sendPasswordResetEmail(auth, email.trim());
      setSubmitted(true);
      
      // 3. Redirigir al login después de mostrar el éxito
      setTimeout(() => {
        navigate('/login');
      }, 4000);

    } catch (err) {
      console.error("Error recuperación:", err);
      setError('Error al enviar el correo. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* SECCIÓN IZQUIERDA: IMAGEN (35%) */}
      <div className="hidden lg:flex w-[35%] bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Security"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-slate-900" />
        </div>
        <div className="relative z-10 self-end p-12 w-full">
          <div className="h-1.5 w-16 bg-blue-600 mb-6" />
          <p className="text-white text-xl font-medium leading-relaxed opacity-90">
            Seguridad y confianza en la gestión de su cuenta.
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO */}
      <div className="w-full lg:w-[65%] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] flex flex-col">
          
          <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-10 transition-colors w-fit">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>

          {!submitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                  Recuperar <span className="text-blue-600">Acceso</span>
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Ingrese su correo electrónico para verificar su identidad y restablecer su contraseña.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                {error && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                    <AlertCircle className="text-orange-600 shrink-0" size={18} />
                    <p className="text-orange-800 text-[11px] font-bold uppercase tracking-wider">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Correo Registrado</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none text-slate-900 font-semibold text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Verificar y Enviar"}
                </button>
              </form>
            </>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] text-center space-y-5 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                <CheckCircle2 className="text-white" size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-emerald-900 font-black text-lg uppercase tracking-tight">¡Correo Enviado!</h3>
                <p className="text-emerald-700 text-sm font-medium">
                  Las instrucciones han sido enviadas. Redirigiendo al login en unos segundos...
                </p>
              </div>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full animate-progress" />
              </div>
            </div>
          )}

          <footer className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 pt-8 flex justify-center">
            <p>© 2026 Edificios Colombia</p>
          </footer>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;