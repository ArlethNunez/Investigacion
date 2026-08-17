import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Badge } from "@/components/ui/badge";

export function PageHeader({ title, description, isBadge = false }) {
    const headingRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
    headingRef.current?.focus();
    }, [location.pathname]);

    return (
    <div className="mb-10 space-y-2">
        <div className="flex items-center gap-3">
        <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-extrabold tracking-tight text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
            {title}
        </h1>
        {isBadge && description !== undefined && (
            <Badge
            variant="secondary"
            className="px-3 py-0.5 text-xs font-semibold uppercase tracking-wider"
            >
            {description}
            </Badge>
        )}
        </div>
        {!isBadge && description && (
        <p className="text-muted-foreground text-lg max-w-[750px]">
            {description}
        </p>
        )}
    </div>
    );
}

PageHeader.propTypes = {
    title: PropTypes.node.isRequired,
    description: PropTypes.node,
    isBadge: PropTypes.bool,
};