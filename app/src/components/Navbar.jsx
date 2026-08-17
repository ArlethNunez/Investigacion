import { useEffect, useState } from "react";
import { CalendarDays, Moon, Sun, LogIn, LogOut, UserPlus, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/auth/useAuth";
import toast from "react-hot-toast";

import { NavLink, useNavigate } from "react-router-dom";

function getInitials(fullName) {
    if (!fullName) return "?";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
}

export function Navbar() {
    const [darkMode, setDarkMode] = useState(true);
    const { user, isAuthenticated, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const canManageEvents = hasRole(["Administrador"]);

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

    function handleLogout() {
        logout();
        toast.success("Sesión cerrada correctamente.");
        navigate("/events");
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
                        <span className="text-primary">Eventos</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 p-1 shadow-sm">
                    <NavLink to="/" className={linkClass}>
                        Inicio
                    </NavLink>
                    <NavLink to="/events" className={linkClass}>
                        Eventos
                    </NavLink>
                    {canManageEvents && (
                        <NavLink to="/create" className={linkClass}>
                            Crear evento
                        </NavLink>
                    )}
                    <NavLink to="/inscripciones" className={linkClass}>
                        Inscripciones
                    </NavLink>

                    {/* Menú de usuario */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label={isAuthenticated ? `Menú de ${user.fullName}` : "Menú de invitado"}
                                className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback>
                                        {isAuthenticated ? getInitials(user.fullName) : <UserIcon className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <p className="font-medium">
                                    {isAuthenticated ? user.fullName : "Invitado"}
                                </p>
                                <p className="text-xs font-normal text-muted-foreground">
                                    {isAuthenticated ? user.role?.name : "Sin sesión"}
                                </p>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild disabled={isAuthenticated}>
                                <NavLink to="/login" className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Iniciar sesión
                                </NavLink>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild disabled={isAuthenticated}>
                                <NavLink to="/register" className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Registrarse
                                </NavLink>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                disabled={!isAuthenticated}
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-destructive focus:text-destructive"
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
                </div>
            </nav>
        </header>
    );
}