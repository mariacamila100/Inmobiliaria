import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { departamentosColombia } from '../data/colombia'; // Importamos tu data local
import {
  createEdificio,
  updateEdificio
} from '../services/edificios.services';
import { alertSuccess } from '../components/Alert';

const EdificioModal = ({ edificio, onClose, onSaved }) => {
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    departamento: 'Santander', // Campo nuevo
    ciudad: 'Bucaramanga',
    estado: 'activo'
  });

  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);

  // Lógica para filtrar ciudades según departamento
  useEffect(() => {
    const deptoEncontrado = departamentosColombia.find(d => d.departamento === form.departamento);
    if (deptoEncontrado) {
      setCiudadesFiltradas(deptoEncontrado.ciudades);
    }
  }, [form.departamento]);

  useEffect(() => {
    if (edificio) {
      setForm({
        nombre: edificio.nombre || '',
        direccion: edificio.direccion || '',
        departamento: edificio.departamento || 'Santander',
        ciudad: edificio.ciudad || '',
        estado: edificio.estado || 'activo'
      });
    }
  }, [edificio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edificio) {
      await updateEdificio(edificio.id, form);
      alertSuccess('Edificio actualizado', 'Los cambios se guardaron correctamente');
    } else {
      await createEdificio(form);
      alertSuccess('Edificio creado', 'El edificio fue registrado correctamente');
    }
    onSaved();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
      />

      <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fadeIn">
        
        <h3 className="text-xl font-bold mb-6 text-slate-800">
          {edificio ? 'Editar edificio' : 'Nuevo edificio'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre del edificio">
            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none"
            />
          </FormGroup>

          <FormGroup label="Dirección">
            <input
              value={form.direccion}
              onChange={e => setForm({ ...form, direccion: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Departamento">
              <select
                value={form.departamento}
                onChange={e => setForm({ ...form, departamento: e.target.value, ciudad: '' })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none"
              >
                {departamentosColombia.map(dep => (
                  <option key={dep.departamento} value={dep.departamento}>{dep.departamento}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Ciudad">
              <select
                value={form.ciudad}
                onChange={e => setForm({ ...form, ciudad: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none"
              >
                <option value="">Seleccione...</option>
                {ciudadesFiltradas.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormGroup>
          </div>

          <FormGroup label="Estado">
            <select
              value={form.estado}
              onChange={e => setForm({ ...form, estado: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </FormGroup>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold transition"
            >
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
    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

export default EdificioModal;