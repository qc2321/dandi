"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/Toast";

export default function PlaygroundPage() {
    const [apiKey, setApiKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast, showSuccessToast, showErrorToast, hideToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            showErrorToast("Please enter an API key");
            return;
        }

        setIsLoading(true);

        try {
            // Navigate to protected route with API key
            router.push(`/protected?key=${encodeURIComponent(apiKey)}`);
        } catch (error) {
            showErrorToast("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-400 via-yellow-300 to-red-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="8" y="2" width="8" height="4" rx="1" fill="#e0e7ef" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">API Playground</h1>
                        <p className="text-gray-600 text-sm sm:text-base">Enter your API key to test access to protected pages</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                                API Key
                            </label>
                            <input
                                type="text"
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm sm:text-base bg-white text-gray-900 placeholder-gray-500"
                                placeholder="dandi-**********"
                                required
                                style={{ letterSpacing: "0.05em" }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Validating...
                                </div>
                            ) : (
                                "Validate API Key"
                            )}
                        </button>
                    </form>

                    <div className="mt-4 sm:mt-6 text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            This will redirect you to a protected route to test your API key validation.
                        </p>
                    </div>
                </div>
            </div>
            <Toast toast={toast} onClose={hideToast} />
        </div>
    );
} 