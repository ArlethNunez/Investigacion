const API_URL = import.meta.env.VITE_API_URL;

export async function getRegistrations() {
    try {
        const response = await fetch(`${API_URL}/registrations`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudieron obtener las inscripciones.");
    }
}

export async function getRegistrationsByEvent(eventId) {
    try {
        const response = await fetch(`${API_URL}/registrations/event/${eventId}`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudieron obtener las inscripciones del evento.");
    }
}

export async function createRegistration(registrationData) {
    try {
        const response = await fetch(`${API_URL}/registrations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registrationData),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Datos inválidos.");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || "No se pudo registrar la inscripción.");
    }
}