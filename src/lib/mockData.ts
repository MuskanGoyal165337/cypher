export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  history: { time: string; value: number }[];
}

export const INITIAL_BALANCE = 10000; // $10,000 USD

// Available symbols in Data folder: AAPL, AMZN, CSCO, GOOG, IBM, MSFT
export const MOCK_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 259.48,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$3.9T",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 259 + Math.random() * 5 }))
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 415.20,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$3.1T",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 415 + Math.random() * 8 }))
  },
  {
    symbol: "GOOG",
    name: "Alphabet Inc.",
    price: 192.50,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$2.4T",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 192 + Math.random() * 4 }))
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 225.80,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$2.3T",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 225 + Math.random() * 5 }))
  },
  {
    symbol: "IBM",
    name: "IBM Corporation",
    price: 145.00,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$130B",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 145 + Math.random() * 3 }))
  },
  {
    symbol: "CSCO",
    name: "Cisco Systems Inc.",
    price: 48.50,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$195B",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 48 + Math.random() * 2 }))
  }
];

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgCost: number;
}