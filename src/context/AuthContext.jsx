import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (!token || !user) return;

        let cancelled = false;

        const ping = async () => {
            try {
                await apiClient.post('/auth/ping');
            } catch (_e) {
                // ignore
            }
        };

        ping();
        const interval = setInterval(() => {
            if (cancelled) return;
            ping();
        }, 30000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [token, user]);

    useEffect(() => {
        let cancelled = false;

        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    // Hydrate immediately so a slow auth check cannot blank the app.
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                } catch (_error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }

                setLoading(false);

                try {
                    // Verify token is still valid by calling /api/auth/me
                    const response = await apiClient.get('/auth/me', {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });

                    if (!cancelled) {
                        setUser(response.data.data);
                        setToken(storedToken);
                    }
                } catch (error) {
                    // Token is invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (!cancelled) {
                        setToken(null);
                        setUser(null);
                    }
                    // Don't redirect - let the user continue as guest
                }
            } else if (!cancelled) {
                setLoading(false);
            }
        };

        initAuth();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async ({ identifier, password }) => {
        try {
            const response = await apiClient.post('/auth/login', { identifier, password });
            const { data } = response.data;
            const { token: newToken, user: userData } = data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            const { data } = response.data;
            const { token: newToken, user: userDataPayload } = data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userDataPayload));

            setToken(newToken);
            setUser(userDataPayload);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Update apiClient to include auth token
    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete apiClient.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
