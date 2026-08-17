import { useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "./useAuth";

export function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // useEffect en vez de llamar toast() directo en el render:
    // así evitamos un efecto secundario durante el renderizado
    // (React puede re-renderizar el componente más de una vez
    // en modo StrictMode, y no querés que el toast se duplique).
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            toast.error("Necesitás iniciar sesión para ver esta página.");
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return <p className="text-center text-muted-foreground">Verificando sesión...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};