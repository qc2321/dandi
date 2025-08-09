"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/Toast";
import { supabase } from "@/lib/supabaseClient.js";

function ProtectedPageContent() {
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast, showSuccessToast, showErrorToast, hideToast } = useToast();

    useEffect(() => {
        const validateApiKey = async () => {
            console.log("🔍 Starting API key validation...");
            const apiKey = searchParams.get('key');
            console.log("📝 API Key received:", apiKey ? `${apiKey.substring(0, 8)}...` : "none");

            if (!apiKey) {
                console.log("❌ No API key provided");
                showErrorToast("No API key provided");
                setTimeout(() => {
                    router.push('/playground');
                }, 2000);
                return;
            }

            try {
                console.log("🔗 Attempting to connect to Supabase...");
                console.log("🌐 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
                console.log("🔑 Supabase Anon Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

                // Validate API key against Supabase database
                console.log("🔍 Querying database for API key...");
                const { data, error } = await supabase
                    .from("api_keys")
                    .select("id, name, value")
                    .eq("value", apiKey.trim())
                    .single();

                console.log("📊 Database response:", { data, error });

                if (error && error.code !== 'PGRST116') {
                    // PGRST116 is "not found" error, which is expected for invalid keys
                    console.error("❌ Database error:", error);
                    showErrorToast("Error validating API key");
                    setTimeout(() => {
                        router.push('/playground');
                    }, 3000);
                    return;
                }

                const isValidKey = data && data.value === apiKey.trim();
                console.log("✅ Validation result:", isValidKey);

                setIsValid(isValidKey);

                if (isValidKey) {
                    console.log("🎉 API key is valid!");
                    showSuccessToast("Valid API key");
                } else {
                    console.log("❌ API key is invalid");
                    showErrorToast("Invalid API key");
                    // Redirect back to playground after showing error
                    setTimeout(() => {
                        router.push('/playground');
                    }, 3000);
                }
            } catch (error) {
                console.error("💥 Validation error:", error);
                showErrorToast("Error validating API key");
                setTimeout(() => {
                    router.push('/playground');
                }, 3000);
            } finally {
                console.log("🏁 Validation process completed");
                setIsValidating(false);
            }
        };

        validateApiKey();
    }, [searchParams, router, showSuccessToast, showErrorToast]);

    const handleBackToPlayground = () => {
        router.push('/playground');
    };

    if (isValidating) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-400 via-yellow-300 to-red-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Validating API Key...</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Please wait while we verify your credentials</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className={`inline-block w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${isValid
                            ? 'bg-green-100'
                            : 'bg-red-100'
                            }`}>
                            {isValid ? (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            {isValid ? 'Access Granted' : 'Access Denied'}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            {isValid
                                ? 'Your API key is valid and you can access protected pages.'
                                : 'Your API key is invalid. Please try again with a valid key.'
                            }
                        </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className={`p-3 sm:p-4 rounded-xl ${isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                            }`}>
                            <div className="flex items-start">
                                <div className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${isValid ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                    {isValid ? (
                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-2 sm:ml-3">
                                    <h3 className={`text-xs sm:text-sm font-medium ${isValid ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                        {isValid ? 'Validation Successful' : 'Validation Failed'}
                                    </h3>
                                    <p className={`text-xs sm:text-sm mt-1 ${isValid ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {isValid
                                            ? 'Your API key has been verified and you have access to protected resources.'
                                            : 'The provided API key could not be validated. Please check your key and try again.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isValid ? (
                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    className="w-full bg-green-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base"
                                >
                                    Access Protected Content
                                </button>
                                <button
                                    onClick={handleBackToPlayground}
                                    className="w-full bg-gray-900 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base"
                                >
                                    Back to Playground
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleBackToPlayground}
                                className="w-full bg-gray-900 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base"
                            >
                                Back to Playground
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Toast toast={toast} onClose={hideToast} />
        </div>
    );
}

export default function ProtectedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-400 via-yellow-300 to-red-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Please wait</p>
                </div>
            </div>
        }>
            <ProtectedPageContent />
        </Suspense>
    );
} 