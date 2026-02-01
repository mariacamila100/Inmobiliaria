import { useState } from 'react';
import {
  Menu, X, Building2, User, LogOut, LayoutGrid, Home
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { auth } from '../api/firebaseConfig';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard =
    location.pathname.includes('/admin') ||
    location.pathname.includes('/panel');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 top-0 backdrop-blur-xl bg-white/70 border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
              <Building2 className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tight">
              Edificios<span className="text-blue-600">Col</span>
            </span>
          </Link>


          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-8">

            {!isDashboard && (
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-600 hover:text-orange-500 font-semibold text-sm transition-colors"
              >
                <Home size={18} />
                Venta / Renta
              </Link>
            )}

            {!user ? (
            
            <Link to="/login">
  <button
    className="
      bg-blue-600 hover:bg-blue-700
      text-white px-6 py-3
      rounded-xl font-black text-xs
      uppercase tracking-widest
      flex items-center gap-2
      transition-all
      shadow-lg shadow-blue-600/25
    "
  >
    <User size={18} />
    Acceso Residentes
  </button>
</Link>

            ) : (
              <div className="flex items-center gap-3">

                {/* PANEL */}
                <Link
                  to={user.role === 'admin' ? '/admin' : '/panel'}
                  className="
                    flex items-center gap-2
                    px-5 py-2.5
                    rounded-2xl
                    backdrop-blur-xl bg-white/60
                    border border-white/40
                    text-slate-800 font-semibold text-sm
                    hover:bg-white/80
                    transition-all
                  "
                >
                  <LayoutGrid size={18} />
                  panel
                </Link>

                {/* SALIR */}
                <button
                  onClick={handleLogout}
                  className="
                    px-4 py-2.5
                    rounded-2xl
                    bg-orange-500/10 text-orange-600
                    hover:bg-orange-500 hover:text-white
                    transition-all shadow-sm
                  "
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl hover:bg-white/60 text-slate-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden backdrop-blur-xl bg-white/80 border-t border-white/40 p-6 space-y-4">

          {!isDashboard && (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-semibold"
            >
              Venta / Renta
            </Link>
          )}

          {!user ? (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="
                w-full bg-orange-500 text-white
                py-4 rounded-2xl
                font-black text-xs
                uppercase tracking-widest
                shadow-lg shadow-orange-500/30
              ">
                Acceso residentes
              </button>
            </Link>
          ) : (
            <div className="space-y-3">
              <Link
                to={user.role === 'admin' ? '/admin' : '/panel'}
                onClick={() => setIsOpen(false)}
                className="
                  block w-full text-center
                  backdrop-blur-xl bg-white/60
                  border border-white/40
                  text-slate-800
                  py-4 rounded-2xl
                  font-semibold text-sm
                "
              >
                panel
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="
                  w-full bg-orange-500/10 text-orange-600
                  hover:bg-orange-500 hover:text-white
                  py-4 rounded-2xl
                  font-bold text-xs uppercase tracking-widest
                  transition-all
                "
              >
                salir
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
