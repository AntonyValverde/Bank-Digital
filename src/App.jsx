// src/App.jsx
import { useState } from "react";
import Login from "./components/Login";
import Menu from "./components/Menu";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? <Login setUser={setUser} /> : <Menu user={user} />}
    </div>
  );
}

export default App;
