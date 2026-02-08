import { User, Trophy, TrendingUp, TrendingDown, Clock, Target, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ScenarioResult, getScenarioHistory, getScenarioStats, clearScenarioHistory } from '@/lib/scenarioHistory';
import { useState, useEffect } from 'react';

interface ProfileViewProps {
    userName?: string;
}

export function ProfileView({ userName = "Trader" }: ProfileViewProps) {
    const [history, setHistory] = useState<ScenarioResult[]>([]);
    const [stats, setStats] = useState(getScenarioStats());

    useEffect(() => {
        setHistory(getScenarioHistory());
        setStats(getScenarioStats());
    }, []);

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to clear all scenario history?')) {
            clearScenarioHistory();
            setHistory([]);
            setStats(getScenarioStats());
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/30 p-8 rounded-3xl">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{userName}</h1>
                        <p className="text-gray-400">Scenario Training Profile</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.totalScenarios}</p>
                    <p className="text-xs text-gray-400">Scenarios Completed</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center">
                    <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">Win Rate</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center">
                    {stats.totalProfitLoss >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    ) : (
                        <TrendingDown className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    )}
                    <p className={`text-2xl font-bold ${stats.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{Math.abs(stats.totalProfitLoss).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-400">Total P/L</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center">
                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.averageLearningScore.toFixed(1)}</p>
                    <p className="text-xs text-gray-400">Avg Learning Score</p>
                </div>
            </div>

            {/* Scenario History */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Scenario History
                    </h2>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="p-12 text-center">
                        <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No scenarios completed yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Complete scenarios to see your training history here
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {history.map((result, index) => (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{result.scenarioIcon}</span>
                                        <div>
                                            <h3 className="text-white font-medium">{result.scenarioName}</h3>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(result.completedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {/* Days Completed */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-400">Days</p>
                                            <p className="text-white font-medium">
                                                {result.daysCompleted}/{result.totalDays}
                                            </p>
                                        </div>

                                        {/* Trades */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-400">Trades</p>
                                            <p className="text-white font-medium">{result.totalTrades}</p>
                                        </div>

                                        {/* Learning Score */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-400">Score</p>
                                            <p className="text-yellow-400 font-medium">{result.learningScore}/10</p>
                                        </div>

                                        {/* Profit/Loss */}
                                        <div className="text-right min-w-[100px]">
                                            <p className={`text-lg font-bold ${result.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {result.profitLoss >= 0 ? '+' : ''}₹{result.profitLoss.toLocaleString('en-IN')}
                                            </p>
                                            <p className={`text-xs ${result.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {result.profitLossPercent >= 0 ? '+' : ''}{result.profitLossPercent.toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
