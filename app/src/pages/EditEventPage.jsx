import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { EventForm } from "../components/EventForm"
import { Alert } from "../components/ui/alert"

import { getServicioById, updateServicio } from "../services/eventsService"
import { getEspecialidades } from "@/services/especialidades"
import { uploadEventImage } from "@/services/storageService"
export function EditEventPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [servicio, setServicio] = useState(null)
    const [especialidades, setEspecialidades] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true)

                const [
                    servicioData,
                    especialidadesData
                ] = await Promise.all([
                    getServicioById(id),
                    getEspecialidades()
                ])

                if (!servicioData) {
                    setError("El servicio solicitado no existe.")
                    return
                }

                setServicio(servicioData.data)
                setEspecialidades(especialidadesData.data)

            } catch {
                setError("No se pudieron cargar los datos para editar el servicio.")
            } finally {
                setLoading(false)
            }
        }

        loadEditData()
    }, [id])
    async function handleUpdateEvent(formData) {
        try {
            let imageFileName = servicio.imagen || "image-not-found.jpg"
            const imageFile =
                formData.imagen instanceof File
                    ? formData.imagen
                    : formData.imagen?.[0]
            if (imageFile) {
                imageFileName = await uploadEventImage(
                    imageFile,
                    servicio.imagen
                )
            }
            const { activo, ...rest } = formData
            const servicioData = {
                ...rest,
                imagen: imageFileName
            }
            console.log("imagen final:", servicioData.imagen)
            const updatedServicio = await updateServicio(id, servicioData)
            toast.success(
                `El servicio "${updatedServicio.data.nombre}" fue actualizado correctamente.`
            )
            navigate("/events")
        } catch (error) {
            console.error("Error al actualizar el servicio", error)
            toast.error(error.message)
        }
    }
    if (loading) {
        return <p>Cargando datos del servicio...</p>
    }
    if (error) {
        return (
            <Alert variant="destructive">
                {error}
            </Alert>
        )
    }
    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar servicio"
                description="Modifique la información del servicio seleccionado."
            />

            <EventForm
                onSubmit={handleUpdateEvent}
                especialidades={especialidades}
                initialData={servicio}
                submitText="Actualizar servicio"
            />
        </section>
    )
}
