import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINIS_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {name,lastName,email,phone,linkedin,portfolio, description, skills, education, experience, projects, jobDescription } = req.body;

  const prompt = `Genera un CV profesional basado en la siguiente información y promediame que tan compatible soy con el puesto en una escala del 1% al 100% en el final del cv:
  Nombre: ${name}
  Apellido: ${lastName}
  Email: ${email}
  Teléfono: ${phone}
  Linkedin Link: ${linkedin}
  Portfolio Link: ${portfolio}
  Descripción: ${description}
  Habilidades: ${skills}
  Estudios: ${education}
  Experiencia: ${experience}
  Proyectos: ${projects}
  Descripción del trabajo en el cual voy a aplicar: ${jobDescription}`;

  try {
    const resGoogle = await generateText({
      model: google('models/gemini-pro'),
      prompt: prompt,
    });

    res.status(200).json({ cv: resGoogle.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}