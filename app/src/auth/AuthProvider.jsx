import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./authContext";
import { loginUser, registerUser, getProfile } from "../services/authService";

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearSession = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    const newToken = data.data.token;

        const profileData = await getProfile(newToken);

        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
        setUser(profileData.data ?? profileData);

        return profileData.data ?? profileData;
    }, []);

    const register = useCallback(async (userData) => {
        return await registerUser(userData);
    }, []);

    const logout = useCallback(() => {
        clearSession();
    }, [clearSession]);

    const hasRole = useCallback(
        (allowedRoles) => {
            if (!user?.role?.name) return false;
            return allowedRoles.includes(user.role.name);
        },
        [user]
    );

    // Restaurar sesión al iniciar la aplicación
    useEffect(() => {
        let isMounted = true;

        async function restoreSession() {
            const savedToken = localStorage.getItem(TOKEN_KEY);

            if (!savedToken) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const profileData = await getProfile(savedToken);

                if (isMounted) {
                    setToken(savedToken);
                    setUser(profileData.data ?? profileData);
                }
            } catch {
                if (isMounted) clearSession();
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, [clearSession]);

    const isAuthenticated = Boolean(token && user);

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            hasRole,
        }),
        [user, token, loading, isAuthenticated, login, register, logout, hasRole]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};