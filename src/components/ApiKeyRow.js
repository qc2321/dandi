import { EyeIcon, EyeSlashIcon, ClipboardIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ApiKeyRow({
    apiKey,
    showKey,
    onToggleKey,
    onCopy,
    onEdit,
    onDelete
}) {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-2 sm:px-4 py-3 text-gray-900 text-xs sm:text-sm font-medium align-middle">
                {apiKey.name}
            </td>
            <td className="px-2 sm:px-4 py-3 text-gray-500 text-xs sm:text-sm align-middle">
                <div className="flex flex-col">
                    <span className="font-medium">{apiKey.usage}</span>
                    <span className="text-xs text-gray-400">/ {apiKey.limit_count || 1000}</span>
                </div>
            </td>
            <td className="px-2 sm:px-4 py-3 align-middle">
                <div className="flex items-center gap-2">
                    <input
                        type={showKey ? "text" : "password"}
                        value={apiKey.value}
                        readOnly
                        className="w-32 sm:w-48 lg:w-[220px] bg-gray-100 rounded-md px-2 sm:px-3 py-1 text-gray-700 font-mono text-xs sm:text-sm border border-gray-200 focus:outline-none"
                        style={{ letterSpacing: "0.1em" }}
                    />
                </div>
            </td>
            <td className="px-2 sm:px-4 py-3 align-middle">
                <div className="flex items-center gap-1 sm:gap-3">
                    <button
                        className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={() => onToggleKey(apiKey.id)}
                        title={showKey ? "Hide" : "Show"}
                    >
                        {showKey ? (
                            <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                            <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                    <button
                        className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={() => onCopy(apiKey.value)}
                        title="Copy"
                    >
                        <ClipboardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Edit"
                        onClick={() => onEdit(apiKey)}
                    >
                        <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                        onClick={() => onDelete(apiKey.id)}
                    >
                        <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
} 