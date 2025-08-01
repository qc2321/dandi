export default function Toast({ toast, onClose }) {
    if (!toast.show) return null;

    return (
        <div className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center ${toast.color === 'green' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg animate-fade-in-up min-w-[280px] sm:min-w-[320px] max-w-[calc(100vw-2rem)] sm:max-w-[90vw] mx-4`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill={toast.color === 'green' ? '#22c55e' : '#dc2626'} />
                {toast.color === 'green' ? (
                    <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l3 3 5-5" />
                ) : (
                    <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                )}
            </svg>
            <span className="font-semibold flex-1 text-sm sm:text-base">{toast.message}</span>
            <button onClick={onClose} className="ml-2 sm:ml-4 text-white/80 hover:text-white focus:outline-none flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
} 