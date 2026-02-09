/**
 * Scenario Configuration Layer
 * 
 * Contains ONLY scenario metadata - no price data.
 * Prices are resolved at runtime from the historical price dataset.
 */

// Behavioral metadata for learning-oriented scenarios
export interface ScenarioBehavior {
    volatility: 'low' | 'medium' | 'high' | 'extreme';
    trendType: 'crash' | 'recovery' | 'bubble' | 'bull' | 'bear';
    expectedMistakes: Array<'panic_selling' | 'fomo_buying' | 'overtrading' | 'overconcentration' | 'poor_timing' | 'holding_too_long'>;
    stressLevel: number;  // 1-10
    keyLesson: string;
}

// Key date configuration for scenario
export interface ScenarioKeyDate {
    isoDate: string;           // ISO format: YYYY-MM-DD
    displayDate: string;       // Human readable: "Feb 19, 2020"
    news?: string[];           // Headlines for this date
    sentiment?: 'panic' | 'fear' | 'neutral' | 'optimism' | 'euphoria';
}

// Scenario configuration (metadata only)
export interface ScenarioConfig {
    id: string;
    name: string;
    description: string;
    period: string;
    learningObjective: string;
    icon: string;
    color: string;
    startingBalance: number;
    symbols: string[];         // Available stocks for this scenario
    behavior: ScenarioBehavior;
    keyDates: ScenarioKeyDate[];  // Specific dates to use (not all trading days)
}

// ============================================================================
// SCENARIO CONFIGURATIONS
// ============================================================================

export const COVID_CRASH_CONFIG: ScenarioConfig = {
    id: 'covid-crash',
    name: 'COVID-19 Crash',
    description: 'Experience the fastest market crash in history as COVID-19 spreads globally.',
    period: 'Feb 19 - May 15, 2020',
    learningObjective: 'Learn how panic selling leads to losses and patience leads to recovery.',
    icon: '🦠',
    color: 'red',
    startingBalance: 10000,
    symbols: ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'IBM', 'CSCO'],
    behavior: {
        volatility: 'extreme',
        trendType: 'crash',
        expectedMistakes: ['panic_selling', 'overtrading'],
        stressLevel: 9,
        keyLesson: 'Markets recover faster than emotions. Patience beats panic.'
    },
    keyDates: [
        { isoDate: '2020-02-19', displayDate: 'Feb 19, 2020', news: ['📈 Markets hit all-time highs', 'Tech stocks lead S&P 500 rally', 'Coronavirus largely contained in China'], sentiment: 'euphoria' },
        { isoDate: '2020-02-24', displayDate: 'Feb 24, 2020', news: ['🔴 Italy reports surge in COVID cases', 'Dow drops over 1,000 points', 'CDC warns Americans to prepare for outbreak'], sentiment: 'fear' },
        { isoDate: '2020-03-02', displayDate: 'Mar 2, 2020', news: ['Federal Reserve signals possible rate cut', 'Brief market rebound on stimulus hopes', 'Companies initiate work-from-home policies'], sentiment: 'neutral' },
        { isoDate: '2020-03-09', displayDate: 'Mar 9, 2020', news: ['🔴 Oil price war begins between Saudi Arabia and Russia', 'Markets enter correction territory', 'Circuit breaker triggered - trading halted after 7% drop'], sentiment: 'panic' },
        { isoDate: '2020-03-12', displayDate: 'Mar 12, 2020', news: ['WHO declares COVID-19 a pandemic', 'Dow enters bear market - down 20% from peak', 'NBA suspends season, Tom Hanks tests positive'], sentiment: 'panic' },
        { isoDate: '2020-03-16', displayDate: 'Mar 16, 2020', news: ['🔴 Dow drops 2,997 points - worst day since 1987', 'Fed cuts rates to near zero', 'Circuit breaker triggered again'], sentiment: 'panic' },
        { isoDate: '2020-03-23', displayDate: 'Mar 23, 2020', news: ['⚠️ MARKET BOTTOM - lowest point of the crash', 'S&P 500 down 34% from peak', 'Fed announces unlimited QE'], sentiment: 'panic' },
        { isoDate: '2020-04-06', displayDate: 'Apr 6, 2020', news: ['📈 Markets surge on slowing death rates', 'Dow jumps 1,600+ points', 'Hope for COVID peak in coming weeks'], sentiment: 'optimism' },
        { isoDate: '2020-04-17', displayDate: 'Apr 17, 2020', news: ['Remdesivir shows promise in trials', 'States begin reopening discussions', 'Tech stocks lead recovery'], sentiment: 'optimism' },
        { isoDate: '2020-05-01', displayDate: 'May 1, 2020', news: ['Economic reopening begins in phases', 'Unemployment claims hit 30 million', 'Tech giants report strong earnings'], sentiment: 'neutral' }
    ]
};

