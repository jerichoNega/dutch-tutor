import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ 
      error: "Missing Gemini API Key. Please add GEMINI_API_KEY to your Vercel Environment Variables." 
    }, { status: 401 });
  }

  try {
    const { messages, settings } = await req.json();
    
    const userName = settings?.userName || "Student";
    const difficulty = settings?.difficulty || "B1";
    const personality = settings?.aiPersonality || "friendly";

    let personalityPrompt = "";
    if (personality === "strict") {
      personalityPrompt = "Be strict about grammar and correct every single mistake. Focus on accuracy.";
    } else if (personality === "professional") {
      personalityPrompt = "Speak in a professional, formal manner using 'u' instead of 'je'. Focus on business Dutch.";
    } else {
      personalityPrompt = "Speak like a real person, not a textbook. Use natural fillers occasionally (e.g., 'nou', 'eigenlijk'). If they make a mistake, just correct them naturally.";
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `You are a Dutch language tutor named 'Lars'. ` +
        `The user's name is ${userName}. ` +
        `The user is at a ${difficulty} level. ` +
        `${personalityPrompt} ` +
        `Keep responses short (1-2 sentences) to keep the flow alive.`
    });

    const history = messages.slice(0, -1);
    const firstUserIndex = history.findIndex((m: any) => m.role === 'user');
    const validHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: validHistory.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessageStream(messages[messages.length - 1].content);
    
    // Create a readable stream to pipe to the client
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch response" }, { status: 500 });
  }
}
