import { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function Home() {
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
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
