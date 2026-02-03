import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { DashboardView } from "@/app/components/DashboardView";
import { PortfolioView } from "@/app/components/PortfolioView";
import { NewsView } from "@/app/components/NewsView";
import { StockCard } from "@/app/components/StockCard";
import { StockDetail } from "@/app/components/StockDetail";
import { Chatbot } from "@/app/components/Chatbot";
import { ScenarioSelector } from "@/app/components/ScenarioSelector";
import { ScenarioControls } from "@/app/components/ScenarioControls";
import { INITIAL_BALANCE, MOCK_STOCKS, PortfolioItem, Stock } from "@/lib/mockData";
import { MOCK_NEWS } from "@/lib/newsData";
import { Scenario, buildPriceHistory, isSymbolInScenario } from "@/lib/historicalScenarios";
import { logTrade, clearTradeLog, getTradeLog, generateBehaviorSummary, TradeAction, BehaviorSummary } from "@/lib/behaviorTracker";
import { ScenarioSummary } from "@/app/components/ScenarioSummary";
import { toast, Toaster } from "sonner";
import { Search, History } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [stocks, setStocks] = useState<Stock[]>(MOCK_STOCKS);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [netWorthHistory, setNetWorthHistory] = useState<{ time: string; value: number }[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isScenarioSelectorOpen, setIsScenarioSelectorOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [scenarioDayIndex, setScenarioDayIndex] = useState(0);

  // Scenario summary modal state
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    scenario: Scenario;
    trades: TradeAction[];
    summary: BehaviorSummary;
    finalBalance: number;
  } | null>(null);

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Update stocks when scenario changes - uses accurate historical price data
  useEffect(() => {
    if (activeScenario) {
      const currentDay = activeScenario.days[scenarioDayIndex];

      setStocks(prevStocks =>
        prevStocks.map(stock => {
          // Check if this stock exists in the scenario
          if (!isSymbolInScenario(activeScenario, stock.symbol)) {
            // Stock not in this scenario - mark as unavailable
            return {
              ...stock,
              price: 0,
              change: 0,
              changePercent: 0,
              volume: 'N/A',
              history: []
            };
          }

          const price = currentDay.prices[stock.symbol];
          const change = currentDay.changes[stock.symbol];

          if (price !== undefined) {
            return {
              ...stock,
              price: price,
              change: change,
              changePercent: change,
              volume: 'Historical',
              history: buildPriceHistory(activeScenario, scenarioDayIndex, stock.symbol)
            };
          }
          return stock;
        })
      );
      setIsLive(false);
    }
  }, [activeScenario, scenarioDayIndex]);

  // Handle scenario selection
  const handleSelectScenario = (scenario: Scenario | null) => {
    // If exiting a scenario, show the summary first
    if (activeScenario && scenario === null) {
      const trades = getTradeLog(activeScenario.id);
      const summary = generateBehaviorSummary(activeScenario.id, activeScenario.behavior);
      setSummaryData({
        scenario: activeScenario,
        trades,
        summary,
        finalBalance: balance + portfolio.reduce((sum, item) => {
          const stock = stocks.find(s => s.symbol === item.symbol);
          return sum + (stock ? stock.price * item.shares : 0);
        }, 0)
      });
      setShowSummary(true);
      return; // Don't clear yet, wait for modal close
    }

    setActiveScenario(scenario);
    setScenarioDayIndex(0);
    if (scenario) {
      setBalance(scenario.startingBalance);
      setPortfolio([]);
      toast.success(`Started: ${scenario.name}`);
    }
  };

  // Handle closing the summary modal
  const handleCloseSummary = () => {
    setShowSummary(false);
    setSummaryData(null);
    setActiveScenario(null);
    setScenarioDayIndex(0);
    setBalance(INITIAL_BALANCE);
    setPortfolio([]);
    setStocks(MOCK_STOCKS);
    setIsLive(true);
    clearTradeLog();
    toast.success('Switched to Live Market');
  };

  // Real-time Stock Data Fetching via Finnhub API (only when not in scenario mode)
  useEffect(() => {
    if (activeScenario) return; // Skip live fetching in scenario mode

    const fetchStockPrices = async () => {
      const API_KEY = "d5vdv91r01qjj9jj6a20d5vdv91r01qjj9jj6a2g";
      const symbolMap: Record<string, string> = {
        "AAPL": "AAPL",
        "MSFT": "MSFT",
        "GOOGL": "GOOGL",
        "AMZN": "AMZN",
        "NVDA": "NVDA",
        "META": "META",
        "TSLA": "TSLA",
        "JPM": "JPM",
        "V": "V",
        "WMT": "WMT"
      };

      console.log("[Stock Fetch] Starting fetch at", new Date().toLocaleTimeString());

      // Fetch all data first
      const newPrices: Record<string, any> = {};
      let successCount = 0;
      let errorCount = 0;

      // Fetch stocks sequentially with delay to avoid rate limiting
      for (const symbol of Object.keys(symbolMap)) {
        const finnhubSymbol = symbolMap[symbol];
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${API_KEY}`,
            { cache: 'no-store' } // Prevent caching
          );

          if (response.status === 429) {
            console.warn(`[Stock Fetch] Rate limited on ${symbol}`);
            setIsLive(false);
            errorCount++;
            continue;
          }

          if (!response.ok) {
            console.error(`[Stock Fetch] HTTP error for ${symbol}: ${response.status}`);
            errorCount++;
            continue;
          }

          const data = await response.json();
          console.log(`[Stock Fetch] ${symbol}:`, data);

          if (data.c && data.c > 0) {
            newPrices[symbol] = data;
            successCount++;
          } else {
            console.warn(`[Stock Fetch] No valid price for ${symbol}`);
          }

          // Small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`[Stock Fetch] Error fetching ${symbol}:`, e);
          errorCount++;
        }
      }

      console.log(`[Stock Fetch] Complete: ${successCount} success, ${errorCount} errors`);

      // Update connection status
      setIsLive(successCount > 0);

      if (successCount > 0) {
        setLastUpdate(new Date());

        setStocks(prevStocks =>
          prevStocks.map(stock => {
            const data = newPrices[stock.symbol];
            if (data) {
              const newPrice = data.c;
              const change = data.d;
              const changePercent = data.dp;

              const newHistory = [...stock.history.slice(1), {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                value: newPrice
              }];

              return {
                ...stock,
                price: newPrice,
                change: change,
                changePercent: parseFloat(changePercent.toFixed(2)),
                history: newHistory
              };
            }
            return stock;
          })
        );
      }
    };

    fetchStockPrices(); // Initial fetch
    const interval = setInterval(fetchStockPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [activeScenario]); // Re-run effect when activeScenario changes to stop/start interval

  // Track Net Worth History
  useEffect(() => {
    const portfolioValue = portfolio.reduce((sum, item) => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      return sum + (stock ? stock.price * item.shares : 0);
    }, 0);

    const currentNetWorth = balance + portfolioValue;

    setNetWorthHistory(prev => {
      const newEntry = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: currentNetWorth
      };
      const newHistory = [...prev, newEntry];
      return newHistory.length > 20 ? newHistory.slice(newHistory.length - 20) : newHistory;
    });
  }, [stocks, balance, portfolio]); // Update when stocks update (every 3s)

  const handleBuy = (stock: Stock, shares: number) => {
    const cost = stock.price * shares;
    if (cost > balance) {
      toast.error("Insufficient funds");
      return;
    }

    setBalance(prev => prev - cost);
    setPortfolio(prev => {
      const existing = prev.find(p => p.symbol === stock.symbol);
      if (existing) {
        // Calculate new average cost
        const totalCost = (existing.shares * existing.avgCost) + cost;
        const totalShares = existing.shares + shares;
        return prev.map(p => p.symbol === stock.symbol
          ? { ...p, shares: totalShares, avgCost: totalCost / totalShares }
          : p
        );
      }
      return [...prev, { symbol: stock.symbol, shares, avgCost: stock.price }];
    });

    // Track behavior during scenario mode
    if (activeScenario) {
      logTrade(
        activeScenario.id,
        scenarioDayIndex,
        'buy',
        stock.symbol,
        shares,
        stock.price,
        stock.changePercent,
        portfolio,
        balance
      );
    }

    toast.success(`Bought ${shares} shares of ${stock.symbol}`);
  };

  const handleSell = (stock: Stock, shares: number) => {
    const existing = portfolio.find(p => p.symbol === stock.symbol);
    if (!existing || existing.shares < shares) {
      toast.error("Not enough shares to sell");
      return;
    }

    const revenue = stock.price * shares;
    setBalance(prev => prev + revenue);
    setPortfolio(prev => {
      if (existing.shares === shares) {
        return prev.filter(p => p.symbol !== stock.symbol);
      }
      return prev.map(p => p.symbol === stock.symbol
        ? { ...p, shares: p.shares - shares }
        : p
      );
    });

    // Track behavior during scenario mode
    if (activeScenario) {
      logTrade(
        activeScenario.id,
        scenarioDayIndex,
        'sell',
        stock.symbol,
        shares,
        stock.price,
        stock.changePercent,
        portfolio,
        balance
      );
    }

    toast.success(`Sold ${shares} shares of ${stock.symbol}`);
  };

  const currentNetWorth = balance + portfolio.reduce((sum, item) => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    return sum + (stock ? stock.price * item.shares : 0);
  }, 0);

  const renderContent = () => {
    if (selectedStock) {
      return (
        <StockDetail
          stock={stocks.find(s => s.symbol === selectedStock.symbol) || selectedStock}
          onBack={() => setSelectedStock(null)}
          onBuy={handleBuy}
          onSell={handleSell}
          currentHoldings={portfolio.find(p => p.symbol === selectedStock.symbol)?.shares || 0}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            balance={balance}
            portfolio={portfolio}
            stocks={stocks}
            netWorth={currentNetWorth}
            history={netWorthHistory.length > 0 ? netWorthHistory : stocks[0].history}
            onTabChange={setActiveTab}
          />
        );
      case 'market':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Market Overview</h1>
                {activeScenario ? (
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                      Simulation Active
                    </span>
                    <span className="text-gray-400 text-sm">
                      {activeScenario.icon} {activeScenario.name} — Day {scenarioDayIndex + 1} of {activeScenario.days.length}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-400 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                    {isLive ? 'Live Connection Active' : 'Connecting to Exchange...'}
                  </p>
                )}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search symbol..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Scenario date indicator */}
            {activeScenario && (
              <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeScenario.icon}</span>
                  <div>
                    <p className="text-white font-medium">{activeScenario.days[scenarioDayIndex].date}</p>
                    <p className="text-gray-400 text-sm">{activeScenario.period}</p>
                  </div>
                </div>
                <p className="text-purple-400 text-sm">Historical prices from this date</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map(stock => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={setSelectedStock}
                />
              ))}
            </div>
          </div>
        );
      case 'portfolio':
        return <PortfolioView portfolio={portfolio} stocks={stocks} />;
      case 'advisor':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in">
            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <path d="M12 22v-4" />
                <path d="M9 12a3 3 0 0 0-3 3v2h12v-2a3 3 0 0 0-3-3" />
                <path d="M12 8v4" />
                <circle cx="12" cy="12" r="10" className="opacity-20" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">AI Financial Advisor</h2>
            <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
              Our advanced AI market analyst is ready to assist you.
              <br />
              Click the chat bubble in the bottom right corner to start getting personalized investment advice, market analysis, and portfolio optimization tips.
            </p>
          </div>
        );
      case 'news':
        return <NewsView activeScenario={activeScenario} scenarioDayIndex={scenarioDayIndex} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'scenarios') {
            setIsScenarioSelectorOpen(true);
            return;
          }
          setActiveTab(tab);
          setSelectedStock(null);
          if (tab === 'advisor') {
            setIsChatbotOpen(true);
          }
        }}
        activeScenario={activeScenario}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scenario Controls Bar */}
        {activeScenario && (
          <ScenarioControls
            scenario={activeScenario}
            currentDayIndex={scenarioDayIndex}
            onDayChange={setScenarioDayIndex}
            onExit={() => handleSelectScenario(null)}
          />
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
          <header className="flex justify-between items-center mb-8 md:hidden">
            <div className="flex items-center gap-2 text-blue-500">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
              <span className="font-bold">QUANTUM</span>
            </div>
            <button
              onClick={() => setActiveTab(activeTab === 'dashboard' ? 'market' : 'dashboard')}
              className="p-2 bg-gray-900 rounded-lg"
            >
              Menu
            </button>
          </header>

          {renderContent()}
        </main>
      </div>

      <Chatbot
        stocks={stocks}
        portfolio={portfolio}
        balance={balance}
        netWorth={currentNetWorth}
        news={MOCK_NEWS}
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <ScenarioSelector
        isOpen={isScenarioSelectorOpen}
        onClose={() => setIsScenarioSelectorOpen(false)}
        onSelectScenario={handleSelectScenario}
        activeScenario={activeScenario}
      />

      {/* Scenario Summary Modal */}
      {summaryData && (
        <ScenarioSummary
          isOpen={showSummary}
          onClose={handleCloseSummary}
          scenario={summaryData.scenario}
          trades={summaryData.trades}
          summary={summaryData.summary}
          finalBalance={summaryData.finalBalance}
          startingBalance={summaryData.scenario.startingBalance}
        />
      )}

      <Toaster position="top-center" theme="dark" />
    </div>
  );
}