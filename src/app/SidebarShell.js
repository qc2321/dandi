"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarShell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full bg-white shadow-xl transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-16"}
          lg:rounded-r-3xl flex flex-col p-4 lg:p-6 gap-4 lg:gap-6
          ${sidebarOpen ? "" : "lg:items-center"}
          ${sidebarOpen ? "" : "lg:overflow-x-hidden"}
          ${sidebarOpen ? "" : "lg:px-2"}
        `}
            >
                {/* Mobile toggle button */}
                <button
                    className={`absolute top-4 -right-4 z-50 bg-white border border-gray-200 rounded-full shadow-lg p-2 flex items-center justify-center lg:hidden`}
                    onClick={() => setSidebarOpen((v) => !v)}
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* Desktop toggle (hamburger) */}
                <button
                    className={`absolute top-4 right-[-18px] z-50 bg-white border border-gray-200 rounded-full shadow-lg p-2 hidden lg:flex items-center justify-center`}
                    onClick={() => setSidebarOpen((v) => !v)}
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {/* Logo */}
                <Link href="/" className={`flex items-center gap-2 mb-6 lg:mb-8 transition-all duration-300 ${sidebarOpen ? "" : "lg:justify-center"} hover:opacity-80`}>
                    <span className="inline-block w-8 h-8 bg-gradient-to-tr from-blue-400 via-yellow-300 to-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12L12 4M12 4L20 12M12 4V20" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {sidebarOpen && <span className="text-xl font-bold text-gray-900 tracking-tight">Dandi</span>}
                </Link>
                {/* Navigation */}
                <nav className={`flex-1 flex flex-col gap-1 text-sm ${sidebarOpen ? "" : "lg:items-center"}`}>
                    <Link href="/dashboards" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${pathname === '/dashboards' ? 'font-semibold text-gray-900 bg-gray-100' : 'text-gray-700 hover:bg-gray-100'} ${sidebarOpen ? "justify-start" : "lg:justify-center"}`}>
                        <span className="inline-block w-5 h-5 flex-shrink-0"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        {sidebarOpen && <span>Overview</span>}
                    </Link>
                    <Link href="/playground" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${pathname === '/playground' ? 'font-semibold text-gray-900 bg-gray-100' : 'text-gray-700 hover:bg-gray-100'} ${sidebarOpen ? "justify-start" : "lg:justify-center"}`}>
                        <span className="inline-block w-5 h-5 flex-shrink-0"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" strokeLinecap="round" strokeLinejoin="round" /><rect x="8" y="2" width="8" height="4" rx="1" fill="#e0e7ef" /></svg></span>
                        {sidebarOpen && <span>API Playground</span>}
                    </Link>
                    <Link href="#" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 ${sidebarOpen ? "justify-start" : "lg:justify-center"}`}>
                        <span className="inline-block w-5 h-5 flex-shrink-0"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17l4-4-4-4m8 8l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        {sidebarOpen && <span>Use Cases</span>}
                    </Link>
                    <Link href="#" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 ${sidebarOpen ? "justify-start" : "lg:justify-center"}`}>
                        <span className="inline-block w-5 h-5 flex-shrink-0"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        {sidebarOpen && <span>Billing</span>}
                    </Link>
                    <Link href="#" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 ${sidebarOpen ? "justify-start" : "lg:justify-center"}`}>
                        <span className="inline-block w-5 h-5 flex-shrink-0"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        {sidebarOpen && <span>Settings</span>}
                    </Link>
                    <a href="#" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 ${sidebarOpen ? "justify-start" : "lg:justify-center"}`}>
                        <span className="inline-block w-5 h-5 flex-shrink-0"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16v-1a4 4 0 014-4h4m0 0V7m0 4l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        {sidebarOpen && <span>Documentation</span>}
                        {sidebarOpen && <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 3h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </a>
                </nav>
            </aside>
            {/* Main content area */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
                {/* Mobile header with hamburger */}
                <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12L12 4M12 4L20 12M12 4V20" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <span className="text-lg font-bold text-gray-900">Dandi</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
                {children}
            </main>
        </div>
    );
} 