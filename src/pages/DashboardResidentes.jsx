import { useAuth } from '../context/authContext';

const DashboardResidente = () => {
  const { user } = useAuth();
  const edificioId = localStorage.getItem('edificioId');

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-navy-900">Hola, {user.email.split('@')[0]}</h1>
      <p className="text-gray-600">Bienvenido al panel de su unidad en {edificioId}.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {/* Acceso a PDFs */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-700">
          <h3 className="font-bold text-lg mb-2">Mis Documentos</h3>
          <p className="text-sm text-gray-500">Estados de cuenta y reglamentos.</p>
          <button className="mt-4 text-blue-700 font-semibold underline">Ver Archivos</button>
        </div>

        {/* Reportar Incidente */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-orange-500">
          <h3 className="font-bold text-lg mb-2">PQRS / Reportes</h3>
          <p className="text-sm text-gray-500">Informa ruidos o áreas comunes.</p>
          <button className="mt-4 text-orange-600 font-semibold underline">Crear Ticket</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardResidente;