/**
 * Historical Market Scenarios
 * 
 * Contains accurate historical price data for simulating past market events.
 * All prices are adjusted close prices from historical records.
 * 
 * Stocks covered: AAPL, MSFT, GOOGL, AMZN, NVDA, META
 * Note: META was FB before Oct 2021; for pre-2021 scenarios we use FB historical data
 */

export interface HistoricalDay {
    date: string;
    isoDate: string;  // For date-based lookups
    prices: Record<string, number>;
    changes: Record<string, number>;
    news?: string[];
    sentiment?: 'panic' | 'fear' | 'neutral' | 'optimism' | 'euphoria';  // Day-level sentiment
}

// Behavioral metadata for learning-oriented scenarios
export interface ScenarioBehavior {
    volatility: 'low' | 'medium' | 'high' | 'extreme';
    trendType: 'crash' | 'recovery' | 'bubble' | 'bull' | 'bear';
    expectedMistakes: Array<'panic_selling' | 'fomo_buying' | 'overtrading' | 'overconcentration' | 'poor_timing' | 'holding_too_long'>;
    stressLevel: number;  // 1-10
    keyLesson: string;  // Primary takeaway
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    period: string;
    learningObjective: string;
    icon: string;
    color: string;
    startingBalance: number;
    stocks: string[];  // Which stocks are available in this scenario
    behavior: ScenarioBehavior;  // Behavioral metadata for learning
    days: HistoricalDay[];
}

// Helper to calculate percentage change
function calcChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
}

// ============================================================================
// COVID-19 Market Crash (Feb - May 2020)
// Historical adjusted close prices from major exchanges
// ============================================================================
const covidCrashScenario: Scenario = {
    id: 'covid-crash',
    name: 'COVID-19 Crash',
    description: 'Experience the fastest market crash in history as COVID-19 spreads globally.',
    period: 'Feb 19 - May 15, 2020',
    learningObjective: 'Learn how panic selling leads to losses and patience leads to recovery.',
    icon: '🦠',
    color: 'red',
    startingBalance: 100000,
    stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'],
    behavior: {
        volatility: 'extreme',
        trendType: 'crash',
        expectedMistakes: ['panic_selling', 'overtrading'],
        stressLevel: 9,
        keyLesson: 'Markets recover faster than emotions. Patience beats panic.'
    },
    days: [
        {
            date: 'Feb 19, 2020',
            isoDate: '2020-02-19',
            prices: { AAPL: 323.62, MSFT: 187.28, GOOGL: 1526.69, AMZN: 2170.22, NVDA: 288.45, META: 217.08 },
            changes: { AAPL: 0, MSFT: 0, GOOGL: 0, AMZN: 0, NVDA: 0, META: 0 },  // Day 1 baseline
            news: ['📈 Markets hit all-time highs', 'Tech stocks lead S&P 500 rally', 'Coronavirus largely contained in China']
        },
        {
            date: 'Feb 24, 2020',
            isoDate: '2020-02-24',
            prices: { AAPL: 298.18, MSFT: 170.89, GOOGL: 1421.59, AMZN: 2009.29, NVDA: 262.34, META: 197.20 },
            changes: { AAPL: -7.86, MSFT: -8.75, GOOGL: -6.88, AMZN: -7.41, NVDA: -9.05, META: -9.15 },
            news: ['🔴 Italy reports surge in COVID cases', 'Dow drops over 1,000 points', 'CDC warns Americans to prepare for outbreak']
        },
        {
            date: 'Mar 2, 2020',
            isoDate: '2020-03-02',
            prices: { AAPL: 298.81, MSFT: 172.79, GOOGL: 1389.11, AMZN: 1955.87, NVDA: 265.24, META: 196.75 },
            changes: { AAPL: 0.21, MSFT: 1.11, GOOGL: -2.29, AMZN: -2.66, NVDA: 1.11, META: -0.23 },
            news: ['Federal Reserve signals possible rate cut', 'Brief market rebound on stimulus hopes', 'Companies initiate work-from-home policies']
        },
        {
            date: 'Mar 9, 2020',
            isoDate: '2020-03-09',
            prices: { AAPL: 266.17, MSFT: 153.63, GOOGL: 1215.56, AMZN: 1800.00, NVDA: 232.44, META: 163.80 },
            changes: { AAPL: -10.93, MSFT: -11.09, GOOGL: -12.49, AMZN: -7.97, NVDA: -12.37, META: -16.74 },
            news: ['🔴 Oil price war begins between Saudi Arabia and Russia', 'Markets enter correction territory', 'Circuit breaker triggered - trading halted after 7% drop']
        },
        {
            date: 'Mar 12, 2020',
            isoDate: '2020-03-12',
            prices: { AAPL: 248.23, MSFT: 139.06, GOOGL: 1114.91, AMZN: 1676.61, NVDA: 210.59, META: 150.26 },
            changes: { AAPL: -6.74, MSFT: -9.49, GOOGL: -8.28, AMZN: -6.86, NVDA: -9.40, META: -8.27 },
            news: ['🔴 WHO officially declares COVID-19 a pandemic', 'USA travel ban from Europe announced', 'NBA season suspended', 'Worst trading day since 1987']
        },
        {
            date: 'Mar 16, 2020',
            isoDate: '2020-03-16',
            prices: { AAPL: 242.21, MSFT: 135.42, GOOGL: 1084.33, AMZN: 1689.00, NVDA: 196.75, META: 146.01 },
            changes: { AAPL: -2.43, MSFT: -2.62, GOOGL: -2.74, AMZN: 0.74, NVDA: -6.57, META: -2.83 },
            news: ['🔴 Second circuit breaker triggered in a week', 'Fed cuts rates to near zero', 'Multiple states begin lockdown orders']
        },
        {
            date: 'Mar 23, 2020',
            isoDate: '2020-03-23',
            prices: { AAPL: 224.37, MSFT: 135.98, GOOGL: 1056.62, AMZN: 1902.83, NVDA: 209.12, META: 148.10 },
            changes: { AAPL: -7.36, MSFT: 0.41, GOOGL: -2.55, AMZN: 12.66, NVDA: 6.29, META: 1.43 },
            news: ['📉 MARKET BOTTOM - S&P 500 hits lowest point', 'Fed announces unlimited quantitative easing', 'Congress debates $2 trillion stimulus package', 'Amazon surges on unprecedented demand']
        },
        {
            date: 'Apr 6, 2020',
            isoDate: '2020-04-06',
            prices: { AAPL: 262.47, MSFT: 164.36, GOOGL: 1186.92, AMZN: 2012.98, NVDA: 252.83, META: 166.20 },
            changes: { AAPL: 16.99, MSFT: 20.87, GOOGL: 12.33, AMZN: 5.79, NVDA: 20.90, META: 12.22 },
            news: ['📈 Markets rally on stimulus optimism', 'US reports slowing growth in new cases', 'Work-from-home and streaming stocks surge']
        },
        {
            date: 'Apr 17, 2020',
            isoDate: '2020-04-17',
            prices: { AAPL: 282.80, MSFT: 178.60, GOOGL: 1263.47, AMZN: 2375.00, NVDA: 280.12, META: 178.45 },
            changes: { AAPL: 7.74, MSFT: 8.67, GOOGL: 6.45, AMZN: 17.98, NVDA: 10.80, META: 7.37 },
            news: ['📈 Gilead remdesivir drug shows promise in trials', 'States begin discussing reopening plans', 'Tech company earnings beat expectations']
        },
        {
            date: 'May 15, 2020',
            isoDate: '2020-05-15',
            prices: { AAPL: 307.71, MSFT: 183.16, GOOGL: 1373.19, AMZN: 2409.78, NVDA: 331.25, META: 209.78 },
            changes: { AAPL: 8.81, MSFT: 2.55, GOOGL: 8.69, AMZN: 1.46, NVDA: 18.25, META: 17.55 },
            news: ['📈 Markets recover most pandemic losses', 'Vaccine trials accelerate globally', 'Tech sector leads recovery - NASDAQ near new highs']
        }
    ]
};

