import { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

function initializeSubscriptions() {
  const savedSubscriptions = localStorage.getItem("userSubscriptions");
  if (savedSubscriptions) {
    return new Set(JSON.parse(savedSubscriptions));
  }
  return new Set();
}

export function useStockSubscriptions() {
  const socket = useSocket();
  const [subscribed, setSubscribed] = useState(initializeSubscriptions);

  // Reconnect to subscriptions when socket connects
  useEffect(() => {
    if (subscribed.size > 0) {
      const reconnect = () => {
        subscribed.forEach(ticker => {
          socket.emit("stock:subscribe", ticker);
        });
      };

      if (socket.connected) {
        reconnect();
      } else {
        socket.once("connect", reconnect);
      }
    }
  }, [socket, subscribed]);

  const subscribe = useCallback((ticker) => {
    setSubscribed(prev => {
      if (prev.has(ticker)) return prev;

      const next = new Set(prev);
      next.add(ticker);
      
      // Persist to localStorage
      localStorage.setItem("userSubscriptions", JSON.stringify(Array.from(next)));
      
      socket.emit("stock:subscribe", ticker);
      return next;
    });
  }, [socket]);

  return {
    subscribed,
    subscribe,
    isSubscribed: (ticker) => subscribed.has(ticker)
  };
}
