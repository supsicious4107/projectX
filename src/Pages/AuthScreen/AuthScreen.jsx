import { useState } from "react";
import AuthModal from "Components/auth/AuthModal";

/** Экран авторизации ― модалка не закрывается и умеет переключаться */
const AuthScreen = () => {
    const [mode, setMode] = useState("Login");

    return (
        <AuthModal
            showAuthModal={true}
            setShowAuthModal={() => {}}  // ничего не делаем
            authMode={mode}
            onSwitchMode={setMode}
            blockClose={true}            // убираем крестик / Esc
        />
    );
};

export default AuthScreen;
