import { useState } from 'react';
import { motion } from 'motion/react';
import { User, LogIn, Sparkles } from 'lucide-react';

interface LoginPageProps {
    onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            setError('Please enter a username');
            return;
        }

        if (trimmedUsername.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        if (trimmedUsername.length > 20) {
            setError('Username must be less than 20 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate slight delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        onLogin(trimmedUsername);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/25"
                    >
                        <span className="text-4xl font-bold text-white">Q</span>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">QUANTUM</h1>
                    <p className="text-gray-400">Stock Market Simulator</p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-semibold text-white">Welcome</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Enter your username to continue
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Your username"
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm mt-2"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Continue</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Info text */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        Your progress will be saved to your profile
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    Practice trading in a risk-free environment
                </p>
            </motion.div>
        </div>
    );
}
