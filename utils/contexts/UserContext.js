'use client'
// Manipulacion de la informacion del usuario
import { createContext, useState, useEffect } from "react"

import { userInfoSchema } from "../schemas/userInfo.schema"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    // Informacion del usuario
    const [userData, setUserData] = useState({
        personalInfo: {
            name: '',
            lastName: '',
            countryCode: '',
            phoneNumber: '',
            countryCode: '',
            email: '',
            description: ''
        },
        technicalSkills: [],
        education: [],
        experience: [],
        projects: [],
        leadershipAndActivities: []
    })

    // return info usuario cache 
    const loadCache = () => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo)
            return parsedUserInfo 
        }
    }

    // Recuperamos datos del usuario 
    useEffect(() => {
        const userInfo = loadCache()
        if (userInfo) {
            setUserData(userInfo)
        }
    }, []);

    // Funcion de guardado de usuario en cache
    const saveUserCache = (dataUser) => {
        try {
            // validamos la información
            const data = userInfoSchema.parse(dataUser)

            const newData = { ...userData, ...data }
            // Intentamos guardar la informacion en cache
            const stringUser = JSON.stringify(newData)
            localStorage.setItem("userInfo", stringUser)
            setUserData(newData)
        } catch (error) {
            console.error("Ocurrio algun error al guardar la información: " + error.name);
            console.error(error)
            return { success: false, message: error.name === 'ZodError' ? 'Error validando los datos' : 'Ocurrio un error inesperado al tratar de guardar la información.. Vuelve a intentarlo', error }
        }
        return { success: true, message: '¡La Informacion se guardo con exitó!' }
    }

    return (
        <UserContext.Provider value={{ saveUserCache, userData }} >
            {children}
        </UserContext.Provider>
    )

}