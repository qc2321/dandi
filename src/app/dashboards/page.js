"use client";

import { useState } from "react";
import { useApiKeys } from "../../hooks/useApiKeys";
import { useToast } from "../../hooks/useToast";
import { useModal } from "../../hooks/useModal";
import Toast from "../../components/Toast";
import PlanOverview from "../../components/PlanOverview";
import ApiKeysTable from "../../components/ApiKeysTable";
import ApiKeyModal from "../../components/ApiKeyModal";

export default function Dashboard() {
    const [showKey, setShowKey] = useState({});
    const [payAsYouGo, setPayAsYouGo] = useState(false);

    // Custom hooks
    const { apiKeys, loading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();
    const { toast, showAutoHideToast, hideToast } = useToast();
    const {
        showModal,
        editId,
        form,
        openModal,
        closeModal,
        openEditModal,
        updateForm
    } = useModal();

    // Event handlers
    const handleToggleKey = (id) => {
        setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value);
        showAutoHideToast('Copied API Key to clipboard', 'green');
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this API key?")) {
            const success = await deleteApiKey(id);
            if (success) {
                showAutoHideToast('API Key deleted', 'red');
            } else {
                showAutoHideToast('Failed to delete API key', 'red');
            }
        }
    };

    const handleEdit = (key) => {
        openEditModal(key);
    };

    const handleCreateOrEdit = async () => {
        if (!form.name.trim()) return;

        let success;
        if (editId) {
            success = await updateApiKey(editId, { name: form.name, value: form.value });
            if (success) {
                showAutoHideToast('API Key updated', 'green');
            } else {
                showAutoHideToast('Failed to update API key', 'red');
            }
        } else {
            success = await createApiKey({ name: form.name, value: form.value });
            if (success) {
                showAutoHideToast('API Key created', 'green');
            } else {
                showAutoHideToast('Failed to create API key', 'red');
            }
        }

        if (success) {
            closeModal();
        }
    };

    const handleFormChange = (field, value) => {
        updateForm(field, value);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-10 px-2 sm:px-4">
            {/* Toast Notification */}
            <Toast toast={toast} onClose={hideToast} />

            <div className="max-w-6xl mx-auto">
                {/* Overview Heading */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Overview</h1>

                {/* Plan Overview */}
                <PlanOverview
                    payAsYouGo={payAsYouGo}
                    onPayAsYouGoChange={() => setPayAsYouGo(v => !v)}
                />

                {/* API Keys Table */}
                <ApiKeysTable
                    apiKeys={apiKeys}
                    loading={loading}
                    showKey={showKey}
                    onToggleKey={handleToggleKey}
                    onCopy={handleCopy}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddKey={openModal}
                />
            </div>

            {/* API Key Modal */}
            <ApiKeyModal
                showModal={showModal}
                editId={editId}
                form={form}
                onClose={closeModal}
                onSubmit={handleCreateOrEdit}
                onFormChange={handleFormChange}
            />
        </div>
    );
} 