import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  // lógica para armar la lista según location.pathname
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex gap-2 text-sm text-muted-foreground">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/events">Eventos</Link></li>
        <li aria-current="page">Detalle del evento</li>
      </ol>
    </nav>
  );
}