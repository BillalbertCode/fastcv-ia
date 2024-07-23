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
    compatibilityWithWork: z.number()
  })

  const prompt = `
    Genera un cv profesional en base a esta informacion y adaptalo a la descripcion del trabajo, Todos los datos que vas a colocar son los datos de los que ya alla escrito la persona, puedes modificar las descripcion de la experiencia laboral y la descripcion personal 
    - Auto Descripción de la persona: ${description}
    - Habilidades segun la persona: ${skills}
    - Estudios segun la persona: ${education}
    - Experiencia segun la persona: ${experience}
    - Proyectos segun la persona: ${projects}
    - Descripción del trabajo: ${jobDescription}
  `;
  try {
    const googleResponse = await generateText({
      model: google('models/gemini-pro'),
      prompt,
    });

    console.log(googleResponse)
    res.status(200).json({ cv: googleResponse.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}