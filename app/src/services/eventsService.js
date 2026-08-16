const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

export async function getServicios() {
    try {
        const response = await fetch(`${API_URL}/servicios`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("Error al obtener los servicios");
    }
}

export async function getServicioById(id) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Error al obtener el servicio");
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del servicio.");
    }
}

export async function createServicio(servicioData) {
    const response = await fetch(`${API_URL}/servicios`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(servicioData)
    });

    if (!response.ok) {
        const data = await response.json();
        console.error("========== ERROR API CREATE ==========");
        console.error(JSON.stringify(data, null, 2));
        console.error("=======================================");
        throw new Error(data?.message || "No se pudo crear el servicio.");
    }

    return await response.json();
}

export async function updateServicio(id, servicioData) {
    const response = await fetch(`${API_URL}/servicios/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(servicioData)
    });

    if (!response.ok) {
        const data = await response.json();
        console.error("========== ERROR API UPDATE ==========");
        console.error(JSON.stringify(data, null, 2));
        console.error("=======================================");
        throw new Error(data?.message || "No se pudo actualizar el servicio.");
    }

    return await response.json();
}

export async function cambiarEstadoServicio(id, activo) {
    const response = await fetch(`${API_URL}/servicios/${id}/estado`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ activo })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "No se pudo cambiar el estado del servicio.");
    }

    return await response.json();
}