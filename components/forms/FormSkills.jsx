import { useState } from "react";
// Layout
import InputGroup from "./layout/InputGroup";
// Components
import InputForm from "../component/InputForm";
import { Button } from "../ui/button";
// Esquemas
import { skillSchema } from "@/utils/schemas/userInfo.schema";

const FormSkills = ({ onClick }) => {

    // Data
    const [skills, setSkills] = useState({
        name: ''
    })

    // Manipulacion de errores
    const [errors, setErrors] = useState({})

    const handleInput = (e) => {
        const { name, value } = e.target
        setSkills({ ...skills, [name]: value })

        if (errors[name]?._errors) {
            const nullValue = { ...errors, [name]: null }
            setErrors(nullValue)
        }

    }

    const validateSkill = () => {
        const { success, error, data } = skillSchema.safeParse(skills)
        console.log(skills)

        if (!success) {
            const errorObject = error.format()
            setErrors(errorObject)
            return false
        }
        return data
    }

    const resetInputs = () => {
        setErrors({})
        setSkills(Object.fromEntries(Object.keys(skills).map(key => [key, ''])))

    }
    const addSkill = () => {

        const data = validateSkill()
        if (!data) {
            return
        }
        // Onclick para hacer los cambios
        onClick("technicalSkills", data)

        resetInputs()
        console.log(skills)
    }
    return (
        <InputGroup title={"Habilidades"}>
            <InputForm
                name='name'
                label='Habilidad'
                value={skills.name}
                _errors={errors.name?._errors}
                onChange={handleInput}
            />
            <Button onClick={addSkill} className="border hover:bg-slate-50 hover:text-black" >Añadir Habilidad</Button>
        </InputGroup>
    )
}

export default FormSkills;