import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { generateObject, generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINIS_API_KEY
});


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, lastName, email, phone, linkedin, portfolio, description, skills, education, experience, projects, jobDescription } = req.body;

  const schema = z.object({
    personDescription: z.string(),
    skills: z.array(z.object({ name: z.string(), description: z.string() })),
    studies: z.array(z.object({
      name: z.string(),
      site: z.string(),
      dateInit: z.string(),
      dateEnd: z.string(),
      description: z.string(),
      type: z.string()
    })),
    experience: z.array(z.object({
      employment: z.string(),
      name: z.string(),
      site: z.string(),
      dateInit: z.string(),
      dateEnd: z.string(),
      description: z.string()
    })),
    projects: z.array(z.object({
      name: z.string(),
      link: z.string(),
      description: z.string()
    })),
    compatibilityWithWork: z.number(),
    feedbackMessage: z.string()
  })

  const prompt = `
    Segun la informacion de esta persona, modifica de manera veridica la informacion de la persona para que se adapte a la descripcion del empleo
    - Auto Descripción de la persona, maximo 300 caracteres: ${description}
    - Habilidades segun la persona, maximo 6 habilidades contando soft-Skill y Hard-skils mas apropiadas para el empleo: ${skills}
    - Estudios segun la persona: ${education}
    - Experiencia segun la persona, descripcion de maximo 350 caracteres por empleo: ${experience}
    - Proyectos segun la persona, descripcion de maximo 350 caracteres por proyecto : ${projects}
    - Descripción del trabajo ${jobDescription}
    Dale una puntuacion de compatibilidad con el empleo del 1 al 100 con total sinceridad y un mensaje de feedback segun que deberia aprender o mejorar para el puesto y que le faltaria
  `;
  try {
    const googleResponse = await generateObject({
      model: google('models/gemini-1.5-pro-latest'),
      prompt,
      schema,
      system: "Eres un sistema automatico que va a mejorar las descripciones y datos que te dan de un usuario segun una descripcion de trabajo al cual aplicara",
      mode: "json"
    });

    console.log(googleResponse)
    res.status(200).json( {cv: googleResponse.object});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}