import { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function Home() {
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
  const [jobDescription, setJobDescription] = useState('');
  const [cv, setCv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setCv(data.cv);
    } else {
      console.error(data.error);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(cv, 10, 10);
    doc.save('cv.pdf');
  };

  return (
    <div>
      <h1>Generador de CV</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type='text' />
        </div>
        <div>
          <label>Apellido</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} type='text' />
        </div>
        <div>
          <label>Numero de telefono</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type='number'/>
        </div>
        <div>
          <label>Correo electronico</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type='email'/>
        </div>
        <div>
          <label>Linkedin Link</label>
          <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} type='text'/>
        </div>
        <div>
          <label>Portfolio Link</label>
          <input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} type='text' />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Habilidades:</label>
          <textarea value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
        <div>
          <label>Educación:</label>
          <textarea value={education} onChange={(e) => setEducation(e.target.value)} />
        </div>
        <div>
          <label>Experiencia:</label>
          <textarea value={experience} onChange={(e) => setExperience(e.target.value)} />
        </div>
        <div>
          <label>Proyectos:</label>
          <textarea value={projects} onChange={(e) => setProjects(e.target.value)} />
        </div>
        <div>
          <label>Descripción del Trabajo:</label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
        </div>
        <button type="submit">Generar CV</button>
      </form>
      {cv && (
        <div>
          <h2>CV Generado:</h2>
          <pre>{cv}</pre>
          <button onClick={handleDownload}>Descargar como PDF</button>
        </div>
      )}
    </div>
  );
}
