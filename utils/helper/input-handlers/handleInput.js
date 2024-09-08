/**
 * Limpia la propiedad del objeto de error
 * @param {event} e 
 * @param {object} errorObject - objeto con los datos de error
 * @param {string} objectKeyName - Nombre de la propiedad donde se aloja el valor del error del input
 * @returns {object} objeto con los valores del error
 * 
 */
export const cleanErrorInput = (e, handlerError, objectKeyName) => {
    const { name } = e.target;

    if (handlerError[objectKeyName]?.[name]) {
        const nullValue = { ...handlerError[objectKeyName], [name]: null }
        const objectError = { ...handlerError, [objectKeyName]: nullValue }

        return objectError
    }

    return handlerError
}

/**
 * Manejador de Input - controla el flujo de datos del input
 * @param {event} e 
 * @param {object} handlerInputs - objeto controlador de inputs
 * @param {string} objectKeyName - nombre la propiedad a acceder
 * @returns {object}
 */
export const onInputChange = (e, handlerInputs, objectKeyName) => {
    const { name, value } = e.target
    const objectData = {
        ...handlerInputs,
        [objectKeyName]: { ...handlerInputs[objectKeyName], [name]: value }
    }

    return objectData
}


/**
 * Funcion para asignar los errores issues de los schemas Zod a un objeto
 * @param {object} error - objeto de error devuelto por el esquema zod 
 * @returns {object} devuelve un objeto con una estructura facil de usar
 */
const convertZodErrors = (error) => {
    const errorObject = {}

    // Recorremos los datos del objeto ZodError 
    // Asigna las validaciones para que sea facil de acceder
    error.issues.forEach((issue) => {
        const path = issue.path
        const message = issue.message
        let current = errorObject

        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) {
                current[key] = {}
            }
            current = current[key]
        }
        current[path[path.length - 1]] = message;
    })
    // Devuelve un objeto con una estructura facil de usar
    return errorObject
}

const dateToday = () => {
    const today = new Date()
    const maxDate = today.toISOString().split('T')[0];
    return maxDate
}