// ============================================================================
// 2008 Financial Crisis (Sep - Dec 2008)
// Historical adjusted close prices
// Note: META did not exist (Facebook IPO was 2012), NVDA included
// ============================================================================
const financialCrisis2008: Scenario = {
    id: 'financial-crisis-2008',
    name: '2008 Financial Crisis',
    description: 'Navigate the worst financial crisis since the Great Depression.',
    period: 'Sep 15 - Dec 31, 2008',
    learningObjective: 'Understand systemic risk and the importance of portfolio diversification.',
    icon: '🏦',
    color: 'orange',
    startingBalance: 100000,
    stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'],  // No META/FB in 2008
    behavior: {
        volatility: 'extreme',
        trendType: 'bear',
        expectedMistakes: ['panic_selling', 'overconcentration', 'poor_timing'],
        stressLevel: 10,
        keyLesson: 'Diversification protects against systemic collapse. Never bet everything on one sector.'
    },
    days: [
        {
            date: 'Sep 15, 2008',
            isoDate: '2008-09-15',
            prices: { AAPL: 14.16, MSFT: 25.17, GOOGL: 420.50, AMZN: 77.31, NVDA: 9.86 },
            changes: { AAPL: 0, MSFT: 0, GOOGL: 0, AMZN: 0, NVDA: 0 },
            news: ['🔴 LEHMAN BROTHERS FILES FOR BANKRUPTCY', 'Merrill Lynch sold to Bank of America for $50B', 'AIG seeks emergency funding from Fed']
        },
        {
            date: 'Sep 29, 2008',
            isoDate: '2008-09-29',
            prices: { AAPL: 12.36, MSFT: 24.11, GOOGL: 386.91, AMZN: 70.16, NVDA: 8.24 },
            changes: { AAPL: -12.71, MSFT: -4.21, GOOGL: -7.99, AMZN: -9.25, NVDA: -16.43 },
            news: ['🔴 House REJECTS $700B bailout bill', 'Dow drops 778 points - largest single-day point drop ever', 'Global markets crash in response']
        },
        {
            date: 'Oct 6, 2008',
            isoDate: '2008-10-06',
            prices: { AAPL: 11.02, MSFT: 22.47, GOOGL: 355.53, AMZN: 62.48, NVDA: 7.12 },
            changes: { AAPL: -10.84, MSFT: -6.80, GOOGL: -8.11, AMZN: -10.95, NVDA: -13.59 },
            news: ['🔴 Credit markets completely frozen', 'Fed expands emergency lending programs', 'Dow falls below 10,000 for first time in 4 years']
        },
        {
            date: 'Oct 10, 2008',
            isoDate: '2008-10-10',
            prices: { AAPL: 9.14, MSFT: 20.52, GOOGL: 332.01, AMZN: 55.20, NVDA: 5.89 },
            changes: { AAPL: -17.06, MSFT: -8.68, GOOGL: -6.61, AMZN: -11.65, NVDA: -17.28 },
            news: ['📉 PANIC SELLING - Worst week in market history', 'Dow swings 1,000+ points multiple days', 'G7 announces coordinated global rate cuts']
        },
        {
            date: 'Oct 28, 2008',
            isoDate: '2008-10-28',
            prices: { AAPL: 11.44, MSFT: 22.33, GOOGL: 359.36, AMZN: 57.24, NVDA: 7.45 },
            changes: { AAPL: 25.16, MSFT: 8.82, GOOGL: 8.24, AMZN: 3.70, NVDA: 26.49 },
            news: ['📈 Massive relief rally - Dow up 900 points', 'Fed cuts rates to 1%', 'Markets bounce from extreme oversold levels']
        },
        {
            date: 'Nov 20, 2008',
            isoDate: '2008-11-20',
            prices: { AAPL: 8.09, MSFT: 18.29, GOOGL: 262.43, AMZN: 42.70, NVDA: 5.68 },
            changes: { AAPL: -29.28, MSFT: -18.09, GOOGL: -26.97, AMZN: -25.40, NVDA: -23.76 },
            news: ['📉 NEW LOWS - Dow at 11-year low', 'S&P 500 enters bear market territory', 'Auto industry pleads for bailout']
        },
        {
            date: 'Dec 16, 2008',
            isoDate: '2008-12-16',
            prices: { AAPL: 9.47, MSFT: 19.52, GOOGL: 300.36, AMZN: 51.25, NVDA: 7.23 },
            changes: { AAPL: 17.06, MSFT: 6.72, GOOGL: 14.45, AMZN: 20.02, NVDA: 27.29 },
            news: ['Fed cuts rates to historic 0-0.25% range', 'TARP bailout program approved', 'Signs of market stabilization']
        },
        {
            date: 'Dec 31, 2008',
            isoDate: '2008-12-31',
            prices: { AAPL: 9.24, MSFT: 19.44, GOOGL: 307.65, AMZN: 51.28, NVDA: 7.41 },
            changes: { AAPL: -2.43, MSFT: -0.41, GOOGL: 2.43, AMZN: 0.06, NVDA: 2.49 },
            news: ['Year ends with S&P 500 down 38% for 2008', 'Worst annual decline since 1931', 'Survivors position portfolios for 2009']
        }
    ]
};

