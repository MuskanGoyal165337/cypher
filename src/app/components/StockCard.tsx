import { Stock } from "@/lib/mockData";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface StockCardProps {
  stock: Stock;
  onClick: (stock: Stock) => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(stock)}
      className="bg-gray-900 border border-gray-800 p-4 rounded-xl cursor-pointer hover:border-gray-700 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-bold text-lg">{stock.symbol}</h3>
          <p className="text-gray-400 text-xs truncate">{stock.name}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(stock.changePercent).toFixed(5)}%
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-4">
        <span className="text-2xl font-bold text-white">₹{stock.price.toFixed(2)}</span>
        <TrendingUp className={`w-12 h-6 ${isPositive ? 'text-green-500/20' : 'text-red-500/20'}`} />
      </div>
    </motion.div>
  );
}