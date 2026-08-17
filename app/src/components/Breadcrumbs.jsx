import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

    /**
     * aria-label="breadcrumb" distingue este <nav> del Navbar principal,
     * para que un lector de pantalla lo reconozca como una región distinta
     * al navegar por landmarks.
     * El último ítem no es link (ya estás ahí) y lleva aria-current="page".
     */
export function Breadcrumbs({ items }) {
    return (
    <nav
        aria-label="breadcrumb"
        className="mb-6 flex items-center gap-2 rounded-lg border-l-4 border-primary bg-muted/40 px-4 py-2.5"
    >
        <Home className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
            <li key={item.label} className="flex items-center gap-2">
                {isLast || !item.to ? (
                <span
                    aria-current="page"
                    className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-medium text-primary"
                >
                    {item.label}
                </span>
                ) : (
                <Link
                    to={item.to}
                    className="text-muted-foreground hover:text-foreground hover:underline"
                >
                    {item.label}
                </Link>
                )}
                {!isLast && (
                <ChevronRight
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                />
                )}
            </li>
            );
        })}
        </ol>
    </nav>
    );
}

Breadcrumbs.propTypes = {
    items: PropTypes.arrayOf(
    PropTypes.shape({
        label: PropTypes.string.isRequired,
        to: PropTypes.string,
    })
    ).isRequired,
};