import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export function useStocks() {
  const socket = useSocket();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    // Handle initial prices when connected
    socket.on("stock:init", (initialPrices) => {
      setPrices(initialPrices);
    });

    // Handle price updates
    socket.on("stock:update", ({ ticker, price }) => {
      setPrices(prev => ({
        ...prev,
        [ticker]: price
      }));
    });

    return () => {
      socket.off("stock:init");
      socket.off("stock:update");
    };
  }, [socket]);

  return { prices };
}
