const { STOCK_TICKERS } = require("../config/constants");
const store = require("../store/subscriptionStore");
const stockService = require("../services/stockService");

module.exports = (io, socket) => {
  socket.on("auth:login", email => {
    socket.data.email = email;
    socket.emit("stock:init", stockService.prices);
  });

  socket.on("stock:subscribe", ticker => {
    if (STOCK_TICKERS.includes(ticker)) {
      store.subscribe(ticker, socket.id);
    }
  });

  socket.on("disconnect", () => {
    store.unsubscribeAll(socket.id);
  });
};
