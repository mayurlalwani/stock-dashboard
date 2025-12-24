const TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

const prices = {};
TICKERS.forEach(t => prices[t] = randomPrice());

function randomPrice() {
  return +(Math.random() * 1000 + 100).toFixed(2);
}

function startStockEngine(io, subscriptions) {
  setInterval(() => {
    TICKERS.forEach(ticker => {
      prices[ticker] = randomPrice();

      subscriptions[ticker]?.forEach(socketId => {
        io.to(socketId).emit("priceUpdate", {
          ticker,
          price: prices[ticker]
        });
      });
    });
  }, 1000);
}

module.exports = { startStockEngine, prices, TICKERS };
