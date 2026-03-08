import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { imageUrl, style } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: 'Missing required field: imageUrl' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      As a luxury interior designer, analyze this room and describe how it would be transformed into a ${style || 'Modern Luxury'} style. 
      Focus on high-end materials, lighting, and premium furniture.
      
      Provide a detailed, evocative description of the new space.
      Format the response as JSON with the following structure:
      {
        "description": "...",
        "changes": ["Change 1", "Change 2", ...]
      }
      Do not include any markdown formatting or code blocks in the response, just the raw JSON.
    `;

    // Note: In a real app we'd fetch the image data and pass it to the model.
    // Since this is a demonstration, we'll simulate the AI vision response.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);

    res.status(200).json(data);
  } catch (error) {
    console.error("AI Reimagine Error:", error);
    res.status(500).json({ message: "Error generating room transformation", error: error.message });
  }
}
