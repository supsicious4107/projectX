import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import defaultTheme from "Theme/defaultTheme";
import useLocalStorage from "Hooks/useLocalStorage";

import { ThemeProvider } from "styled-components";

import { AuthProvider }   from "Contexts/AuthContext";
import ProtectedRoute     from "Routes/ProtectedRoute";
import AuthScreen         from "Pages/AuthScreen/AuthScreen";
import HomePage           from "Pages/HomePage/HomePage";

function App() {
    /* что лежит в localStorage (или дефолт на первой загрузке) */
    const [storedThemeJSON] = useLocalStorage(
        "theme",
        JSON.stringify({ ...defaultTheme })
    );

    /* сливаем defaultTheme + пользовательские правки (если будут) */
    const theme = { ...defaultTheme, ...JSON.parse(storedThemeJSON) };

    useEffect(() => {
        document.title = "TO DO LIST";
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/login" element={<AuthScreen />} />
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        {/* fallback на главную для неизвестных путей */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </HashRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