export const FINANCIAL_CRISIS_2008_CONFIG: ScenarioConfig = {
    id: 'financial-crisis-2008',
    name: '2008 Financial Crisis',
    description: 'Navigate the worst financial crisis since the Great Depression.',
    period: 'Sep 15 - Dec 31, 2008',
    learningObjective: 'Understand how systemic risk affects all stocks, and why diversification alone doesn\'t protect against market crashes.',
    icon: '🏦',
    color: 'orange',
    startingBalance: 10000,
    symbols: ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'IBM', 'CSCO'],
    behavior: {
        volatility: 'extreme',
        trendType: 'crash',
        expectedMistakes: ['panic_selling', 'overtrading', 'poor_timing'],
        stressLevel: 10,
        keyLesson: 'In a true crisis, almost everything falls together. Cash preservation matters.'
    },
    keyDates: [
        { isoDate: '2008-09-12', displayDate: 'Sep 12, 2008', news: ['Lehman Brothers struggles to survive', 'Markets on edge awaiting weekend news', 'Financial stocks plunge'], sentiment: 'fear' },
        { isoDate: '2008-09-15', displayDate: 'Sep 15, 2008', news: ['🔴 Lehman Brothers files for bankruptcy', 'Largest bankruptcy in US history', 'Bank of America acquires Merrill Lynch'], sentiment: 'panic' },
        { isoDate: '2008-09-29', displayDate: 'Sep 29, 2008', news: ['🔴 House rejects $700B bailout', 'Dow drops 778 points - largest point drop ever', 'Credit markets freeze'], sentiment: 'panic' },
        { isoDate: '2008-10-03', displayDate: 'Oct 3, 2008', news: ['TARP bailout passes', 'Markets remain volatile', 'Global markets in turmoil'], sentiment: 'fear' },
        { isoDate: '2008-10-10', displayDate: 'Oct 10, 2008', news: ['Dow swings 1,000+ points intraday', 'G7 pledges coordinated action', 'Fear index (VIX) hits record'], sentiment: 'panic' },
        { isoDate: '2008-10-27', displayDate: 'Oct 27, 2008', news: ['Market stabilization attempts', 'Auto industry seeks bailout', 'Recession confirmed'], sentiment: 'fear' },
        { isoDate: '2008-11-20', displayDate: 'Nov 20, 2008', news: ['⚠️ S&P 500 hits crisis low', 'Dow closes below 7,600', 'Auto bailout uncertainty'], sentiment: 'panic' },
        { isoDate: '2008-12-01', displayDate: 'Dec 1, 2008', news: ['Official recession declared', 'Dating from December 2007', 'Markets continue volatile'], sentiment: 'fear' },
        { isoDate: '2008-12-16', displayDate: 'Dec 16, 2008', news: ['Fed cuts rates to near zero', 'Quantitative easing begins', 'Markets rally on stimulus'], sentiment: 'neutral' }
    ]
};

export const DOTCOM_BUBBLE_CONFIG: ScenarioConfig = {
    id: 'dotcom-bubble',
    name: 'Dot-com Bubble Burst',
    description: 'Experience the bursting of the internet bubble that wiped out trillions.',
    period: 'Mar - Oct 2000',
    learningObjective: 'See how speculation and FOMO can lead to massive overvaluation, and why fundamentals matter.',
    icon: '💻',
    color: 'blue',
    startingBalance: 10000,
    symbols: ['AAPL', 'MSFT', 'CSCO', 'IBM', 'AMZN'],
    behavior: {
        volatility: 'high',
        trendType: 'crash',
        expectedMistakes: ['fomo_buying', 'holding_too_long', 'overconcentration'],
        stressLevel: 7,
        keyLesson: 'When everyone is euphoric, be cautious. Valuations eventually matter.'
    },
    keyDates: [
        { isoDate: '2000-03-10', displayDate: 'Mar 10, 2000', news: ['📈 NASDAQ hits all-time peak at 5,048', 'Tech stocks reach astronomical valuations', 'IPO frenzy continues'], sentiment: 'euphoria' },
        { isoDate: '2000-03-20', displayDate: 'Mar 20, 2000', news: ['Tech stocks begin sharp decline', 'First signs of bubble bursting', 'Investors start taking profits'], sentiment: 'fear' },
        { isoDate: '2000-04-03', displayDate: 'Apr 3, 2000', news: ['Microsoft antitrust ruling shakes market', 'NASDAQ drops 7.6%', 'Tech sector hit hard'], sentiment: 'panic' },
        { isoDate: '2000-04-14', displayDate: 'Apr 14, 2000', news: ['🔴 NASDAQ crashes over 9% in single day', 'Black Friday for tech stocks', 'Market down 34% from peak'], sentiment: 'panic' },
        { isoDate: '2000-05-30', displayDate: 'May 30, 2000', news: ['Brief tech rally fades', 'Dot-com layoffs begin', 'Venture capital dries up'], sentiment: 'fear' },
        { isoDate: '2000-07-17', displayDate: 'Jul 17, 2000', news: ['Summer rally attempts fail', 'More dot-coms go bankrupt', 'NASDAQ down 40% from peak'], sentiment: 'fear' },
        { isoDate: '2000-09-05', displayDate: 'Sep 5, 2000', news: ['Post-Labor Day sell-off', 'Tech earnings disappoint', 'Recession fears grow'], sentiment: 'fear' },
        { isoDate: '2000-10-19', displayDate: 'Oct 19, 2000', news: ['Intel warning crushes tech', 'NASDAQ erases 3 years of gains', 'Dot-com era officially over'], sentiment: 'panic' }
    ]
};

