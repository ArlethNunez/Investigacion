const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Credenciales incorrectas.");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || "No se pudo iniciar sesión.");
    }
}

export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                roleId: userData.roleId ?? 2,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "No se pudo completar el registro.");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || "No se pudo registrar el usuario.");
    }
}

export async function getProfile(token) {
    try {
        const response = await fetch(`${API_URL}/users/perfil`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Sesión inválida o expirada.");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || "No se pudo obtener el perfil.");
    }
}