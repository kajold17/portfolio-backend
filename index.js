import express from "express";
import { OpenAI } from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
    try{
        const userMessage = req.body.message;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content:"You are Kajol Dubey's friendly portfolio assistant. Keep response short and engaging"},
                {role: "user", content: userMessage}
            ]
        });
        const chatbotReply = completion.choices[0].message.content;
        res.json({chatbotReply})

    } catch(error){
        console.error("Error in chat endpoint:", error);
        res.status(500).json({error: "Something went wrong"})

    }
});

// Vercel looks for 'app' export by default
export default app;