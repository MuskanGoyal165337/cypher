import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Award, Target } from 'lucide-react';
import { Scenario, ScenarioBehavior } from '@/lib/historicalScenarios';
import { TradeAction, BehaviorSummary, BehaviorTag, getBehaviorDescription, isPositiveBehavior } from '@/lib/behaviorTracker';

interface ScenarioSummaryProps {
    isOpen: boolean;
    onClose: () => void;
    scenario: Scenario;
    trades: TradeAction[];
    summary: BehaviorSummary;
    finalBalance: number;
    startingBalance: number;
}

export function ScenarioSummary({
    isOpen,
    onClose,
    scenario,
    trades,
    summary,
    finalBalance,
    startingBalance
}: ScenarioSummaryProps) {
    const profitLoss = finalBalance - startingBalance;
    const profitPercent = ((profitLoss / startingBalance) * 100).toFixed(2);
    const isProfit = profitLoss >= 0;

    // Group trades by behavior tag
    const tradesByBehavior: Record<BehaviorTag, TradeAction[]> = {} as Record<BehaviorTag, TradeAction[]>;
    trades.forEach(trade => {
        trade.tags.forEach(tag => {
            if (!tradesByBehavior[tag]) {
                tradesByBehavior[tag] = [];
            }
            tradesByBehavior[tag].push(trade);
        });
    });

    // Check which expected mistakes the user made
    const mistakesMade = scenario.behavior.expectedMistakes.filter(
        mistake => summary.behaviorCounts[mistake] > 0
    );
    const mistakesAvoided = scenario.behavior.expectedMistakes.filter(
        mistake => summary.behaviorCounts[mistake] === 0
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{scenario.icon}</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Scenario Complete</h2>
                                        <p className="text-blue-100">{scenario.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
                            {/* Performance Summary */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-800 p-4 rounded-xl text-center">
                                    <p className="text-gray-400 text-sm">Final Balance</p>
                                    <p className={`text-2xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                        ₹{finalBalance.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl text-center">
                                    <p className="text-gray-400 text-sm">Profit/Loss</p>
                                    <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                        {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                        {profitPercent}%
                                    </div>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl text-center">
                                    <p className="text-gray-400 text-sm">Total Trades</p>
                                    <p className="text-2xl font-bold text-white">{summary.totalTrades}</p>
                                </div>
                            </div>

                            {/* Learning Score */}
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-4 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Award className="w-8 h-8 text-yellow-400" />
                                    <div className="flex-1">
                                        <p className="text-yellow-400 font-bold">Learning Score: {summary.learningScore}/10</p>
                                        <p className="text-sm text-gray-300">{scenario.behavior.keyLesson}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Behavior Analysis */}
                            <div>
                                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-400" />
                                    Behavior Analysis
                                </h3>

                                {/* Mistakes Made */}
                                {mistakesMade.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-red-400 text-sm font-medium mb-2 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" /> Mistakes Made (Expected in this scenario)
                                        </p>
                                        <div className="space-y-2">
                                            {mistakesMade.map(mistake => (
                                                <div key={mistake} className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                                                    <p className="text-red-300 font-medium">{getBehaviorDescription(mistake)}</p>
                                                    <p className="text-red-200 text-sm mt-1">
                                                        Occurred {summary.behaviorCounts[mistake]} time(s)
                                                    </p>
                                                    {/* Show specific trades */}
                                                    <div className="mt-2 space-y-1">
                                                        {tradesByBehavior[mistake]?.slice(0, 3).map(trade => (
                                                            <div key={trade.id} className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                                                                {trade.type.toUpperCase()} {trade.shares} {trade.symbol} @ ₹{trade.price.toFixed(2)}
                                                                <span className="text-gray-500"> (Day {trade.scenarioDay + 1}, {trade.marketChange >= 0 ? '+' : ''}{trade.marketChange.toFixed(1)}%)</span>
                                                            </div>
                                                        ))}
                                                        {(tradesByBehavior[mistake]?.length || 0) > 3 && (
                                                            <p className="text-xs text-gray-500">+{tradesByBehavior[mistake].length - 3} more</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Mistakes Avoided - only show if trades were made */}
                                {trades.length > 0 && mistakesAvoided.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-green-400 text-sm font-medium mb-2 flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" /> Mistakes Avoided
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {mistakesAvoided.map(mistake => (
                                                <span key={mistake} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                                                    ✓ No {mistake.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* All Detected Behaviors */}
                                {Object.entries(tradesByBehavior).length > 0 && (
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium mb-2">All Detected Behaviors</p>
                                        <div className="space-y-2">
                                            {Object.entries(tradesByBehavior).map(([tag, tagTrades]) => (
                                                <div
                                                    key={tag}
                                                    className={`p-3 rounded-lg border ${isPositiveBehavior(tag as BehaviorTag)
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-gray-800 border-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className={isPositiveBehavior(tag as BehaviorTag) ? 'text-green-300' : 'text-gray-300'}>
                                                            {getBehaviorDescription(tag as BehaviorTag)}
                                                        </span>
                                                        <span className="text-gray-500 text-sm">{tagTrades.length}x</span>
                                                    </div>
                                                    <div className="mt-2 space-y-1">
                                                        {tagTrades.slice(0, 2).map(trade => (
                                                            <div key={trade.id} className="text-xs text-gray-500">
                                                                → {trade.type.toUpperCase()} {trade.shares} {trade.symbol} @ ₹{trade.price.toFixed(2)} on Day {trade.scenarioDay + 1}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* No trades message */}
                                {trades.length === 0 && (
                                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                                        <p className="text-gray-400">No trades were made during this scenario.</p>
                                        <p className="text-gray-500 text-sm mt-1">Try making some trades next time to see your behavior analysis!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-700 p-4 bg-gray-800/50">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Continue to Live Market
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
