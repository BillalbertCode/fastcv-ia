// Hook para el control de formularios
// Valida los datos, controla los inputs, devuelve la data
import { useState } from "react"

/**
 * Validacion y manejo de  formularios
 * @param {const} schema - schema de validacion con zod 
 * @param {object} initialState - objeto con el estado inicial del formulario  
 * @param {function} onClick - funcion de envio de los datos
 * @returns 
 */
export const useForm = (schema, initialState, onClick) => {
    // Manejador de inputs
    const [formData, setformData] = useState(initialState)

    // manejador de errorses
    const [errors, seterrors] = useState({})

    // onChange del input
    const handleInput = (e) => {
        const { name, value } = e.target
        setformData({ ...formData, [name]: value })

        if (errors[name]?._errors) {
            seterrors({ ...errors, [name]: null })
        }
    }

    const validate = () => {
        // Validacion de esquema
        const { success, error, data } = schema.safeParse(formData)

        // Controlamos y asignamos el error
        if (!success) {
            const errorsObject = error.format()
            seterrors(errorsObject)
            return false
        }

        // Devuleve los datos
        return data
    }

    // Reinicia los campos del formulario
    const resetInputs = () => {
        seterrors({})
        setformData(initialState)
    }

    //Añadir/Enviar 
    const add = () => {
        // validacion del formulario
        const dataValidated = validate()
        if (!dataValidated) {
            return
        }
        // onClick para hacer los cambios comvenientes,
        // Enviar los datos
        onClick(dataValidated)

        resetInputs()
    }
    
    return {
        errors,
        formData,
        handleInput,
        add
    }
}