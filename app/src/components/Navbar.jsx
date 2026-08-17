import { useEffect, useState } from "react";
import {
    CalendarDays,
    Moon,
    Sun,
    LogIn,
    LogOut,
    UserPlus,
    User as UserIcon,
    Menu,
    X,
} from "lucide-react";

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

    const last =
        parts.length > 1
            ? parts[parts.length - 1][0]
            : "";

    return (first + last).toUpperCase();
}


export function Navbar() {

    const [darkMode, setDarkMode] = useState(true);

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const {
        user,
        isAuthenticated,
        logout,
        hasRole
    } = useAuth();

    const navigate = useNavigate();

    const canManageEvents =
        hasRole(["Administrador"]);


    // =========================================
    // ESTILOS DE LOS LINKS
    // =========================================

    const linkClass = ({ isActive }) =>
        isActive
            ? "rounded-full px-4 py-2 text-primary font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            : "rounded-full px-4 py-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";


    // =========================================
    // MODO OSCURO / CLARO
    // =========================================

    useEffect(() => {

        document.documentElement.classList.toggle(
            "dark",
            darkMode
        );

    }, [darkMode]);


    function toggleTheme() {

        setDarkMode(
            (prev) => !prev
        );

    }


    // =========================================
    // CERRAR SESIÓN
    // =========================================

    function handleLogout() {

        logout();

        toast.success(
            "Sesión cerrada correctamente."
        );

        navigate("/events");

        setMobileMenuOpen(false);

    }


    // =========================================
    // CERRAR MENÚ LATERAL
    // =========================================

    function closeMenu() {

        setMobileMenuOpen(false);

    }


    // =========================================
    // ABRIR / CERRAR MENÚ
    // =========================================

    function toggleMobileMenu() {

        setMobileMenuOpen(
            (prev) => !prev
        );

    }


    return (

        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">


            {/* ================================================= */}
            {/* NAVBAR PRINCIPAL */}
            {/* ================================================= */}

            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">


                {/* ============================================= */}
                {/* LOGO */}
                {/* ============================================= */}

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

                        <CalendarDays className="h-5 w-5" />

                    </div>


                    <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">

                        Sistema de{" "}

                        <span className="text-primary">
                            Eventos
                        </span>

                    </h1>

                </div>


                {/* ================================================= */}
                {/* PARTE DERECHA */}
                {/* ================================================= */}

                <div className="flex items-center gap-2">


                    {/* ================================================= */}
                    {/* LINKS ORIGINALES */}
                    {/* ================================================= */}

                    <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card/70 p-1 shadow-sm">


                        {/* INICIO */}

                        <NavLink
                            to="/"
                            className={linkClass}
                        >
                            Inicio
                        </NavLink>


                        {/* EVENTOS */}

                        <NavLink
                            to="/events"
                            className={linkClass}
                        >
                            Eventos
                        </NavLink>


                        {/* CREAR EVENTO */}

                        {canManageEvents && (

                            <NavLink
                                to="/create"
                                className={linkClass}
                            >
                                Crear evento
                            </NavLink>

                        )}


                        {/* INSCRIPCIONES */}

                        <NavLink
                            to="/inscripciones"
                            className={linkClass}
                        >
                            Inscripciones
                        </NavLink>


                    </div>


                    {/* ================================================= */}
                    {/* MENÚ DE USUARIO */}
                    {/* ================================================= */}

                    <DropdownMenu>

                        <DropdownMenuTrigger asChild>

                            <Button
                                variant="outline"
                                size="icon"
                                aria-label={
                                    isAuthenticated
                                        ? `Menú de ${user.fullName}`
                                        : "Menú de invitado"
                                }
                                className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >

                                <Avatar className="h-7 w-7">

                                    <AvatarFallback>

                                        {isAuthenticated
                                            ? getInitials(
                                                user.fullName
                                            )
                                            : (
                                                <UserIcon className="h-4 w-4" />
                                            )}

                                    </AvatarFallback>

                                </Avatar>

                            </Button>

                        </DropdownMenuTrigger>


                        <DropdownMenuContent
                            align="end"
                            className="w-56"
                        >

                            <DropdownMenuLabel>

                                <p className="font-medium">

                                    {isAuthenticated
                                        ? user.fullName
                                        : "Invitado"}

                                </p>


                                <p className="text-xs font-normal text-muted-foreground">

                                    {isAuthenticated
                                        ? user.role?.name
                                        : "Sin sesión"}

                                </p>

                            </DropdownMenuLabel>


                            <DropdownMenuSeparator />


                            {/* LOGIN */}

                            <DropdownMenuItem
                                asChild
                                disabled={isAuthenticated}
                            >

                                <NavLink
                                    to="/login"
                                    className="flex items-center gap-2"
                                >

                                    <LogIn className="h-4 w-4" />

                                    Iniciar sesión

                                </NavLink>

                            </DropdownMenuItem>


                            {/* REGISTRO */}

                            <DropdownMenuItem
                                asChild
                                disabled={isAuthenticated}
                            >

                                <NavLink
                                    to="/register"
                                    className="flex items-center gap-2"
                                >

                                    <UserPlus className="h-4 w-4" />

                                    Registrarse

                                </NavLink>

                            </DropdownMenuItem>


                            {/* LOGOUT */}

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


                    {/* ================================================= */}
                    {/* BOTÓN DE TEMA */}
                    {/* ================================================= */}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Cambiar tema"
                        className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >

                        {darkMode ? (

                            <Sun className="h-5 w-5" />

                        ) : (

                            <Moon className="h-5 w-5" />

                        )}

                    </Button>


                    {/* ================================================= */}
                    {/* BOTÓN HAMBURGUESA */}
                    {/* ================================================= */}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleMobileMenu}
                        aria-label={
                            mobileMenuOpen
                                ? "Cerrar menú"
                                : "Abrir menú"
                        }
                        aria-expanded={mobileMenuOpen}
                        className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >

                        {mobileMenuOpen ? (

                            <X className="h-5 w-5" />

                        ) : (

                            <Menu className="h-5 w-5" />

                        )}

                    </Button>


                </div>

            </nav>


            {/* ========================================================= */}
            {/* FONDO OSCURO CUANDO EL MENÚ ESTÁ ABIERTO */}
            {/* ========================================================= */}

            <div
                onClick={closeMenu}
                className={`
                    fixed inset-0 z-[90]
                    bg-black/40
                    transition-opacity duration-300
                    ${mobileMenuOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                `}
            />


            {/* ========================================================= */}
            {/* MENÚ LATERAL */}
            {/* ========================================================= */}

            <aside
                className={`
                    fixed left-0 top-0 z-[100]
                    h-screen w-72
                    border-r border-border
                    bg-background
                    shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${mobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                <div className="flex h-full flex-col">


                    {/* ================================================= */}
                    {/* CABECERA DEL MENÚ */}
                    {/* ================================================= */}

                    <div className="flex items-center justify-between border-b border-border px-5 py-4">


                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">

                                <CalendarDays className="h-5 w-5" />

                            </div>


                            <div>

                                <p className="font-bold text-foreground">
                                    Sistema de
                                </p>

                                <p className="font-bold text-primary">
                                    Eventos
                                </p>

                            </div>

                        </div>


                        {/* BOTÓN X */}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={closeMenu}
                            aria-label="Cerrar menú"
                            className="rounded-full border-border hover:bg-accent hover:text-accent-foreground"
                        >

                            <X className="h-5 w-5" />

                        </Button>


                    </div>


                    {/* ================================================= */}
                    {/* CONTENIDO DEL MENÚ */}
                    {/* ================================================= */}

                    <div className="flex-1 overflow-y-auto px-4 py-5">


                        {/* ================================================= */}
                        {/* NAVEGACIÓN */}
                        {/* ================================================= */}

                        <div>

                            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Navegación
                            </p>


                            <div className="flex flex-col gap-1">


                                {/* INICIO */}

                                <NavLink
                                    to="/"
                                    className={linkClass}
                                    onClick={closeMenu}
                                >

                                    Inicio

                                </NavLink>


                                {/* EVENTOS */}

                                <NavLink
                                    to="/events"
                                    className={linkClass}
                                    onClick={closeMenu}
                                >

                                    Eventos

                                </NavLink>


                                {/* CREAR EVENTO */}

                                {canManageEvents && (

                                    <NavLink
                                        to="/create"
                                        className={linkClass}
                                        onClick={closeMenu}
                                    >

                                        Crear evento

                                    </NavLink>

                                )}


                                {/* INSCRIPCIONES */}

                                <NavLink
                                    to="/inscripciones"
                                    className={linkClass}
                                    onClick={closeMenu}
                                >

                                    Inscripciones

                                </NavLink>


                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* SEPARADOR */}
                        {/* ================================================= */}

                        <div className="my-5 border-t border-border" />


                        {/* ================================================= */}
                        {/* INFORMACIÓN DEL USUARIO */}
                        {/* ================================================= */}

                        <div>

                            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Usuario
                            </p>


                            <div className="flex items-center gap-3 rounded-xl bg-card/70 px-4 py-3">


                                <Avatar className="h-10 w-10">

                                    <AvatarFallback>

                                        {isAuthenticated
                                            ? getInitials(
                                                user.fullName
                                            )
                                            : (
                                                <UserIcon className="h-4 w-4" />
                                            )}

                                    </AvatarFallback>

                                </Avatar>


                                <div className="min-w-0">

                                    <p className="truncate font-medium">

                                        {isAuthenticated
                                            ? user.fullName
                                            : "Invitado"}

                                    </p>


                                    <p className="truncate text-xs text-muted-foreground">

                                        {isAuthenticated
                                            ? user.role?.name
                                            : "Sin sesión"}

                                    </p>

                                </div>


                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* OPCIONES DE CUENTA */}
                        {/* ================================================= */}

                        <div className="mt-3 flex flex-col gap-1">


                            {/* LOGIN */}

                            <NavLink
                                to="/login"
                                onClick={closeMenu}
                                className={`
                                    flex items-center gap-3
                                    rounded-full px-4 py-2
                                    text-muted-foreground
                                    hover:bg-primary
                                    hover:text-primary-foreground
                                    ${
                                        isAuthenticated
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                `}
                            >

                                <LogIn className="h-4 w-4" />

                                Iniciar sesión

                            </NavLink>


                            {/* REGISTRO */}

                            <NavLink
                                to="/register"
                                onClick={closeMenu}
                                className={`
                                    flex items-center gap-3
                                    rounded-full px-4 py-2
                                    text-muted-foreground
                                    hover:bg-primary
                                    hover:text-primary-foreground
                                    ${
                                        isAuthenticated
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                `}
                            >

                                <UserPlus className="h-4 w-4" />

                                Registrarse

                            </NavLink>


                            {/* LOGOUT */}

                            <button
                                disabled={!isAuthenticated}
                                onClick={handleLogout}
                                className="
                                    flex items-center gap-3
                                    rounded-full px-4 py-2
                                    text-left
                                    text-destructive
                                    hover:bg-destructive/10
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >

                                <LogOut className="h-4 w-4" />

                                Cerrar sesión

                            </button>


                        </div>


                        {/* ================================================= */}
                        {/* SEPARADOR */}
                        {/* ================================================= */}

                        <div className="my-5 border-t border-border" />


                        {/* ================================================= */}
                        {/* TEMA */}
                        {/* ================================================= */}

                        <div>

                            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Apariencia
                            </p>


                            <button
                                onClick={toggleTheme}
                                className="
                                    flex w-full items-center gap-3
                                    rounded-full px-4 py-2
                                    text-left
                                    text-muted-foreground
                                    hover:bg-accent
                                    hover:text-accent-foreground
                                "
                            >

                                {darkMode ? (

                                    <Sun className="h-5 w-5" />

                                ) : (

                                    <Moon className="h-5 w-5" />

                                )}


                                {darkMode
                                    ? "Cambiar a modo claro"
                                    : "Cambiar a modo oscuro"}

                            </button>

                        </div>


                    </div>


                    {/* ================================================= */}
                    {/* PIE DEL MENÚ */}
                    {/* ================================================= */}

                    <div className="border-t border-border px-5 py-4">

                        <p className="text-center text-xs text-muted-foreground">
                            Sistema de Eventos
                        </p>

                    </div>


                </div>

            </aside>


        </header>
    );
}