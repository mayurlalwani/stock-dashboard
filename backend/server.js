const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const stockService = require("./services/stockService");
const socketHandler = require("./socket/handlers");
const store = require("./store/subscriptionStore");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => socketHandler(io, socket));

stockService.start(io, store);

server.listen(4000, () =>
  console.log("Backend running on http://localhost:4000")
);
