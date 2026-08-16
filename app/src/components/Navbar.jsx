import { useEffect, useState } from "react";
import { CalendarDays, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

function getInitials(nombre, primerApellido) {
    if (!nombre) return "?";
    const inicialNombre = nombre[0] || "";
    const inicialApellido = primerApellido?.[0] || "";
    return (inicialNombre + inicialApellido).toUpperCase();
}

export function Navbar() {
    const [darkMode, setDarkMode] = useState(true);
    const { user, isAuthenticated, logout, hasRole } = useAuth();

    const linkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-semibold"
            : "rounded-full px-4 text-muted-foreground hover:bg-primary hover:text-primary-foreground";

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    function toggleTheme() {
        setDarkMode((prev) => !prev);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <CalendarDays className="h-5 w-5" />
                    </div>

                    <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                        Sistema de{" "}
                        <span className="text-primary">Orientación</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 p-1 shadow-sm">
                    <NavLink to="/" className={linkClass}>
                        Inicio
                    </NavLink>
                    <NavLink to="/events" className={linkClass}>
                        Servicios
                    </NavLink>
                    {hasRole(["Administrador"]) && (
                        <NavLink to="/events/create" className={linkClass}>
                            Crear servicio
                        </NavLink>
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Cambiar tema"
                        className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                        {darkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Menú de usuario"
                                className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground"
                            >
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                        {isAuthenticated ? getInitials(user.nombre, user.primerApellido) : "👤"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                {isAuthenticated ? `${user.nombre} ${user.primerApellido}` : "Invitado"}
                                <p className="text-xs font-normal text-muted-foreground">
                                    {isAuthenticated ? user.rol?.nombre : "Sin sesión"}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild disabled={isAuthenticated}>
                                <Link to="/login">Iniciar sesión</Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild disabled={isAuthenticated}>
                                <Link to="/register">Registrarse</Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem disabled={!isAuthenticated} onClick={logout}>
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}