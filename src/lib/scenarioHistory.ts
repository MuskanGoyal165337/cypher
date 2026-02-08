// Scenario History Storage
// Tracks completed scenarios for the Profile section

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

// In-memory storage (persists during session)
let scenarioHistory: ScenarioResult[] = [];

/**
 * Add a completed scenario to history
 */
export function addScenarioResult(result: Omit<ScenarioResult, 'id' | 'completedAt'>): ScenarioResult {
    const newResult: ScenarioResult = {
        ...result,
        id: `scenario-${Date.now()}`,
        completedAt: new Date()
    };

    scenarioHistory.unshift(newResult); // Add to beginning (newest first)

    // Keep only last 50 results
    if (scenarioHistory.length > 50) {
        scenarioHistory = scenarioHistory.slice(0, 50);
    }

    console.log('[ScenarioHistory] Added result:', newResult);
    return newResult;
}

/**
 * Get all scenario results
 */
export function getScenarioHistory(): ScenarioResult[] {
    return [...scenarioHistory];
}

/**
 * Get summary statistics
 */
export function getScenarioStats() {
    const total = scenarioHistory.length;
    const profitable = scenarioHistory.filter(s => s.profitLoss > 0).length;
    const totalPL = scenarioHistory.reduce((sum, s) => sum + s.profitLoss, 0);
    const avgLearningScore = total > 0
        ? scenarioHistory.reduce((sum, s) => sum + s.learningScore, 0) / total
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
    scenarioHistory = [];
    console.log('[ScenarioHistory] History cleared');
}
