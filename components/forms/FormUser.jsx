// Formulario 
// Registro de datos de usuario para el CV
import { useState, useEffect, useContext } from "react"
// Contexts
import { UserContext } from "@/utils/contexts/UserContext"
import FormSkills from "./FormSkills"
import { addInputGroup } from "@/utils/helper/input-handlers/handleInputGroup"

const FormUser = () => {
    // Context para manejar la data del usuario
    const { userData } = useContext(UserContext)

    // Manipulacion de datos del Usuario para los imputs
    const [user, setUser] = useState(userData)

    useEffect(() => {
        if (userData) {
            setUser(userData)
        }
    }, [userData])

    // Funcion para agregar los datos al handlerInput (user)
    const handleAdd = (arrayName, data) => {
        setUser(addInputGroup(user, arrayName, data))
        console.log(user)
    }


    return (
        <div className="m-auto">
            <FormSkills
                onClick={(data) => handleAdd("technicalSkills", data)}
            />
        </div>
    )
}

export default FormUser