'use client'
// Manipulacion de la informacion del usuario
import { createContext, useState } from "react"

import { userInfoSchema } from "../schemas/userInfo.schema"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    // Informacion del usuario
    const [user, setUser] = useState()

    // Funcion de guardado de usuario en cache
    const saveUserCache = (dataUser) => {
        try {
            // validamos la información
            userInfoSchema.parse(dataUser)

            // Intentamos guardar la informacion en cache
            const stringUser = JSON.stringify(dataUser)
            localStorage.setItem("user", stringUser)

            setUser(dataUser)
        } catch (error) {
            console.error("Ocurrio algun error al guardar la información:" + error.name);
            console.error(error);
            return { success: false, message: error.name === 'ZodError' ? 'Error validando los datos' : 'Ocurrio un error inesperado al tratar de guardar la información.. Vuelve a intentarlo', error }
        }
        return { success: true, message: '¡La Informacion se guardo con exitó!' }
    }

    return (
        <UserContext.Provider value={{ saveUserCache }} >
            {children}
        </UserContext.Provider>
    )

}