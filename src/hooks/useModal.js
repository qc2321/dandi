import { useState, useCallback } from "react";

export const useModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        value: "",
        limit: false,
        monthly: "1000",
    });

    const openModal = useCallback(() => {
        setShowModal(true);
        setEditId(null);
        setForm({ name: "", value: "", limit: false, monthly: "1000" });
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditId(null);
        setForm({ name: "", value: "", limit: false, monthly: "1000" });
    }, []);

    const openEditModal = useCallback((key) => {
        setEditId(key.id);
        setForm({
            name: key.name,
            value: key.value,
            limit: false,
            monthly: "1000",
        });
        setShowModal(true);
    }, []);

    const updateForm = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setForm({ name: "", value: "", limit: false, monthly: "1000" });
    }, []);

    return {
        showModal,
        editId,
        form,
        openModal,
        closeModal,
        openEditModal,
        updateForm,
        resetForm,
    };
}; 