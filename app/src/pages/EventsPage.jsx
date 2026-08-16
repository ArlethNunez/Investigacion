import { useState, useEffect } from "react";
import { EventList } from "../components/EventList";
import { getServicios } from "../services/eventsService";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { Alert, AlertDescription } from "@/components/ui/alert";


export function EventsPage() {
    const [servicios, setServicios] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchServicios() {
            try {
                setLoading(true);
                const data = await getServicios();
                console.log(data);
                setServicios(data.data);
            } catch (error) {
                console.error("Error al cargar servicios", error);
                setError("Error al cargar servicios");
            } finally {
                setLoading(false);
            }
        }
        fetchServicios();
    }, []);

    // Filtrar servicios por nombre
    const filteredServicios = servicios.filter((servicio) =>
        servicio.nombre.toLowerCase().includes(search.toLowerCase())
    );
   
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando servicios...
            </p>
        );
    }
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    return (
        <section>
            <PageHeader
                title="Servicios"
                description={filteredServicios.length}
                isBadge={true}
            />

            <SearchBar value={search} onChange={setSearch} />
            {filteredServicios.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    No hay resultados
                </p>
            ) : (
                <EventList events={filteredServicios} />
            )}
        </section>
    );
}