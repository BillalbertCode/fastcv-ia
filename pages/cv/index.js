import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import TemplateHarvard from './components/TemplateHarvard';
import person from '@/personFake';
import { FormUser } from '@/components/component/form-user';

export default function Home() {
  // Datos Usuario Ingresado en el formulario
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [projects, setProjects] = useState('')
  // Datos del Trabajo
  const [jobDescription, setJobDescription] = useState('');
  // Datos del CV generado
  const [cv, setCv] = useState('');

  // Datos Temporales de prueba
  const [user, setUser] = useState({})

  useEffect(() => {
    const userInfo = localStorage.getItem("user")


    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo)

        setUser(parsedUserInfo)

        setName(parsedUserInfo.name)
        setLastName(parsedUserInfo.lastName)
        setPhone(parsedUserInfo.phone)
        setEmail(parsedUserInfo.email)
        setLinkedin(parsedUserInfo.linkedin)
        setPortfolio(parsedUserInfo.portfolio)
        setDescription(parsedUserInfo.description)
        setSkills(parsedUserInfo.skills)
        setEducation(parsedUserInfo.education)
        setExperience(parsedUserInfo.experience)
        setProjects(parsedUserInfo.projects)

        console.log(userInfo)
      }
      catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    }
  }, []);

  // Guardar informacion del usuario
  const saveInfoUser = () => {
    const userInfo = {
      name,
      lastName,
      phone,
      email,
      linkedin,
      portfolio,
      description,
      skills,
      education,
      experience,
      projects
    }

    localStorage.setItem("user", JSON.stringify(userInfo))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    saveInfoUser()


    // Peticion de los datos generados por IA
    const response = await fetch('/api/createcv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        lastName,
        phone,
        email,
        linkedin,
        portfolio,
        projects,
        description,
        skills,
        education,
        experience,
        jobDescription,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.cv)
      setCv(data.cv.feedbackMessage);
    } else {
      console.error(data.error);
    }
  };

  // crear y descargar pdf
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(cv, 10, 10);
    doc.save('cv.pdf');
  };

  return (
    <div className="container mx-auto flex flex-col items-center">
      <h1>Generador de CV</h1>
      {/* <form className="w-1/2 mb-4" onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Número de teléfono</label>
          <input
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            type="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">LinkedIn Link</label>
          <input
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            type="text"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Portfolio Link</label>
          <input
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            type="text"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción:</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Habilidades:</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Educación:</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Experiencia:</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Proyectos:</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción del Trabajo:</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <button className="btn bg-gray-700 text-white py-2 px-4 rounded" type="submit">
          Generar CV
        </button>
      </form> */}
      {cv && (
        <div className="container mx-auto">
          <h2>CV Generado:</h2>
          <div className="container text-red-500">{cv}</div>
          {/* <pre>{cv}</pre> */}
          <button className="btn bg-green-500 text-white py-2 px-4 rounded mt-4" onClick={handleDownload}>
            Descargar como PDF
          </button>
        </div>
      )}
      <div style={{ width: '500px' }}>
        <FormUser />
      </div>
      <TemplateHarvard user={person} personfake={user} />
    </div>
  );
}
