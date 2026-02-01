import { db } from '../api/firebaseConfig';
import { 
  collection, query, orderBy, limit, onSnapshot, doc, getDoc, updateDoc, where 
} from 'firebase/firestore';

export const getMensajesEnVivo = (edificioId, setMensajes) => {
  // Validamos que sea un string y no sea el valor por defecto 'all'
  const filtrarPorEdificio = typeof edificioId === 'string' && edificioId !== 'all';

  let q = query(collection(db, 'mensajes'), orderBy('fecha', 'desc'), limit(25));

  if (filtrarPorEdificio) {
    q = query(
      collection(db, 'mensajes'), 
      where('edificioId', '==', edificioId), 
      orderBy('fecha', 'desc'), 
      limit(25)
    );
  }

  return onSnapshot(q, async (snapshot) => {
    const mensajesPromesas = snapshot.docs.map(async (documento) => {
      const data = documento.data();
      let nombreReal = "Residente"; 

      // Usando 'usurioId' exactamente como está en tu Firebase
      if (data.usurioId) {
        try {
          const userSnap = await getDoc(doc(db, 'usuarios', data.usurioId));
          if (userSnap.exists()) {
            nombreReal = userSnap.data().nombreApellido || "Residente";
          }
        } catch (error) {
          console.error("Error al obtener nombre:", error);
        }
      }

      return {
        id: documento.id,
        ...data,
        usuarioNombre: nombreReal, 
        fechaLegible: data.fecha?.toDate().toLocaleString([], { 
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    });

    const resultados = await Promise.all(mensajesPromesas);
    setMensajes(resultados);
  });
};

export const cambiarEstadoMensaje = async (mensajeId, nuevoEstado) => {
  try {
    const mensajeRef = doc(db, 'mensajes', mensajeId);
    await updateDoc(mensajeRef, { status: nuevoEstado });
  } catch (error) {
    console.error("Error en cambiarEstadoMensaje:", error);
    throw error;
  }
};

export const responderMensaje = async (mensajeId, textoRespuesta) => {
  try {
    const ref = doc(db, 'mensajes', mensajeId);
    await updateDoc(ref, { 
      respuestaAdmin: textoRespuesta,
      status: 'resuelto', 
      fechaRespuesta: new Date()
    });
  } catch (error) {
    console.error("Error al responder mensaje:", error);
    throw error;
  }
};