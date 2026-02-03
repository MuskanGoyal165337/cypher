import { PortfolioItem, Stock } from "@/lib/mockData";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface PortfolioViewProps {
  portfolio: PortfolioItem[];
  stocks: Stock[];
}

export function PortfolioView({ portfolio, stocks }: PortfolioViewProps) {
  const totalValue = portfolio.reduce((sum, item) => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    return sum + (stock ? stock.price * item.shares : 0);
  }, 0);

  const totalCost = portfolio.reduce((sum, item) => sum + (item.shares * item.avgCost), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-gray-400">Manage your investments and track performance</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-2xl text-right">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Asset Value</div>
          <div className="text-2xl font-bold text-white">₹{totalValue.toFixed(2)}</div>
          <div className={`text-sm ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalGain >= 0 ? '+' : ''}₹{totalGain.toFixed(2)} ({totalGainPercent.toFixed(5)}%)
          </div>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800 border-dashed">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your portfolio is empty</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            You haven't purchased any stocks yet. Visit the Market page to start building your wealth.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="p-4 text-gray-400 font-medium text-sm">Symbol</th>
                <th className="p-4 text-gray-400 font-medium text-sm text-right">Shares</th>
                <th className="p-4 text-gray-400 font-medium text-sm text-right">Avg Cost</th>
                <th className="p-4 text-gray-400 font-medium text-sm text-right">Current Price</th>
                <th className="p-4 text-gray-400 font-medium text-sm text-right">Market Value</th>
                <th className="p-4 text-gray-400 font-medium text-sm text-right">Return</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => {
                const stock = stocks.find(s => s.symbol === item.symbol);
                if (!stock) return null;
                const value = item.shares * stock.price;
                const gain = value - (item.shares * item.avgCost);
                const gainPercent = (gain / (item.shares * item.avgCost)) * 100;
                const isPositive = gain >= 0;

                return (
                  <tr key={item.symbol} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{item.symbol}</div>
                      <div className="text-xs text-gray-500">{stock.name}</div>
                    </td>
                    <td className="p-4 text-right text-gray-300">{item.shares}</td>
                    <td className="p-4 text-right text-gray-300">₹{item.avgCost.toFixed(2)}</td>
                    <td className="p-4 text-right text-gray-300">₹{stock.price.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium text-white">₹{value.toFixed(2)}</td>
                    <td className={`p-4 text-right font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {isPositive ? '+' : ''}₹{gain.toFixed(2)}
                      </div>
                      <div className="text-xs opacity-80">{gainPercent.toFixed(5)}%</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}