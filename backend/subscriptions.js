const subscriptions = {};

function subscribe(socketId, ticker) {
  if (!subscriptions[ticker]) subscriptions[ticker] = new Set();
  subscriptions[ticker].add(socketId);
}

function unsubscribe(socketId) {
  Object.values(subscriptions).forEach(set => set.delete(socketId));
}

module.exports = { subscriptions, subscribe, unsubscribe };
