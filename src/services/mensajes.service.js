import { db } from '../api/firebaseConfig';
import { 
  collection, query, orderBy, limit, onSnapshot, doc, getDoc, updateDoc, where 
} from 'firebase/firestore';

export const getMensajesEnVivo = (filtroEdificio, setMensajes) => {
  const idDelEdificio = typeof filtroEdificio === 'object' ? filtroEdificio?.id : filtroEdificio;
  const tieneFiltroReal = idDelEdificio && idDelEdificio !== 'all' && idDelEdificio !== 'Global';

  let q = tieneFiltroReal
    ? query(collection(db, 'mensajes'), where('edificioId', '==', idDelEdificio), orderBy('fecha', 'desc'), limit(25))
    : query(collection(db, 'mensajes'), orderBy('fecha', 'desc'), limit(25));

  return onSnapshot(q, async (snapshot) => {
    const mensajesPromesas = snapshot.docs.map(async (documento) => {
      const data = documento.data();
      const uid = data.usuarioId || data.usurioId;
      let nombreReal = "Residente"; 

      if (uid) {
        try {
          const userSnap = await getDoc(doc(db, 'usuarios', uid));
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
        usuarioNombre: nombreReal, // Sobrescribimos cualquier "Anónimo" guardado
        fechaLegible: data.fecha?.toDate().toLocaleString([], { 
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
        })
      };
    });

    const resultados = await Promise.all(mensajesPromesas);
    setMensajes(resultados);
  });
};

export const cambiarEstadoMensaje = async (mensajeId, nuevoEstado) => {
  const mensajeRef = doc(db, 'mensajes', mensajeId);
  await updateDoc(mensajeRef, { status: nuevoEstado });
};

export const responderMensaje = async (mensajeId, textoRespuesta) => {
  const ref = doc(db, 'mensajes', mensajeId);
  await updateDoc(ref, { 
    respuestaAdmin: textoRespuesta,
    status: 'resuelto', 
    fechaRespuesta: new Date()
  });
};