import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export const useApiKeys = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    // Helper function to get auth headers
    const getAuthHeaders = () => {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Add Authorization header if session exists
        if (session?.apiToken) {
            headers['Authorization'] = `Bearer ${session.apiToken}`;
        }

        return headers;
    };

    // Fetch API keys from the REST API
    const fetchKeys = async () => {
        if (!session) return; // Don't fetch if no session

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/api-keys', {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch API keys');
            }

            const data = await response.json();
            setApiKeys(data.apiKeys || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create new API key
    const createApiKey = async (keyData) => {
        if (!session) {
            setError('Authentication required');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/api-keys', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: keyData.name,
                    value: keyData.value,
                    limit: keyData.limit_count,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create API key');
            }

            await fetchKeys(); // Refresh the list
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update existing API key
    const updateApiKey = async (id, keyData) => {
        if (!session) {
            setError('Authentication required');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/api-keys/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: keyData.name,
                    value: keyData.value,
                    limit: keyData.limit_count,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update API key');
            }

            await fetchKeys(); // Refresh the list
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Delete API key
    const deleteApiKey = async (id) => {
        if (!session) {
            setError('Authentication required');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/api-keys/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete API key');
            }

            await fetchKeys(); // Refresh the list
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount and when session changes
    useEffect(() => {
        if (session) {
            fetchKeys();
        } else {
            setApiKeys([]);
            setError(null);
        }
    }, [session]);

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