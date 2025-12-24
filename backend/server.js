const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { startStockEngine, TICKERS, prices } = require("./stockEngine");
const { subscriptions, subscribe, unsubscribe } = require("./subscriptions");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("login", email => {
    socket.email = email;
    socket.emit("initPrices", prices);
  });

  socket.on("subscribe", ticker => {
    if (TICKERS.includes(ticker)) {
      subscribe(socket.id, ticker);
    }
  });

  socket.on("disconnect", () => {
    unsubscribe(socket.id);
  });
});

startStockEngine(io, subscriptions);

server.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
