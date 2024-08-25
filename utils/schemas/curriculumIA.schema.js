// Usada en el SDK 
import { z } from "zod";
// Respuesta de la IA esperada esquema
// Esquema para la generacion de la IA
export const schemaIA = z.object({
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
        position: z.string(),
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