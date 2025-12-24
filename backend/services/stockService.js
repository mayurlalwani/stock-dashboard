const { STOCK_TICKERS, UPDATE_INTERVAL_MS } = require("../config/constants");

class StockService {
  constructor() {
    this.prices = {};
    STOCK_TICKERS.forEach(t => this.prices[t] = this.randomPrice());
  }

  randomPrice() {
    return +(Math.random() * 1000 + 100).toFixed(2);
  }

  start(io, store) {
    setInterval(() => {
      STOCK_TICKERS.forEach(ticker => {
        const price = this.randomPrice();
        this.prices[ticker] = price;

        store.getSubscribers(ticker).forEach(socketId => {
          io.to(socketId).emit("stock:update", { ticker, price });
        });
      });
    }, UPDATE_INTERVAL_MS);
  }
}

module.exports = new StockService();
