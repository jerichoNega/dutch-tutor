const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

async function findWorkingModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = [
    "gemini-1.5-flash",
    "gemini-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-pro"
  ];

  console.log("Searching for a model with an active quota...");

  for (const modelName of models) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi");
      console.log(`✅ ${modelName} is WORKING!`);
      process.exit(0);
    } catch (e) {
      console.log(`❌ ${modelName} failed: ${e.message.split('\n')[0]}`);
    }
  }
  console.error("🏁 No working models found with the current API key.");
}

findWorkingModel();
