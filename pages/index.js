import { useState, useEffect, useContext } from 'react';
// Context
import { UserContext } from '@/utils/contexts/UserContext';
// Componentes
import TemplateHarvard from '@/components/cv/components/TemplateHarvard';
import { FormUser } from '@/components/component/form-user';
import JobForm from '@/components/cv/components/JobForm';
// Utilidades
import { fetchCreateCV } from '@/components/cv/utils/fetchCreateCv';

export default function Home() {
  // Datos del CV generado
  const [cv, setCv] = useState({});

  // Datos usuario proveidos por el context
  const { userData } = useContext(UserContext)
  
  // Asignamos los valores del usuario
  const [user, setUser] = useState(userData)
  
  // Escucha activa de los datos del usuario
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  //Carga del curriculum
  const [loading, setLoading] = useState(false)

  // Manejo ed errores
  const [error, setError] = useState(false)

  // Peticion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError(false)
    const response = await fetchCreateCV(user)

    if (response) {
      if ('cv' in response) {
        setCv(response.cv)
      } else {
        console.error(response.error)
        setError(response.error)
      }
      setLoading(false)
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
            <JobForm onChange={handleJobDescriptionChange} feedbackMessage={cv?.feedbackMessage} compatibilityWithWork={cv?.compatibilityWithWork} />
            <button disabled={Object.keys(user).length === 0} onClick={handleSubmit} className="btn bg-green-500 text-white mx-auto py-2 px-4 rounded">Generar Cv </button>
            <p className="text-center font-medium">{loading ? "Generando CV por favor espere..." : " "}</p>
            <p className="text-center text-red-600 font-medium">{error && error}</p>
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
