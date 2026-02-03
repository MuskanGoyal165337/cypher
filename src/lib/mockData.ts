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

export const INITIAL_BALANCE = 100000; // ₹100,000 INR

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
    symbol: "GOOGL",
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
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 118.50,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$2.9T",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 118 + Math.random() * 3 }))
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 585.30,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$1.5T",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 585 + Math.random() * 10 }))
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.50,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$791B",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 248 + Math.random() * 8 }))
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 242.80,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$698B",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 242 + Math.random() * 5 }))
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 315.40,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$595B",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 315 + Math.random() * 6 }))
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 92.50,
    change: 0,
    changePercent: 0,
    volume: "Loading...",
    marketCap: "$745B",
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i + 9}:00`, value: 92 + Math.random() * 2 }))
  }
];

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgCost: number;
}