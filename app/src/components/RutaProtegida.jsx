import { Outlet } from "react-router-dom";

export function RutaProtegida({ isAuthorized }) {
  if (!isAuthorized) {
    return <p role="alert">No tenés permiso para ver esta página.</p>;
  }
  return <Outlet />;
}