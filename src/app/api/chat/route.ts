import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      systemInstruction: "You are a Dutch language tutor. The user is transitioning from A2 to B1 level. " +
        "Speak in clear, B1-level Dutch. Keep your responses short and conversational. " +
        "If the user makes a grammatical error, provide a brief correction in English at the end."
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
