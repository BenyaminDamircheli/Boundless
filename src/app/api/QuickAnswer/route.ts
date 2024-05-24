import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    console.log(req.body)
    const { title } = req.body;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "You are a concept summarizer. You should give a quick answer/description of any topic given to you by the user. You should not converse with them, just output a summary/introduction of the following topic: " + title }],
        max_tokens: 80,
        temperature: 1,
    });

    res.status(200).json({
        message: "Quick answer fetched successfully",
        data: response.choices[0].message.content
    });
}