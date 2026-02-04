# QUANTUM - AI-Powered Stock Trading Simulator

<div align="center">

![Quantum Logo](https://img.shields.io/badge/QUANTUM-Trading%20Simulator-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTMgM3YxOGgxOCIvPjxwYXRoIGQ9Im0xOSA5LTUgNS00LTQtMyAzIi8+PC9zdmc+)

**An educational stock trading simulator with historical market scenarios, AI-powered advisor, and behavioral analysis**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-✓-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 Overview

Quantum is a **stock trading simulator** designed for educational purposes. It allows users to practice trading in a risk-free environment using both **live market data** and **historical crisis simulations**. The platform tracks trading behaviors and provides AI-powered feedback to help users learn from common psychological mistakes in trading.

### 🎯 Key Features

- **Live Market Data** - Real-time stock prices via Finnhub API
- **Historical Scenarios** - Simulate trading during major market events
- **Behavior Tracking** - Detect emotional trading patterns (panic selling, FOMO buying)
- **AI Financial Advisor** - Powered by Llama 3.2 LLM via HuggingFace
- **Portfolio Management** - Buy/sell stocks, track P&L, view net worth
- **Post-Scenario Analysis** - Detailed summary with learning insights

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vite + React)                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Dashboard  │  │   Market    │  │  Portfolio  │              │
│  │    View     │  │    View     │  │    View     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │               │               │                        │
│  ┌──────────────────────────────────────────────────┐           │
│  │               App.tsx (State Management)          │           │
│  │  - balance, portfolio, stocks, netWorthHistory   │           │
│  │  - activeScenario, scenarioDayIndex              │           │
│  └──────────────────────────────────────────────────┘           │
│         │               │               │                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Scenario   │  │  Behavior   │  │   Chatbot   │              │
│  │   Engine    │  │   Tracker   │  │    (AI)     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
          │                                  │
          ▼                                  ▼
┌─────────────────────┐          ┌─────────────────────┐
│  Finnhub API        │          │  Express Backend    │
│  (Live Stock Data)  │          │  (LLM Proxy)        │
└─────────────────────┘          └─────────────────────┘
                                           │
                                           ▼
                                 ┌─────────────────────┐
                                 │  HuggingFace API    │
                                 │  (Llama 3.2-3B)     │
                                 └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks-based state management |
| **Vite** | Fast development server and build tool |
| **TailwindCSS 4** | Utility-first CSS framework |
| **Radix UI** | Accessible component primitives |
| **MUI** | Material Design components |
| **Recharts** | Stock price charts and graphs |
| **Framer Motion** | Animations and transitions |
| **Sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | API server for LLM proxy |
| **Finnhub API** | Real-time stock quotes |
| **HuggingFace Inference API** | AI chatbot (Llama 3.2-3B-Instruct) |

---

## 📂 Project Structure

```
cypher/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main application component
│   │   └── components/
│   │       ├── Chatbot.tsx      # AI financial advisor chatbot
│   │       ├── DashboardView.tsx # Main dashboard
│   │       ├── PortfolioView.tsx # Portfolio management
│   │       ├── NewsView.tsx     # Market news feed
│   │       ├── StockCard.tsx    # Individual stock cards
│   │       ├── StockDetail.tsx  # Stock detail with buy/sell
│   │       ├── Sidebar.tsx      # Navigation sidebar
│   │       ├── ScenarioSelector.tsx  # Historical scenario picker
│   │       ├── ScenarioControls.tsx  # Day navigation controls
│   │       ├── ScenarioSummary.tsx   # Post-scenario analysis modal
│   │       └── ui/              # Reusable UI components
│   ├── lib/
│   │   ├── behaviorTracker.ts   # Trading behavior analysis
│   │   ├── historicalScenarios.ts # Historical market data
│   │   ├── mockData.ts          # Stock & portfolio types
│   │   ├── newsData.ts          # Market news data
│   │   └── stockApi.ts          # API utilities
│   └── styles/                  # Global CSS files
├── server/
│   ├── index.js                 # Express server for AI chatbot
│   ├── .env                     # API keys (HuggingFace)
│   └── .env.example             # Environment template
└── package.json
```

---

## 🎮 Core Logic

### 1. State Management (`App.tsx`)

The main `App.tsx` component manages all application state using React hooks:

```typescript
// Core state variables
const [balance, setBalance] = useState(INITIAL_BALANCE);     // Cash balance ($100,000)
const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);  // Holdings
const [stocks, setStocks] = useState<Stock[]>(MOCK_STOCKS);       // Stock data
const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
const [scenarioDayIndex, setScenarioDayIndex] = useState(0);      // Current day in scenario
```

### 2. Trading System

**Buy Logic:**
1. Validate sufficient balance
2. Deduct cost from balance
3. Calculate new average cost if adding to existing position
4. Log trade to behavior tracker (during scenarios)

