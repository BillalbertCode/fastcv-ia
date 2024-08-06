// Funcion controlada
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { generateObject, generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINIS_API_KEY
});

// Funcion de mapeo de arrays
// Para volver en un string la informacion para el prompt
const getEstudios = (education) => {
  return education.map((edu, index) => (
    ` Institución: ${edu.name}
       Ubicación: ${edu.location}
       Título: ${edu.degree}
       Concentración: ${edu.concentration}
       Promedio: ${edu.gpa}
       Fecha de graduación: ${edu.graduationDate}
       Tesis: ${edu.thesis}
       ${edu.relevantEvents && ("Eventos Relevantes en la institucion " + edu.relevantEvents)}
       ${edu.courseWorks && ("Cursos hechos en la universidad" + edu.courseWorks)}
  `
  )).join('\n');
}

const getExperience = (experience) => {
  return experience.map((exp, index) => (
    ` Organización: ${exp.organization}
       Ubicación: ${exp.location}
       Posicíon / Puesto: ${exp.position}
       Fecha de Inicio: ${exp.startDate}
       Fecha Final: ${exp.endDate}
       Descripcion del labor en el puesto: ${exp.description}
  `
  )).join('\n')
}

const getProjects = (projects) => {
  return projects.map((project, index) => (
    ` Nombre del proyecto: ${project.name}
    Posicion/Puesto: ${project.position}
    Descripcion del proyecto: ${project.description}
`
  )).join('\n')
}

const getleadershipAndActivities = (leadershipAndActivities) => {
  return leadershipAndActivities.map((activity, index) => (
    `
    Organización: ${activity.organization}.
    Lugar: ${activity.location}.
    Role/Puesto: ${activity.role}.
    Fecha de inicio: ${activity.startDate}.
    Fecha de finalización: ${activity.endDate}.
    Logros: ${activity.achievements}
    `
  )).join('\n')
}

const getTechnicalSkills = (skills) => {
  return skills.map((skill, index) => (
    `Habilidad ${index} :${skill}`
  )).join('\n')
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { personalInfo, education, experience, projects, leadershipAndActivities, technicalSkills, jobDescription } = req.body;

  // Esquema para la generacion de la IA
  const schema = z.object({
    personDescription: z.string(),
    education: z.array(z.object({
      name: z.string(),
      location: z.string(),
      degree: z.string(),
      concentration: z.string(),
      gpa: z.string(),
      graduationDate: z.string(),
      thesis: z.string(),
      relevantEvents: z.string(),
      courseWorks: z.string(),
      type: z.string()
    })),
    experience: z.array(z.object({
      organization: z.string(),
      location: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string()
    })),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string()
    })),
    leadershipAndActivities: z.array(z.object({
      organization: z.string(),
      location: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      achievements: z.array(z.string())
    })),
    technicalSkills: z.array(z.object({
      category: z.string(),
      skills: z.array(z.string())
    })),
    compatibilityWithWork: z.number(),
    feedbackMessage: z.string()
  })

  //  Prompt con las intrucciones de la creacion de la respuesta de la IA
  const prompt = `
    Segun la informacion de esta persona, modifica de manera veridica la informacion de la persona para que se adapte a la descripcion del empleo 
    para crear un cv con las reglas de harvard de como crear un resume apropiado.
    Detalles relevantes: todos los formatos de fechas lo colocas como mes y año, toda la informacion no proporcionada la colocas como "undefined"
    - Descripcion del empleo ${jobDescription}
    - Auto Descripción de la persona, maximo 300 caracteres: ${personalInfo.description}
    - Estudios segun la persona: ${getEstudios(education)} maximo 3 estudios segun los mas compatibles con el empleo
    - Experiencia segun la persona, descripcion de maximo 350 caracteres por empleo: ${getExperience(experience)}  maximo 3 experiencias segun los mas compatibles con el empleo
    - Proyectos segun la persona, descripcion de maximo 350 caracteres por proyecto : ${getProjects(projects)}  maximo 2 proyectos segun los mas compatibles con el empleo.
    - Liderazgo y Actividades segun la persona, descripcion de maximo 350 caracteres por Actividad: ${getleadershipAndActivities(leadershipAndActivities)} maximo 2 segun los mas compatibles con el empleo.
    - Habilidades Tecnicas segun la persona: ${getTechnicalSkills(technicalSkills)}, analiza el resto de informacion del usuario para añadir nuevas habilidades, y dividelo en categorias 
    Dale una puntuacion de que tan compatible es la persona con la descripcion del empleo, del 1 al 100 y un mensaje de feedback segun que deberia aprender o mejorar para el empleo que esta solicitando.
    `;
  try {
    // Peticion de respuesta IA
    const googleResponse = await generateObject({
      model: google('models/gemini-1.5-pro-latest'),
      prompt,
      schema,
      system: "Eres un sistema automatico que va a mejorar las descripciones y datos que te dan de un usuario segun una descripcion de trabajo al cual aplicara",
      mode: "json"
    });

    // Formato de Cv disponible para la Api
    const cv = {
      personalInfo: {
        name: personalInfo.name,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone
      },
      education: googleResponse.object.education,
      experience: googleResponse.object.experience,
      projects: googleResponse.object.projects,
      leadershipAndActivities: googleResponse.object.leadershipAndActivities,
      technicalSkills: googleResponse.object.technicalSkills,
      compatibilityWithWork: googleResponse.object.compatibilityWithWork,
      feedbackMessage: googleResponse.object.feedbackMessage
    }
    res.status(200).json({ cv: cv });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}