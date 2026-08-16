export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t border-border bg-card text-card-foreground text-center p-6 mt-auto">
            <p className="text-sm text-muted-foreground">
                © {currentYear}{" "}
                <span className="text-primary font-medium">InternCR</span>.
                Todos los derechos reservados y un abracito.
            </p>
        </footer>
    );
}