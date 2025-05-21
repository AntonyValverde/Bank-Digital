import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import "./Sinpe.css";

const Sinpe = ({ user }) => {
  const [para, setPara] = useState("");
  const [monto, setMonto] = useState("");
  const [detalle, setDetalle] = useState("");

  const hacerSinpe = async () => {
    const date = new Date().toISOString();
    const montoFloat = parseFloat(monto);

    if (!para || !montoFloat || !detalle) {
      return alert("Todos los campos son obligatorios.");
    }

    const envio = {
      tipo: "sinpe enviado",
      para,
      monto: -montoFloat,
      fecha: date,
      detalle,
    };

    const recibido = {
      tipo: "sinpe recibido",
      de: user.telefono,
      monto: montoFloat,
      fecha: date,
      detalle,
    };

    // 🔹 Buscar emisor por teléfono
    const emisorQuery = query(
      collection(db, user.banco),
      where("telefono", "==", user.telefono)
    );
    const emisorSnapshot = await getDocs(emisorQuery);

    if (emisorSnapshot.empty) return alert("Emisor no encontrado");

    const emisorDoc = emisorSnapshot.docs[0];
    const emisorRef = emisorDoc.ref;
    const emisorData = emisorDoc.data();

    await updateDoc(emisorRef, {
      monto: (emisorData.monto || 0) - montoFloat,
      movimientos: [...(emisorData.movimientos || []), envio],
    });

    // 🔹 Buscar receptor por teléfono en todas las colecciones
    const bancos = ["clientesBAC", "clientesBCR", "clientesBN", "clientesBP"];
    let receptorRef = null;
    let receptorData = null;

    for (let banco of bancos) {
      const receptorQuery = query(
        collection(db, banco),
        where("telefono", "==", para)
      );
      const receptorSnapshot = await getDocs(receptorQuery);

      if (!receptorSnapshot.empty) {
        const receptorDoc = receptorSnapshot.docs[0];
        receptorRef = receptorDoc.ref;
        receptorData = receptorDoc.data();
        break;
      }
    }

    if (!receptorRef || !receptorData) return alert("Destino no encontrado");

    await updateDoc(receptorRef, {
      monto: (receptorData.monto || 0) + montoFloat,
      movimientos: [...(receptorData.movimientos || []), recibido],
    });

    alert("✅ SINPE realizado con éxito");
    setPara("");
    setMonto("");
    setDetalle("");
  };

  return (
    <div className="sinpe-container">
      <h2>Hacer SINPE</h2>
      <input
        placeholder="Teléfono destino"
        value={para}
        onChange={(e) => setPara(e.target.value)}
      />
      <input
        placeholder="Monto"
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <input
        placeholder="Detalle"
        value={detalle}
        onChange={(e) => setDetalle(e.target.value)}
      />
      <button onClick={hacerSinpe}>Enviar</button>
    </div>
  );
};

export default Sinpe;
