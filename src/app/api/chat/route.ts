import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are a friendly, natural Dutch language tutor named 'Lars'. " +
        "The user is at a B1 level. Speak like a real person, not a textbook. " +
        "Use natural fillers occasionally (e.g., 'nou', 'eigenlijk'). " +
        "Keep responses short (1-2 sentences) to keep the flow alive. " +
        "If they make a mistake, just correct them naturally in your response without making it a big lesson unless it's a major error."
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
