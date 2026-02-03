import { useState } from 'react';
import { SCENARIOS, Scenario } from '@/lib/historicalScenarios';
import { X, Play, Calendar, Target, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScenarioSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectScenario: (scenario: Scenario | null) => void;
    activeScenario: Scenario | null;
}

export function ScenarioSelector({ isOpen, onClose, onSelectScenario, activeScenario }: ScenarioSelectorProps) {
    const [selectedPreview, setSelectedPreview] = useState<Scenario | null>(null);

    const handleStartScenario = (scenario: Scenario) => {
        onSelectScenario(scenario);
        onClose();
    };

    const handleExitToLive = () => {
        onSelectScenario(null);
        onClose();
    };

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            red: 'bg-red-500/20 border-red-500/50 text-red-400',
            orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
            purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
            green: 'bg-green-500/20 border-green-500/50 text-green-400'
        };
        return colors[color] || colors.green;
    };

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
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                    <History className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Historical Scenarios</h2>
                                    <p className="text-sm text-gray-400">Experience investing during historic market events</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                            {/* Live Market Option */}
                            <div
                                onClick={handleExitToLive}
                                className={`mb-6 p-4 rounded-xl border-2 cursor-pointer transition-all ${!activeScenario
                                    ? 'border-green-500 bg-green-500/10'
                                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
                                        📡
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            Live Market
                                            {!activeScenario && (
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-gray-400">Trade with real-time market data from Finnhub</p>
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                </div>
                            </div>

                            {/* Scenarios Grid */}
                            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                                Historical Events
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {SCENARIOS.map((scenario: Scenario) => (
                                    <div
                                        key={scenario.id}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${activeScenario?.id === scenario.id
                                            ? `${getColorClass(scenario.color)} border-2`
                                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                                            }`}
                                        onClick={() => setSelectedPreview(scenario)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getColorClass(scenario.color).split(' ')[0]
                                                }`}>
                                                {scenario.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                    {scenario.name}
                                                    {activeScenario?.id === scenario.id && (
                                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                                            Active
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-1">{scenario.description}</p>
                                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {scenario.period}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Play className="w-3 h-3" />
                                                        {scenario.days.length} days
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Selected Preview */}
                            <AnimatePresence>
                                {selectedPreview && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="mt-6 p-5 bg-gray-800 rounded-xl border border-gray-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                                    {selectedPreview.icon} {selectedPreview.name}
                                                </h4>
                                                <p className="text-gray-400 mt-1">{selectedPreview.period}</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedPreview(null)}
                                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                                            >
                                                <X className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>

                                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                                                <Target className="w-4 h-4" />
                                                Learning Objective
                                            </div>
                                            <p className="text-gray-300">{selectedPreview.learningObjective}</p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-gray-400">
                                                Starting Balance: <span className="text-white font-medium">₹{selectedPreview.startingBalance.toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={() => handleStartScenario(selectedPreview)}
                                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <Play className="w-4 h-4" />
                                                Start Scenario
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                            <p className="text-xs text-gray-500 text-center">
                                💡 Historical scenarios use real price data. Your decisions determine your outcome!
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
