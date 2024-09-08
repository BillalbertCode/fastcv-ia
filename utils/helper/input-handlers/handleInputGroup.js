/**
 * Añadimos el nuevo objeto en el array 
 * @param {object} handleInputs - objeto con los datos de los inputs/usuario
 * @param {string} arrayName - Nombre de la propiedad donde se alojan los arrays con grupo de objetos
 * @param {object} data - datos a agregar
 * @returns {object} objeto con la data del usuario añadida
 */
export const addInputGroup = (handleInputs, arrayName, data) => {
    const objectData = {
        ...handleInputs,
        [arrayName]: [...handleInputs[arrayName], data]
    }
    return objectData
}

/**
 * Vaciamos los valores de los inputs a ''
 * @param {object} handlerInputs - Objeto Controlador de los inputs
 * @param {string} arrayName - Nombre de la propiedad donde esta el grupo de inputs
 * @returns {object} objeto con los inputs Vacios
 */
export const resetInputGroup = (handlerInputs, arrayName) => {
    const objectGroup = {
        ...handlerInputs,
        [arrayName]: Object.fromEntries(Object.keys(handlerInputs[arrayName]).map(key => [key, '']))
    }
    return objectGroup
}

/**
 * Eliminar Propiedades de un array se eliminan segun el indice
 * @param {object} handlerInput - objeto que controla los inputs
 * @param {string} arrayName - propiedad del objeto a acceder 
 * @param {number} index - Indice del objeto 
 * @returns {object} - objeto con el grupo inputs eliminado
 */
export const deleteInputGroup = (handlerInput, arrayName, index) => {
    const objectData = {
        ...handlerInput,
        [arrayName]: [...handlerInput[arrayName].filter((item, i) => i !== index)]
    }
    return objectData
}

/**
 * Clean de Error in propery key (arrayName) 
 * @param {object} handlerError - Manejador de errores 
 * @param {string} arrayName - Property name a eliminar los errores
 * @returns 
 */
export const cleanErrorGroup = (handlerError, arrayName) => {
    const objectError = { ...handlerError, [arrayName]: {} }
    return objectError
}

/**
 * Add error in object handler error (setError)
 * @param {object} handleError -  objeto que controla los errores  
 * @param {string} arrayName -  Nombre de la propiedad donde se alojan los arrays con grupo de objetos
 * @param {object} error - objeto con los errores de la validacion
 * @returns {object} objeto con los errores
 */
export const addErrorGroup = (handleError, arrayName, error) => {
    const objectError = {
        ...handleError,
        [arrayName]: error
    }

    return objectError
}