/**
 * Historical Price Data Layer
 * 
 * Loads and indexes historical price data from Yahoo Finance JSON files.
 * Provides O(1) lookup by date and symbol for scenario price resolution.
 */

// Import JSON data statically
import AAPL_DATA from '../../../Data/AAPL.json';
import MSFT_DATA from '../../../Data/MSFT.json';
import GOOG_DATA from '../../../Data/GOOG.json';
import AMZN_DATA from '../../../Data/AMZN.json';
import IBM_DATA from '../../../Data/IBM.json';
import CSCO_DATA from '../../../Data/CSCO.json';
import EBAY_DATA from '../../../Data/EBAY.json';

export interface PriceData {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// Map of date string (YYYY-MM-DD) -> symbol -> price data
type PriceIndex = Map<string, Map<string, PriceData>>;

// Global price index (initialized once)
let priceIndex: PriceIndex | null = null;

/**
 * Convert Unix timestamp to ISO date string (YYYY-MM-DD)
 */
function timestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
}

/**
 * Parse Yahoo Finance JSON format into indexed price data
 */
function parseYahooFinanceData(data: any, symbol: string, index: PriceIndex): void {
    const result = data.chart?.result?.[0];
    if (!result) {
        console.warn(`[HistoricalPrices] No data found for ${symbol}`);
        return;
    }

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0];

    if (!quote) {
        console.warn(`[HistoricalPrices] No quote data for ${symbol}`);
        return;
    }

    const opens = quote.open || [];
    const highs = quote.high || [];
    const lows = quote.low || [];
    const closes = quote.close || [];
    const volumes = quote.volume || [];

    for (let i = 0; i < timestamps.length; i++) {
        const dateStr = timestampToDate(timestamps[i]);
        const close = closes[i];

        // Skip invalid entries
        if (close === null || close === undefined || isNaN(close)) continue;

        if (!index.has(dateStr)) {
            index.set(dateStr, new Map());
        }

        const symbolMap = index.get(dateStr)!;
        symbolMap.set(symbol, {
            open: opens[i] || close,
            high: highs[i] || close,
            low: lows[i] || close,
            close: close,
            volume: volumes[i] || 0
        });
    }
}

/**
 * Build the price index from all JSON files
 */
function buildPriceIndex(): PriceIndex {
    const index: PriceIndex = new Map();

    const datasets: [any, string][] = [
        [AAPL_DATA, 'AAPL'],
        [MSFT_DATA, 'MSFT'],
        [GOOG_DATA, 'GOOG'],
        [AMZN_DATA, 'AMZN'],
        [IBM_DATA, 'IBM'],
        [CSCO_DATA, 'CSCO'],
        [EBAY_DATA, 'EBAY'],
    ];

    for (const [data, symbol] of datasets) {
        parseYahooFinanceData(data, symbol, index);
    }

    console.log(`[HistoricalPrices] Indexed ${index.size} trading days`);
    return index;
}

/**
 * Initialize the price index (lazy loading)
 */
export function initializePriceIndex(): void {
    if (!priceIndex) {
        priceIndex = buildPriceIndex();
    }
}

/**
 * Get price data for a specific date and symbol
 */
export function getPrice(date: string, symbol: string): PriceData | undefined {
    initializePriceIndex();
    return priceIndex?.get(date)?.get(symbol);
}

/**
 * Get closing price for a specific date and symbol
 */
export function getClosePrice(date: string, symbol: string): number | undefined {
    return getPrice(date, symbol)?.close;
}

/**
 * Get prices for multiple symbols on a date
 */
export function getPricesForDate(date: string, symbols: string[]): Record<string, number> {
    initializePriceIndex();
    const result: Record<string, number> = {};
    const dateData = priceIndex?.get(date);

    if (!dateData) return result;

    for (const symbol of symbols) {
        const price = dateData.get(symbol);
        if (price) {
            result[symbol] = price.close;
        }
    }
    return result;
}

/**
 * Check if data exists for a given date
 */
export function hasDataForDate(date: string): boolean {
    initializePriceIndex();
    return priceIndex?.has(date) ?? false;
}

/**
 * Get all available dates (sorted)
 */
export function getAvailableDates(): string[] {
    initializePriceIndex();
    return Array.from(priceIndex?.keys() ?? []).sort();
}

/**
 * Get available symbols
 */
export function getAvailableSymbols(): string[] {
    return ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'IBM', 'CSCO'];
}

/**
 * Find the next trading day on or after a given date
 */
export function findNextTradingDay(date: string, maxDaysToSearch: number = 10): string | undefined {
    initializePriceIndex();

    let currentDate = new Date(date);
    for (let i = 0; i < maxDaysToSearch; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (priceIndex?.has(dateStr)) {
            return dateStr;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return undefined;
}

/**
 * Find the previous trading day on or before a given date
 */
export function findPrevTradingDay(date: string, maxDaysToSearch: number = 10): string | undefined {
    initializePriceIndex();

    let currentDate = new Date(date);
    for (let i = 0; i < maxDaysToSearch; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (priceIndex?.has(dateStr)) {
            return dateStr;
        }
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return undefined;
}

/**
 * Calculate percentage change between two dates for a symbol
 */
export function calculateChange(symbol: string, currentDate: string, previousDate: string): number {
    const current = getClosePrice(currentDate, symbol);
    const previous = getClosePrice(previousDate, symbol);

    if (!current || !previous || previous === 0) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
}
