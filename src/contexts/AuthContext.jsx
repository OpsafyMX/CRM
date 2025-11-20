import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const currentUser = storage.get('currentUser');
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = storage.get('users') || [];
        const foundUser = users.find(
            u => u.email === email && u.password === password
        );

        if (foundUser) {
            const userWithoutPassword = { ...foundUser };
            delete userWithoutPassword.password;
            setUser(userWithoutPassword);
            storage.set('currentUser', userWithoutPassword);
            return { success: true };
        }

        return { success: false, error: 'Credenciales inválidas' };
    };

    const register = (userData) => {
        const users = storage.get('users') || [];

        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            return { success: false, error: 'El email ya está registrado' };
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        storage.set('users', users);

        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        storage.set('currentUser', userWithoutPassword);

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        storage.remove('currentUser');
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        storage.set('currentUser', updatedUser);

        // Update in users list
        const users = storage.get('users') || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            storage.set('users', users);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
