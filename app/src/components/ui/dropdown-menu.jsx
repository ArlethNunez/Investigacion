"use client"

import * as DropdownMenuPrimitive from "radix-ui"
import PropTypes from "prop-types"
import { cn } from "@/lib/utils"

function DropdownMenu(props) {
    return <DropdownMenuPrimitive.DropdownMenu.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(props) {
    return <DropdownMenuPrimitive.DropdownMenu.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
    return (
        <DropdownMenuPrimitive.DropdownMenu.Portal>
            <DropdownMenuPrimitive.DropdownMenu.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                className={cn(
                    "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
                    className
                )}
                {...props}
            />
        </DropdownMenuPrimitive.DropdownMenu.Portal>
    )
}

DropdownMenuContent.propTypes = {
    className: PropTypes.string,
    sideOffset: PropTypes.number
}

function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
    return (
        <DropdownMenuPrimitive.DropdownMenu.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
                "data-[variant=destructive]:text-red-500 data-[variant=destructive]:focus:bg-red-500/10",
                className
            )}
            {...props}
        />
    )
}

DropdownMenuItem.propTypes = {
    className: PropTypes.string,
    inset: PropTypes.bool,
    variant: PropTypes.string
}

function DropdownMenuLabel({ className, inset, ...props }) {
    return (
        <DropdownMenuPrimitive.DropdownMenu.Label
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn(
                "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
                className
            )}
            {...props}
        />
    )
}

DropdownMenuLabel.propTypes = {
    className: PropTypes.string,
    inset: PropTypes.bool
}

function DropdownMenuSeparator({ className, ...props }) {
    return (
        <DropdownMenuPrimitive.DropdownMenu.Separator
            data-slot="dropdown-menu-separator"
            className={cn("bg-border -mx-1 my-1 h-px", className)}
            {...props}
        />
    )
}

DropdownMenuSeparator.propTypes = {
    className: PropTypes.string
}

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
}
