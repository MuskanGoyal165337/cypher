import { Scenario } from '@/lib/historicalScenarios';
import { Calendar, X, Newspaper, Timer, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface ScenarioControlsProps {
    scenario: Scenario;
    currentDayIndex: number;
    onDayChange: (index: number) => void;
    onExit: () => void;
}

export function ScenarioControls({ scenario, currentDayIndex, onDayChange, onExit }: ScenarioControlsProps) {
    const currentDay = scenario.days[currentDayIndex];
    const progress = ((currentDayIndex + 1) / scenario.days.length) * 100;
    const isLastDay = currentDayIndex === scenario.days.length - 1;

    // 30-second countdown timer
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        // Reset timer when day changes
        setTimeLeft(30);
    }, [currentDayIndex]);

    useEffect(() => {
        // Don't run timer on last day
        if (isLastDay) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-advance to next day
                    onDayChange(currentDayIndex + 1);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentDayIndex, isLastDay, onDayChange]);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer color based on urgency
    const getTimerColor = () => {
        if (timeLeft <= 5) return 'text-red-400 bg-red-500/20';
        if (timeLeft <= 10) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-blue-400 bg-blue-500/20';
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-4 py-3"
        >
            <div className="max-w-7xl mx-auto">
                {/* Top Row with Timer */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{scenario.icon}</span>
                        <div>
                            <h3 className="text-sm font-bold text-white">{scenario.name}</h3>
                            <p className="text-xs text-gray-400">{scenario.period}</p>
                        </div>
                    </div>

                    {/* Countdown Timer - Prominent Display */}
                    <div className="flex items-center gap-4">
                        {!isLastDay ? (
                            <motion.div
                                key={timeLeft}
                                initial={{ scale: timeLeft <= 5 ? 1.1 : 1 }}
                                animate={{ scale: 1 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold ${getTimerColor()}`}
                            >
                                <Timer className="w-5 h-5" />
                                <span>Next day in {formatTime(timeLeft)}</span>
                            </motion.div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Final Day - Scenario Complete!</span>
                            </div>
                        )}

                        <button
                            onClick={onExit}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Exit
                        </button>
                    </div>
                </div>

                {/* Day Info & Progress Row */}
                <div className="flex items-center gap-4">
                    {/* Current Day Display (Read-only) */}
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium text-sm">
                            {currentDay.date}
                        </span>
                    </div>

                    {/* Progress Bar */}
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

                    {/* Timer Progress Ring */}
                    <div className="relative w-10 h-10">
                        <svg className="transform -rotate-90 w-10 h-10">
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className="text-gray-700"
                            />
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={100}
                                strokeDashoffset={100 - (timeLeft / 30) * 100}
                                className={timeLeft <= 5 ? 'text-red-500' : timeLeft <= 10 ? 'text-yellow-500' : 'text-blue-500'}
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {timeLeft}
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
