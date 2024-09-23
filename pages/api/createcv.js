// API de generacion de los datos CV
// Esta API recibe los datos del usuario y lo mejora
// Ademas Devuelve Mensaje de Feedback y compatibilidad

// SDK Vercel
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText } from 'ai';
// Esquemas
import { schemaIA } from "@/utils/schemas/curriculumIA.schema";
import { userServerSchema } from "@/utils/schemas/userInfo.schema";

// Uso de la API de Geminis
const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINIS_API_KEY
});

// Funcion de mapeo de arrays
// Para devolver en un string la informacion que necesita el prompt
const getEstudios = (education) => {
  return education.map((edu, index) => (
    ` Institución: ${edu.name}
       Ubicación: ${edu.location}
       Título: ${edu.degree}
       Concentración: ${edu.concentration}
       Fecha de graduación: ${edu.graduationDate}
       ${edu.gpa && ("Promedio:" + edu.gpa)}
       ${edu.thesis && ("Tesis:" + edu.thesis)}
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
    `Habilidad ${index} :${skill.name}`
  )).join('\n')
}

//  Prompt con las intrucciones de la creacion de la respuesta de la IA
// toda la informacion no proporcionada la colocas como "undefined"
const promptCV = data => `
    - Descripcion del empleo: ${data.jobDescription}
    - Auto Descripción de la persona: ${data.personalInfo.description}
    - Estudios segun la persona: ${getEstudios(data.education)}
    - Experiencia segun la persona: ${getExperience(data.experience)} 
    - Proyectos segun la persona: ${getProjects(data.projects)}
    - Liderazgo y Actividades segun la persona: ${getleadershipAndActivities(data.leadershipAndActivities)}
    - Habilidades Técnicas segun la persona: ${getTechnicalSkills(data.technicalSkills)}
    `;

// API Response
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validacion de datos con el esquema 
  const { success, data, error } = userServerSchema.safeParse(req.body)

  // Control de datos fallidos 
  if (!success) {
    return res.status(400).json({ error: { message: 'Invalid request', error: error.format() } })
  }

  // extraccion de datos de usuario 
  const { personalInfo } = data;


  try {
    // Peticion de respuesta IA
    const googleResponse = await generateObject({
      model: google('models/gemini-1.5-pro-latest'),
      prompt: promptCV(data),
      schema: schemaIA,
      system: "Eres un sistema automatico que va a mejorar las descripciones y datos que te dan de un usuario segun una descripcion de trabajo al cual aplicara",
      mode: "json"
    });

    // Extaccion de la data dada por la IA
    const {
      education,
      experience,
      projects,
      leadershipAndActivities,
      technicalSkills,
      compatibilityWithWork,
      feedbackMessage
    } = googleResponse.object

    // Formato de Cv disponible para la Api
    const cv = {
      personalInfo: {
        name: personalInfo.name,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.countryCode + personalInfo.phoneNumber
      },
      education,
      experience,
      projects,
      leadershipAndActivities,
      technicalSkills,
      compatibilityWithWork,
      feedbackMessage
    }
    res.status(200).json({ cv: cv });

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: { message: 'Error al generar la respuesta de la IA', error: error } });
  }
}