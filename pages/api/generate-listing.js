import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({ message: "Notes are required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-2.5-flash for fast text generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert real estate copywriter and data extractor. 
      I will provide you with rough notes about a property.
      I need you to transform these notes into a structured, premium real estate listing.
      
      Requirements:
      1. Create a captivating, luxurious 'title'.
      2. Extract or infer the 'location' (City, State format preferred).
      3. Format the 'price' elegantly (e.g., "$1,200,000" or "$850,000"). If no price is given, estimate one based on luxury context.
      4. Extract or estimate 'beds', 'baths', and 'sqft'.
      5. Write a short, enticing 2-sentence 'description'.
      6. Provide an array of 3 'images' representing a premium home that fits the description. Use realistic, high-quality Unsplash URLs (e.g., modern architecture, luxury interiors, pools). DO NOT USE PLACEHOLDERS, give real URLs. YOU MUST ensure the URLs end with: ?auto=format&fit=crop&w=1600&q=90 to guarantee high resolution.
      
      Rough notes: "${notes}"
      
      Respond ONLY with a valid JSON object matching this exact shape:
      {
        "title": "String",
        "location": "String",
        "price": "String",
        "beds": "String",
        "baths": "String",
        "sqft": "String",
        "description": "String",
        "images": ["url1", "url2", "url3"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown blocks from Gemini's response
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(cleanText);

    res.status(200).json(data);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: "Failed to generate listing from AI." });
  }
}
