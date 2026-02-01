import { db } from '../api/firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  serverTimestamp // <--- IMPORTANTE: Importar desde firestore, no desde tu config
} from 'firebase/firestore'; 
import { createUserWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../api/firebaseConfig';

const collectionRef = collection(db, 'usuarios');

// Inicialización de App secundaria para crear usuarios sin cerrar la sesión del admin
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

export const getUsuarios = async () => {
  try {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const createUsuario = async (data) => {
  try {
    // 1. Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
    const uid = userCredential.user.uid;
    
    // Cerramos la sesión secundaria inmediatamente
    await signOut(secondaryAuth);

    // 2. Guardar la información extendida en Firestore
    const docData = {
      nombreApellido: data.nombreApellido,
      email: data.email,
      edificioId: data.edificioId,
      unidad: data.unidad,
      rol: data.rol || 'residente',
      estado: true,
      uid: uid,
      createdAt: serverTimestamp() // Ahora funcionará correctamente
    };

    return await addDoc(collectionRef, docData);
  } catch (error) {
    console.error("Error en createUsuario:", error);
    throw error;
  }
};

export const updateUsuario = async (id, data) => {
  try {
    const docRef = doc(db, 'usuarios', id);
    // Extraemos el password para no guardarlo accidentalmente en texto plano en la DB
    const { password, ...updateData } = data; 
    return await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

export const toggleEstadoUsuario = async (id, estadoActual) => {
  try {
    const docRef = doc(db, 'usuarios', id);
    await updateDoc(docRef, {
      estado: !estadoActual
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    throw error;
  }
};