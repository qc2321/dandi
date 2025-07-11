export default function ApiKeyModal({
    showModal,
    editId,
    form,
    onClose,
    onSubmit,
    onFormChange
}) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 relative animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {editId ? 'Edit API key' : 'Create a new API key'}
                </h2>
                <p className="text-gray-500 mb-6">
                    Enter a name and value for the {editId ? 'API key.' : 'new API key.'}
                </p>

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Key Name <span className="font-normal text-gray-400">— A unique name to identify this key</span>
                    </label>
                    <input
                        className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-gray-900 text-base outline-none placeholder-gray-400"
                        placeholder="Key Name"
                        value={form.name}
                        onChange={e => onFormChange('name', e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Key Value <span className="font-normal text-gray-400">— The API key string</span>
                    </label>
                    <input
                        className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-gray-900 text-base outline-none placeholder-gray-400"
                        placeholder="API Key Value (leave blank to auto-generate)"
                        value={form.value}
                        onChange={e => onFormChange('value', e.target.value)}
                    />
                </div>

                <div className="mb-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={form.limit}
                            onChange={e => onFormChange('limit', e.target.checked)}
                            className="accent-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Limit monthly usage<span className="text-gray-400">*</span>
                        </span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        disabled={!form.limit}
                        value={form.monthly}
                        onChange={e => onFormChange('monthly', e.target.value)}
                        className={`mt-2 w-full rounded-lg border px-4 py-2 text-gray-900 text-base outline-none placeholder-gray-400 ${form.limit ? 'border-blue-500 focus:ring-2 focus:ring-blue-100' : 'border-gray-200 bg-gray-100 text-gray-400'}`}
                        placeholder="1000"
                    />
                </div>

                <div className="text-xs text-gray-400 mb-6">
                    * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        onClick={onSubmit}
                        disabled={!form.name.trim()}
                    >
                        {editId ? 'Save' : 'Create'}
                    </button>
                    <button
                        className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
} 