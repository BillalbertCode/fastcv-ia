import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINIS_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { description, skills, education, experience, jobDescription } = req.body;

  const prompt = `Genera un CV profesional basado en la siguiente información:
  Descripción: ${description}
  Habilidades: ${skills}
  Estudios: ${education}
  Experiencia: ${experience}
  Descripción del trabajo: ${jobDescription}`;

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