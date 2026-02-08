import { PortfolioItem, Stock } from "@/lib/mockData";
import { ArrowUpRight, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DashboardViewProps {
  balance: number;
  portfolio: PortfolioItem[];
  stocks: Stock[];
  netWorth: number;
  history: { time: string; value: number }[];
  onTabChange?: (tab: string) => void;
}

export function DashboardView({ balance, portfolio, stocks, netWorth, history, onTabChange }: DashboardViewProps) {
  // Calculate total profit/loss
  const startValue = 100000; // Changed to INR
  const totalChange = netWorth - startValue;
  const percentChange = (totalChange / startValue) * 100;
  const isPositive = totalChange >= 0;

  // Calculate market sentiment based on average stock performance
  const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;
  const marketSentiment = avgChange >= 0 ? 'Bullish' : 'Bearish';
  const sentimentPercentage = Math.min(100, Math.abs(avgChange) * 20 + 50); // Scale to 0-100%

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Net Worth Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-blue-900/50 to-gray-900 border border-blue-800/30 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="relative z-10">
            <h2 className="text-blue-200 font-medium mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Total Net Worth
            </h2>
            <div className="text-5xl font-bold text-white mb-4">
              ₹{netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
              {isPositive ? '+' : ''}₹{totalChange.toFixed(2)} ({percentChange.toFixed(3)}%)
            </div>
          </div>

          <div className="mt-8 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNetWorth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
            <h3 className="text-gray-400 text-sm mb-1">Buying Power</h3>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex flex-col justify-center relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwc3RvY2slMjBtYXJrZXQlMjBjaGFydCUyMGFic3RyYWN0fGVufDF8fHx8MTc2OTg1ODU1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Market Trend"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="relative z-10">
              <h3 className="text-gray-400 text-sm mb-2">Market Sentiment</h3>
              <div className={`text-xl font-bold mb-1 ${marketSentiment === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
                {marketSentiment}
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${marketSentiment === 'Bullish' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${sentimentPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">Top Movers</h3>
            <button
              onClick={() => onTabChange?.('market')}
              className="text-blue-500 text-sm hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {stocks.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 3).map(stock => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-xl transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stock.change >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">₹{stock.price.toFixed(2)}</div>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(3)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">Your Portfolio</h3>
            <button
              onClick={() => onTabChange?.('portfolio')}
              className="text-blue-500 text-sm hover:underline"
            >
              View All
            </button>
          </div>
          {portfolio.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <p>No stocks owned yet.</p>
              <p className="text-sm">Start trading to build your wealth!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.slice(0, 3).map(item => {
                const stock = stocks.find(s => s.symbol === item.symbol);
                if (!stock) return null;
                const value = item.shares * stock.price;
                const gain = value - (item.shares * item.avgCost);
                const gainPercent = (gain / (item.shares * item.avgCost)) * 100;

                return (
                  <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-xl transition-colors">
                    <div>
                      <div className="text-white font-bold">{item.symbol}</div>
                      <div className="text-xs text-gray-500">{item.shares} shares</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">₹{value.toFixed(2)}</div>
                      <div className={`text-sm ${gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {gain >= 0 ? '+' : ''}{gainPercent.toFixed(5)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}