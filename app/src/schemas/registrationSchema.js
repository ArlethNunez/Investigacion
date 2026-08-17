import { z } from "zod";
import { getRegistrationsByEvent } from "../services/registrationsService";

export function createRegistrationSchema(events) {
    return z
        .object({
            eventId: z.string().min(1, "Debe seleccionar un evento"),
            userId: z.string().min(1, "Debe seleccionar un usuario"),
            statusId: z.string().min(1, "Debe seleccionar un estado de inscripción"),
            confirmed: z.boolean().refine((value) => value === true, {
                message: "Debe confirmar que verificó la información antes de continuar",
            }),
        })
        .superRefine(async (data, ctx) => {
            if (!data.eventId) return;

            const event = events.find((e) => String(e.id) === data.eventId);

            if (!event) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["eventId"],
                    message: "El evento seleccionado no es válido",
                });
                return;
            }

            if (!event.isActive) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["eventId"],
                    message: "El evento seleccionado no está activo",
                });
                return;
            }

            if (new Date(event.date) < new Date()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["eventId"],
                    message: "La fecha del evento ya pasó",
                });
                return;
            }

            try {
                const registrationsData = await getRegistrationsByEvent(event.id);
                const inscritos = registrationsData.data.filter(
                    (reg) => reg.status?.name === "Inscrito"
                ).length;

                if (inscritos >= event.totalCapacity) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["eventId"],
                        message: "El evento ya no tiene cupos disponibles",
                    });
                }
            } catch {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["eventId"],
                    message: "No se pudo verificar la disponibilidad del evento",
                });
            }
        });
}