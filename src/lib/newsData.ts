export interface NewsArticle {
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
  summary: string;
  ticker?: string;
}

// Mock news data simulating financial news feed
export const MOCK_NEWS: NewsArticle[] = [
  {
    title: "Reliance Industries Reports Strong Q4 Earnings, Stock Surges",
    source: "Economic Times",
    date: "2 hours ago",
    sentiment: "positive",
    url: "#",
    summary: "Reliance Industries reported better-than-expected quarterly earnings, driven by robust performance in retail and telecom divisions.",
    ticker: "RELIANCE"
  },
  {
    title: "TCS Wins Major Digital Transformation Deal from Global Bank",
    source: "Business Standard",
    date: "4 hours ago",
    sentiment: "positive",
    url: "#",
    summary: "Tata Consultancy Services secured a multi-year contract worth over $500 million, strengthening its position in BFSI sector.",
    ticker: "TCS"
  },
  {
    title: "Infosys Faces Margin Pressure Amid Rising Operational Costs",
    source: "Moneycontrol",
    date: "6 hours ago",
    sentiment: "negative",
    url: "#",
    summary: "Infosys reported declining margins in latest quarter as employee costs and attrition rates remain elevated.",
    ticker: "INFY"
  },
  {
    title: "HDFC Bank Announces Strategic Branch Expansion in Tier-2 Cities",
    source: "Mint",
    date: "8 hours ago",
    sentiment: "positive",
    url: "#",
    summary: "HDFC Bank plans to open 500 new branches across tier-2 and tier-3 cities, aiming to capture growing retail banking opportunity.",
    ticker: "HDFCBANK"
  },
  {
    title: "RBI Expected to Maintain Rates, Focus on Inflation Management",
    source: "The Hindu BusinessLine",
    date: "10 hours ago",
    sentiment: "neutral",
    url: "#",
    summary: "Reserve Bank of India likely to keep repo rates unchanged in upcoming policy meeting, economists predict cautious stance.",
    ticker: undefined
  },
  {
    title: "ICICI Bank Digital Banking Platform Crosses 10 Million Users",
    source: "Financial Express",
    date: "12 hours ago",
    sentiment: "positive",
    url: "#",
    summary: "ICICI Bank's digital banking initiatives show strong traction with significant growth in mobile and internet banking users.",
    ticker: "ICICIBANK"
  },
  {
    title: "IT Sector Faces Headwinds as US Economic Concerns Mount",
    source: "CNBC-TV18",
    date: "14 hours ago",
    sentiment: "neutral",
    url: "#",
    summary: "Indian IT companies may see slower growth as major clients in US review technology spending amid economic uncertainty.",
    ticker: undefined
  },
  {
    title: "Reliance Retail Expands Footprint with 200 New Stores",
    source: "Times of India",
    date: "1 day ago",
    sentiment: "positive",
    url: "#",
    summary: "Reliance Retail announces aggressive expansion strategy, planning to open stores across multiple formats in key metros.",
    ticker: "RELIANCE"
  },
  {
    title: "Banking Stocks Rally on Improved Credit Growth Numbers",
    source: "BloombergQuint",
    date: "1 day ago",
    sentiment: "positive",
    url: "#",
    summary: "Banking sector stocks see strong gains as latest RBI data shows robust credit growth and declining NPAs.",
    ticker: undefined
  },
  {
    title: "Nifty 50 Hits New All-Time High on Strong FII Inflows",
    source: "Zee Business",
    date: "1 day ago",
    sentiment: "positive",
    url: "#",
    summary: "Indian benchmark index reaches record levels backed by sustained foreign institutional investor buying across sectors.",
    ticker: undefined
  }
];

export function getNewsByTicker(ticker: string): NewsArticle[] {
  return MOCK_NEWS.filter(article => article.ticker === ticker);
}

export function getAllNews(): NewsArticle[] {
  return MOCK_NEWS;
}