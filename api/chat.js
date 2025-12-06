import dotenv from "dotenv"; 
dotenv.config();

import fetch from 'node-fetch';
import resumeData from '../data/resume.js';

dotenv.config();

export default async function handler(req, res){
    if (req.method !== "POST"){
        return (res.status(405).json({ error: "Only POST allowed" }))
    }

    const message = req.body.message;
    if (!message){
        return(res.status(400).json({error: "Message is required"}))
    }

    const payload = {
        model: "...",
        messages: [
          { role: "system", content: `Use this info about Kajol:\n${resumeData}` },
          { role: "user", content: message }
        ]
    }

    try{
        const response = await fetch('https://models.inference.ai.azure.com/chat/completions',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GITHUB_MODEL_TOKEN}`
            },
            body: JSON.stringify(payload)
        });
    }catch(error){
        console.error("Error fetching response:", error);
        return(res.status(500).json({error: "Internal server error"}))
    }


}