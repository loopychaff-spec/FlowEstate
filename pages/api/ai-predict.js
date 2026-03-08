import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { propertyId, propertyData, timeline } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Construct the prompt with strict JSON requirements
    const prompt = `
      You are an elite FlowBrain real estate predictive algorithm.
      I will provide you with a luxury property's true data and a requested timeline (e.g. 6 months, 5 years, 10 years).
      
      Property Data: ${JSON.stringify(propertyData)}
      Requested Forecast Timeline: ${timeline}
      
      Analyze the current macroeconomic climate, regional development around the property's location, and luxury real estate trends over the requested timeline. Provide a predictive financial forecast.
      
      CRITICAL: You MUST respond ONLY with a raw, valid JSON object. Do not use Markdown blocks (no \`\`\`json). Just the raw object.
      
      Format:
      {
        "currentValue": "String (e.g. $4,200,000)",
        "projectedValue": "String (e.g. $5,800,000)",
        "percentageChange": "String (e.g. +38%)",
        "confidenceScore": "Number 1-100",
        "analysis": "String explaining the core drivers of this forecast over the specific timeline.",
        "riskFactors": ["String risk 1", "String risk 2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up potential markdown formatting if the model disobeys
    let cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const forecast = JSON.parse(cleanedText);
      res.status(200).json(forecast);
    } catch (parseError) {
      console.error("Failed to parse AI output:", cleanedText);
      res.status(500).json({ message: 'AI returned malformed data', raw: cleanedText });
    }

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
