const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo: email, password })
        });
        if (!response.ok) {
            const data = await response.json();
            console.error("========== ERROR API LOGIN ==========");
            console.error(JSON.stringify(data, null, 2));
            console.error("======================================");
            throw new Error(JSON.stringify(data, null, 2));
        }
        const result = await response.json();
        return result.data; // { token }
    } catch {
        throw new Error("No se pudo iniciar sesión.");
    }
}

export async function getProfile(token) {
    try {
        const response = await fetch(`${API_URL}/usuarios/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error();
        }
        const result = await response.json();
        return result.data;
    } catch {
        throw new Error("No se pudo obtener el perfil del usuario.");
    }
}

export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_URL}/usuarios/registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const data = await response.json();
            console.error("========== ERROR API REGISTER ==========");
            console.error(JSON.stringify(data, null, 2));
            console.error("=========================================");
            throw new Error(JSON.stringify(data, null, 2));
        }
        const result = await response.json();
        return result.data;
    } catch {
        throw new Error("No se pudo registrar el usuario.");
    }
}