class SubscriptionStore {
  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(ticker, socketId) {
    if (!this.subscriptions.has(ticker)) {
      this.subscriptions.set(ticker, new Set());
    }
    this.subscriptions.get(ticker).add(socketId);
  }

  unsubscribeAll(socketId) {
    for (const set of this.subscriptions.values()) {
      set.delete(socketId);
    }
  }

  getSubscribers(ticker) {
    return this.subscriptions.get(ticker) || new Set();
  }
}

module.exports = new SubscriptionStore();
