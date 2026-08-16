const API_URL = import.meta.env.VITE_API_URL;

export async function getServiciosActivos() {
    try {
        const response = await fetch(`${API_URL}/servicios/activos`);

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch  {
        throw new Error("No se pudieron cargar los servicios.");
    }
}