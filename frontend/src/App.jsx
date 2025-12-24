import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { socket } from "./socket";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogin(email) {
    socket.emit("login", email);
    setLoggedIn(true);
  }

  return loggedIn ? <Dashboard /> : <Login onLogin={handleLogin} />;
}
