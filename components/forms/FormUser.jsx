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
            <FormSkills onClick={(data) => handleAdd("technicalSkills", data)} />
            <FormEducation onClick={(data) => handleAdd("education", data)} />
            <FormExperience onClick={(data) => handleAdd("experience", data)} />
            <FormProjects onClick={(data) => handleAdd("projects", data)}/>
            <FormLeadership onClick={(data) => handleAdd("leadershipAndActivities", data)}/>
        </div>
    )
}

export default FormUser