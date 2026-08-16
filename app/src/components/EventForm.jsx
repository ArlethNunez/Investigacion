import PropTypes from "prop-types"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Image,
    Text,
    Type,
    Clock,
    DollarSign,
    Hash
} from "lucide-react"

import { eventSchema } from "../schemas/eventSchema"
import { FormError } from "./FormError"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "./ui/card"
import { Controller, useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select"
import { useState } from "react"

export function EventForm({
    onSubmit,
    especialidades,
    initialData = null,
    submitText = "Registrar servicio"
}) {
    const [imagePreview, setImagePreview] = useState(
        initialData?.imagen
            ? `${import.meta.env.VITE_IMAGE_URL}/${initialData.imagen}`
            : null
    )
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            precioBase: initialData?.precioBase || "",
            duracionMinutos: initialData?.duracionMinutos || "",
            activo: initialData?.activo ?? true,
            imagen: undefined,
            especialidadId: initialData?.especialidadId
                ? String(initialData.especialidadId)
                : ""
        }
    })

    function handleImageChange(event) {
        const file = event.target.files?.[0]
        if (!file) {
            setImagePreview(null)
            return
        }
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
    }

    function handleValidSubmit(formData) {
        const file = formData.imagen?.[0]
        const dataToSend = {
            ...formData,
            imagen: file || initialData?.imagen
        }
        console.log("Datos enviados:", dataToSend)

        onSubmit(dataToSend)
    }

    return (
        <Card className="mx-auto max-w-4xl border-border/70 shadow-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Datos del servicio</CardTitle>
                <CardDescription>
                    Complete la información principal del servicio de orientación.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="nombre" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Type className="h-4 w-4 text-primary" />
                                Nombre del servicio
                            </label>
                            <Input
                                id="nombre"
                                placeholder="Ej: Orientación vocacional"
                                className={errors.nombre ? "border-destructive" : ""}
                                {...register("nombre")}
                            />
                            <FormError message={errors.nombre?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="descripcion" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Text className="h-4 w-4 text-primary" />
                                Descripción
                            </label>
                            <Textarea
                                id="descripcion"
                                placeholder="Describa brevemente el servicio"
                                rows={4}
                                className={errors.descripcion ? "border-destructive" : ""}
                                {...register("descripcion")}
                            />
                            <FormError message={errors.descripcion?.message} />
                        </div>

                        <div>
                            <label htmlFor="precioBase" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <DollarSign className="h-4 w-4 text-primary" />
                                Precio base
                            </label>
                            <Input
                                id="precioBase"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Ej: 15000"
                                className={errors.precioBase ? "border-destructive" : ""}
                                {...register("precioBase")}
                            />
                            <FormError message={errors.precioBase?.message} />
                        </div>

                        <div>
                            <label htmlFor="duracionMinutos" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Clock className="h-4 w-4 text-primary" />
                                Duración (minutos)
                            </label>
                            <Input
                                id="duracionMinutos"
                                type="number"
                                min="1"
                                placeholder="Ej: 45"
                                className={errors.duracionMinutos ? "border-destructive" : ""}
                                {...register("duracionMinutos")}
                            />
                            <FormError message={errors.duracionMinutos?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="especialidadId" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Hash className="h-4 w-4 text-primary" />
                                Especialidad
                            </label>
                            <Controller
                                name="especialidadId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.especialidadId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione una especialidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {especialidades.map((especialidad) => (
                                                <SelectItem key={especialidad.id} value={String(especialidad.id)}>
                                                    {especialidad.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.especialidadId?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="imagen"
                                className="mb-2 flex items-center gap-2 text-sm font-medium"
                            >
                                <Image className="h-4 w-4 text-primary" />
                                Imagen representativa del servicio
                            </label>
                            <div
                                className={`grid gap-4 rounded-xl border border-dashed bg-muted/30 p-4 transition-colors md:grid-cols-[220px_1fr] ${errors.imagen
                                    ? "border-destructive"
                                    : "border-border hover:border-primary/60"
                                    }`}
                            >
                                <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg border bg-background">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa del servicio"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-center text-muted-foreground">
                                            <Image className="mb-2 h-10 w-10" />
                                            <span className="text-sm font-medium">Vista previa</span>
                                            <span className="text-xs">Sin imagen seleccionada</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center gap-3">
                                    <div>
                                        <Input
                                            id="imagen"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            {...register("imagen", {
                                                onChange: handleImageChange
                                            })}
                                        />
                                        <label
                                            htmlFor="imagen"
                                            className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                        >
                                            Seleccionar imagen
                                        </label>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Subir imagen del servicio</p>
                                        <p className="text-xs text-muted-foreground">
                                            Formatos recomendados: PNG, JPG o WEBP.
                                        </p>
                                    </div>
                                    <FormError message={errors.imagen?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4 md:col-span-2">
                            <input
                                id="activo"
                                type="checkbox"
                                className="h-4 w-4 accent-primary"
                                {...register("activo")}
                            />
                            <div>
                                <label htmlFor="activo" className="text-sm font-medium">
                                    Servicio activo
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Si está activo, el servicio podrá seleccionarse al agendar una cita.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                            setImagePreview(null);
                        }}
                    >
                        Limpiar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {submitText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

EventForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    especialidades: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string
}