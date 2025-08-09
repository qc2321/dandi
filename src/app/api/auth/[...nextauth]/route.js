import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabaseClient.js";
import { generateApiToken } from "@/lib/auth.js";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    // Check if user already exists in Supabase
                    const { data: existingUser, error: fetchError } = await supabase
                        .from("users")
                        .select("id, email, name, image, provider")
                        .eq("email", user.email)
                        .single();

                    if (fetchError && fetchError.code !== 'PGRST116') {
                        console.error("Error checking existing user:", fetchError);
                        return true; // Allow sign in even if database check fails
                    }

                    if (!existingUser) {
                        // User doesn't exist, create new user record
                        const userData = {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            provider: account.provider,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        };

                        const { error: insertError } = await supabase
                            .from("users")
                            .insert([userData]);

                        if (insertError) {
                            console.error("Error creating user:", insertError);
                            // Still allow sign in even if database insert fails
                        }
                    } else {
                        // User exists, update last login time
                        const { error: updateError } = await supabase
                            .from("users")
                            .update({
                                updated_at: new Date().toISOString(),
                                last_login: new Date().toISOString()
                            })
                            .eq("email", user.email);

                        if (updateError) {
                            console.error("Error updating user login time:", updateError);
                        }
                    }
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    // Allow sign in even if database operations fail
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account && user) {
                // Generate a custom JWT token for API authentication
                const apiToken = generateApiToken(user);

                return {
                    ...token,
                    accessToken: account.access_token,
                    apiToken: apiToken,
                };
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, including the API token
            session.accessToken = token.accessToken;
            session.apiToken = token.apiToken;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 