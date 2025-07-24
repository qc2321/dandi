"use client";

import { useSession } from "next-auth/react";
import ProtectedRoute from "../../components/ProtectedRoute";

function DashboardContent() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
                    <p className="text-gray-600 mb-6">
                        Welcome to your protected dashboard! This page is only accessible to authenticated users.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-blue-900 mb-2">User Information</h2>
                        <div className="space-y-2 text-sm text-blue-800">
                            <p><strong>Name:</strong> {session?.user?.name || "Not provided"}</p>
                            <p><strong>Email:</strong> {session?.user?.email || "Not provided"}</p>
                            <p><strong>Provider:</strong> Google</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">API Keys</h3>
                        <p className="text-gray-600 mb-4">Manage your API keys and credentials</p>
                        <a
                            href="/dashboards"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                        >
                            Manage Keys
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Playground</h3>
                        <p className="text-gray-600 mb-4">Test your API integrations</p>
                        <a
                            href="/playground"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                        >
                            Open Playground
                        </a>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
                        <p className="text-gray-600 mb-4">Configure your account settings</p>
                        <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700">
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