import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { UserPlus, User, Mail, Lock, ShieldCheck } from "lucide-react";

import { useAuth } from "../auth/useAuth";
import { registerSchema } from "../schemas/registerSchema";
import { PageHeader } from "../components/PageHeader";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FormError } from "../components/FormError";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

export function RegisterPage() {
    const { register: registerUserSession, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/events", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function handleValidSubmit(formData) {
        try {
            await registerUserSession({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
            });

            toast.success("Cuenta registrada correctamente. Ahora puede iniciar sesión.");
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <section className="mx-auto max-w-md space-y-6">
            <Breadcrumbs
                items={[
                    { label: "Inicio", to: "/" },
                    { label: "Registro" },
                ]}
            />

            <PageHeader
                title="Registro de usuario"
                description="Cree una cuenta para gestionar sus inscripciones a eventos."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Nueva cuenta
                    </CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit(handleValidSubmit)}>
                    <CardContent className="grid gap-4">
                        <div>
                            <Label htmlFor="fullName" className="mb-2 flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Nombre completo
                            </Label>
                            <Input
                                id="fullName"
                                className={errors.fullName ? "border-destructive" : ""}
                                {...register("fullName")}
                            />
                            <FormError message={errors.fullName?.message} />
                        </div>

                        <div>
                            <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className={errors.email ? "border-destructive" : ""}
                                {...register("email")}
                            />
                            <FormError message={errors.email?.message} />
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-2 flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                className={errors.password ? "border-destructive" : ""}
                                {...register("password")}
                            />
                            <FormError message={errors.password?.message} />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Confirmar contraseña
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                className={errors.confirmPassword ? "border-destructive" : ""}
                                {...register("confirmPassword")}
                            />
                            <FormError message={errors.confirmPassword?.message} />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            ¿Ya tiene cuenta?{" "}
                            <Link to="/login" className="text-primary hover:underline">
                                Inicie sesión aquí
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </section>
    );
}