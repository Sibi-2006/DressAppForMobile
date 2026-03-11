import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        checkExistingSession();
    }, []);

    // ─── BUG 4 FIX: Trust AsyncStorage, verify in background ───
    const checkExistingSession = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('neon_user');

            // Guard against garbage values
            if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
                setLoading(false);
                return;
            }

            let userData = null;
            try {
                userData = JSON.parse(savedUser);
            } catch {
                await AsyncStorage.removeItem('neon_user');
                setLoading(false);
                return;
            }

            if (!userData?._id) {
                await AsyncStorage.removeItem('neon_user');
                setLoading(false);
                return;
            }

            // ✅ Set user IMMEDIATELY from AsyncStorage (fast, no waiting for network)
            setUser(userData);
            setIsLoggedIn(true);
            setIsAdmin(userData.role === 'admin' || userData.isAdmin === true);
            setLoading(false);   // ← Unblock UI right away

            // Then silently verify with backend (/api/auth/profile = protected route)
            // Use /api/auth/profile since /api/auth/me doesn't exist
            try {
                const res = await api.get('/api/auth/profile', { timeout: 6000 });
                const freshUser = res.data?.user || res.data;
                if (freshUser?._id) {
                    setUser(freshUser);
                    await AsyncStorage.setItem('neon_user', JSON.stringify(freshUser));
                }
            } catch (verifyErr) {
                if (verifyErr.response?.status === 401) {
                    // Cookie truly expired → logout
                    console.log('Cookie expired, session ended');
                    await _clearSession();
                }
                // Network error / 5xx → keep user logged in (offline mode)
                console.log('Background verify failed (keeping session):', verifyErr.message);
            }

        } catch (err) {
            console.log('checkExistingSession error:', err.message);
            setLoading(false);
        }
    };

    const _clearSession = async () => {
        await AsyncStorage.multiRemove(['neon_user', 'neon_cart']);
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });
            console.log('Login response keys:', Object.keys(res.data || {}));

            const userData = res.data?.user || res.data;
            console.log('User data received:', JSON.stringify(userData).slice(0, 150));

            if (!userData?._id) {
                return { success: false, message: 'Login failed: no user data received' };
            }

            // Persist to AsyncStorage so next app open auto-logs in
            await AsyncStorage.setItem('neon_user', JSON.stringify(userData));

            setUser(userData);
            setIsLoggedIn(true);
            setIsAdmin(userData.role === 'admin' || userData.isAdmin === true);

            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Login failed';
            console.log('Login error:', msg);
            return { success: false, message: msg };
        }
    };

    const register = async (formData) => {
        try {
            const res = await api.post('/api/auth/register', formData);
            return { success: true, data: res.data };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
        } catch (e) {
            console.log('Logout endpoint error (safe to ignore):', e.message);
        } finally {
            await _clearSession();
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

export default AuthContext;
