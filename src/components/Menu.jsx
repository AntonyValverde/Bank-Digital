import { useState } from "react";
import Estado from "./Estado";
import Sinpe from "./Sinpe";
import "./Menu.css";

const Menu = ({ user }) => {
  const [view, setView] = useState("");

  return (
    <div className="menu-container">
      <div className="menu-box">
        <h1>Bienvenido {user.telefono}</h1>
        <div className="menu-buttons">
          <button onClick={() => setView("estado")}>Ver Estado</button>
          <button onClick={() => setView("sinpe")}>Hacer SINPE</button>
          <button onClick={() => window.location.reload()}>Cerrar Sesión</button>
        </div>

        <div className="menu-content">
          {view === "estado" && <Estado user={user} />}
          {view === "sinpe" && <Sinpe user={user} />}
        </div>
      </div>
    </div>
  );
};

export default Menu;
