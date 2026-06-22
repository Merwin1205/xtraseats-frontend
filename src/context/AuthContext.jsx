import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || null);
    const [name, setName] = useState(localStorage.getItem('name') || null);
    const [isSubscribed, setIsSubscribed] = useState(
        localStorage.getItem('isSubscribed') === 'true'
    );

    // Called after successful login or register
    const login = (id, uname, displayName, subscribed) => {
        setUserId(String(id));
        setUsername(uname);
        setName(displayName);
        setIsSubscribed(subscribed);
        localStorage.setItem('userId', String(id));
        localStorage.setItem('username', uname);
        localStorage.setItem('name', displayName);
        localStorage.setItem('isSubscribed', String(subscribed));
    };

    // Called right after a successful Rs.30 payment
    const updateSubscription = (subscribed) => {
        setIsSubscribed(subscribed);
        localStorage.setItem('isSubscribed', String(subscribed));
    };

    const logout = () => {
        setUserId(null);
        setUsername(null);
        setName(null);
        setIsSubscribed(false);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ userId, username, name, isSubscribed, login, updateSubscription, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}