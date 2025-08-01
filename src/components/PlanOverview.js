export default function PlanOverview({ payAsYouGo, onPayAsYouGoChange }) {
    return (
        <div className="rounded-2xl shadow-lg mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="inline-block bg-white/30 text-xs font-semibold text-white px-2 sm:px-3 py-1 rounded-full mb-3 backdrop-blur-sm">CURRENT PLAN</div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow">Researcher</div>
                    <div className="mt-3 sm:mt-4 text-white/90 text-xs sm:text-sm font-medium">
                        API Usage
                        <span className="inline-block align-middle ml-1">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="12" fill="white" fillOpacity=".2" />
                                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="white">i</text>
                            </svg>
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-white/80 text-xs">Plan</span>
                        <div className="flex-1 w-32 sm:w-40 h-2 bg-white/30 rounded-full overflow-hidden">
                            <div className="h-2 bg-white/80 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-white/80 text-xs">0/1,000 Credits</span>
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center gap-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={payAsYouGo}
                                onChange={onPayAsYouGoChange}
                                className="sr-only"
                            />
                            <span className={`w-8 h-4 sm:w-9 sm:h-5 flex items-center bg-white/40 rounded-full p-0.5 sm:p-1 duration-200 ${payAsYouGo ? 'bg-white/80' : ''}`}>
                                <span className={`bg-white w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow transform duration-200 ${payAsYouGo ? 'translate-x-4 sm:translate-x-4' : ''}`}></span>
                            </span>
                            <span className="ml-2 text-white/90 text-xs sm:text-sm font-medium">
                                Pay as you go
                                <span className="inline-block align-middle ml-1">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="12" fill="white" fillOpacity=".2" />
                                        <text x="12" y="16" textAnchor="middle" fontSize="12" fill="white">i</text>
                                    </svg>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
                <div className="flex items-start sm:items-center justify-end w-full sm:w-auto">
                    <button className="bg-white/80 hover:bg-white text-blue-700 font-semibold px-4 sm:px-5 py-2 rounded-lg shadow transition-colors text-sm">
                        Manage Plan
                    </button>
                </div>
            </div>
        </div>
    );
} 