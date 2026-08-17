import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, MapPin, Monitor, Users, ClipboardCheck } from "lucide-react";

import { createRegistrationSchema } from "../schemas/registrationSchema";
import { getRegistrationsByEvent } from "../services/registrationsService";
import { FormError } from "./FormError";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export function RegistrationForm({ events, users, statuses, onValidSubmit }) {
    const schema = useMemo(() => createRegistrationSchema(events), [events]);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            eventId: "",
            userId: "",
            statusId: "",
            confirmed: false,
        },
    });

    const selectedEventId = watch("eventId");
    const selectedEvent = events.find((e) => String(e.id) === selectedEventId);

    const [eventStats, setEventStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        if (!selectedEventId) {
            setEventStats(null);
            return;
        }

        async function loadStats() {
            try {
                setLoadingStats(true);
                const data = await getRegistrationsByEvent(selectedEventId);
                const inscritos = data.data.filter(
                    (reg) => reg.status?.name === "Inscrito"
                ).length;
                setEventStats({ inscritos });
            } catch {
                setEventStats(null);
            } finally {
                setLoadingStats(false);
            }
        }

        loadStats();
    }, [selectedEventId]);

    function handleSubmitForm(formData) {
        onValidSubmit(formData, () => {
            reset();
            setEventStats(null);
        });
    }

    const cuposDisponibles =
        selectedEvent && eventStats
            ? selectedEvent.totalCapacity - eventStats.inscritos
            : null;

    return (
        <Card className="mx-auto max-w-2xl border-border/70 shadow-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Inscripción a evento</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <CardContent className="grid gap-5">
                    {/* Evento */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            Evento
                        </label>
                        <Controller
                            name="eventId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        className={errors.eventId ? "border-destructive" : ""}
                                    >
                                        <SelectValue placeholder="Seleccione un evento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map((event) => (
                                            <SelectItem key={event.id} value={String(event.id)}>
                                                {event.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormError message={errors.eventId?.message} />
                    </div>

                    {/* Información dinámica del evento */}
                    {selectedEvent && (
                        <div className="grid gap-2 rounded-lg border bg-muted/30 p-4 text-sm">
                            <p className="font-semibold">{selectedEvent.title}</p>
                            <p className="flex items-center gap-2 text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(selectedEvent.date).toLocaleString("es-CR", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                })}
                            </p>
                            <p className="flex items-center gap-2 text-muted-foreground">
                                <Monitor className="h-4 w-4" />
                                {selectedEvent.modality}
                            </p>
                            <p className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {selectedEvent.location}
                            </p>
                            <p className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                Capacidad total: {selectedEvent.totalCapacity}
                            </p>

                            {loadingStats ? (
                                <p className="text-muted-foreground">Consultando disponibilidad...</p>
                            ) : eventStats ? (
                                <>
                                    <p>Inscritos: {eventStats.inscritos}</p>
                                    <p
                                        className={
                                            cuposDisponibles > 0
                                                ? "font-semibold text-primary"
                                                : "font-semibold text-destructive"
                                        }
                                    >
                                        Cupos disponibles: {cuposDisponibles}
                                    </p>
                                </>
                            ) : null}
                        </div>
                    )}

                    {/* Usuario */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4 text-primary" />
                            Usuario
                        </label>
                        <Controller
                            name="userId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        className={errors.userId ? "border-destructive" : ""}
                                    >
                                        <SelectValue placeholder="Seleccione un usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)}>
                                                {user.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormError message={errors.userId?.message} />
                    </div>

                    {/* Estado de inscripción */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <ClipboardCheck className="h-4 w-4 text-primary" />
                            Estado de inscripción
                        </label>
                        <Controller
                            name="statusId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        className={errors.statusId ? "border-destructive" : ""}
                                    >
                                        <SelectValue placeholder="Seleccione un estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={String(status.id)}>
                                                {status.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormError message={errors.statusId?.message} />
                    </div>

                    {/* Confirmación */}
                    <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                        <input
                            id="confirmed"
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 accent-primary"
                            {...register("confirmed")}
                        />
                        <div>
                            <label htmlFor="confirmed" className="text-sm font-medium">
                                Confirmo que verifiqué la información antes de registrar
                            </label>
                            <FormError message={errors.confirmed?.message} />
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end border-t pt-6">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Registrando..." : "Registrar inscripción"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

RegistrationForm.propTypes = {
    events: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    statuses: PropTypes.array.isRequired,
    onValidSubmit: PropTypes.func.isRequired,
};