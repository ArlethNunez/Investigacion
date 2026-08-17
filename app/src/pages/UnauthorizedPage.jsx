import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export function UnauthorizedPage() {
    return (
        <section className="mx-auto max-w-md py-12">
            <Card>
                <CardContent
                    className="flex flex-col items-center gap-4 py-10 text-center"
                    role="alert"
                >
                    <ShieldAlert className="h-12 w-12 text-destructive" aria-hidden="true" />
                    <h2 className="text-xl font-bold">Acceso no autorizado</h2>
                    <p className="text-sm text-muted-foreground">
                        No cuenta con los permisos necesarios para acceder a esta sección.
                    </p>
                    <Button asChild>
                        <Link to="/events">Volver al listado de eventos</Link>
                    </Button>
                </CardContent>
            </Card>
        </section>
    );
}