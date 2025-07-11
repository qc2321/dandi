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
            <td className="px-4 py-3 text-gray-900 text-sm font-medium align-middle">
                {apiKey.name}
            </td>
            <td className="px-4 py-3 text-gray-500 text-sm align-middle">
                {apiKey.usage}
            </td>
            <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-2">
                    <input
                        type={showKey ? "text" : "password"}
                        value={apiKey.value}
                        readOnly
                        className="w-[220px] bg-gray-100 rounded-md px-3 py-1 text-gray-700 font-mono text-sm border border-gray-200 focus:outline-none"
                        style={{ letterSpacing: "0.1em" }}
                    />
                </div>
            </td>
            <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-3">
                    <button
                        className="p-1 text-gray-400 hover:text-gray-700"
                        onClick={() => onToggleKey(apiKey.id)}
                        title={showKey ? "Hide" : "Show"}
                    >
                        {showKey ? (
                            <EyeIcon className="w-5 h-5" />
                        ) : (
                            <EyeSlashIcon className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        className="p-1 text-gray-400 hover:text-gray-700"
                        onClick={() => onCopy(apiKey.value)}
                        title="Copy"
                    >
                        <ClipboardIcon className="w-5 h-5" />
                    </button>
                    <button
                        className="p-1 text-gray-400 hover:text-gray-700"
                        title="Edit"
                        onClick={() => onEdit(apiKey)}
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                        onClick={() => onDelete(apiKey.id)}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
} 