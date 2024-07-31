import { useState, useEffect } from 'react';
import TemplateHarvard from './components/TemplateHarvard';
import person from '@/personFake';
import { FormUser } from '@/components/component/form-user';

export default function Home() {
  // Datos del Trabajo
  const [jobDescription, setJobDescription] = useState('');
  // Datos del CV generado
  const [cv, setCv] = useState({});

  // Datos Temporales
  const [user, setUser] = useState({})


  useEffect(() => {
    const userInfo = localStorage.getItem("user")

    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo)

        setUser(parsedUserInfo)

        console.log(userInfo)
      }
      catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    }
    console.log(cv)
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Peticion de los datos generados por IA
    const response = await fetch('/api/createcv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.cv)
      setCv(data.cv);
    } else {
      console.error(data.error);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center">
      <h1>Generador de CV</h1>
      <div style={{ width: '500px' }}>
        <FormUser />
      </div>
      <div>
        <button onClick={handleSubmit} className="btn bg-green-500 text-white py-2 px-4 rounded">Generar Cv </button>
      </div>
      {
        Object.keys(cv).length !== 0 &&
        <TemplateHarvard user={cv}/>
      }
    </div>
  );
}
