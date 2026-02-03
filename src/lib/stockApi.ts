const API_KEY = "d5uvjdhr01qtqguiuv70d5uvjdhr01qtqguiuv7g";
const BASE_URL = "https://www.alphavantage.co/query";

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  latestTradingDay: string;
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data["Global Quote"] && data["Global Quote"]["01. symbol"]) {
      const quote = data["Global Quote"];
      return {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
        volume: formatVolume(quote["06. volume"]),
        latestTradingDay: quote["07. latest trading day"],
      };
    } else {
      console.warn(`API error for ${symbol}:`, data);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

function formatVolume(volume: string): string {
  const v = parseInt(volume);
  if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(1) + "K";
  return volume;
}
