import { db, storage } from '../api/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

const inmueblesCollection = collection(db, 'inmuebles');

// Subir imagen y retornar URL
const uploadImage = async (file) => {
  if (!file) return null;
  const storageRef = ref(storage, `inmuebles/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const getInmuebles = async () => {
  const snapshot = await getDocs(inmueblesCollection);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createInmueble = async (data, imageFile) => {
  const fotoUrl = await uploadImage(imageFile);

  const cleanData = {
    ...data,
    precio: Number(data.precio),
    habitaciones: Number(data.habitaciones),
    baños: Number(data.baños),
    area: String(data.area),

    // 🔹 NUEVOS CAMPOS
    barrio: data.barrio || '',
    estrato: data.estrato !== undefined ? Number(data.estrato) : null,
    parqueadero: Boolean(data.parqueadero),
    amoblado: Boolean(data.amoblado),

    destacado: Boolean(data.destacado),
    foto: fotoUrl,
    fechaPublicacion: serverTimestamp()
  };

  return await addDoc(inmueblesCollection, cleanData);
};

export const updateInmueble = async (id, data, newImageFile) => {
  const docRef = doc(db, 'inmuebles', id);
  let updateData = { ...data };

  if (newImageFile) {
    const fotoUrl = await uploadImage(newImageFile);
    updateData.foto = fotoUrl;
  }

  const cleanData = {
    ...updateData,
    precio: Number(updateData.precio),
    habitaciones: Number(updateData.habitaciones),
    baños: Number(updateData.baños),
    area: String(updateData.area),

    // 🔹 NUEVOS CAMPOS
    barrio: updateData.barrio || '',
    estrato: updateData.estrato !== undefined ? Number(updateData.estrato) : null,
    parqueadero: Boolean(updateData.parqueadero),
    amoblado: Boolean(updateData.amoblado)
  };

  return await updateDoc(docRef, cleanData);
};

export const inactivateInmueble = async (id) => {
  const docRef = doc(db, 'inmuebles', id);
  return await updateDoc(docRef, { estado: 'Inactivo' });
};
