import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";          // 👈 правильно

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser]     = useState(null);
    const [loading, setLoad]  = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (fbUser) => {
            setUser(fbUser);
            setLoad(false);
        });
        return unsub;
    }, []);

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
