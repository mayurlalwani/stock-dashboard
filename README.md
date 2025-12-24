# Stock Screener

A real-time stock price tracking application built with a modern, scalable architecture. Users can authenticate, subscribe to stock price updates, and receive live price changes via WebSocket connections.

## Table of Contents

- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Design Decisions](#design-decisions)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Features](#features)

---

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone/Navigate to the project:**
   ```bash
   cd stock-screener
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

#### Development Mode

1. **Start the backend server** (from project root):
   ```bash
   cd backend
   node server.js
   ```
   - Backend runs on `http://localhost:4000`

2. **In a new terminal, start the frontend development server** (from project root):
   ```bash
   cd frontend
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173` (Vite default)

#### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```
Output is in `frontend/dist/`

**Backend:**
No build step required; runs directly with Node.js.

---

## System Architecture

The application follows a **client-server architecture** with real-time bidirectional communication via WebSocket:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Login Component - User authentication              │   │
│  │ • Dashboard - Stock grid with subscription UI        │   │
│  │ • Hooks - useStockSubscriptions, useStocks          │   │
│  │ • Context - SocketContext for socket management     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    Socket.IO (Bidirectional)
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express + Socket.IO)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Express Server - HTTP server setup                │   │
│  │ • Socket Handlers - Event listeners & processors    │   │
│  │ • Stock Service - Price generation & distribution   │   │
│  │ • Subscription Store - In-memory subscription DB    │   │
│  │ • Config - Constants (tickers, intervals)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Login**: Client sends `auth:login` event → Server stores email in socket data
2. **Price Initialization**: Server emits `stock:init` with current prices
3. **Stock Subscription**: Client sends `stock:subscribe` → Server registers socket in SubscriptionStore
4. **Price Updates**: Stock Service generates new prices every 1000ms → Emits `stock:update` to subscribed clients
5. **Disconnection**: Server cleans up all subscriptions for disconnected socket

---

## Design Decisions

### 1. **WebSocket (Socket.IO) for Real-Time Updates**
- **Why**: HTTP polling would be inefficient for frequent price updates. Socket.IO provides:
  - Bidirectional communication
  - Automatic reconnection handling
  - Fallback to polling if WebSocket unavailable
  - Built-in room/namespace support

### 2. **In-Memory Subscription Store**
- **Why**: For this phase, an in-memory Map is sufficient because:
  - Simple and fast O(1) lookups
  - Perfect for prototype/MVP
  - No database latency
  - Can be easily swapped for persistent storage (Redis, PostgreSQL) later

### 3. **Centralized Stock Service**
- **Why**: Single source of truth for price generation:
  - Ensures all clients see consistent prices
  - Simplifies price update logic
  - Prevents duplicate generation
  - Easy to swap mock prices with real API calls

### 4. **Context API for Socket Management**
- **Why**: Provides clean socket access across React components:
  - Avoids prop drilling
  - Centralized connection management
  - Easy to mock for testing

### 5. **Separation of Concerns**
- **Backend Structure**:
  - `services/` - Business logic (stock prices)
  - `socket/` - WebSocket event handlers
  - `store/` - Data persistence layer
  - `config/` - Constants and configuration
  
- **Frontend Structure**:
  - `context/` - Global state (socket)
  - `hooks/` - Reusable logic
  - Components - UI presentation
  - `src/` - Application code

### 6. **Environment-Agnostic Architecture**
- Mock stock prices (easily replaceable with real API)
- CORS enabled for flexible deployment
- Configurable constants for easy tuning

---

## Project Structure

```
stock-screener/
├── backend/
│   ├── server.js                 # Express + Socket.IO setup
│   ├── stockEngine.js            # [Legacy] Price generation
│   ├── subscriptions.js          # [Legacy] Subscription logic
│   ├── stockService.js           # Service class for stock operations
│   ├── package.json
│   ├── config/
│   │   └── constants.js          # Tickers, update intervals
│   ├── services/
│   │   └── stockService.js       # Stock price logic
│   ├── socket/
│   │   └── handlers.js           # Socket event handlers
│   └── store/
│       └── subscriptionStore.js  # Subscription management
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Root component (login/dashboard)
│   │   ├── Login.jsx             # Login form component
│   │   ├── Dashboard.jsx         # Main stock grid display
│   │   ├── socket.js             # Socket instance
│   │   ├── App.css
│   │   ├── Login.css
│   │   └── Dashboard.css
│   ├── context/
│   │   └── SocketContext.js      # Socket context provider
│   ├── hooks/
│   │   └── useStockSubscriptions.jsx  # Subscription logic hook
│   └── public/
│
└── package.json                  # Root package (dependencies reference)
```

---

## Technologies

### Backend
- **Express** v5.2.1 - Web framework
- **Socket.IO** v4.8.3 - Real-time communication
- **Node.js** - Runtime

### Frontend
- **React** v19.2.0 - UI library
- **Vite** v7.2.4 - Build tool & dev server
- **Socket.IO Client** v4.8.3 - WebSocket client
- **ESLint** - Code quality

---

## Features

✅ **User Authentication** - Simple email-based login  
✅ **Real-Time Price Updates** - Live stock prices via WebSocket  
✅ **Selective Subscriptions** - Subscribe/unsubscribe to individual stocks  
✅ **Responsive UI** - Grid-based stock display  
✅ **Automatic Cleanup** - Unsubscribes on disconnect  
✅ **Scalable Architecture** - Ready for database integration & real APIs  

---

## Future Enhancements

- [ ] Persistent database (MongoDB/PostgreSQL) for subscriptions
- [ ] Real stock price API integration (Alpha Vantage, IEX Cloud)
- [ ] User authentication with JWT
- [ ] Price history & charting
- [ ] Alerts for price thresholds
- [ ] Portfolio tracking
- [ ] Redis pub/sub for horizontal scaling

---

## Troubleshooting

**Frontend can't connect to backend:**
- Verify backend is running on `http://localhost:4000`
- Check CORS settings in `backend/server.js`
- Ensure frontend connects to correct URL in `frontend/src/socket.js`

**Prices not updating:**
- Check browser console for WebSocket connection errors
- Verify `stockService` is running (`stockService.start()` in `server.js`)

**Port already in use:**
- Backend: Change port in `backend/server.js` (e.g., 4001)
- Frontend: Vite uses 5173 by default, can be customized in `frontend/vite.config.js`
