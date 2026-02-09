/**
 * Scenario Resolver Layer
 * 
 * Runtime bridge between scenario configs and historical price data.
 * Resolves dates, fetches prices, and calculates changes dynamically.
 */

import { ScenarioConfig, ScenarioKeyDate } from './scenarioConfig';
import {
    getClosePrice,
    getPricesForDate,
    findNextTradingDay,
    hasDataForDate,
    calculateChange
} from '../data/historicalPrices';

// Interface matching the existing HistoricalDay format for backward compatibility
export interface ResolvedDay {
    date: string;           // Display date (e.g., "Feb 19, 2020")
    isoDate: string;        // ISO date for lookups
    prices: Record<string, number>;
    changes: Record<string, number>;
    news?: string[];
    sentiment?: 'panic' | 'fear' | 'neutral' | 'optimism' | 'euphoria';
}

/**
 * Resolve a single key date to full day data with prices
 */
export function resolveKeyDate(
    keyDate: ScenarioKeyDate,
    prevKeyDate: ScenarioKeyDate | null,
    symbols: string[]
): ResolvedDay {
    // Find actual trading day (in case keyDate falls on weekend/holiday)
    const tradingDate = findNextTradingDay(keyDate.isoDate) || keyDate.isoDate;

    // Get prices for all symbols
    const prices: Record<string, number> = {};
    const changes: Record<string, number> = {};

    for (const symbol of symbols) {
        const price = getClosePrice(tradingDate, symbol);
        if (price !== undefined) {
            prices[symbol] = Number(price.toFixed(2));

            // Calculate change from previous day
            if (prevKeyDate) {
                const prevTradingDate = findNextTradingDay(prevKeyDate.isoDate) || prevKeyDate.isoDate;
                changes[symbol] = calculateChange(symbol, tradingDate, prevTradingDate);
            } else {
                changes[symbol] = 0; // First day has 0 change
            }
        }
    }

    return {
        date: keyDate.displayDate,
        isoDate: tradingDate,
        prices,
        changes,
        news: keyDate.news,
        sentiment: keyDate.sentiment
    };
}

/**
 * Resolve all days for a scenario config
 */
export function resolveScenarioDays(config: ScenarioConfig): ResolvedDay[] {
    const resolvedDays: ResolvedDay[] = [];

    for (let i = 0; i < config.keyDates.length; i++) {
        const keyDate = config.keyDates[i];
        const prevKeyDate = i > 0 ? config.keyDates[i - 1] : null;

        const resolved = resolveKeyDate(keyDate, prevKeyDate, config.symbols);
        resolvedDays.push(resolved);
    }

    return resolvedDays;
}

/**
 * Get prices for a specific day index in a scenario
 */
export function getScenarioDayPrices(
    config: ScenarioConfig,
    dayIndex: number
): Record<string, number> {
    if (dayIndex < 0 || dayIndex >= config.keyDates.length) {
        return {};
    }

    const keyDate = config.keyDates[dayIndex];
    const tradingDate = findNextTradingDay(keyDate.isoDate) || keyDate.isoDate;

    return getPricesForDate(tradingDate, config.symbols);
}

/**
 * Get percentage changes for a specific day index
 */
export function getScenarioDayChanges(
    config: ScenarioConfig,
    dayIndex: number
): Record<string, number> {
    if (dayIndex < 0 || dayIndex >= config.keyDates.length) {
        return {};
    }

    const keyDate = config.keyDates[dayIndex];
    const prevKeyDate = dayIndex > 0 ? config.keyDates[dayIndex - 1] : null;

    const tradingDate = findNextTradingDay(keyDate.isoDate) || keyDate.isoDate;

    const changes: Record<string, number> = {};

    for (const symbol of config.symbols) {
        if (prevKeyDate) {
            const prevTradingDate = findNextTradingDay(prevKeyDate.isoDate) || prevKeyDate.isoDate;
            changes[symbol] = calculateChange(symbol, tradingDate, prevTradingDate);
        } else {
            changes[symbol] = 0;
        }
    }

    return changes;
}

/**
 * Build price history up to current day (for charts)
 */
export function buildScenarioPriceHistory(
    config: ScenarioConfig,
    dayIndex: number,
    symbol: string
): Array<{ time: string; value: number }> {
    const history: Array<{ time: string; value: number }> = [];

    for (let i = 0; i <= dayIndex && i < config.keyDates.length; i++) {
        const keyDate = config.keyDates[i];
        const tradingDate = findNextTradingDay(keyDate.isoDate) || keyDate.isoDate;
        const price = getClosePrice(tradingDate, symbol);

        if (price !== undefined) {
            history.push({
                time: keyDate.displayDate,
                value: Number(price.toFixed(2))
            });
        }
    }

    // Recharts needs at least 2 points
    if (history.length === 1) {
        history.unshift({ time: 'Start', value: history[0].value });
    }

    return history;
}

/**
 * Get display date for a day index
 */
export function getScenarioDayDate(config: ScenarioConfig, dayIndex: number): string {
    if (dayIndex < 0 || dayIndex >= config.keyDates.length) {
        return '';
    }
    return config.keyDates[dayIndex].displayDate;
}

/**
 * Get news for a day index
 */
export function getScenarioDayNews(config: ScenarioConfig, dayIndex: number): string[] {
    if (dayIndex < 0 || dayIndex >= config.keyDates.length) {
        return [];
    }
    return config.keyDates[dayIndex].news || [];
}

/**
 * Get total number of days in scenario
 */
export function getScenarioTotalDays(config: ScenarioConfig): number {
    return config.keyDates.length;
}

/**
 * Check if a symbol is available in a scenario
 */
export function isSymbolInScenarioConfig(config: ScenarioConfig, symbol: string): boolean {
    return config.symbols.includes(symbol);
}
