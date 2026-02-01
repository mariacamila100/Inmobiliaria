import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardResidente from './pages/DashboardResidentes';
import DashboardAdmin from './pages/DashboardAdmin';

// Componente para manejar la raíz "/" sin parpadeos
const RootHandler = () => {
  const { user, loading } = useAuth();

  // 1. MIENTRAS CARGA: No mostramos nada para evitar el "flash" del Home
  if (loading) return null; 

  // 2. SI HAY USUARIO: Vamos directo al panel (según su rol)
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/panel'} replace />;
  }

  // 3. SI NO HAY USUARIO: Recién aquí mostramos el Home
  return <Home />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* La raíz ahora es controlada por el RootHandler */}
          <Route path="/" element={<RootHandler />} />
          
          <Route path="/login" element={<Login />} />
          
          <Route path="/panel" element={
            <ProtectedRoute allowedRoles={['residente']}>
              <DashboardResidente />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardAdmin /> 
            </ProtectedRoute>
          } />

          {/* Redirección de seguridad para rutas inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;