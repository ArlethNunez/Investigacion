import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, useLocation, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"

const loginSchema = z.object({
    correo: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
    password: z.string().min(1, "La contraseña es obligatoria")
})

export function LoginPage() {
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const previousRoute = location.state?.from?.pathname

    // Si ya hay sesión activa, no tiene sentido mostrar el login
    useEffect(() => {
        if (isAuthenticated) {
            navigate(previousRoute || "/events", { replace: true })
        }
    }, [isAuthenticated, navigate, previousRoute])

    async function onSubmit(data) {
        setLoading(true)
        try {
            await login(data.correo, data.password)
            toast.success("Sesión iniciada correctamente")
            navigate(previousRoute || "/events", { replace: true })
        } catch {
            toast.error("Correo o contraseña incorrectos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Iniciar sesión</CardTitle>
                    <CardDescription>Ingresá tus credenciales para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="correo">Correo</Label>
                            <Input id="correo" type="email" {...register("correo")} />
                            {errors.correo && (
                                <p className="text-sm text-red-500">{errors.correo.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Ingresando..." : "Ingresar"}
                        </Button>

                        <p className="text-sm text-center">
                            ¿No tenés cuenta?{" "}
                            <Link to="/register" className="underline">Registrate</Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}