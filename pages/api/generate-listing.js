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
      I will provide you with rough notes, a URL, or a text snippet copied from a real estate website (like Zillow, Redfin, or a local brokerage).
      
      Your goal is to transform this raw information into a structured, premium real estate listing for FlowEstate AI.
      
      Requirements:
      1. **Extract Data**: Look for Price, Beds, Baths, SqFt, and Location inside the text.
      2. **Handle URLs**: If the input is just a URL, use your knowledge of that area/site to create a realistic mock listing that fits that URL's context.
      3. **Premium Title**: Create a captivating, luxurious 'title' (e.g. "The Azure Peak Contemporary").
      4. **Location**: Format as "City, State".
      5. **Price**: Format elegantly (e.g. "$1,200,000").
      6. **Description**: Write a short, enticing 2-sentence 'description' in a high-end tone.
      7. **Images**: Provide an array of 3 realistic, high-quality Unsplash URLs that match the property's style. Ensure they end with: ?auto=format&fit=crop&w=1600&q=90.
      
      Input Data: "${notes}"
      
      Respond ONLY with a valid JSON object:
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
