import { useState, useEffect } from "react";
import { NewsArticle } from "@/lib/newsData";
import { Scenario } from "@/lib/historicalScenarios";
import { TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Building2, RefreshCw, History } from "lucide-react";

const API_KEY = "d5vdv91r01qjj9jj6a20d5vdv91r01qjj9jj6a2g";
const STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"];

interface FinnhubNews {
  headline: string;
  source: string;
  datetime: number;
  summary: string;
  url: string;
  related: string;
}

interface NewsViewProps {
  activeScenario?: Scenario | null;
  scenarioDayIndex?: number;
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "1 day ago";
  return `${Math.floor(diff / 86400)} days ago`;
}

function analyzeSentiment(headline: string, summary: string): 'positive' | 'negative' | 'neutral' {
  const text = (headline + " " + summary).toLowerCase();

  const positiveWords = ['surge', 'jump', 'gain', 'rise', 'beat', 'record', 'strong', 'boost', 'rally', 'soar', 'profit', 'growth', 'success', 'upgrade', 'bullish'];
  const negativeWords = ['fall', 'drop', 'decline', 'loss', 'miss', 'weak', 'concern', 'risk', 'plunge', 'crash', 'cut', 'downgrade', 'bearish', 'trouble', 'warning'];

  const positiveScore = positiveWords.filter(word => text.includes(word)).length;
  const negativeScore = negativeWords.filter(word => text.includes(word)).length;

  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

// Analyze sentiment from scenario news headline
function analyzeScenarioSentiment(headline: string): 'positive' | 'negative' | 'neutral' {
  const lower = headline.toLowerCase();
  if (headline.includes('📈') || lower.includes('rally') || lower.includes('surge') || lower.includes('record') || lower.includes('bounce')) {
    return 'positive';
  }
  if (headline.includes('📉') || headline.includes('🔴') || lower.includes('crash') || lower.includes('drop') || lower.includes('fall') || lower.includes('panic')) {
    return 'negative';
  }
  return 'neutral';
}

export function NewsView({ activeScenario, scenarioDayIndex = 0 }: NewsViewProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if scenario mode is active
  const isScenarioMode = activeScenario !== null && activeScenario !== undefined;

  const fetchLiveNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const toDate = today.toISOString().split('T')[0];
      const fromDate = weekAgo.toISOString().split('T')[0];

      const allNews: NewsArticle[] = [];

      // Fetch news for each stock (limit to 2 stocks to avoid rate limiting)
      for (const symbol of STOCK_SYMBOLS.slice(0, 2)) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${API_KEY}`
          );

          if (!response.ok) continue;

          const data: FinnhubNews[] = await response.json();

          // Take first 5 articles per stock
          const articles = data.slice(0, 5).map((item): NewsArticle => ({
            title: item.headline,
            source: item.source,
            date: getRelativeTime(item.datetime),
            sentiment: analyzeSentiment(item.headline, item.summary),
            url: item.url,
            summary: item.summary.length > 200 ? item.summary.substring(0, 200) + "..." : item.summary,
            ticker: item.related || symbol
          }));

          allNews.push(...articles);
        } catch (e) {
          console.error(`Error fetching news for ${symbol}:`, e);
        }
      }

      // Sort by freshness (most recent first) and limit total
      allNews.sort((a, b) => {
        const timeA = a.date.includes('minute') ? 0 : a.date.includes('hour') ? 1 : 2;
        const timeB = b.date.includes('minute') ? 0 : b.date.includes('hour') ? 1 : 2;
        return timeA - timeB;
      });

      setNews(allNews.slice(0, 10));
    } catch (e) {
      setError("Failed to fetch news. Please try again later.");
      console.error("Error fetching news:", e);
    } finally {
      setLoading(false);
    }
  };

  // Load scenario-specific news
  const loadScenarioNews = () => {
    if (!activeScenario) return;

    const currentDay = activeScenario.days[scenarioDayIndex];
    const newsHeadlines = currentDay.news || [];

    const scenarioNews: NewsArticle[] = newsHeadlines.map((headline: string, index: number) => ({
      title: headline,
      source: "Historical Record",
      date: currentDay.date,
      sentiment: analyzeScenarioSentiment(headline),
      ticker: "MARKET",
      summary: `Historical market event from ${activeScenario.name}. This news reflects the market conditions on ${currentDay.date}.`
    }));

    setNews(scenarioNews);
    setLoading(false);
  };

  useEffect(() => {
    if (isScenarioMode) {
      loadScenarioNews();
    } else {
      fetchLiveNews();
      // Refresh news every 5 minutes (only in live mode)
      const interval = setInterval(fetchLiveNews, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isScenarioMode, activeScenario, scenarioDayIndex]);

  const getSentimentIcon = (sentiment: NewsArticle['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: NewsArticle['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-500/20 bg-green-500/5';
      case 'negative':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-gray-700 bg-gray-900/50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white">Market News</h1>
          {isScenarioMode ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                <History className="w-3 h-3" />
                Historical News
              </span>
              <span className="text-gray-400 text-sm">
                {activeScenario.icon} {activeScenario.name} — {activeScenario.days[scenarioDayIndex].date}
              </span>
            </div>
          ) : (
            <p className="text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live financial news powered by Finnhub
            </p>
          )}
        </div>
        {!isScenarioMode && (
          <button
            onClick={fetchLiveNews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Scenario date context */}
      {isScenarioMode && (
        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeScenario.icon}</span>
            <div>
              <p className="text-white font-medium">News from {activeScenario.days[scenarioDayIndex].date}</p>
              <p className="text-gray-400 text-sm">Day {scenarioDayIndex + 1} of {activeScenario.days.length}</p>
            </div>
          </div>
          <p className="text-purple-400 text-sm hidden md:block">Historical market events</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {loading && news.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-gray-400">Loading {isScenarioMode ? 'historical' : 'latest'} news...</p>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-5xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Significant News</h3>
          <p className="text-gray-400">
            {isScenarioMode
              ? `No major market-moving events recorded for ${activeScenario?.days[scenarioDayIndex].date}`
              : "No news articles available at this time."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {news.map((article, index) => (
            <div
              key={index}
              className={`block border rounded-xl p-5 transition-all duration-300 ${getSentimentColor(article.sentiment)} ${!isScenarioMode && article.url ? 'cursor-pointer hover:shadow-lg' : ''}`}
              onClick={() => !isScenarioMode && article.url && window.open(article.url, '_blank')}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {article.ticker && (
                      <span className="px-2.5 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-md border border-blue-600/30">
                        {article.ticker}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{article.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {article.title}
                  </h3>

                  {article.summary && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {article.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(article.sentiment)}
                      <span className={`text-sm font-medium capitalize ${article.sentiment === 'positive' ? 'text-green-500' :
                        article.sentiment === 'negative' ? 'text-red-500' :
                          'text-gray-500'
                        }`}>
                        {article.sentiment}
                      </span>
                    </div>

                    {!isScenarioMode && article.url && (
                      <span className="ml-auto flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Read more
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
