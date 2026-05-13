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

    const result = await model.generateContent(`Generate 3 example sentences for the Dutch word: ${word}. Return ONLY the JSON array.`);
    const response = await result.response;
    const text = response.text();
    
    // Improved cleaning: find the first [ and last ] to extract JSON
    const startIdx = text.indexOf("[");
    const endIdx = text.lastIndexOf("]");
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("Invalid AI response format");
    }

    const jsonStr = text.substring(startIdx, endIdx + 1);
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
