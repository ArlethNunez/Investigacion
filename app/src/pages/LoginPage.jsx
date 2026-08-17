import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";

import { useAuth } from "../auth/useAuth";
import { PageHeader } from "../components/PageHeader";
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

export function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const previousRoute = location.state?.from?.pathname;

    useEffect(() => {
        if (isAuthenticated) {
            navigate(previousRoute || "/events", { replace: true });
        }
    }, [isAuthenticated, navigate, previousRoute]);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Debe ingresar correo y contraseña.");
            return;
        }

        try {
            setSubmitting(true);
            await login({ email: email.trim(), password });
            toast.success("Sesión iniciada correctamente.");
            navigate(previousRoute || "/events", { replace: true });
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="mx-auto max-w-md space-y-6">
            <PageHeader
                title="Iniciar sesión"
                description="Ingrese sus credenciales para acceder al sistema."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <LogIn className="h-5 w-5 text-primary" />
                        Acceso
                    </CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div>
                            <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@utn.ac.cr"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-2 flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-sm font-medium text-destructive">{error}</p>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Ingresando..." : "Iniciar sesión"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            ¿No tiene cuenta?{" "}
                            <Link to="/register" className="text-primary hover:underline">
                                Regístrese aquí
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </section>
    );
}