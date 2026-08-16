import { z } from "zod"
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
]

export const eventSchema = z.object({
    nombre: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(120, "El nombre no debe superar 120 caracteres."),
    descripcion: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(500, "La descripción no debe superar 500 caracteres."),
    precioBase: z.coerce.number()
        .positive("El precio debe ser mayor a 0."),
    duracionMinutos: z.coerce.number()
        .int("La duración debe ser un número entero.")
        .min(1, "La duración debe ser mayor a 0."),
    activo: z.boolean(),
    especialidadId: z.coerce.number()
        .int("Debe seleccionar una especialidad.")
        .min(1, "Debe seleccionar una especialidad."),

    imagen: z
        .any()
        .refine((files) => files?.length === 1, {
            message: "Debe seleccionar una imagen."
        })
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
            message: "La imagen no debe superar los 2 MB."
        })
        .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
            message: "Solo se permiten imágenes JPG, PNG o WEBP."
        })
});