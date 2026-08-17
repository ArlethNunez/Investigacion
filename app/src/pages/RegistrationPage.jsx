import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "../components/PageHeader";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { RegistrationForm } from "../components/RegistrationForm";
import { Alert } from "../components/ui/alert";
import { getEvents } from "../services/eventsService";
import { getUsers } from "../services/usersService";
import { getRegistrationStatuses } from "../services/registrationStatusesService.js";
import { createRegistration } from "../services/registrationsService";

export function RegistrationPage() {
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const [eventsData, usersData, statusesData] = await Promise.all([
                    getEvents(),
                    getUsers(),
                    getRegistrationStatuses(),
                ]);

                setEvents(eventsData.data);
                setUsers(usersData.data);
                setStatuses(statusesData.data);
            } catch {
                setError("No se pudieron cargar los datos necesarios para el formulario.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    async function handleRegister(formData, onSuccess) {
        try {
            const registrationData = {
                eventId: Number(formData.eventId),
                userId: Number(formData.userId),
                statusId: Number(formData.statusId),
            };

            await createRegistration(registrationData);

            toast.success("La inscripción fue registrada correctamente.");
            onSuccess();
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando datos del formulario...</p>;
    }

    return (
        <section className="space-y-6">
            <Breadcrumbs
                items={[
                    { label: "Inicio", to: "/" },
                    { label: "Eventos", to: "/events" },
                    { label: "Inscripciones" },
                ]}
            />

            <PageHeader
                title="Inscripción de usuarios a eventos"
                description="Registre la inscripción de un usuario en un evento disponible."
            />

            {error && <Alert variant="destructive">{error}</Alert>}

            {!error && (
                <RegistrationForm
                    events={events}
                    users={users}
                    statuses={statuses}
                    onValidSubmit={handleRegister}
                />
            )}
        </section>
    );
}