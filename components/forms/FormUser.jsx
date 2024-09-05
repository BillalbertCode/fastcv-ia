// Formulario 
// Registro de datos de usuario para el CV
import { useState, useEffect, useContext } from "react"
// Contexts
import { UserContext } from "@/utils/contexts/UserContext"
// Utils
import { addInputGroup } from "@/utils/helper/input-handlers/handleInputGroup"
// Componentes de Formulario
import FormEducation from "./FormEducation"
import FormExperience from "./FormExperience"
import FormProjects from "./FormProjects"
import FormSkills from "./FormSkills"
import FormLeadership from "./FormLeadership"
import FormPersonal from "./FormPesonal"
// Componentes UI
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
// Icons
import { CheckIco, SaveIco } from "../resources/Icons"
import { XCircleIcon } from "lucide-react"

const FormUser = () => {
    // Context para manejar la data del usuario
    const { userData, saveUserCache } = useContext(UserContext)

    // Manipulacion de datos del Usuario para los imputs
    const [user, setUser] = useState(userData)

    useEffect(() => {
        if (userData) {
            setUser(userData)
        }
    }, [userData])

    const [success, setSuccess] = useState({
        message: '',
        status: true,
        visibility: false
    })

    // Guardar la informacion en cache
    const [loading, setLoading] = useState(false)

    // Notificacion de usuario guardado
    const notificationSaveUser = (message, status) => {
        setSuccess({ message, status, visibility: true })
    }

    // Manejo del tiempo de la Notificacion
    useEffect(() => {
        if (success.visibility) {
            const timeoutId = setTimeout(() => {
                setSuccess({ visibility: false });
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [success]);

    // Funcion para agregar los datos al handlerInput (user)
    const handleAddArray = (arrayName, data) => {
        setUser(addInputGroup(user, arrayName, data))
    }

    const handleAdd = (objectKey, data) => {
        setUser({ ...user, [objectKey]: data })
    }
    // Guardar informacion del usuario
    const saveInfoUser = () => {
        setLoading(true);

        // Guardamos con una funcion del userContext
        const { success, error, message } = saveUserCache(user)
        try {
            // Control de errores
            if (!success) {
                throw new Error(error)
            }
        } catch (err) {
            console.error(err)
            // Hubo un problema de validacion de inputs req

            if (error?.issues) {
                const errors = error.format()
                console.error(errors)
            }
        } finally {
            notificationSaveUser(message, success)
            setLoading(false)
        }
    }

    const cancelInfoUser = () => {
        setUser(userData)
    }

    return (
        <Card className="w-full max-w-3x1">
            <CardHeader>
                <CardTitle>Formulario de registro de datos</CardTitle>
                <CardDescription>Actualiza o agrega tu información</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <FormPersonal onClick={(data) => handleAdd("personalInfo", data)} />
                <FormSkills onClick={(data) => handleAddArray("technicalSkills", data)} />
                <FormEducation onClick={(data) => handleAddArray("education", data)} />
                <FormExperience onClick={(data) => handleAddArray("experience", data)} />
                <FormProjects onClick={(data) => handleAddArray("projects", data)} />
                <FormLeadership onClick={(data) => handleAddArray("leadershipAndActivities", data)} />
            </CardContent>
            <CardFooter className="flex-nowrap justify-between">
                <div>
                    {success.visibility && (
                        <div className={`flex items-center gap-2 ${success.status ? "text-green-500" : "text-red-500"}`}>
                            {success.status ? <CheckIco className="size-6" /> : <XCircleIcon className="size-6" />}
                            <p className="text-sm">{success.message}</p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <Button onClick={saveInfoUser} className={`border bg-vnzla rounded-full ${loading && 'cursor-wait'}`}>
                        {loading ? 'Guardando...' : 'Guardar Informacion'}
                        <SaveIco className="fill-amber-400 size-5" />
                    </Button>
                    <div className="flex justify-center">
                        <button onClick={cancelInfoUser} className="transition hover:text-red-400 font-medium text-sm">Cancelar</button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default FormUser