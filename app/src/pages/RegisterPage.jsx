import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "@/auth/useAuth"
import { registerSchema } from "@/schemas/registerSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"

export function RegisterPage() {
    const { register: registerUser, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    })

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/events", { replace: true })
        }
    }, [isAuthenticated, navigate])

    async function onSubmit(data) {
        setLoading(true)
        try {
            await registerUser({
                nombre: data.nombre,
                primerApellido: data.primerApellido,
                segundoApellido: data.segundoApellido || undefined,
                correo: data.correo,
                telefono: data.telefono || undefined,
                password: data.password
            })
            toast.success("Cuenta creada correctamente. Iniciá sesión.")
            navigate("/login", { replace: true })
        } catch {
            toast.error("No se pudo completar el registro")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Crear cuenta</CardTitle>
                    <CardDescription>Registrate para poder agendar citas de orientación</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input id="nombre" type="text" {...register("nombre")} />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="primerApellido">Primer apellido</Label>
                            <Input id="primerApellido" type="text" {...register("primerApellido")} />
                            {errors.primerApellido && (
                                <p className="text-sm text-red-500">{errors.primerApellido.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="segundoApellido">Segundo apellido</Label>
                            <Input id="segundoApellido" type="text" {...register("segundoApellido")} />
                            {errors.segundoApellido && (
                                <p className="text-sm text-red-500">{errors.segundoApellido.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="correo">Correo</Label>
                            <Input id="correo" type="email" {...register("correo")} />
                            {errors.correo && (
                                <p className="text-sm text-red-500">{errors.correo.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" type="tel" {...register("telefono")} />
                            {errors.telefono && (
                                <p className="text-sm text-red-500">{errors.telefono.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Registrando..." : "Registrarse"}
                        </Button>

                        <p className="text-sm text-center">
                            ¿Ya tenés cuenta?{" "}
                            <Link to="/login" className="underline">Iniciá sesión</Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
