import { useEffect, useState } from "react";
import { socket } from "./socket";
import "./Dashboard.css";

const TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

export default function Dashboard() {
  const [prices, setPrices] = useState({});
  const [subscribedTickers, setSubscribedTickers] = useState(new Set());

  useEffect(() => {
    socket.on("initPrices", setPrices);
    socket.on("priceUpdate", ({ ticker, price }) => {
      setPrices(p => ({ ...p, [ticker]: price }));
    });

    return () => {
      socket.off("priceUpdate");
    };
  }, []);

  const handleSubscribe = (ticker) => {
    socket.emit("subscribe", ticker);
    setSubscribedTickers(prev => new Set([...prev, ticker]));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📈 Stock Screener</h1>
        <p className="subtitle">Real-time stock price tracking</p>
      </div>

      <div className="stocks-grid">
        {TICKERS.map(ticker => (
          <div key={ticker} className="stock-card">
            <div className="ticker-name">{ticker}</div>
            <div className="price-display">
              ₹ <span className="price-value">{prices[ticker] ?? "--"}</span>
            </div>
            <button 
              className={`subscribe-btn ${subscribedTickers.has(ticker) ? 'subscribed' : ''}`}
              onClick={() => handleSubscribe(ticker)}
              disabled={subscribedTickers.has(ticker)}
            >
              {subscribedTickers.has(ticker) ? '✓ Subscribed' : '+ Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
