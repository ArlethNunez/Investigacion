import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "../components/PageHeader"
import { EventForm } from "../components/EventForm"
import { Alert } from "../components/ui/alert"
import { createServicio } from "../services/eventsService"
import { getEspecialidades } from "@/services/especialidades"
import toast from "react-hot-toast"
import { uploadEventImage } from "@/services/storageService"

export function CreateEventPage() {
    const navigate = useNavigate()
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true)
                const especialidadesData = await getEspecialidades()
                setEspecialidades(especialidadesData.data)
            } catch {
                setError("No se pudieron cargar los datos del formulario.")
            } finally {
                setLoading(false)
            }
        }
        loadFormData()
    }, [])
    async function handleCreateEvent(formData) {
        try {
            let imageFileName = "image-not-found.jpg"
            const imageFile =
                formData.imagen instanceof File
                    ? formData.imagen
                    : formData.imagen?.[0]
            if (imageFile) {
                imageFileName = await uploadEventImage(imageFile)
            }
            const { activo, ...rest } = formData
            const servicioData = {
                ...rest,
                imagen: imageFileName,
            }
            console.log("imagen final:", servicioData.imagen)
            const newServicio = await createServicio(servicioData)
            toast.success(`El servicio "${newServicio.data.nombre}" fue registrado correctamente.`)
            navigate("/events")
        } catch (error) {
            console.error("Error al crear el servicio", error);
            toast.error(error.message);
        }
    }
    if (loading) {
        return <p>Cargando datos del formulario...</p>
    }
    return (
        <section className="space-y-6">
            <PageHeader
                title="Crear servicio"
                description="Complete la información del servicio y guarde los datos en la API."
            />
            {error && (
                <Alert variant="destructive">
                    {error}
                </Alert>
            )}
            <EventForm
                onSubmit={handleCreateEvent}
                especialidades={especialidades}
            />
        </section>
    )
}