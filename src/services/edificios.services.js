import { db } from '../api/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';

const ref = collection(db, 'edificios');

/* 🔹 Obtener SOLO edificios activos */
export const getEdificios = async () => {
  const q = query(ref, where('estado', '==', 'activo'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/* 🔹 Crear edificio */
export const createEdificio = async (data) => {
  return await addDoc(ref, {
    ...data,
    estado: 'activo',
    createdAt: serverTimestamp()
  });
};

/* 🔹 Editar edificio */
export const updateEdificio = async (id, data) => {
  return await updateDoc(doc(db, 'edificios', id), {
    ...data,
    updatedAt: serverTimestamp()
  });
};

/* 🔹 Inactivar edificio (BORRADO LÓGICO) */
export const inactivateEdificio = async (id) => {
  return await updateDoc(doc(db, 'edificios', id), {
    estado: 'inactivo',
    inactivatedAt: serverTimestamp()
  });
};
