import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createUsuario, updateUsuario } from '../services/usuarios.service'
import { getEdificios } from '../services/edificios.services';
import { alertSuccess } from '../components/Alert';

const UsuarioModal = ({ usuario, onClose, onSaved }) => {
  const [edificios, setEdificios] = useState([]);
  const [form, setForm] = useState({
    nombreApellido: '',
    email: '',
    password: '',
    edificioId: '',
    unidad: '',
  });

  useEffect(() => {
    // Cargar edificios para el select
    getEdificios().then(setEdificios);

    if (usuario) {
      setForm({
        nombreApellido: usuario.nombreApellido || '',
        email: usuario.email || '',
        edificioId: usuario.edificioId || '',
        unidad: usuario.unidad || '',
        password: '*****' // Password no se edita así por seguridad
      });
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usuario) {
      await updateUsuario(usuario.id, form);
      alertSuccess('Actualizado', 'Usuario modificado con éxito');
    } else {
      await createUsuario(form);
      alertSuccess('Creado', 'Residente registrado en sistema y Auth');
    }
    onSaved();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fadeIn">
        <h3 className="text-xl font-bold mb-6 text-slate-800">
          {usuario ? 'Editar Residente' : 'Nuevo Residente'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre y Apellido">
            <input
              value={form.nombreApellido}
              onChange={e => setForm({ ...form, nombreApellido: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Email / Usuario">
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                disabled={!!usuario}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </FormGroup>
            {!usuario && (
              <FormGroup label="Contraseña">
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </FormGroup>
            )}
          </div>

          <FormGroup label="Asignar Edificio">
            <select
              value={form.edificioId}
              onChange={e => setForm({ ...form, edificioId: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Seleccione edificio...</option>
              {edificios.map(edi => (
                <option key={edi.id} value={edi.id}>{edi.nombre}</option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Unidad (Apto/Casa)">
            <input
              value={form.unidad}
              onChange={e => setForm({ ...form, unidad: e.target.value })}
              placeholder="Ej: 402"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </FormGroup>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition">
              Guardar Residente
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

const FormGroup = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

export default UsuarioModal;