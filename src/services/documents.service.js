import { 
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../api/firebaseConfig';

// 📥 OBTENER TODOS LOS DOCUMENTOS (Para el Admin)
export const getDocuments = async () => {
  try {
    const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return [];
  }
};

// 📥 OBTENER POR EDIFICIO (Para el Residente)
export const getDocumentsByBuilding = async (buildingId) => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('edificioId', '==', buildingId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener documentos por edificio:", error);
    return [];
  }
};

// SUBIR DOCUMENTO
export const uploadDocument = async (formData) => {
  const titulo = formData.get('titulo');
  const edificioId = formData.get('edificioId');
  const tipo = formData.get('tipo');
  const año = formData.get('año');
  const file = formData.get('file');

  const storageRef = ref(storage, `documents/${edificioId}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return await addDoc(collection(db, 'documents'), {
    titulo,
    edificioId,
    tipo,
    año,
    archivourl: url,
    createdAt: serverTimestamp()
  });
};
// src/services/documents.service.js

// ... otras funciones (getDocuments, uploadDocument, etc.)

export const deleteDocument = async (id) => {
  // Aquí va tu lógica de borrado (ejemplo con fetch/axios)
  // const response = await axios.delete(`${API_URL}/documents/${id}`);
  // return response.data;
  console.log("Eliminando documento:", id);
};