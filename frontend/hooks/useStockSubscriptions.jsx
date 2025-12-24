import { useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

export function useStockSubscriptions() {
  const socket = useSocket();
  const [subscribed, setSubscribed] = useState(new Set());

  const subscribe = useCallback((ticker) => {
    setSubscribed(prev => {
      if (prev.has(ticker)) return prev;

      const next = new Set(prev);
      next.add(ticker);
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
