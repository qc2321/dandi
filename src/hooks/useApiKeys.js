import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const useApiKeys = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch API keys from Supabase
    const fetchKeys = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("api_keys")
                .select("id, created_at, name, value, usage")
                .order("created_at", { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setApiKeys(data || []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create new API key
    const createApiKey = async (keyData) => {
        setLoading(true);
        setError(null);
        try {
            const newKey = {
                id: uuidv4(),
                name: keyData.name,
                value: keyData.value || `dandi-${Math.random().toString(36).slice(2, 12)}`,
                usage: 0,
            };

            const { error } = await supabase.from("api_keys").insert([newKey]);

            if (error) {
                setError(error.message);
                return false;
            } else {
                await fetchKeys(); // Refresh the list
                return true;
            }
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update existing API key
    const updateApiKey = async (id, keyData) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from("api_keys")
                .update({ name: keyData.name, value: keyData.value })
                .eq("id", id);

            if (error) {
                setError(error.message);
                return false;
            } else {
                await fetchKeys(); // Refresh the list
                return true;
            }
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Delete API key
    const deleteApiKey = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.from("api_keys").delete().eq("id", id);

            if (error) {
                setError(error.message);
                return false;
            } else {
                await fetchKeys(); // Refresh the list
                return true;
            }
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchKeys();
    }, []);

    return {
        apiKeys,
        loading,
        error,
        fetchKeys,
        createApiKey,
        updateApiKey,
        deleteApiKey,
    };
}; 