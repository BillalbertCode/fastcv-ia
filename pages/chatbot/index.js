import { useState, useEffect } from 'react';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINIS_API_KEY
});

const chatGenerator = async (prompt) => {
    const resGoogle = await generateText({
        model: google('models/gemini-pro'),
        prompt: prompt,
    });
    return resGoogle.text;
}

export default function Home() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async () => {
        const res = await chatGenerator(input);
        setResponse(res);
    };

    return (
        <main>
            <div>Hola</div>
            <div>{response}</div>
            <textarea
                placeholder="Escribe tu mensaje"
                value={input}
                onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Enviar</button>
        </main>
    );
}
