import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../api/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, "usuarios", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: data.rol,
              unidad: data.unidad,
              edificioId: data.edificioId,
              nombreCompleto: data.nombreApellido
            });
          } else {
            // Usuario en Auth pero no en Firestore
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'residente' });
          }
        } catch (error) {
          console.error("Error al obtener perfil:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);