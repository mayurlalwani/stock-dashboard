import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { socket } from "./socket";

function initializeLoggedIn() {
  return !!localStorage.getItem("userEmail");
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(initializeLoggedIn);

  // Only handle socket reconnection, no setState here
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      const reconnect = () => {
        socket.emit("auth:login", savedEmail);
      };

      if (socket.connected) {
        reconnect();
      } else {
        socket.once("connect", reconnect);
      }
    }
  }, []);

  function handleLogin(email) {
    localStorage.setItem("userEmail", email);
    socket.emit("auth:login", email);
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userSubscriptions");
    setLoggedIn(false);
    socket.disconnect();
  }

  return loggedIn ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
