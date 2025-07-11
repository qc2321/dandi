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
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        The key is used to authenticate your requests to the Research API. To learn more, see the <a href="#" className="underline">documentation</a> page.
                    </p>
                </div>
                <button
                    className="ml-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm shadow-sm"
                    onClick={onAddKey}
                >
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Key</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Loading...</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">NAME</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">USAGE</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">KEY</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 tracking-wider">OPTIONS</th>
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
    );
} 