export const BULL_RUN_2021_CONFIG: ScenarioConfig = {
    id: 'bull-run-2021',
    name: '2021 Bull Run',
    description: 'Ride the post-pandemic bull market fueled by stimulus and retail trading.',
    period: 'Jan - Nov 2021',
    learningObjective: 'Practice taking profits and avoiding FOMO in a strong bull market.',
    icon: '🚀',
    color: 'green',
    startingBalance: 10000,
    symbols: ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'IBM', 'CSCO'],
    behavior: {
        volatility: 'medium',
        trendType: 'bull',
        expectedMistakes: ['fomo_buying', 'overconcentration', 'poor_timing'],
        stressLevel: 4,
        keyLesson: 'Even in bull markets, discipline matters. Take profits and stay diversified.'
    },
    keyDates: [
        { isoDate: '2021-01-25', displayDate: 'Jan 25, 2021', news: ['📈 GameStop mania begins', 'Retail traders vs Wall Street', 'Meme stock phenomenon born'], sentiment: 'euphoria' },
        { isoDate: '2021-02-12', displayDate: 'Feb 12, 2021', news: ['S&P 500 hits new highs', 'Stimulus checks fuel market', 'Tech continues to lead'], sentiment: 'optimism' },
        { isoDate: '2021-03-08', displayDate: 'Mar 8, 2021', news: ['Tech selloff on rate fears', 'Rotation to value stocks', 'Bond yields spike'], sentiment: 'neutral' },
        { isoDate: '2021-04-16', displayDate: 'Apr 16, 2021', news: ['📈 Markets resume rally', 'Strong earnings season', 'Coinbase goes public'], sentiment: 'optimism' },
        { isoDate: '2021-05-19', displayDate: 'May 19, 2021', news: ['Crypto crash spooks markets', 'Inflation concerns grow', 'Tech stocks wobble'], sentiment: 'fear' },
        { isoDate: '2021-07-19', displayDate: 'Jul 19, 2021', news: ['Delta variant fears hit markets', 'Dow drops 700 points', 'Recovery concerns emerge'], sentiment: 'fear' },
        { isoDate: '2021-09-07', displayDate: 'Sep 7, 2021', news: ['📈 S&P 500 at record highs', 'Tech giants dominate', 'Apple market cap nears $2.5T'], sentiment: 'optimism' },
        { isoDate: '2021-10-25', displayDate: 'Oct 25, 2021', news: ['📈 New all-time highs', 'Meta announces metaverse pivot', 'Tesla hits $1T valuation'], sentiment: 'euphoria' },
        { isoDate: '2021-11-22', displayDate: 'Nov 22, 2021', news: ['Market peaks for the year', 'Omicron variant discovered', 'Fed signals faster taper'], sentiment: 'neutral' }
    ]
};

// All scenario configurations
export const SCENARIO_CONFIGS: ScenarioConfig[] = [
    COVID_CRASH_CONFIG,
    FINANCIAL_CRISIS_2008_CONFIG,
    DOTCOM_BUBBLE_CONFIG,
    BULL_RUN_2021_CONFIG
];

/**
 * Get scenario config by ID
 */
export function getScenarioConfigById(id: string): ScenarioConfig | undefined {
    return SCENARIO_CONFIGS.find(config => config.id === id);
}
