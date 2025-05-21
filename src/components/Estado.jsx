import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Estado.css";

const Estado = ({ user }) => {
  const [monto, setMonto] = useState(0);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const fetchDatosActualizados = async () => {
      const q = query(collection(db, user.banco), where("telefono", "==", user.telefono));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setMonto(docData.monto || 0);
        setMovimientos(docData.movimientos || []);
      }
    };

    fetchDatosActualizados();
  }, [user]);

  return (
    <div className="estado-container">
      <h2>Estado de cuenta</h2>
      <div className="monto-card">Saldo actual: ₡{monto}</div>

      <h3>Movimientos recientes:</h3>
      <ul className="movimientos-list">
        {movimientos.map((mov, i) => (
          <li key={i}>
            <strong>{mov.tipo || mov.detalle}</strong>
            <span>₡{mov.monto} | {mov.fecha}</span>
          </li>
        ))}
      </ul>
    </div>
  );

};

export default Estado;
