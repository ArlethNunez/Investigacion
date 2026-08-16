import { z } from "zod"

export const registerSchema = z
    .object({
        nombre: z.string().min(1, "El nombre es obligatorio"),
        primerApellido: z.string().min(1, "El primer apellido es obligatorio"),
        segundoApellido: z.string().optional(),
        correo: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
        telefono: z.string().optional(),
        password: z.string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
            .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
            .regex(/[0-9]/, "Debe contener al menos un número"),
        confirmPassword: z.string().min(1, "Debés confirmar la contraseña")
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"]
    })