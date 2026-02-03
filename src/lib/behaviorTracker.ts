/**
 * Behavior Tracking System
 * 
 * Tracks and categorizes user trading actions during scenario simulations.
 * Detects behavioral patterns like panic selling, FOMO buying, overtrading, etc.
 * 
 * This data is used for:
 * - Post-scenario analysis
 * - AI advisor context
 * - Learning outcome assessment
 */

import { Scenario, ScenarioBehavior } from './historicalScenarios';

// Types of behavioral mistakes we track
export type BehaviorTag =
    | 'panic_selling'      // Selling during sharp drops
    | 'fomo_buying'        // Buying after large rallies
    | 'overtrading'        // Too many trades in short time
    | 'overconcentration'  // >50% portfolio in single stock
    | 'poor_timing'        // Buying highs, selling lows
    | 'holding_too_long'   // Not taking profits
    | 'good_timing'        // Positive behavior - buying dips
    | 'profit_taking'      // Positive behavior - selling gains
    | 'diversified';       // Positive - balanced portfolio

// Individual trade action
export interface TradeAction {
    id: string;
    timestamp: Date;
    scenarioId: string;
    scenarioDay: number;
    type: 'buy' | 'sell';
    symbol: string;
    shares: number;
    price: number;
    totalValue: number;
    marketChange: number;  // % change that day
    tags: BehaviorTag[];   // Behavioral tags for this trade
}

// Session-level behavior summary
export interface BehaviorSummary {
    scenarioId: string;
    totalTrades: number;
    buyCount: number;
    sellCount: number;
    behaviorCounts: Record<BehaviorTag, number>;
    dominantBehavior: BehaviorTag | null;
    riskScore: number;  // 1-10, higher = riskier behavior
    learningScore: number;  // How well they avoided expected mistakes
}

// In-memory trade log for current session
let tradeLog: TradeAction[] = [];

/**
 * Log a trade action and analyze its behavioral implications
 */
export function logTrade(
    scenarioId: string,
    scenarioDay: number,
    type: 'buy' | 'sell',
    symbol: string,
    shares: number,
    price: number,
    marketChange: number,
    portfolio: Array<{ symbol: string; shares: number; avgCost: number }>,
    balance: number
): TradeAction {
    const totalValue = shares * price;
    const tags = analyzeTradeBehavior(type, marketChange, symbol, shares, price, portfolio, balance);

    const action: TradeAction = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        scenarioId,
        scenarioDay,
        type,
        symbol,
        shares,
        price,
        totalValue,
        marketChange,
        tags
    };

    tradeLog.push(action);
    console.log(`[BehaviorTracker] Trade logged:`, action);

    return action;
}

/**
 * Analyze a trade and assign behavioral tags
 */
function analyzeTradeBehavior(
    type: 'buy' | 'sell',
    marketChange: number,
    symbol: string,
    shares: number,
    price: number,
    portfolio: Array<{ symbol: string; shares: number; avgCost: number }>,
    balance: number
): BehaviorTag[] {
    const tags: BehaviorTag[] = [];
    const tradeValue = shares * price;

    // Calculate portfolio concentration after trade
    const totalPortfolioValue = portfolio.reduce((sum, p) => sum + (p.shares * price), 0) + balance;

    if (type === 'sell') {
        // PANIC SELLING: Selling when market is down significantly
        if (marketChange < -5) {
            tags.push('panic_selling');
        }

        // Check if selling at a loss
        const holding = portfolio.find(p => p.symbol === symbol);
        if (holding && price < holding.avgCost) {
            // Selling at a loss during a down market = panic
            if (marketChange < 0) {
                tags.push('poor_timing');
            }
        } else if (holding && price > holding.avgCost * 1.1) {
            // Selling at 10%+ profit = profit taking (good)
            tags.push('profit_taking');
        }
    }

    if (type === 'buy') {
        // FOMO BUYING: Buying after significant rally
        if (marketChange > 5) {
            tags.push('fomo_buying');
        }

        // GOOD TIMING: Buying during a dip
        if (marketChange < -3) {
            tags.push('good_timing');
        }

        // Check for overconcentration
        const existingHolding = portfolio.find(p => p.symbol === symbol);
        const existingValue = existingHolding ? existingHolding.shares * price : 0;
        const newConcentration = (existingValue + tradeValue) / (totalPortfolioValue + tradeValue);

        if (newConcentration > 0.5) {
            tags.push('overconcentration');
        }
    }

    // Check for overtrading (>3 trades in current session)
    const recentTrades = tradeLog.filter(t =>
        Date.now() - t.timestamp.getTime() < 60000 // Last minute
    );
    if (recentTrades.length >= 3) {
        tags.push('overtrading');
    }

    // If balanced portfolio after buy, mark as diversified
    if (type === 'buy' && portfolio.length >= 3) {
        const maxConcentration = Math.max(...portfolio.map(p => p.shares * price / totalPortfolioValue));
        if (maxConcentration < 0.4) {
            tags.push('diversified');
        }
    }

    return tags;
}

