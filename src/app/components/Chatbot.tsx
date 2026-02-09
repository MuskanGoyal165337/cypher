import { Button } from "@/app/components/ui/button";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Stock, PortfolioItem } from "@/lib/mockData";

import { NewsArticle } from "@/lib/newsData";
import { API_BASE } from "@/lib/api";

/**
 * AI-Powered Financial Chatbot using Hugging Face Flan-UL2 Model
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your Hugging Face API key from: https://huggingface.co/settings/tokens
 * 2. Replace "hf_YOUR_API_KEY_HERE" in the callHuggingFaceAPI function below
 * 3. The chatbot will automatically use real-time stock data, portfolio info, and news
 * 
 * If API fails or key is not set, fallback responses will be used.
 */

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotProps {
  stocks: Stock[];
  portfolio: PortfolioItem[];
  balance: number;
  netWorth: number;
  news: NewsArticle[];
  isOpen: boolean;
  onToggle: () => void;
}

export function Chatbot({ stocks, portfolio, balance, netWorth, news, isOpen, onToggle }: ChatbotProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm FinBot, your AI Financial Advisor with real-time market access. I can analyze your portfolio, discuss stocks, review recent news, and provide personalized investment strategies. What would you like to know?", sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    // Generate AI response using Hugging Face API
    setTimeout(async () => {
      const botResponse = await generateAIResponse(userInput, stocks, portfolio, balance, netWorth, news);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">FinBot AI</h3>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-bl-none border border-gray-700 p-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs text-gray-400">AI is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for financial advice..."
                className="flex-1 bg-gray-900 border-gray-700 text-white rounded-lg px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <Button size="icon" className="bg-blue-600 hover:bg-blue-700" onClick={handleSend}>
                {isLoading ? <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-white z-50 hover:bg-blue-500 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </>
  );
}

async function generateAIResponse(input: string, stocks: Stock[], portfolio: PortfolioItem[], balance: number, netWorth: number, news: NewsArticle[]): Promise<string> {
  try {
    // Build market context for the AI
    const context = buildMarketContext(stocks, portfolio, balance, netWorth, news);

    // Call the Express backend server
    // Call the Express backend server
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: context,
        question: input
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API error:', errorData);

      // If model is loading, show a helpful message
      if (response.status === 503) {
        return "🔄 The AI model is warming up. Please try again in a few seconds!";
      }

      throw new Error(errorData.message || 'API request failed');
    }

    const data = await response.json();
    return data.response || getIntelligentResponse(input, stocks, portfolio, balance, netWorth, news);

  } catch (error) {
    console.error('AI Response Error:', error);
    // Fallback to rule-based responses if backend is unavailable
    return getIntelligentResponse(input, stocks, portfolio, balance, netWorth, news);
  }
}

function buildMarketContext(stocks: Stock[], portfolio: PortfolioItem[], balance: number, netWorth: number, news: NewsArticle[]): string {
  const stockSummary = stocks.map(s =>
    `${s.symbol}: $${s.price.toFixed(2)} (${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%)`
  ).join(', ');

  const portfolioSummary = portfolio.length > 0
    ? portfolio.map(p => {
      const stock = stocks.find(s => s.symbol === p.symbol);
      if (!stock) return '';
      const currentValue = stock.price * p.shares;
      const profitLoss = currentValue - (p.avgCost * p.shares);
      return `${p.symbol}: ${p.shares} shares at $${p.avgCost.toFixed(2)}, P/L: ${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`;
    }).join('; ')
    : 'No holdings';

  const newsSummary = news.slice(0, 3).map(n =>
    `"${n.title}" (${n.sentiment})`
  ).join('; ');

  return `Current Market Data:
- Stocks: ${stockSummary}
- User Portfolio: ${portfolioSummary}
- Cash: $${balance.toFixed(2)}
- Net Worth: $${netWorth.toFixed(2)}
- Recent News: ${newsSummary}`;
}

function getIntelligentResponse(input: string, stocks: Stock[], portfolio: PortfolioItem[], balance: number, netWorth: number, news: NewsArticle[]): string {
  const lowerInput = input.toLowerCase();

  // Format currency in INR
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  // Check for specific stock mention
  const mentionedStock = stocks.find(stock =>
    lowerInput.includes(stock.symbol.toLowerCase()) ||
    lowerInput.includes(stock.name.toLowerCase())
  );

  if (mentionedStock) {
    const stockNews = news.filter(n => n.ticker === mentionedStock.symbol);
    const holding = portfolio.find(p => p.symbol === mentionedStock.symbol);

    let response = `📊 **${mentionedStock.name} (${mentionedStock.symbol})**\n`;
    response += `Current Price: ${formatCurrency(mentionedStock.price)} `;
    response += mentionedStock.change >= 0
      ? `🟢 +${formatCurrency(mentionedStock.change)} (+${mentionedStock.changePercent.toFixed(2)}%)\n`
      : `🔴 ${formatCurrency(mentionedStock.change)} (${mentionedStock.changePercent.toFixed(2)}%)\n`;

    if (holding) {
      const currentValue = mentionedStock.price * holding.shares;
      const costBasis = holding.avgCost * holding.shares;
      const profitLoss = currentValue - costBasis;
      const profitPct = ((currentValue / costBasis) - 1) * 100;

      response += `\n📈 **Your Position:**\n`;
      response += `• ${holding.shares} shares @ ${formatCurrency(holding.avgCost)} avg\n`;
      response += `• Current Value: ${formatCurrency(currentValue)}\n`;
      response += profitLoss >= 0
        ? `• P/L: +${formatCurrency(profitLoss)} (+${profitPct.toFixed(1)}%) ✅`
        : `• P/L: ${formatCurrency(profitLoss)} (${profitPct.toFixed(1)}%) ⚠️`;
    }

    if (stockNews.length > 0) {
      response += `\n\n📰 **Latest News:** "${stockNews[0].title}"`;
    }

    return response;
  }

  // Portfolio analysis
  if (lowerInput.includes('portfolio') || lowerInput.includes('holdings') || lowerInput.includes('position')) {
    if (portfolio.length === 0) {
      return `📋 **Portfolio Summary**\n\nYour portfolio is currently empty.\n\n💵 Available Cash: ${formatCurrency(balance)}\n\n💡 **Tip:** Navigate to the Market tab to explore stocks and start building your portfolio!`;
    }

    let response = `📋 **Portfolio Summary**\n\n`;
    let totalInvested = 0;
    let totalValue = 0;

    portfolio.forEach(p => {
      const stock = stocks.find(s => s.symbol === p.symbol);
      if (stock) {
        const currentValue = stock.price * p.shares;
        const costBasis = p.avgCost * p.shares;
        const pl = currentValue - costBasis;
        totalInvested += costBasis;
        totalValue += currentValue;

        response += `• **${p.symbol}**: ${p.shares} shares @ ${formatCurrency(stock.price)} = ${formatCurrency(currentValue)} `;
        response += pl >= 0 ? `(+${formatCurrency(pl)}) ✅\n` : `(${formatCurrency(pl)}) ⚠️\n`;
      }
    });

    const totalPL = totalValue - totalInvested;
    response += `\n💰 **Total Portfolio Value:** ${formatCurrency(totalValue)}`;
    response += `\n💵 **Cash Balance:** ${formatCurrency(balance)}`;
    response += `\n📊 **Net Worth:** ${formatCurrency(netWorth)}`;
    response += totalPL >= 0
      ? `\n\n🎯 Overall: +${formatCurrency(totalPL)} profit`
      : `\n\n⚠️ Overall: ${formatCurrency(totalPL)} loss`;

    return response;
  }

  // Balance inquiry
  if (lowerInput.includes('balance') || lowerInput.includes('cash') || lowerInput.includes('money')) {
    return `💵 **Account Balance**\n\nAvailable Cash: ${formatCurrency(balance)}\nTotal Net Worth: ${formatCurrency(netWorth)}\n\n${balance > 10000 ? "You have substantial buying power available!" : "Consider your risk tolerance before making trades."}`;
  }

  // News inquiry
  if (lowerInput.includes('news') || lowerInput.includes('headlines') || lowerInput.includes('update')) {
    if (news.length === 0) {
      return "📰 No recent news available. Check back soon for market updates!";
    }

    let response = `📰 **Latest Market News**\n\n`;
    news.slice(0, 3).forEach((n, i) => {
      const sentiment = n.sentiment === 'positive' ? '🟢' : n.sentiment === 'negative' ? '🔴' : '⚪';
      response += `${i + 1}. ${sentiment} **${n.ticker || 'Market'}**: "${n.title}"\n`;
    });
    return response;
  }

  // Market overview
  if (lowerInput.includes('market') || lowerInput.includes('overview') || lowerInput.includes('today')) {
    const gainers = stocks.filter(s => s.changePercent > 0);
    const losers = stocks.filter(s => s.changePercent < 0);
    const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;

    let response = `📈 **Market Overview**\n\n`;
    response += `Overall Trend: ${avgChange >= 0 ? '🟢 Bullish' : '🔴 Bearish'} (${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}% avg)\n\n`;

    if (gainers.length > 0) {
      const topGainer = gainers.sort((a, b) => b.changePercent - a.changePercent)[0];
      response += `🏆 **Top Gainer:** ${topGainer.symbol} (+${topGainer.changePercent.toFixed(2)}%)\n`;
    }

    if (losers.length > 0) {
      const topLoser = losers.sort((a, b) => a.changePercent - b.changePercent)[0];
      response += `📉 **Top Loser:** ${topLoser.symbol} (${topLoser.changePercent.toFixed(2)}%)\n`;
    }

    response += `\n📊 ${gainers.length} advancing, ${losers.length} declining`;
    return response;
  }

  // Help / general inquiry
  if (lowerInput.includes('help') || lowerInput.includes('what can') || lowerInput.includes('how')) {
    return `👋 **I'm FinBot, your AI Trading Assistant!**\n\nI can help you with:\n\n📊 **Stock Analysis** - Ask about AAPL, MSFT, GOOGL, AMZN, or NVDA\n📋 **Portfolio Review** - "Show my portfolio" or "What do I own?"\n💵 **Balance Info** - "What's my balance?" or "How much cash?"\n📈 **Market Overview** - "How's the market?" or "Market update"\n📰 **News Updates** - "Latest news" or "What's happening?"\n\nJust type your question and I'll provide real-time insights!`;
  }

  // Buy/Sell advice
  if (lowerInput.includes('buy') || lowerInput.includes('sell') || lowerInput.includes('should i')) {
    return `⚠️ **Investment Disclaimer**\n\nI can provide market data and analysis, but I cannot give specific buy/sell recommendations. This is a simulated trading environment for educational purposes.\n\n💡 **Tips for Practice:**\n• Diversify across different stocks\n• Don't invest more than you can afford to lose\n• Consider the stock's recent performance and news\n• Start small and learn from your trades\n\nWant me to analyze a specific stock's current data?`;
  }

  // Default response
  return `🤖 I'm your AI Financial Assistant! I have access to real-time market data for:\n\n• **AAPL** (Apple) - ${formatCurrency(stocks.find(s => s.symbol === 'AAPL')?.price || 0)}\n• **MSFT** (Microsoft) - ${formatCurrency(stocks.find(s => s.symbol === 'MSFT')?.price || 0)}\n• **GOOGL** (Alphabet) - ${formatCurrency(stocks.find(s => s.symbol === 'GOOGL')?.price || 0)}\n• **AMZN** (Amazon) - ${formatCurrency(stocks.find(s => s.symbol === 'AMZN')?.price || 0)}\n• **NVDA** (NVIDIA) - ${formatCurrency(stocks.find(s => s.symbol === 'NVDA')?.price || 0)}\n\nTry asking: "Tell me about AAPL" or "Show my portfolio"`;
}