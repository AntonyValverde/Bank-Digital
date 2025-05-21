import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import "./Login.css";

const Login = ({ setUser }) => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [banco, setBanco] = useState("clientesBP");

  // Solo para registro
  const [cuenta, setCuenta] = useState("");
  const [monto, setMonto] = useState("");

  const handleLogin = async () => {
    const colRef = collection(db, banco);
    const q = query(colRef, where("telefono", "==", telefono));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Usuario no encontrado");
      return;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    if (data.cedula === cedula && data.contrasena === contrasena) {
      setUser({ ...data, banco, telefono });
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleRegistro = async () => {
    if (!telefono || !cedula || !contrasena || !cuenta || !monto || !banco) {
      return alert("Todos los campos son obligatorios");
    }

    const colRef = collection(db, banco);
    const q = query(colRef, where("telefono", "==", telefono));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("⚠️ Ya existe un cliente con ese número");
      return;
    }

    const nuevoCliente = {
      telefono,
      cedula,
      contrasena,
      cuenta,
      monto: parseFloat(monto),
      banco: banco.replace("clientes", ""),
      movimientos: [],
      accion: "registro",
    };

    await setDoc(doc(db, banco, crypto.randomUUID()), nuevoCliente);

    alert("✅ Registro exitoso. Ya puedes iniciar sesión.");
    setModoRegistro(false);
    setTelefono("");
    setCedula("");
    setContrasena("");
    setCuenta("");
    setMonto("");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{modoRegistro ? "Registrar cliente" : "Iniciar sesión"}</h2>

        {/* Campos comunes */}
        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <input
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        {/* Solo para modo registro */}
        {modoRegistro && (
          <>
            <input
              placeholder="Número de cuenta"
              value={cuenta}
              onChange={(e) => setCuenta(e.target.value)}
            />
            <input
              placeholder="Monto inicial"
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </>
        )}

        <select value={banco} onChange={(e) => setBanco(e.target.value)}>
          <option value="clientesBAC">BAC</option>
          <option value="clientesBN">BN</option>
          <option value="clientesBP">BP</option>
          <option value="clientesBCR">BCR</option>
        </select>

        <button onClick={modoRegistro ? handleRegistro : handleLogin}>
          {modoRegistro ? "Registrar" : "Ingresar"}
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          {modoRegistro ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                style={{ background: "none", color: "#2a5298", border: "none", cursor: "pointer" }}
                onClick={() => setModoRegistro(false)}
              >
                Iniciar sesión
              </button>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{" "}
              <button
                style={{ background: "none", color: "#2a5298", border: "none", cursor: "pointer" }}
                onClick={() => setModoRegistro(true)}
              >
                Registrarse
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
