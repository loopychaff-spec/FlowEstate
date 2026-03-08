import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { address, city, state } = req.body;

  if (!address || !city || !state) {
    return res.status(400).json({ message: 'Missing required fields: address, city, state' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      As a local real estate expert, provide a comprehensive neighborhood guide for the following property:
      Address: ${address}, ${city}, ${state}

      Please include detailed sections on:
      1. Neighborhood Overview & Vibe
      2. Schools & Education (mention specific schools if possible)
      3. Safety & Community
      4. Amenities & Lifestyle (Parks, Dining, Shopping)
      5. Commute & Accessibility

      Format the response as JSON with the following structure:
      {
        "vibe": "...",
        "schools": "...",
        "safety": "...",
        "lifestyle": "...",
        "commute": "..."
      }
      Do not include any markdown formatting or code blocks in the response, just the raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown if the model included it
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);

    res.status(200).json(data);
  } catch (error) {
    console.error("AI Neighborhood Error:", error);
    res.status(500).json({ message: "Error generating neighborhood guide", error: error.message });
  }
}
