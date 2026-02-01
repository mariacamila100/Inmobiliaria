import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createInmueble, updateInmueble } from '../services/inmuebles.services';
import { getEdificios } from '../services/edificios.services';
import { alertSuccess } from '../components/Alert';

const InmuebleModal = ({ inmueble, onClose, onSaved }) => {
  const [edificios, setEdificios] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    precio: '',
    tipo: 'venta',
    estado: 'Disponible',
    edificioId: '',
    unidad: '', // Ej: Torre A - Apto 402
    habitaciones: '',
    baños: '',
    area: '',
    descripcion: '',
    destacado: false,
    fotoFile: null,
    barrio: '',
    estrato: '',
    parqueadero: 'no',
    amoblado: 'no',
  });

  useEffect(() => {
    const loadData = async () => {
      const eds = await getEdificios();
      setEdificios(eds);

      if (inmueble) {
        setForm({
          ...inmueble,
          precio: inmueble.precio?.toString() || '',
          habitaciones: inmueble.habitaciones?.toString() || '',
          baños: inmueble.baños?.toString() || '',
          area: inmueble.area?.toString() || '',
          barrio: inmueble.barrio || '',
          unidad: inmueble.unidad || '',
          estrato: inmueble.estrato?.toString() || '',
          parqueadero: inmueble.parqueadero ? 'si' : 'no',
          amoblado: inmueble.amoblado ? 'si' : 'no',
          fotoFile: null
        });
        if (inmueble.foto) setPreviewImage(inmueble.foto);
      }
    };
    loadData();
  }, [inmueble]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, fotoFile: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Buscamos la data del edificio para "heredar" su ubicación
    const edificioInfo = edificios.find(ed => ed.id === form.edificioId);

    const { fotoFile, ...restOfForm } = form;

    const dataToSend = {
      ...restOfForm,
      precio: Number(form.precio) || 0,
      habitaciones: Number(form.habitaciones) || 0,
      baños: Number(form.baños) || 0,
      area: String(form.area),
      estrato: Number(form.estrato) || null,
      parqueadero: form.parqueadero === 'si',
      amoblado: form.amoblado === 'si',
      // Guardamos snapshot de ubicación para el mapa
      nombreEdificio: edificioInfo?.nombre || '',
      direccionEdificio: edificioInfo?.direccion || '',
      ciudadEdificio: edificioInfo?.ciudad || '',
      departamentoEdificio: edificioInfo?.departamento || ''
    };

    try {
      if (inmueble) {
        await updateInmueble(inmueble.id, dataToSend, fotoFile);
        alertSuccess('Actualizado', 'Inmueble actualizado correctamente');
      } else {
        await createInmueble(dataToSend, fotoFile);
        alertSuccess('Creado', 'Inmueble registrado correctamente');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fadeIn max-h-[95vh] overflow-y-auto">
        
        <h3 className="text-xl font-bold mb-6 text-slate-800">
          {inmueble ? 'Editar inmueble' : 'Nuevo inmueble'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            required
            placeholder="Título del anuncio (Ej: Apartamento remodelado)"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: e.target.value })}
              placeholder="Precio ($)"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />

            <select
              value={form.edificioId}
              onChange={e => setForm({ ...form, edificioId: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
            >
              <option value="">Seleccione edificio...</option>
              {edificios.map(ed => (
                <option key={ed.id} value={ed.id}>{ed.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              value={form.barrio}
              onChange={e => setForm({ ...form, barrio: e.target.value })}
              placeholder="Barrio / Sector"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />

            <input
              value={form.unidad}
              onChange={e => setForm({ ...form, unidad: e.target.value })}
              placeholder="Unidad (Ej: T1 - 402)"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.estrato}
              onChange={e => setForm({ ...form, estrato: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
            >
              <option value="">Estrato</option>
              {[1,2,3,4,5,6].map(e => (
                <option key={e} value={e}>Estrato {e}</option>
              ))}
            </select>

            <div className="flex items-center justify-between px-4 bg-slate-50 rounded-xl border border-slate-200">
               <span className="text-xs font-bold text-slate-500 uppercase">Destacado</span>
               <input 
                type="checkbox" 
                checked={form.destacado} 
                onChange={e => setForm({...form, destacado: e.target.checked})}
                className="w-5 h-5 accent-blue-600"
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.parqueadero}
              onChange={e => setForm({ ...form, parqueadero: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
            >
              <option value="no">Parqueadero: No</option>
              <option value="si">Parqueadero: Sí</option>
            </select>

            <select
              value={form.amoblado}
              onChange={e => setForm({ ...form, amoblado: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none"
            >
              <option value="no">Amoblado: No</option>
              <option value="si">Amoblado: Sí</option>
            </select>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-slate-400 font-bold uppercase">Foto</span>
              )}
            </div>
            <label className="flex-1 cursor-pointer py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold text-center hover:bg-slate-100 transition uppercase tracking-wider">
              {inmueble ? 'Cambiar imagen' : 'Subir imagen'}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              value={form.habitaciones}
              onChange={e => setForm({ ...form, habitaciones: e.target.value })}
              placeholder="Hab."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none text-center font-bold"
            />
            <input
              type="text"
              value={form.baños}
              onChange={e => setForm({ ...form, baños: e.target.value })}
              placeholder="Baños"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none text-center font-bold"
            />
            <input
              type="text"
              value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })}
              placeholder="Área m2"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none text-center font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.tipo}
              onChange={e => setForm({ ...form, tipo: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-blue-600"
            >
              <option value="venta">En Venta</option>
              <option value="renta">En Renta</option>
            </select>
            <select
              value={form.estado}
              onChange={e => setForm({ ...form, estado: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold"
            >
              <option value="Disponible">Disponible</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <textarea
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
            rows="3"
            placeholder="Escribe aquí los detalles destacados..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
          />

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Guardar Propiedad'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-xl font-bold transition-all"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default InmuebleModal;