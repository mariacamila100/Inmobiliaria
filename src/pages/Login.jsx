import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../api/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
<<<<<<< HEAD
import { ArrowRight, Loader2, Lock, Mail, Eye, EyeOff, UserPlus } from 'lucide-react';
=======
import { ArrowRight, Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
=======

>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
    if (!acceptedTerms) {
      setError('Debes aceptar el tratamiento de datos para continuar.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      let emailParaAuth = identifier.trim();

      // 1. LÓGICA DE IDENTIFICACIÓN (RESIDENTE POR UNIDAD O ADMIN POR EMAIL)
      if (!identifier.includes('@')) {
        const q = query(
          collection(db, 'usuarios'),
          where('unidad', '==', identifier.trim()),
          where('rol', '==', 'residente')
        );
        const querySnapshot = await getDocs(q);
<<<<<<< HEAD
        if (querySnapshot.empty) throw new Error('La unidad no existe.');
=======
        
        if (querySnapshot.empty) {
          throw new Error('La unidad no existe o no tiene perfil asignado.');
        }
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f

        const userData = querySnapshot.docs[0].data();
        // Reconstrucción del correo según tu lógica de creación
        emailParaAuth = `${userData.unidad}${userData.nombreApellido
          .toLowerCase()
          .replace(/\s/g, '')}@${userData.edificioId}.com`;
      }

      // 2. AUTENTICACIÓN CON FIREBASE AUTH
      const userCredential = await signInWithEmailAndPassword(auth, emailParaAuth, password);
      const firebaseUid = userCredential.user.uid;

<<<<<<< HEAD
      const qPerfil = query(collection(db, 'usuarios'), where('uid', '==', firebaseUid));
=======
      // 3. BÚSQUEDA DEL PERFIL POR CAMPO 'uid' (Solución al ID mismatch)
      const qPerfil = query(
        collection(db, 'usuarios'), 
        where('uid', '==', firebaseUid)
      );
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
      const querySnap = await getDocs(qPerfil);

      if (!querySnap.empty) {
        const finalUserData = querySnap.docs[0].data();
<<<<<<< HEAD
        finalUserData.rol === 'admin' ? navigate('/admin') : navigate('/panel');
      } else {
        await signOut(auth);
        throw new Error('Perfil no configurado.');
      }
    } catch (err) {
      setError('Credenciales inválidas o error de conexión.');
=======
        
        // Redirección basada en el rol encontrado en el documento
        if (finalUserData.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/panel');
        }
      } else {
        // Si el usuario existe en Auth pero no hay documento con ese campo UID
        await signOut(auth);
        throw new Error('Su perfil no está configurado correctamente en la base de datos.');
      }

    } catch (err) {
      console.error("Error en login:", err);
      // Traducción de errores comunes de Firebase
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError(err.message || 'Error al intentar ingresar.');
      }
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex bg-white font-sans overflow-x-hidden">
      {/* SECCIÓN IZQUIERDA: IMAGEN (Oculta en móviles y tablets pequeñas) */}
      <div className="hidden xl:flex xl:w-[40%] bg-slate-900 relative">
=======
    <div className="min-h-screen flex bg-white font-sans">
      {/* SECCIÓN IZQUIERDA: IMAGEN */}
      <div className="hidden lg:flex w-[35%] bg-slate-900 relative overflow-hidden">
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Edificios Colombia"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>
<<<<<<< HEAD
        <div className="relative z-10 self-end p-16">
          <div className="h-1.5 w-12 bg-orange-500 mb-6" />
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Gestión inteligente para <br /> copropiedades modernas.
          </h2>
          <p className="text-slate-300 text-lg">Santander, Colombia.</p>
=======
        <div className="relative z-10 self-end p-12 w-full">
          <div className="h-1.5 w-16 bg-blue-600 mb-6" />
          <p className="text-white text-xl font-medium leading-relaxed opacity-90">
            Eficiencia y control total para su copropiedad.
          </p>
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO */}
<<<<<<< HEAD
      <div className="w-full xl:w-[60%] flex items-center justify-center p-4 sm:p-8 lg:p-16">
        <div className="w-full max-w-[440px] flex flex-col">
          {/* Logo / Header móvil */}
          <div className="mb-10 text-center xl:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-3">
              ACCESO AL <span className="text-orange-500 italic">PORTAL</span>
            </h1>
            <p className="text-slate-500 font-medium">Bienvenido de nuevo. Ingrese sus datos.</p>
=======
      <div className="w-full lg:w-[65%] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Acceso al <span className="text-orange-500">Portal</span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Ingrese sus credenciales para acceder al panel de control.
            </p>
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                <p className="text-red-700 text-xs font-bold uppercase">{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Usuario o Correo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
<<<<<<< HEAD
                  placeholder="Ej: 101 o admin@correo.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none text-sm font-bold"
=======
                  placeholder="Unidad o correo electrónico"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none text-slate-900 font-semibold text-sm"
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
<<<<<<< HEAD
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contraseña</label>
                <Link to="/forgot-password" size={18} className="text-[10px] font-black uppercase text-blue-600 hover:text-orange-500 transition-colors">
                  ¿Olvidaste el acceso?
=======
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Contraseña</label>
                <Link to="/forgot-password" size={18} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Recuperar acceso
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none text-sm font-bold"
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

            <div className="flex items-start gap-3 px-1 py-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-[11px] leading-relaxed text-slate-500 font-medium cursor-pointer">
                Acepto los <span className="text-blue-600 font-bold">Términos</span> y la <span className="text-blue-600 font-bold">Política de Datos</span>.
              </label>
            </div>
<<<<<<< HEAD
<div className="flex justify-center pt-4">
  <button
    type="submit"
    disabled={loading}
    className={`px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-lg
      ${acceptedTerms 
        ? 'bg-slate-900 hover:bg-blue-600 text-white shadow-blue-900/10 active:scale-95' 
        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
  >
    {loading ? (
      <Loader2 className="animate-spin" size={18} />
    ) : (
      <>
        INGRESAR AHORA 
        <ArrowRight size={16} />
      </>
    )}
  </button>
</div>
           
=======

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
>>>>>>> a0f5f3cacf9eff7ff96e4f347fc4a813e159820f
          </form>
          <footer className="mt-auto pt-12 text-slate-300 text-[9px] font-black uppercase tracking-[0.3em] flex flex-col sm:flex-row justify-between gap-4 text-center sm:text-left">
            <p>© 2026 EDIFICIOS COLOMBIA</p>
            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Soporte</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;