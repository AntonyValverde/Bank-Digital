// src/components/Login.jsx
import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import './Login.css';

const Login = ({ setUser }) => {
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [banco, setBanco] = useState("clientesBP");

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

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <input placeholder="Teléfono" onChange={e => setTelefono(e.target.value)} />
        <input placeholder="Cédula" onChange={e => setCedula(e.target.value)} />
        <input placeholder="Contraseña" type="password" onChange={e => setContrasena(e.target.value)} />
        <select onChange={e => setBanco(e.target.value)}>
          <option value="clientesBAC">BAC</option>
          <option value="clientesBN">BN</option>
          <option value="clientesBP">BP</option>
          <option value="clientesBCR">BCR</option>
        </select>
        <button onClick={handleLogin}>Ingresar</button>
      </div>
    </div>
  );


};

export default Login;