**Sell Logic:**
1. Validate sufficient shares owned
2. Add revenue to balance
3. Remove or reduce position
4. Log trade to behavior tracker (during scenarios)

### 3. Historical Scenarios (`historicalScenarios.ts`)

The app includes 4 historically accurate market scenarios:

| Scenario | Period | Stocks | Key Lesson |
|----------|--------|--------|------------|
| 🦠 **COVID-19 Crash** | Feb-May 2020 | 6 stocks | Patience beats panic |
| 🏦 **2008 Financial Crisis** | Sep-Dec 2008 | 5 stocks | Diversification matters |
| 💻 **Dot-com Bubble** | Mar-Oct 2000 | 4 stocks | Valuations matter |
| 🚀 **2021 Bull Run** | Jan-Nov 2021 | 6 stocks | Take profits regularly |

Each scenario includes:
- **Multi-day progression** with accurate historical prices
- **Behavioral metadata** (volatility, stress level, expected mistakes)
- **Daily news headlines** reflecting market sentiment
- **Learning objectives** for educational value

### 4. Behavior Tracking (`behaviorTracker.ts`)

The system detects these behavioral patterns in real-time:

| Behavior | Detection Logic | Type |
|----------|-----------------|------|
| **Panic Selling** | Selling when market down >5% | ❌ Negative |
| **FOMO Buying** | Buying after >5% rally | ❌ Negative |
| **Overtrading** | >3 trades in 60 seconds | ❌ Negative |
| **Overconcentration** | >50% portfolio in one stock | ❌ Negative |
| **Poor Timing** | Selling at a loss during downtrend | ❌ Negative |
| **Good Timing** | Buying during >3% dip | ✅ Positive |
| **Profit Taking** | Selling at >10% profit | ✅ Positive |
| **Diversified** | No single stock >40% | ✅ Positive |

### 5. AI Financial Advisor (`Chatbot.tsx` + `server/index.js`)

**Architecture:**
1. Frontend builds market context (prices, portfolio, news)
2. Express backend proxies request to HuggingFace
3. Llama 3.2-3B-Instruct generates response
4. Response returned to user

**Fallback System:**
If the LLM is unavailable, intelligent rule-based responses handle:
- Stock-specific queries
- Portfolio summaries
- Balance inquiries
- Market overviews
- News updates

### 6. Live Market Data

When not in scenario mode, the app fetches real-time data from Finnhub:
- Updates every 30 seconds
- Tracks 10 major US stocks (AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, JPM, V, WMT)
- Handles rate limiting gracefully

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- HuggingFace API key (for AI chatbot)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cypher

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Configuration

1. **Configure the AI Backend:**
   ```bash
   cd server
   cp .env.example .env
   ```
   
2. **Add your HuggingFace API key to `server/.env`:**
   ```
   HF_API_KEY=hf_your_api_key_here
   PORT=3001
   ```

3. **Get your API key from:** https://huggingface.co/settings/tokens

### Running the Application

```bash
# Terminal 1: Start the backend server
cd server
node index.js

# Terminal 2: Start the frontend
cd ..
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🎓 Educational Features

### Learning Objectives

1. **Emotional Control** - Recognize and avoid panic selling during crashes
2. **FOMO Awareness** - Understand the dangers of chasing rallies
3. **Diversification** - Learn the importance of spreading risk
4. **Timing** - Practice buying dips and taking profits
5. **Historical Context** - Experience how past crises unfolded

### Post-Scenario Analysis

After completing a scenario, users receive:
- **Trade History** - All buy/sell actions with behavioral tags
- **Behavior Summary** - Dominant patterns and risk score
- **Learning Score** - How well they avoided expected mistakes
- **P&L Analysis** - Final balance vs starting balance

---

## 📊 Data Flow

```
User Action (Buy/Sell)
        │
        ▼
┌───────────────────┐
│    handleBuy()    │ ──► Balance update
│    handleSell()   │ ──► Portfolio update
└───────────────────┘
        │
        ▼ (if in scenario mode)
┌───────────────────┐
│   logTrade()      │ ──► Behavior analysis
│   (behaviorTracker) │ ──► Tag assignment
└───────────────────┘
        │
        ▼ (on scenario exit)
┌───────────────────┐
│ generateBehavior  │ ──► Risk score
│    Summary()      │ ──► Learning score
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ ScenarioSummary   │ ──► Modal display
│    Component      │ ──► User feedback
└───────────────────┘
```

---

## 🔧 API Reference

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat` | AI chatbot endpoint |

**POST `/api/chat` Request:**
```json
{
  "context": "Current Market Data: ...",
  "question": "What should I do with AAPL?"
}
```

**Response:**
```json
{
  "response": "Based on current market conditions..."
}
```

---

## 📝 License

This project is for educational purposes. See `ATTRIBUTIONS.md` for third-party licenses.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

<div align="center">

**Built for learning. Trade responsibly.** 📈

</div>
