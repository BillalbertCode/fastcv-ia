// Usada en el SDK 
import { z } from "zod";
// Respuesta de la IA esperada esquema
// Esquema para la generacion de la IA
export const schemaIA = z.object({
    personDescription: z.string().max(300),
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
    }).partial({
        gpa: true,
        thesis: true,
        courseWorks: true,
        relevantEvents: true
    })).max(3).describe('Los estudios más compatibles y relevantes con la descripcion del empleo'),
    experience: z.array(z.object({
        organization: z.string(),
        location: z.string(),
        position: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string().max(350)
    })).max(3).describe('Las experiencias más compatibles y relevantes con la descripción del empleo'),
    projects: z.array(z.object({
        name: z.string(),
        position: z.string(),
        description: z.string().max(350)
    })).max(2).describe('Los proyectos más compatibles y relevantes con la descripción del empleo'),
    leadershipAndActivities: z.array(z.object({
        organization: z.string(),
        location: z.string(),
        role: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        achievements: z.array(z.string().max(350))
    })).max(2).describe('Las Actividades extracurriculares más compatibles y relevantes con la descripción del empleo'),
    technicalSkills: z.array(z.object({
        category: z.string().describe('Nombre de la categoria'),
        skills: z.array(z.string()).describe('Habilidades de la categoria')
    })).describe('Analiza la información del usuario para añadirle habilidades nuevas si compatibles con la descripción del empleo. Extraer las habilidades mas relevantes y dividelas en categorias'),
    compatibilityWithWork: z.number().describe('Dale una puntuación totalmente realista de que tan compatible es con la descripción del empleo desde: 0 (No cumples con ninguno de los campos) hasta 100 cumples con todos los campos requeridos '),
    feedbackMessage: z.string().describe('Un mensaje de feedback según que deberia aprender o mejorar para el empleo que esta solicitando.')
}).describe('Extraer la información mas relevante del usuario y compatible con la descripción del empleo. Así como mejorar su lexico. Todo esto es para crear un curricullum apropiado a la descripción del empleo. ')

// export const curriculumSchema = z.object({
//     personalInfo: {}
// })

// const cv = {
//     personalInfo: {
//       name: personalInfo.name,
//       lastName: personalInfo.lastName,
//       email: personalInfo.email,
//       phone: personalInfo.phone
//     },
//     education: googleResponse.object.education,
//     experience: googleResponse.object.experience,
//     projects: googleResponse.object.projects,
//     leadershipAndActivities: googleResponse.object.leadershipAndActivities,
//     technicalSkills: googleResponse.object.technicalSkills,
//     compatibilityWithWork: googleResponse.object.compatibilityWithWork,
//     feedbackMessage: googleResponse.object.feedbackMessage
//   }