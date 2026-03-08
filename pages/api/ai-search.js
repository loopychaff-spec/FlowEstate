import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages, properties } = req.body;
  if (!messages || !properties) {
    return res.status(400).json({ message: 'Missing messages or properties array' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format the conversation history and property list for the AI
    const conversationContext = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const availableProperties = properties.map(p => 
      `ID: ${p.id} | Title: ${p.title} | Location: ${p.location} | Price: ${p.price} | Beds: ${p.beds} | Baths: ${p.baths} | Sqft: ${p.sqft} | Specs/Desc: ${p.description}`
    ).join('\n---\n');

    const prompt = `
      You are FlowBrain, an elite AI real estate matchmaker. 
      You are engaged in a conversation with a buyer who is looking for very specific properties. 
      They often use soft descriptors (e.g., "vibes", "environment", "near nature", "party scene").
      They can also stack requirements across multiple messages ("I want a house in LA" -> "Actually, make sure it has a pool too").
      
      Here is the CONVERSATION HISTORY so far:
      ${conversationContext}
      
      Here is the ENTIRE INVENTORY of properties currently available:
      ${availableProperties}
      
      Your task:
      1. Analyze the ENTIRE conversation history to understand the user's cumulative requirements.
      2. Evaluate the INVENTORY and find the properties that best match these accumulated requirements. Soft match their descriptions against the user's desired "environment".
      3. Respond strictly with a JSON object containing an array of matched Property IDs, and a friendly, conversational message explaining WHY you picked them based on the user's latest message and overall context.

      CRITICAL: You MUST respond ONLY with a raw, valid JSON object. Do not use Markdown blocks (no \`\`\`json). Just the raw object.
      
      Format:
      {
        "matchedIds": ["property-id-1", "property-id-2"],
        "aiResponse": "String explaining your reasoning in a friendly, high-end concierge tone."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const matchData = JSON.parse(cleanedText);
      res.status(200).json(matchData);
    } catch (parseError) {
      console.error("Failed to parse AI output:", cleanedText);
      res.status(500).json({ message: 'AI returned malformed data', raw: cleanedText });
    }

  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
