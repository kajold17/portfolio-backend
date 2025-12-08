import dotenv from "dotenv"; 
dotenv.config();

import fetch from 'node-fetch';
import resumeData from '../data/resume.js';



export default async function chatHandler(req, res){
     // ✅ CRITICAL: Set CORS headers FIRST
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
     // ✅ ADD THIS: Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
     
    if (req.method !== "POST"){
        return (res.status(405).json({ error: "Only POST allowed" }))
    }
    console.log("📥 Incoming request:");
    const message = req.body.message;
    console.log("📥 Incoming message:", message);
    if (!message){
        return(res.status(400).json({error: "Message is required"}))
    }


    const payload = {
        model: "Phi-4-mini-instruct",
        // model: "OpenAI gpt-5",
        messages: [
          { 
            role: "system", 
            content: `You are a helpful portfolio assistant for Kajol Dubey, a Frontend Engineer. Answer questions based ONLY on this resume data:

${resumeData}

Keep responses friendly, concise (under 150 words), and focused on Kajol's experience and skills.`
          },
          {
            role: "user",
            content: "Who are you?"
          },
          {
            role: "assistant",
            content: "I'm Kajol's portfolio assistant! I'm here to help you learn about Kajol Dubey, a Frontend Engineer with 4+ years of experience building scalable web and mobile applications. What would you like to know about her?"
          },
          {
            role: "user",
            content: "Tell me about Kajol"
          },
          {
            role: "assistant",
            content: "Kajol Dubey is a Frontend Engineer with 4+ years of experience specializing in React, Angular, Next.js, and React Native. She's currently working at Hormone Insight/Auvra building AI-powered health tech apps. She has strong experience in AI-integrated interfaces, design systems, and building 0→1 products. She holds a Master's in Information Science from University at Buffalo."
          },
          { role: "user", content: message }
        ],
        temperature: 0.3,
        max_tokens: 300
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
        const data = await response.json();
        const botReply = data?.choices?.[0]?.message?.content;

        return (res.status(200).json({botReply}))

    }catch(error){
        console.error("Error fetching response:", error);
        return(res.status(500).json({error: "Internal server error"}))
    }


}