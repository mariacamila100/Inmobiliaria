import { db } from '../api/firebaseConfig';
import { 
  collection, addDoc, query, where, getDocs, orderBy, Timestamp, doc, deleteDoc, updateDoc 
} from 'firebase/firestore';

export const registrarConsumo = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'consumos'), {
      ...data,
      fechaRegistro: Timestamp.now(),
      valor: parseFloat(data.valor),
      lectura: parseFloat(data.lectura)
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al registrar consumo:", error);
    throw error;
  }
};

export const getConsumos = async (edificioId = null) => {
  try {
    let consumosRef = collection(db, 'consumos');
    let q = query(consumosRef, orderBy('fechaRegistro', 'desc'));

    if (edificioId && edificioId !== 'all') {
      q = query(consumosRef, where('edificioId', '==', edificioId), orderBy('fechaRegistro', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener consumos:", error);
    return [];
  }
};

export const eliminarConsumo = async (id) => {
  try {
    await deleteDoc(doc(db, 'consumos', id));
  } catch (error) {
    console.error("Error al eliminar:", error);
    throw error;
  }
};

// --- FUNCIÓN AGREGADA ---
export const actualizarConsumo = async (id, data) => {
  try {
    const consumoRef = doc(db, 'consumos', id);
    await updateDoc(consumoRef, {
      ...data,
      valor: parseFloat(data.valor),
      lectura: parseFloat(data.lectura),
      ultimaModificacion: Timestamp.now() // Opcional: para saber cuándo se editó
    });
  } catch (error) {
    console.error("Error al actualizar consumo:", error);
    throw error;
  }
};