import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, ArrowRight, Pencil, PowerOff } from "lucide-react";
import { useAuth } from "@/auth/useAuth";

import { Link } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"

export function EventCard({ event: servicio }) {
    const URL = import.meta.env.VITE_IMAGE_URL
    const { hasRole } = useAuth()
    const canManageEvents = hasRole(["Administrador"])

    function handleToggleEstado(servicio) {
        // Cuando conectes /servicios/{id}/estado con PATCH, acá va la llamada real.
        toast.success(
            `El servicio "${servicio.nombre}" cambió de estado (simulado).`
        )
    }
    return (
        <Card className="relative group overflow-hidden border-border bg-card text-card-foreground hover:border-primary/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                    src={`${URL}/${servicio.imagen}?width=300&height=200&resize=contain`}
                    alt={servicio.nombre}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {servicio.nombre}
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span>{servicio.duracionMinutos} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-primary/70" />
                    <span className="line-clamp-1">₡{servicio.precioBase}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-3">
                <div className="flex items-center justify-end gap-2">
                    {/* Ver detalle */}
                    <Button
                        asChild
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 bg-secondary/40 transition-colors hover:bg-accent"
                    >
                        <Link to={`/events/${servicio.id}`} title="Ver detalles">
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>

                    {canManageEvents && (
                        <>
                            {/* Editar */}
                            <Button
                                asChild
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 bg-secondary/40 transition-colors hover:bg-accent"
                            >
                                <Link to={`/events/${servicio.id}/edit`} title="Editar servicio">
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </Button>
                            {/* Activar/Desactivar */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        title="Cambiar estado del servicio"
                                        className="h-9 w-9 border-destructive/30 bg-destructive/5 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <PowerOff className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            ¿Desea cambiar el estado de este servicio?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            El API no permite eliminar servicios, solo activarlos o desactivarlos (PATCH /servicios/{'{id}'}/estado).
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleToggleEstado(servicio)}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Sí, cambiar estado
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

EventCard.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        precioBase: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        duracionMinutos: PropTypes.number.isRequired,
        imagen: PropTypes.string,
    }).isRequired,
};