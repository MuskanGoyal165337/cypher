/**
 * API Service
 * 
 * Handles all HTTP calls to the backend server
 */

const API_BASE = 'http://localhost:3001/api';

// ============================================================================
// USER API
// ============================================================================

/**
 * Create or get existing user
 */
export async function createOrGetUser(username: string): Promise<{ user: User; isNew: boolean } | null> {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            console.error('[API] Failed to create/get user:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('[API] User error:', error);
        return null;
    }
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('[API] Get user error:', error);
        return null;
    }
}

// ============================================================================
// SCENARIO API
// ============================================================================

/**
 * Save scenario result to database
 */
export async function saveScenarioResult(userId: string, result: ScenarioResultInput): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/scenarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                scenario_id: result.scenarioId,
                scenario_name: result.scenarioName,
                scenario_icon: result.scenarioIcon,
                starting_balance: result.startingBalance,
                final_balance: result.finalBalance,
                profit_loss: result.profitLoss,
                profit_loss_percent: result.profitLossPercent,
                total_trades: result.totalTrades,
                learning_score: result.learningScore,
                days_completed: result.daysCompleted,
                total_days: result.totalDays
            })
        });

        if (!response.ok) {
            console.error('[API] Failed to save scenario:', response.status);
            return false;
        }

        console.log('[API] Scenario saved successfully');
        return true;
    } catch (error) {
        console.error('[API] Save scenario error:', error);
        return false;
    }
}

/**
 * Get user's scenario history
 */
export async function getScenarioHistory(userId: string): Promise<ScenarioResultDB[]> {
    try {
        const response = await fetch(`${API_BASE}/scenarios/${userId}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('[API] Get history error:', error);
        return [];
    }
}

/**
 * Get user's scenario stats
 */
export async function getScenarioStats(userId: string): Promise<ScenarioStats | null> {
    try {
        const response = await fetch(`${API_BASE}/scenarios/${userId}/stats`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.stats;
    } catch (error) {
        console.error('[API] Get stats error:', error);
        return null;
    }
}

// ============================================================================
// TYPES
// ============================================================================

export interface User {
    id: string;
    username: string;
    email?: string;
    created_at: string;
    last_login?: string;
}

export interface ScenarioResultInput {
    scenarioId: string;
    scenarioName: string;
    scenarioIcon: string;
    startingBalance: number;
    finalBalance: number;
    profitLoss: number;
    profitLossPercent: number;
    totalTrades: number;
    learningScore: number;
    daysCompleted: number;
    totalDays: number;
}

export interface ScenarioResultDB {
    id: string;
    user_id: string;
    scenario_id: string;
    scenario_name: string;
    scenario_icon: string;
    starting_balance: number;
    final_balance: number;
    profit_loss: number;
    profit_loss_percent: number;
    total_trades: number;
    learning_score: number;
    days_completed: number;
    total_days: number;
    completed_at: string;
}

export interface ScenarioStats {
    totalScenarios: number;
    profitableScenarios: number;
    winRate: number;
    totalProfitLoss: number;
    averageLearningScore: number;
}
