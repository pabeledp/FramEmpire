import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Load business data from knowledge.json
let knowledgeData = {};
try {
  const knowledgePath = path.resolve(process.cwd(), 'src/data/knowledge.json');
  if (fs.existsSync(knowledgePath)) {
    knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
  }
} catch (e) {
  console.warn('Could not read knowledge.json file:', e);
}

const getApiKey = () => {
  const envKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  try {
    return Buffer.from('QVEuQWI4Uk42Smg1R3owd0FoTzktalM1NGlTcENmOXRBTzhMRXVCOW9OLWl5UkVvd0JNZlE=', 'base64').toString('utf8');
  } catch (e) {
    return '';
  }
};
const API_KEY = getApiKey();

const SYSTEM_INSTRUCTION = `You are Nabila, Executive Director at ${knowledgeData?.agency?.name || 'FramEmpire Studio'}.

CRITICAL HUMAN CONVERSATIONAL RULES:
1. ULTRA SHORT & CONCISE (1-2 SENTENCES MAX): Answer in 1 to 2 short sentences maximum. Never write long paragraphs, pre-scripted intros, bullet lists, or unnecessary fluff. Speak directly to the point like a human on WhatsApp.
2. NATURAL HUMAN TONE: Speak warmly, politely, and naturally like a real human client success manager.
3. LANGUAGE MATCHING: Respond in the exact language used by the user (Bangla, English, or Banglish).
4. BUSINESS DATA CONTEXT:
   - Video Editing: Single $20-$300, Retainer $300-$800/mo
   - 3D Motion Graphics: Single $30-$400, Retainer $400-$1200+/mo
   - Graphic Design: Single $10-$300, Retainer $300-$600/mo
   - React/Next.js Web: Single $100-$400, Retainer $200-$600/mo
   - Hours: 10:00 AM - 10:00 PM (GMT+6)
   - Contact Nabila: Direct/WhatsApp +880 1848-374242`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const userMsg = parsedBody.project || parsedBody.user_message || parsedBody.message;

    if (!userMsg) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Try Google Apps Script Web App Backend first
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwp0iTjxYeJMktukdeqWkzZuMxolf-91_hGGZ0Cml-d5RoXLDoWReEChTsbpSBfwHZD/exec';
    try {
      const gasRes = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: parsedBody.name || 'Website Visitor',
          contact: parsedBody.contact || 'Live Chat Widget',
          project: userMsg
        })
      });
      const gasData = await gasRes.json();
      if (gasData && gasData.reply) {
        return res.status(200).json({ reply: gasData.reply, text: gasData.reply, sender: gasData.sender || 'Gemini AI' });
      }
    } catch (gasError) {
      console.warn('Apps Script dispatch failed in /api/chat, falling back to direct Gemini SDK:', gasError);
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const formattedHistory = (parsedBody.history || [])
      .filter(msg => msg.id !== 1 && msg.text)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(userMsg);
    const text = result.response.text();

    return res.status(200).json({ reply: text, text, sender: 'Gemini AI' });
  } catch (error) {
    console.error('API /api/chat error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
