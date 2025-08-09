import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient.js";

export const useUser = () => {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user data from Supabase
    const fetchUserData = async (email) => {
        if (!email) return;

        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // User not found in database (shouldn't happen if signIn callback works)
                    setError("User not found in database");
                } else {
                    setError(error.message);
                }
            } else {
                setUserData(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update user data
    const updateUserData = async (updates) => {
        if (!session?.user?.email) return false;

        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("users")
                .update(updates)
                .eq("email", session.user.email)
                .select()
                .single();

            if (error) {
                setError(error.message);
                return false;
            } else {
                setUserData(data);
                return true;
            }
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fetch user data when session is available
    useEffect(() => {
        if (status === "authenticated" && session?.user?.email) {
            fetchUserData(session.user.email);
        } else if (status === "unauthenticated") {
            setUserData(null);
            setError(null);
        }
    }, [session, status]);

    return {
        userData,
        loading,
        error,
        fetchUserData,
        updateUserData,
        isAuthenticated: status === "authenticated",
        session,
    };
}; 