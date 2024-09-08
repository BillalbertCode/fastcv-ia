import FormUser from "@/components/forms/FormUser";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/utils/contexts/UserContext";
import ViewInfo from "@/components/component/viewInfo";
export default function Home() {
    const { userData } = useContext(UserContext);

    const [user, setUser] = useState(userData)

    // Escucha activa de los datos del usuario
    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    return (
        <div>
            <h1 className="text-center">Pruebas</h1>
            <FormUser />
        </div>
    )
}