// ============================================================================
// Dot-com Bubble Burst (Mar - Oct 2000)
// Historical adjusted close prices
// Note: GOOGL IPO was 2004, META didn't exist, AMZN and AAPL were small
// ============================================================================
const dotcomBubble: Scenario = {
    id: 'dotcom-bubble',
    name: 'Dot-com Bubble',
    description: 'Experience the bursting of the internet bubble and tech crash.',
    period: 'Mar 10 - Oct 18, 2000',
    learningObjective: 'Learn about speculative bubbles and the importance of valuation fundamentals.',
    icon: '💻',
    color: 'purple',
    startingBalance: 100000,
    stocks: ['AAPL', 'MSFT', 'AMZN', 'NVDA'],  // No GOOGL or META in 2000
    behavior: {
        volatility: 'high',
        trendType: 'bubble',
        expectedMistakes: ['fomo_buying', 'holding_too_long', 'overconcentration'],
        stressLevel: 7,
        keyLesson: 'Valuations matter. When everyone is greedy, be fearful.'
    },
    days: [
        {
            date: 'Mar 10, 2000',
            isoDate: '2000-03-10',
            prices: { AAPL: 3.62, MSFT: 53.31, AMZN: 66.88, NVDA: 3.85 },
            changes: { AAPL: 0, MSFT: 0, AMZN: 0, NVDA: 0 },
            news: ['📈 NASDAQ PEAKS at 5,048.62 - All-time high', 'Tech valuations reach unprecedented levels', 'Internet stocks trading at 100x+ earnings']
        },
        {
            date: 'Mar 20, 2000',
            isoDate: '2000-03-20',
            prices: { AAPL: 3.14, MSFT: 47.57, AMZN: 53.13, NVDA: 3.21 },
            changes: { AAPL: -13.26, MSFT: -10.77, AMZN: -20.56, NVDA: -16.62 },
            news: ['🔴 Tech selloff begins', 'Bubble concerns dominate headlines', 'Investors start taking profits']
        },
        {
            date: 'Apr 14, 2000',
            isoDate: '2000-04-14',
            prices: { AAPL: 2.56, MSFT: 37.25, AMZN: 44.00, NVDA: 2.45 },
            changes: { AAPL: -18.47, MSFT: -21.70, AMZN: -17.19, NVDA: -23.68 },
            news: ['🔴 BLACK FRIDAY - NASDAQ drops 9% in single day', 'NASDAQ down 25% from March peak', 'Internet stocks in freefall']
        },
        {
            date: 'May 24, 2000',
            isoDate: '2000-05-24',
            prices: { AAPL: 2.19, MSFT: 33.19, AMZN: 32.38, NVDA: 2.12 },
            changes: { AAPL: -14.45, MSFT: -10.90, AMZN: -26.41, NVDA: -13.47 },
            news: ['Dot-com company failures accelerate', 'Venture capital funding dries up', 'Tech companies announce layoffs']
        },
        {
            date: 'Jul 28, 2000',
            isoDate: '2000-07-28',
            prices: { AAPL: 2.28, MSFT: 34.44, AMZN: 30.13, NVDA: 2.38 },
            changes: { AAPL: 4.11, MSFT: 3.77, AMZN: -6.95, NVDA: 12.26 },
            news: ['Brief rally attempt in tech stocks', 'Old economy stocks outperform', 'Quality companies separate from hype']
        },
        {
            date: 'Oct 18, 2000',
            isoDate: '2000-10-18',
            prices: { AAPL: 1.19, MSFT: 28.75, AMZN: 24.63, NVDA: 1.78 },
            changes: { AAPL: -47.81, MSFT: -16.52, AMZN: -18.25, NVDA: -25.21 },
            news: ['📉 NASDAQ down 50% from March peak', 'Tech apocalypse continues unabated', 'Investors flee all growth stocks']
        }
    ]
};

