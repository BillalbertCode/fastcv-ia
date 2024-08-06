import { useState, useEffect } from 'react';
import TemplateHarvard from '@/components/cv/components/TemplateHarvard';
import person from '@/personFake';
import { fetchCreateCV } from '@/components/cv/utils/fetchCreateCv';
import { FormUser } from '@/components/component/form-user';
import JobForm from '@/components/cv/components/JobForm';

export default function Home() {
  // Datos del CV generado
  const [cv, setCv] = useState({});
  // Datos usuario
  const [user, setUser] = useState({})

  //Carga del curriculum
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const response = await fetchCreateCV(user)

    if (response) {
      if ('cv' in response) {
        setCv(response.cv)
        setLoading(false)
      } else {
        console.error(response.error)
        setError(response.error)
      }
    }
  }

  // Descripcion del empleo
  const handleJobDescriptionChange = (e) => {
    setUser({ ...user, jobDescription: e.target.value });
  };
  return (
    <div>

      <div className="container mx-auto my-4">
        <div className="grid grid-cols-2">
          <div className='w-full' style={{ maxWidth: "640px" }}>
            <FormUser />
          </div>
          <div className='flex flex-col justify-center'>
            <JobForm onChange={handleJobDescriptionChange} feedbackMessage={cv.feedbackMessage} compatibilityWithWork={cv.compatibilityWithWork} />
            <button disabled={Object.keys(user).length === 0} onClick={handleSubmit} className="btn bg-green-500 text-white mx-auto py-2 px-4 rounded">Generar Cv </button>
              <p className="text-center font-medium">{loading ? "Generando CV por favor espere...": " "}</p>
              <p className="text-center text-red-600 font-medium">{error}</p>
          </div>
        </div>

      </div>
      <div className='my-4 flex flex-col'>
        {
          Object.keys(cv).length !== 0 &&
          <TemplateHarvard user={cv} />
        }
      </div>
    </div>
  );
}
