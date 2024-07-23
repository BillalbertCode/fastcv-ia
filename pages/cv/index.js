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

    const userInfo = {
      name: name,
      lastName: lastName,
      phone: phone,
      email: email,
      linkedin: linkedin,
      portfolio: portfolio,
      description: description,
      skills: skills,
      education: education,
      experience: experience,
      projects: projects
    }
    localStorage.setItem("user", JSON.stringify(userInfo))
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
    <div style={{ width: "50vw" }} className='container'>
      <h1>Generador de CV</h1>
      <form onSubmit={handleSubmit}>
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
          <input className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} type='email' />
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
          <pre>{cv}</pre>
          <button className='btn btn-success' onClick={handleDownload}>Descargar como PDF</button>
        </div>
      )}
    </div>
  );
}