// ============================================================================
// 2021 Bull Market (Jan - Nov 2021)
// Historical adjusted close prices
// All 6 stocks available
// ============================================================================
const bullMarket2021: Scenario = {
    id: 'bull-market-2021',
    name: '2021 Bull Run',
    description: 'Ride the post-pandemic market surge and meme stock mania.',
    period: 'Jan 4 - Nov 22, 2021',
    learningObjective: 'Learn about momentum investing and knowing when to take profits.',
    icon: '🚀',
    color: 'green',
    startingBalance: 100000,
    stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'],
    behavior: {
        volatility: 'medium',
        trendType: 'bull',
        expectedMistakes: ['fomo_buying', 'overtrading', 'poor_timing'],
        stressLevel: 4,
        keyLesson: 'Take profits regularly. Bull markets create overconfidence.'
    },
    days: [
        {
            date: 'Jan 4, 2021',
            isoDate: '2021-01-04',
            prices: { AAPL: 129.41, MSFT: 217.69, GOOGL: 1728.24, AMZN: 3186.63, NVDA: 131.22, META: 268.94 },
            changes: { AAPL: 0, MSFT: 0, GOOGL: 0, AMZN: 0, NVDA: 0, META: 0 },
            news: ['New year opens with optimism', 'Vaccine rollout accelerates', 'Markets expect strong 2021']
        },
        {
            date: 'Jan 27, 2021',
            isoDate: '2021-01-27',
            prices: { AAPL: 142.06, MSFT: 232.90, GOOGL: 1919.12, AMZN: 3305.00, NVDA: 136.60, META: 272.14 },
            changes: { AAPL: 9.77, MSFT: 6.99, GOOGL: 11.04, AMZN: 3.71, NVDA: 4.10, META: 1.19 },
            news: ['🎮 GAMESTOP MANIA - Reddit traders shock Wall Street', 'Robinhood restricts meme stock trading', 'Short squeeze becomes global phenomenon']
        },
        {
            date: 'Apr 29, 2021',
            isoDate: '2021-04-29',
            prices: { AAPL: 133.48, MSFT: 252.18, GOOGL: 2410.12, AMZN: 3467.42, NVDA: 148.13, META: 325.08 },
            changes: { AAPL: -6.04, MSFT: 8.28, GOOGL: 25.58, AMZN: 4.91, NVDA: 8.44, META: 19.46 },
            news: ['📈 Big Tech earnings smash expectations', 'Economy reopening boosts outlook', 'Inflation concerns begin to emerge']
        },
        {
            date: 'Jul 13, 2021',
            isoDate: '2021-07-13',
            prices: { AAPL: 149.15, MSFT: 277.94, GOOGL: 2565.10, AMZN: 3680.00, NVDA: 200.57, META: 353.16 },
            changes: { AAPL: 11.74, MSFT: 10.22, GOOGL: 6.43, AMZN: 6.13, NVDA: 35.40, META: 8.64 },
            news: ['📈 Tech stocks hit new all-time highs', 'NVIDIA surges on AI demand expectations', 'Crypto also reaches record levels']
        },
        {
            date: 'Sep 20, 2021',
            isoDate: '2021-09-20',
            prices: { AAPL: 142.94, MSFT: 289.00, GOOGL: 2704.00, AMZN: 3343.00, NVDA: 197.32, META: 341.66 },
            changes: { AAPL: -4.16, MSFT: 3.98, GOOGL: 5.42, AMZN: -9.16, NVDA: -1.62, META: -3.26 },
            news: ['China Evergrande crisis spooks markets', 'Fed signals tapering concerns', 'September volatility increases']
        },
        {
            date: 'Nov 8, 2021',
            isoDate: '2021-11-08',
            prices: { AAPL: 150.44, MSFT: 331.62, GOOGL: 2980.00, AMZN: 3523.00, NVDA: 301.21, META: 336.87 },
            changes: { AAPL: 5.25, MSFT: 14.74, GOOGL: 10.21, AMZN: 5.38, NVDA: 52.66, META: -1.40 },
            news: ['📈 S&P 500 AND NASDAQ HIT ALL-TIME HIGHS', 'Metaverse hype begins with Facebook rebrand', 'Infrastructure bill passes Congress']
        },
        {
            date: 'Nov 22, 2021',
            isoDate: '2021-11-22',
            prices: { AAPL: 160.55, MSFT: 343.11, GOOGL: 2942.00, AMZN: 3568.00, NVDA: 316.75, META: 332.33 },
            changes: { AAPL: 6.72, MSFT: 3.47, GOOGL: -1.28, AMZN: 1.28, NVDA: 5.16, META: -1.35 },
            news: ['📈 Apple approaches $3 trillion market cap', 'Best bull market rally in decades', 'Thanksgiving week trading begins strong']
        }
    ]
};

