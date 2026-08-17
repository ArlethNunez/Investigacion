const API_URL = import.meta.env.VITE_API_URL;

export async function getRegistrationStatuses() {
    try {
        const response = await fetch(`${API_URL}/registration-statuses`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudieron obtener los estados de inscripción.");
    }
}