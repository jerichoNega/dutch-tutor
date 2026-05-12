import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { word } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are a Dutch language expert. For the given Dutch word, provide 3 natural-sounding B1-level example sentences. " +
        "Each example must include the Dutch sentence followed by its English translation. " +
        "Format your response as a JSON array of objects, like this: [{\"dutch\": \"...\", \"english\": \"...\"}, ...]"
    });

    const result = await model.generateContent(`Generate 3 example sentences for the Dutch word: ${word}`);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON if needed (sometimes Gemini adds ```json ... ```)
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const examples = JSON.parse(jsonStr);

    return NextResponse.json({ examples });
  } catch (error: any) {
    console.error("Vocabulary API Error:", error);
    let errorMessage = "Failed to generate examples";
    if (error.message?.includes("429")) {
      errorMessage = "Quota exceeded. Please wait a minute.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