// ============================================================================
// Export all scenarios and helpers
// ============================================================================
export const SCENARIOS: Scenario[] = [
    covidCrashScenario,
    financialCrisis2008,
    dotcomBubble,
    bullMarket2021
];

// Get scenario by ID
export function getScenarioById(id: string): Scenario | undefined {
    return SCENARIOS.find(s => s.id === id);
}

// Get historical price for a specific symbol on a specific day
export function getHistoricalPrice(scenario: Scenario, dayIndex: number, symbol: string): number | undefined {
    if (dayIndex < 0 || dayIndex >= scenario.days.length) return undefined;
    return scenario.days[dayIndex].prices[symbol];
}

// Get all prices for a specific day
export function getDayPrices(scenario: Scenario, dayIndex: number): Record<string, number> {
    if (dayIndex < 0 || dayIndex >= scenario.days.length) return {};
    return scenario.days[dayIndex].prices;
}

// Get percentage changes for a specific day
export function getDayChanges(scenario: Scenario, dayIndex: number): Record<string, number> {
    if (dayIndex < 0 || dayIndex >= scenario.days.length) return {};
    return scenario.days[dayIndex].changes;
}

// Build price history up to current day (for charts)
// Ensures at least 2 points for Recharts to render properly
export function buildPriceHistory(scenario: Scenario, dayIndex: number, symbol: string): Array<{ time: string; value: number }> {
    const history: Array<{ time: string; value: number }> = [];
    for (let i = 0; i <= dayIndex && i < scenario.days.length; i++) {
        const price = scenario.days[i].prices[symbol];
        if (price !== undefined) {
            history.push({ time: scenario.days[i].date, value: price });
        }
    }

    // Recharts needs at least 2 points to render a line/area chart
    // If we only have 1 point, duplicate it with a slight offset for display
    if (history.length === 1) {
        history.unshift({ time: 'Start', value: history[0].value });
    }

    // If no history at all, return empty (stock not in scenario)
    return history;
}

// Check if a symbol is available in a scenario
export function isSymbolInScenario(scenario: Scenario, symbol: string): boolean {
    return scenario.stocks.includes(symbol);
}

// Calculate portfolio value for a given day
export function calculateScenarioPortfolio(
    portfolio: Array<{ symbol: string; shares: number; avgCost: number }>,
    prices: Record<string, number>
): { totalValue: number; items: Array<{ symbol: string; value: number; change: number }> } {
    const items = portfolio.map(p => {
        const currentPrice = prices[p.symbol] || 0;
        const value = currentPrice * p.shares;
        const cost = p.avgCost * p.shares;
        const change = cost > 0 ? ((value - cost) / cost) * 100 : 0;
        return { symbol: p.symbol, value, change };
    });

    const totalValue = items.reduce((sum, item) => sum + item.value, 0);
    return { totalValue, items };
}
