/**
 * Historical Market Scenarios - Backward Compatibility Layer
 * 
 * This module maintains the existing API while internally using:
 * - Dataset-driven price data from Data/*.json
 * - Configuration-based scenario definitions
 * - Runtime price resolution
 * 
 * UI components continue to use this file without changes.
 */

import {
    SCENARIO_CONFIGS,
    ScenarioConfig,
    getScenarioConfigById,
    ScenarioBehavior
} from './scenarios/scenarioConfig';
import {
    resolveScenarioDays,
    ResolvedDay,
    buildScenarioPriceHistory,
    getScenarioDayPrices,
    getScenarioDayChanges,
    isSymbolInScenarioConfig
} from './scenarios/scenarioResolver';
import { initializePriceIndex } from './data/historicalPrices';

// ============================================================================
// EXPORTED INTERFACES (unchanged for backward compatibility)
// ============================================================================

export interface HistoricalDay {
    date: string;
    isoDate: string;
    prices: Record<string, number>;
    changes: Record<string, number>;
    news?: string[];
    sentiment?: 'panic' | 'fear' | 'neutral' | 'optimism' | 'euphoria';
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
    stocks: string[];
    behavior: ScenarioBehavior;
    days: HistoricalDay[];
}

// Re-export ScenarioBehavior for consumers
export type { ScenarioBehavior };

// ============================================================================
// SCENARIO GENERATION (dynamic, from config + dataset)
// ============================================================================

// Cache for generated scenarios
let scenarioCache: Map<string, Scenario> = new Map();

/**
 * Convert a ScenarioConfig to a Scenario with resolved days
 */
function generateScenarioFromConfig(config: ScenarioConfig): Scenario {
    // Check cache first
    if (scenarioCache.has(config.id)) {
        return scenarioCache.get(config.id)!;
    }

    // Initialize price index if needed
    initializePriceIndex();

    // Resolve days dynamically from dataset
    const resolvedDays = resolveScenarioDays(config);

    // Convert ResolvedDay[] to HistoricalDay[]
    const days: HistoricalDay[] = resolvedDays.map(day => ({
        date: day.date,
        isoDate: day.isoDate,
        prices: day.prices,
        changes: day.changes,
        news: day.news,
        sentiment: day.sentiment
    }));

    const scenario: Scenario = {
        id: config.id,
        name: config.name,
        description: config.description,
        period: config.period,
        learningObjective: config.learningObjective,
        icon: config.icon,
        color: config.color,
        startingBalance: config.startingBalance,
        stocks: config.symbols,
        behavior: config.behavior,
        days
    };

    // Cache the result
    scenarioCache.set(config.id, scenario);

    return scenario;
}

/**
 * Clear scenario cache (useful for testing or hot reload)
 */
export function clearScenarioCache(): void {
    scenarioCache.clear();
}

// ============================================================================
// EXPORTED SCENARIOS (generated dynamically)
// ============================================================================

/**
 * Get all available scenarios
 * Lazily generates scenarios from configs on first access
 */
export function getScenarios(): Scenario[] {
    return SCENARIO_CONFIGS.map(config => generateScenarioFromConfig(config));
}

// For backward compatibility, export SCENARIOS as a getter
export const SCENARIOS: Scenario[] = new Proxy([] as Scenario[], {
    get(target, prop) {
        const scenarios = getScenarios();
        if (prop === 'length') return scenarios.length;
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
            return scenarios[Number(prop)];
        }
        if (prop === Symbol.iterator) {
            return function* () {
                for (const s of scenarios) yield s;
            };
        }
        if (typeof prop === 'string' && prop in Array.prototype) {
            return (scenarios as any)[prop].bind(scenarios);
        }
        return (target as any)[prop];
    }
});

// ============================================================================
// HELPER FUNCTIONS (maintained for backward compatibility)
// ============================================================================

/**
 * Get a scenario by ID
 */
export function getScenarioById(id: string): Scenario | undefined {
    const config = getScenarioConfigById(id);
    if (!config) return undefined;
    return generateScenarioFromConfig(config);
}

/**
 * Get historical price for a specific symbol on a specific day
 */
export function getHistoricalPrice(scenario: Scenario, dayIndex: number, symbol: string): number | undefined {
    if (dayIndex < 0 || dayIndex >= scenario.days.length) return undefined;
    return scenario.days[dayIndex].prices[symbol];
}

/**
 * Get all prices for a specific day
 */
export function getDayPrices(scenario: Scenario, dayIndex: number): Record<string, number> {
    if (dayIndex < 0 || dayIndex >= scenario.days.length) return {};
    return scenario.days[dayIndex].prices;
}

/**
 * Get percentage changes for a specific day
 */
export function getDayChanges(scenario: Scenario, dayIndex: number): Record<string, number> {
    if (dayIndex < 0 || dayIndex >= scenario.days.length) return {};
    return scenario.days[dayIndex].changes;
}

/**
 * Build price history up to current day (for charts)
 * Uses the resolver for fresh data
 */
export function buildPriceHistory(scenario: Scenario, dayIndex: number, symbol: string): Array<{ time: string; value: number }> {
    const config = getScenarioConfigById(scenario.id);
    if (config) {
        return buildScenarioPriceHistory(config, dayIndex, symbol);
    }

    // Fallback to days array
    const history: Array<{ time: string; value: number }> = [];
    for (let i = 0; i <= dayIndex && i < scenario.days.length; i++) {
        const price = scenario.days[i].prices[symbol];
        if (price !== undefined) {
            history.push({ time: scenario.days[i].date, value: price });
        }
    }

    if (history.length === 1) {
        history.unshift({ time: 'Start', value: history[0].value });
    }

    return history;
}

/**
 * Check if a symbol is available in a scenario
 */
export function isSymbolInScenario(scenario: Scenario, symbol: string): boolean {
    return scenario.stocks.includes(symbol);
}

/**
 * Calculate portfolio value for a given day
 */
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
