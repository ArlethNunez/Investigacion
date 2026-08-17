import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
const fullNameRegex = /^\S+(\s+\S+)+$/;

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(5, "El nombre debe tener al menos 5 caracteres")
            .max(80, "El nombre no puede superar los 80 caracteres")
            .regex(
                fullNameRegex,
                "Debe incluir al menos un espacio entre nombre y apellido"
            ),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Ingrese un correo electrónico válido"),

        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .max(30, "La contraseña no puede superar los 30 caracteres")
            .regex(
                passwordRegex,
                "Debe incluir mayúscula, minúscula, número y carácter especial"
            ),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });