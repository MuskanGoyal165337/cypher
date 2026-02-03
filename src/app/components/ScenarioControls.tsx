import { Scenario } from '@/lib/historicalScenarios';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw, X, Newspaper } from 'lucide-react';
import { motion } from 'motion/react';

interface ScenarioControlsProps {
    scenario: Scenario;
    currentDayIndex: number;
    onDayChange: (index: number) => void;
    onExit: () => void;
}

export function ScenarioControls({ scenario, currentDayIndex, onDayChange, onExit }: ScenarioControlsProps) {
    const currentDay = scenario.days[currentDayIndex];
    const progress = ((currentDayIndex + 1) / scenario.days.length) * 100;

    const handlePrevDay = () => {
        if (currentDayIndex > 0) {
            onDayChange(currentDayIndex - 1);
        }
    };

    const handleNextDay = () => {
        if (currentDayIndex < scenario.days.length - 1) {
            onDayChange(currentDayIndex + 1);
        }
    };

    const handleReset = () => {
        onDayChange(0);
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-4 py-3"
        >
            <div className="max-w-7xl mx-auto">
                {/* Top Row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{scenario.icon}</span>
                        <div>
                            <h3 className="text-sm font-bold text-white">{scenario.name}</h3>
                            <p className="text-xs text-gray-400">{scenario.period}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Reset to day 1"
                        >
                            <RotateCcw className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                            onClick={onExit}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Exit
                        </button>
                    </div>
                </div>

                {/* Day Controls Row */}
                <div className="flex items-center gap-4">
                    {/* Day Navigation */}
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={handlePrevDay}
                            disabled={currentDayIndex === 0}
                            className="p-1.5 hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-white" />
                        </button>

                        <div className="flex items-center gap-2 px-3">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-medium text-sm min-w-[120px] text-center">
                                {currentDay.date}
                            </span>
                        </div>

                        <button
                            onClick={handleNextDay}
                            disabled={currentDayIndex === scenario.days.length - 1}
                            className="p-1.5 hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                            Day {currentDayIndex + 1} of {scenario.days.length}
                        </span>
                    </div>
                </div>

                {/* News Ticker */}
                {currentDay.news && currentDay.news.length > 0 && (
                    <motion.div
                        key={currentDayIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-start gap-2 p-2 bg-gray-800/50 rounded-lg"
                    >
                        <Newspaper className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-2">
                            {currentDay.news.map((headline: string, i: number) => (
                                <span
                                    key={i}
                                    className={`text-xs px-2 py-1 rounded ${headline.includes('📉') || headline.includes('🔴')
                                        ? 'bg-red-500/20 text-red-300'
                                        : headline.includes('📈') || headline.includes('🏆')
                                            ? 'bg-green-500/20 text-green-300'
                                            : 'bg-gray-700 text-gray-300'
                                        }`}
                                >
                                    {headline}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
