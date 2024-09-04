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
const promptCV = data => `
    Segun la informacion de esta persona, modifica de manera veridica la informacion de la persona para que se adapte a la descripcion del empleo
    para crear un cv con las reglas de harvard de como crear un resume apropiado.
    Detalles relevantes: todos los formatos de fechas lo colocas como mes y año, toda la informacion no proporcionada la colocas como "undefined"
    - Descripcion del empleo ${data.jobDescription}
    - Auto Descripción de la persona, maximo 300 caracteres: ${data.personalInfo.description}
    - Estudios segun la persona: ${getEstudios(data.education)} maximo 3 estudios segun los mas compatibles con el empleo
    - Experiencia segun la persona, descripcion de maximo 350 caracteres por empleo: ${getExperience(data.experience)}  maximo 3 experiencias segun los mas compatibles con el empleo
    - Proyectos segun la persona, descripcion de maximo 350 caracteres por proyecto : ${getProjects(data.projects)}  maximo 2 proyectos segun los mas compatibles con el empleo.
    - Liderazgo y Actividades segun la persona, descripcion de maximo 350 caracteres por Actividad: ${getleadershipAndActivities(data.leadershipAndActivities)} maximo 2 segun los mas compatibles con el empleo.
    - Habilidades Tecnicas segun la persona: ${getTechnicalSkills(data.technicalSkills)}, analiza el resto de informacion del usuario para añadir nuevas habilidades, y dividelo en categorias 
    Dale una puntuacion de que tan compatible es la persona con la descripcion del empleo del 1 al 100 , y un mensaje de feedback segun que deberia aprender o mejorar para el empleo que esta solicitando.
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
    return res.status(400).json({ error: { message: 'Invalid request', error: error.issues } })
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
    res.status(500).json({ error: { message: 'Error al generar la respuesta de la IA', error: error } });
  }
}