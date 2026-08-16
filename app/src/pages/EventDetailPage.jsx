import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Clock,
    DollarSign,
    ArrowLeft,
    Hash,
    CircleCheck,
    CircleX
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "../components/ui/card";
import { Alert } from "../components/ui/alert";
import { getServicioById } from "../services/eventsService";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
export function EventDetailPage() {
    const { id } = useParams();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        async function loadServicio() {
            try {
                setLoading(true);
                setError("");
                const data = await getServicioById(id);
                if (!data) {
                    setServicio(null);
                    return;
                }
                setServicio(data.data);
            } catch {
                setError("Ocurrió un error al cargar el servicio.");
            } finally {
                setLoading(false);
            }
        }
        loadServicio();
    }, [id]);
    if (loading) {
        return <p className="text-muted-foreground">Cargando detalle...</p>;
    }
    if (error) {
        return <Alert>{error}</Alert>;
    }
    if (!servicio) {
        return (
            <section className="space-y-4">
                <PageHeader
                    title="Servicio no encontrado"
                    description="No existe un servicio asociado al identificador solicitado."
                />
                <Button asChild variant="outline">
                    <Link to="/events">Volver al listado de servicios</Link>
                </Button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al listado de servicios
                </Link>
            </Button>

            <PageHeader
                title={servicio.nombre}
                description="Información detallada del servicio seleccionado"
            />

            <Card className="overflow-hidden">
                {servicio.imagen && (
                    <img
                        src={`${IMAGE_URL}/${servicio.imagen}`}
                        alt={servicio.nombre}
                        className="h-72 w-full object-cover"
                    />
                )}

                <CardHeader>
                    <CardTitle>{servicio.nombre}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    {servicio.descripcion && (
                        <p className="leading-relaxed text-muted-foreground">
                            {servicio.descripcion}
                        </p>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            {servicio.duracionMinutos} minutos
                        </p>

                        <p className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            ₡{servicio.precioBase}
                        </p>

                        {servicio.especialidad && (
                            <p className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-primary" />
                                {servicio.especialidad.nombre}
                            </p>
                        )}

                        <p className="flex items-center gap-2">
                            {servicio.activo ? (
                                <>
                                    <CircleCheck className="h-4 w-4 text-primary" />
                                    Activo
                                </>
                            ) : (
                                <>
                                    <CircleX className="h-4 w-4 text-destructive" />
                                    Inactivo
                                </>
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}