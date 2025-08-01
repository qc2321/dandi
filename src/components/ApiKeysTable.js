import { PlusIcon } from "@heroicons/react/24/outline";
import ApiKeyRow from "./ApiKeyRow";

export default function ApiKeysTable({
    apiKeys,
    loading,
    showKey,
    onToggleKey,
    onCopy,
    onEdit,
    onDelete,
    onAddKey
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">API Keys</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        The key is used to authenticate your requests to the Research API. To learn more, see the <a href="#" className="underline">documentation</a> page.
                    </p>
                </div>
                <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm shadow-sm transition-colors w-fit"
                    onClick={onAddKey}
                >
                    <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add Key</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                    {loading ? (
                        <div className="text-center text-gray-400 py-8 sm:py-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">NAME</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">USAGE</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">KEY</th>
                                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">OPTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {apiKeys && apiKeys.map((apiKey) => (
                                    <ApiKeyRow
                                        key={apiKey.id}
                                        apiKey={apiKey}
                                        showKey={showKey[apiKey.id]}
                                        onToggleKey={onToggleKey}
                                        onCopy={onCopy}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
} 