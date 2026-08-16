import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { AuthContext } from "./AuthContext"
import { loginUser, registerUser, getProfile } from "../services/authService"
import PropTypes from "prop-types"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const isMounted = useRef(true) // evita setState tras desmontar el componente

    const clearSession = useCallback(() => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
    }, [])

    // Restaura la sesión al montar la app (F5)
    useEffect(() => {
        isMounted.current = true

        async function restoreSession() {
            const savedToken = localStorage.getItem("token")
            if (!savedToken) {
                setLoading(false)
                return
            }
            try {
                const profile = await getProfile(savedToken) // valida el token contra el API
                if (isMounted.current) {
                    setToken(savedToken)
                    setUser(profile)
                }
            } catch {
                clearSession() // token inválido/expirado
            } finally {
                if (isMounted.current) setLoading(false)
            }
        }

        restoreSession()
        return () => { isMounted.current = false }
    }, [clearSession])

    const login = useCallback(async (email, password) => {
        const { token: newToken } = await loginUser(email, password)
        const profile = await getProfile(newToken)
        localStorage.setItem("token", newToken)
        setToken(newToken)
        setUser(profile)
        return profile
    }, [])

    const register = useCallback(async (userData) => {
        return await registerUser(userData) // rol Cliente por defecto
    }, [])

    const logout = useCallback(() => {
        clearSession()
    }, [clearSession])

    
const hasRole = useCallback((allowedRoles) => {
    if (!user?.rol?.nombre) return false
    return allowedRoles.includes(user.rol.nombre)
}, [user])


    const isAuthenticated = Boolean(token && user)

    // useMemo mantiene estable la referencia del objeto compartido
    const value = useMemo(() => ({
        user, token, loading, isAuthenticated,
        login, register, logout, hasRole
    }), [user, token, loading, isAuthenticated, login, register, logout, hasRole])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}