/**
 * Get all trades for current scenario session
 */
export function getTradeLog(scenarioId?: string): TradeAction[] {
    if (scenarioId) {
        return tradeLog.filter(t => t.scenarioId === scenarioId);
    }
    return [...tradeLog];
}

/**
 * Generate behavior summary for a scenario session
 */
export function generateBehaviorSummary(scenarioId: string, scenarioBehavior?: ScenarioBehavior): BehaviorSummary {
    const trades = getTradeLog(scenarioId);

    const behaviorCounts: Record<BehaviorTag, number> = {
        panic_selling: 0,
        fomo_buying: 0,
        overtrading: 0,
        overconcentration: 0,
        poor_timing: 0,
        holding_too_long: 0,
        good_timing: 0,
        profit_taking: 0,
        diversified: 0
    };

    // Count behavior occurrences
    trades.forEach(trade => {
        trade.tags.forEach(tag => {
            behaviorCounts[tag]++;
        });
    });

    // Find dominant behavior
    let maxCount = 0;
    let dominantBehavior: BehaviorTag | null = null;
    Object.entries(behaviorCounts).forEach(([tag, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantBehavior = tag as BehaviorTag;
        }
    });

    // Calculate risk score (negative behaviors increase score)
    const negativeBehaviors = ['panic_selling', 'fomo_buying', 'overtrading', 'overconcentration', 'poor_timing'];
    const negativeCount = negativeBehaviors.reduce((sum, b) => sum + behaviorCounts[b as BehaviorTag], 0);
    const riskScore = Math.min(10, Math.round((negativeCount / Math.max(1, trades.length)) * 10));

    // Calculate learning score (how well they avoided expected mistakes)
    let learningScore = 10;
    if (scenarioBehavior) {
        const expectedMistakeCount = scenarioBehavior.expectedMistakes.reduce((sum, mistake) =>
            sum + behaviorCounts[mistake], 0
        );
        learningScore = Math.max(0, 10 - expectedMistakeCount * 2);
    }

    return {
        scenarioId,
        totalTrades: trades.length,
        buyCount: trades.filter(t => t.type === 'buy').length,
        sellCount: trades.filter(t => t.type === 'sell').length,
        behaviorCounts,
        dominantBehavior,
        riskScore,
        learningScore
    };
}

/**
 * Clear trade log (call when exiting scenario)
 */
export function clearTradeLog(): void {
    tradeLog = [];
    console.log('[BehaviorTracker] Trade log cleared');
}

/**
 * Get human-readable description of a behavior tag
 */
export function getBehaviorDescription(tag: BehaviorTag): string {
    const descriptions: Record<BehaviorTag, string> = {
        panic_selling: 'Panic Selling - Selling during sharp market drops',
        fomo_buying: 'FOMO Buying - Buying after large rallies out of fear of missing out',
        overtrading: 'Overtrading - Making too many trades in a short period',
        overconcentration: 'Overconcentration - Putting too much into a single stock',
        poor_timing: 'Poor Timing - Buying high and selling low',
        holding_too_long: 'Holding Too Long - Not taking profits when available',
        good_timing: 'Good Timing - Buying during market dips',
        profit_taking: 'Profit Taking - Selling positions at a gain',
        diversified: 'Diversified - Maintaining a balanced portfolio'
    };
    return descriptions[tag];
}

/**
 * Check if a behavior is positive or negative
 */
export function isPositiveBehavior(tag: BehaviorTag): boolean {
    return ['good_timing', 'profit_taking', 'diversified'].includes(tag);
}
