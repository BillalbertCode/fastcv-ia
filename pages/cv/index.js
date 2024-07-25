import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import CreateCV from './components/CreateCV';
import TemplateHarvard from './components/TemplateHarvard';

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

  const person = {

    personalInfo: {
      name: 'Billalbert ',
      lastName: 'Martinez',
      email: 'BillalbertCode@gmail.com',
      phone: '04142240292',
      linkedin: 'https://www.linkedin.com/in/billalbertcode'
    },
    education: [
      {
        name: 'Universidad de los Andes',
        location: 'Mérida, Venezuela',
        degree: 'Ingeniero en Sistemas',
        concentration: 'Ingeniería de Sistemas',
        gpa: '4.5/5',
        graduationDate: 'Noviembre 2015',
        thesis: 'Desarrollo de un sistema de gestión de proyectos'
      },
      {
        name: 'Universidad Nacional Experimental del Táchira',
        location: 'San Cristóbal, Venezuela',
        degree: 'Licenciatura en Informática',
        concentration: 'Informática',
        gpa: '4.2/5',
        graduationDate: 'Mayo 2010'
      }
    ],
    experience: [
      {
        organization: 'Empresa XYZ',
        location: 'Caracas, Venezuela',
        position: 'Desarrollador de Software',
        startDate: 'Enero 2018',
        endDate: 'Junio 2020',
        description: 'Desarrollo de aplicaciones web utilizando tecnologías como React, Node.js y MongoDB'
      },
      {
        organization: 'Empresa ABC',
        location: 'Mérida, Venezuela',
        position: 'Analista de Sistemas',
        startDate: 'Julio 2015',
        endDate: 'Diciembre 2017',
        description: 'Análisis y desarrollo de sistemas de información para la empresa'
      }
    ],
    projects: [
      {
        name: 'Proyecto de gestión de proyectos',
        link: 'https://github.com/billalbertcode/project-management',
        description: 'Desarrollo de un sistema de gestión de proyectos utilizando tecnologías como React, Node.js y MongoDB'
      },
      {
        name: 'Proyecto de análisis de datos',
        link: 'https://github.com/billalbertcode/data-analysis',
        description: 'Análisis de datos utilizando tecnologías como Python, Pandas y Matplotlib'
      }
    ],
    leadershipAndActivities: [
      {
        organization: 'Universidad de los Andes Computer Club',
        location: 'Mérida, Venezuela',
        role: 'Membership Coordinator / Board Member',
        startDate: 'Enero 2014',
        endDate: 'Present',
        achievements: [
          'Organized marketing and advertising campaign, resulting in a 25% increase in membership.',
          'Coordinated tech conference for forty professionals and 100 students.',
          'Upgraded and enhanced website using WordPress.'
        ]
      },
      {
        organization: 'Venezuelan Robotics Team',
        location: 'Caracas, Venezuela',
        role: 'Team Lead',
        startDate: 'Enero 2018',
        endDate: 'Junio 2020',
        achievements: [
          'Led a team of 10 members to develop a robotic arm for industrial use.',
          'Designed and implemented a control system for the robotic arm using Python and Arduino.'
        ]
      }
    ],
    technicalSkills: [
      {
        category: 'Programming',
        skills: [
          'JavaScript',
          'Python',
          'C++'
        ]
      },
      {
        category: 'Design',
        skills: [
          'Adobe XD',
          'Figma',
          'Wix',
        ]
      }
    ]
  }



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
    <div className='container d-flex flex-column align-items-center'>
      <h1>Generador de CV</h1>
      <form style={{ width: "50vw" }} className='mb-4' onSubmit={handleSubmit}>
        <div className='d-flex justify-content-between'>
          <div>
            <label className='form-label'>Nombre</label>
            <input className='form-control' value={name} onChange={(e) => setName(e.target.value)} type='text' />
          </div>
          <div>
            <label className='form-label'>Apellido</label>
            <input className='form-control' value={lastName} onChange={(e) => setLastName(e.target.value)} type='text' />
          </div>
        </div>
        <div>
          <label className='form-label'>Numero de telefono</label>
          <input className='form-control' value={phone} onChange={(e) => setPhone(e.target.value)} type='number' />
        </div>
        <div>
          <label className='form-label'>Correo electronico</label>
          <input className='form-control' value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} type='email' />
        </div>
        <div>
          <label className='form-label'>Linkedin Link</label>
          <input className='form-control' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} type='text' />
        </div>
        <div>
          <label className='form-label'>Portfolio Link</label>
          <input className='form-control' value={portfolio} onChange={(e) => setPortfolio(e.target.value)} type='text' />
        </div>
        <div>
          <label className='form-label'>Descripción:</label>
          <textarea className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className='form-label'>Habilidades:</label>
          <textarea className='form-control' value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
        <div>
          <label className='form-label'>Educación:</label>
          <textarea className='form-control' value={education} onChange={(e) => setEducation(e.target.value)} />
        </div>
        <div>
          <label className='form-label'>Experiencia:</label>
          <textarea className='form-control' value={experience} onChange={(e) => setExperience(e.target.value)} />
        </div>
        <div>
          <label className='form-label'>Proyectos:</label>
          <textarea className='form-control' value={projects} onChange={(e) => setProjects(e.target.value)} />
        </div>
        <div>
          <label className='form-label'>Descripción del Trabajo:</label>
          <textarea className='form-control' value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
        </div>
        <button className='btn btn-secondary' type="submit">Generar CV</button>
      </form>
      {cv && (
        <div className='container'>
          <h2>CV Generado:</h2>
          <div className='container text-danger'>{cv}</div>
          {/* <pre>{cv}</pre> */}
          <button className='btn btn-success' onClick={handleDownload}>Descargar como PDF</button>
        </div>
      )}
      <TemplateHarvard user={person} />
    </div>
  );
}
