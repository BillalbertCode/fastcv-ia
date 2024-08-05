import { useState, useEffect } from 'react';
import TemplateHarvard from './components/TemplateHarvard';
import person from '@/personFake';
import { fetchCreateCV } from './utils/fetchCreateCv';
import { FormUser } from '@/components/component/form-user';

export default function Home() {
  // Datos del Trabajo
  const [jobDescription, setJobDescription] = useState('');
  // Datos del CV generado
  const [cv, setCv] = useState({});
  // Datos Temporales
  const [user, setUser] = useState({})

  // Manejo ed errores
  const [error, setError] = useState({})

  // Recuperacion de la informacion almacenada en las Cookies
  useEffect(() => {
    const userInfo = localStorage.getItem("user")

    if (userInfo) {
      try {

        const parsedUserInfo = JSON.parse(userInfo)

        setUser(parsedUserInfo)

      }
      catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    }
  }, []);

  // Peticion
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchCreateCV(user)

    if (response) {
      if ('cv' in response) {
        setCv(response.cv)
      } else {
        console.error(response.error)
        setError(response.error)
      }
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center">
      <h1>Generador de CV</h1>
      <div className="grid grid-cols-3">
        <FormUser />
        {
          Object.keys(cv).length !== 0 &&
          <TemplateHarvard user={cv} />
        }
      </div>
      <div>
        <button onClick={handleSubmit} className="btn bg-green-500 text-white py-2 px-4 rounded">Generar Cv </button>
      </div>
    </div>
  );
}
