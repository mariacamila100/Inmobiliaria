import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardResidente from './pages/DashboardResidentes';
import DashboardAdmin from './pages/DashboardAdmin';

// Wrapper para inyectar el usuario del contexto al Dashboard de Residente
const DashboardWrapper = () => {
  const { user } = useAuth();
  return <DashboardResidente user={user} />;
};

// Wrapper para inyectar el usuario al Dashboard de Admin (opcional si lo necesitas)
const AdminWrapper = () => {
  const { user } = useAuth();
  return <DashboardAdmin user={user} />;
};

const NavbarWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Solo mostramos la Navbar pública si NO hay usuario
  if (!user) {
    return <Navbar />;
  }

  return null;
};

const RootHandler = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    // Redirección basada en 'rol' (campo exacto en tu Firestore)
    // Cambiado de user.role a user.rol para coincidir con la DB
    return <Navigate to={user.rol === 'admin' ? '/admin' : '/panel'} replace />;
  }

  return <Home />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavbarWrapper />

        <Routes>
          {/* Ruta Raíz */}
          <Route path="/" element={<RootHandler />} />

          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rutas Privadas: Panel de Residente */}
          <Route
            path="/panel"
            element={
              <ProtectedRoute allowedRoles={['residente']}>
                <DashboardWrapper />
              </ProtectedRoute>
            }
          />

          {/* Rutas Privadas: Panel de Administrador */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWrapper />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;