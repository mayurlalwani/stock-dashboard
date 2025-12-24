import { useStocks } from "../hooks/useStocks";
import { useStockSubscriptions } from "../hooks/useStockSubscriptions";
import "./Dashboard.css";

const TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

export default function Dashboard() {
  const { prices } = useStocks();
  const { subscribe, isSubscribed } = useStockSubscriptions();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📈 Stock Screener</h1>
        <p className="subtitle">Real-time stock price tracking</p>
      </div>

      <div className="stocks-grid">
        {TICKERS.map((ticker) => (
          <div key={ticker} className="stock-card">
            <div className="ticker-name">{ticker}</div>
            <div className="price-display">
              ₹ <span className="price-value">{prices[ticker] ?? "--"}</span>
            </div>
            <button
              className={`subscribe-btn ${isSubscribed(ticker) ? "subscribed" : ""}`}
              onClick={() => subscribe(ticker)}
              disabled={isSubscribed(ticker)}
            >
              {isSubscribed(ticker) ? "✓ Subscribed" : "+ Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
