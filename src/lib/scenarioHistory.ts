// Scenario History Storage
// Tracks completed scenarios for the Profile section
// Now with Supabase persistence via API

import {
    saveScenarioResult,
    getScenarioHistory as fetchScenarioHistoryFromAPI,
    getScenarioStats as fetchScenarioStatsFromAPI,
    createOrGetUser,
    ScenarioResultDB,
    ScenarioStats
} from './api';

export interface ScenarioResult {
    id: string;
    scenarioId: string;
    scenarioName: string;
    scenarioIcon: string;
    startingBalance: number;
    finalBalance: number;
    profitLoss: number;
    profitLossPercent: number;
    totalTrades: number;
    learningScore: number;
    completedAt: Date;
    daysCompleted: number;
    totalDays: number;
}

// User ID storage key
const USER_ID_KEY = 'cypher_user_id';
const USER_NAME_KEY = 'cypher_username';

// In-memory cache (synced with database)
let scenarioHistoryCache: ScenarioResult[] = [];
let currentUserId: string | null = null;

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * Get or create user ID (stored in localStorage)
 */
export async function initializeUser(username?: string): Promise<string | null> {
    // Check localStorage for existing user
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    const storedUsername = localStorage.getItem(USER_NAME_KEY);

    if (storedUserId && storedUsername) {
        currentUserId = storedUserId;
        console.log('[ScenarioHistory] Using existing user:', storedUsername);
        // Load history from database
        await loadHistoryFromDB();
        return storedUserId;
    }

    // Create new user with provided or default username
    const name = username || `user_${Date.now()}`;
    const result = await createOrGetUser(name);

    if (result?.user) {
        currentUserId = result.user.id;
        localStorage.setItem(USER_ID_KEY, result.user.id);
        localStorage.setItem(USER_NAME_KEY, name);
        console.log('[ScenarioHistory] Created/got user:', name, result.isNew ? '(new)' : '(existing)');
        // Load history from database
        await loadHistoryFromDB();
        return result.user.id;
    }

    console.warn('[ScenarioHistory] Failed to initialize user, using local-only mode');
    return null;
}

/**
 * Get current user ID
 */
export function getCurrentUserId(): string | null {
    if (currentUserId) return currentUserId;
    return localStorage.getItem(USER_ID_KEY);
}

// ============================================================================
// SCENARIO HISTORY OPERATIONS
// ============================================================================

/**
 * Load history from database
 */
async function loadHistoryFromDB(): Promise<void> {
    const userId = getCurrentUserId();
    if (!userId) return;

    try {
        const results = await fetchScenarioHistoryFromAPI(userId);
        scenarioHistoryCache = results.map(dbResultToLocal);
        console.log(`[ScenarioHistory] Loaded ${results.length} results from database`);
    } catch (error) {
        console.error('[ScenarioHistory] Failed to load from DB:', error);
    }
}

/**
 * Convert DB result to local format
 */
function dbResultToLocal(db: ScenarioResultDB): ScenarioResult {
    return {
        id: db.id,
        scenarioId: db.scenario_id,
        scenarioName: db.scenario_name,
        scenarioIcon: db.scenario_icon,
        startingBalance: db.starting_balance,
        finalBalance: db.final_balance,
        profitLoss: db.profit_loss,
        profitLossPercent: db.profit_loss_percent,
        totalTrades: db.total_trades,
        learningScore: db.learning_score,
        daysCompleted: db.days_completed,
        totalDays: db.total_days,
        completedAt: new Date(db.completed_at)
    };
}

/**
 * Add a completed scenario to history
 */
export async function addScenarioResult(result: Omit<ScenarioResult, 'id' | 'completedAt'>): Promise<ScenarioResult> {
    const newResult: ScenarioResult = {
        ...result,
        id: `scenario-${Date.now()}`,
        completedAt: new Date()
    };

    // Add to local cache immediately
    scenarioHistoryCache.unshift(newResult);

    // Keep only last 50 results
    if (scenarioHistoryCache.length > 50) {
        scenarioHistoryCache = scenarioHistoryCache.slice(0, 50);
    }

    console.log('[ScenarioHistory] Added result:', newResult);

    // Save to database in background
    const userId = getCurrentUserId();
    if (userId) {
        saveScenarioResult(userId, {
            scenarioId: result.scenarioId,
            scenarioName: result.scenarioName,
            scenarioIcon: result.scenarioIcon,
            startingBalance: result.startingBalance,
            finalBalance: result.finalBalance,
            profitLoss: result.profitLoss,
            profitLossPercent: result.profitLossPercent,
            totalTrades: result.totalTrades,
            learningScore: result.learningScore,
            daysCompleted: result.daysCompleted,
            totalDays: result.totalDays
        }).then(success => {
            if (success) {
                console.log('[ScenarioHistory] Synced to database');
            }
        });
    }

    return newResult;
}

/**
 * Get all scenario results (from cache)
 */
export function getScenarioHistoryLocal(): ScenarioResult[] {
    return [...scenarioHistoryCache];
}

// Alias for backward compatibility
export { getScenarioHistoryLocal as getScenarioHistory };

/**
 * Get summary statistics
 */
export async function getScenarioStatsAsync(): Promise<{
    totalScenarios: number;
    profitableScenarios: number;
    winRate: number;
    totalProfitLoss: number;
    averageLearningScore: number;
}> {
    const userId = getCurrentUserId();

    // Try to get from database
    if (userId) {
        const stats = await fetchScenarioStatsFromAPI(userId);
        if (stats) return stats;
    }

    // Fallback to local calculation
    return getScenarioStatsLocal();
}

/**
 * Get stats from local cache (sync version)
 */
export function getScenarioStatsLocal() {
    const total = scenarioHistoryCache.length;
    const profitable = scenarioHistoryCache.filter(s => s.profitLoss > 0).length;
    const totalPL = scenarioHistoryCache.reduce((sum, s) => sum + s.profitLoss, 0);
    const avgLearningScore = total > 0
        ? scenarioHistoryCache.reduce((sum, s) => sum + s.learningScore, 0) / total
        : 0;

    return {
        totalScenarios: total,
        profitableScenarios: profitable,
        winRate: total > 0 ? (profitable / total) * 100 : 0,
        totalProfitLoss: totalPL,
        averageLearningScore: avgLearningScore
    };
}

/**
 * Clear all history
 */
export function clearScenarioHistory(): void {
    scenarioHistoryCache = [];
    console.log('[ScenarioHistory] History cleared');
}
