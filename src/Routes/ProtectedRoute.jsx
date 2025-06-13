import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "Contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null;                    // спиннер можно добавить

    // если нет пользователя — уходим на /login, запоминая откуда пришли
    if (!user)
        return (
            <Navigate
                to="/login"
                state={{ from: location }}              // пригодится, если решите «возвратиться»
                replace
            />
        );

    return children;
};

export default ProtectedRoute;
