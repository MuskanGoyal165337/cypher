import { Stock } from "@/lib/mockData";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { toast } from "sonner";

interface StockDetailProps {
  stock: Stock;
  onBack: () => void;
  onBuy: (stock: Stock, shares: number) => void;
  onSell: (stock: Stock, shares: number) => void;
  currentHoldings: number;
  isMarketOpen?: boolean;
}

export function StockDetail({ stock, onBack, onBuy, onSell, currentHoldings, isMarketOpen = true }: StockDetailProps) {
  const [amount, setAmount] = useState<string>("");
  const isPositive = stock.change >= 0;

  const handleTrade = (type: 'buy' | 'sell') => {
    const shares = parseInt(amount);
    if (isNaN(shares) || shares <= 0) {
      toast.error("Please enter a valid number of shares");
      return;
    }

    if (type === 'buy') {
      onBuy(stock, shares);
    } else {
      if (shares > currentHoldings) {
        toast.error(`You only have ${currentHoldings} shares to sell`);
        return;
      }
      onSell(stock, shares);
    }
    setAmount("");
  };

  const gradientId = `colorValue-${stock.symbol}`;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white pl-0 gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Market
      </Button>

      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">{stock.symbol}</h1>
          <p className="text-xl text-gray-400">{stock.name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center justify-end gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span className="font-medium">{stock.changePercent.toFixed(3)}% today</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full bg-gray-900/50 rounded-2xl border border-gray-800 p-4">
        {stock.history && stock.history.length >= 2 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stock.history}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#22c55e" : "#ef4444"}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg">📊 Chart Loading...</p>
              <p className="text-sm mt-2">Price history will appear as data loads</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-white font-bold">{stock.marketCap}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Volume</p>
          <p className="text-white font-bold">
            {stock.volume === "Loading..." && !isMarketOpen ? "Market Closed" : stock.volume}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Your Holdings</p>
          <p className="text-white font-bold">{currentHoldings} Shares</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Total Value</p>
          <p className="text-white font-bold">${(currentHoldings * stock.price).toFixed(2)}</p>
        </div>
      </div>

      {/* Trading Actions */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <h3 className="text-white font-bold text-lg mb-4">Trade {stock.symbol}</h3>
        <div className="flex gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Number of shares"
            className="flex-1 bg-gray-800 border-gray-700 text-white rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Button
            className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
            onClick={() => handleTrade('buy')}
          >
            Buy
          </Button>
          <Button
            variant="destructive"
            className="min-w-[100px]"
            onClick={() => handleTrade('sell')}
            disabled={currentHoldings === 0}
          >
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
}