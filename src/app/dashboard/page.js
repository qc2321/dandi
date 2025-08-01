"use client";

import { useSession } from "next-auth/react";
import { useUser } from "../../hooks/useUser";
import ProtectedRoute from "../../components/ProtectedRoute";

function DashboardContent() {
    const { data: session } = useSession();
    const { userData, loading, error } = useUser();

    const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Dashboard</h1>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                        Welcome to your protected dashboard! This page is only accessible to authenticated users.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                        <h2 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">User Information</h2>
                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                            <p><strong>Name:</strong> {session?.user?.name || "Not provided"}</p>
                            <p><strong>Email:</strong> {session?.user?.email || "Not provided"}</p>
                            <p><strong>Provider:</strong> Google</p>
                            {loading && <p><strong>Loading user data...</strong></p>}
                            {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
                            {userData && (
                                <>
                                    <p><strong>Member since:</strong> {formatDate(userData.created_at)}</p>
                                    <p><strong>Last login:</strong> {formatDate(userData.last_login)}</p>
                                    <p><strong>Account ID:</strong> {userData.id}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">API Keys</h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Manage your API keys and credentials</p>
                        <a
                            href="/dashboards"
                            className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Manage Keys
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Playground</h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Test your API integrations</p>
                        <a
                            href="/playground"
                            className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                        >
                            Open Playground
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Settings</h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Configure your account settings</p>
                        <button className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
} 