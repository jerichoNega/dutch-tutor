import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { lessonId, topic, grammarFocus } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are a Dutch language examiner. Create a 5-question multiple choice quiz for a B1 student. " +
        `The theme is ${topic} and the grammar focus is ${grammarFocus.join(", ")}. ` +
        "Each question must have 4 options and exactly 1 correct answer. " +
        "Format your response as a JSON array: [{\"question\": \"...\", \"options\": [\"...\", \"...\", \"...\", \"...\"], \"correctAnswer\": index, \"explanation\": \"...\"}]"
    });

    const result = await model.generateContent(`Create a B1 Dutch quiz for lesson: ${lessonId}`);
    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(jsonStr);

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Quiz API Error:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
