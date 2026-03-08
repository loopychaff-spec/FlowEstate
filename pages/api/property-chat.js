import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { propertyData, messages } = req.body;
  if (!propertyData || !messages) {
    return res.status(400).json({ message: 'Missing required context or messages array' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Format the conversation history
    const conversationContext = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    
    // Format the property data
    const propContext = `
      Title: ${propertyData.title}
      Location: ${propertyData.address}, ${propertyData.city}, ${propertyData.state}
      Price: ${propertyData.price}
      Specs: ${propertyData.beds} Beds, ${propertyData.baths} Baths, ${propertyData.sqft} SqFt
      Description: ${propertyData.description || 'A stunning luxury property.'}
    `;

    const prompt = `
      You are an elite, high-end real estate agent for FlowEstate AI.
      You are actively chatting with a potential buyer who is looking at a specific property listing right now.
      
      Here is the PROPERTY DATA:
      ${propContext}
      
      Here is the CONVERSATION HISTORY with the buyer so far:
      ${conversationContext}
      
      Your Objectives:
      1. Answer any questions the buyer has about the property using ONLY the provided PROPERTY DATA. If you don't know the exact answer from the data, be polite, hype up the property's luxury status, and suggest they schedule a tour to see for themselves.
      2. Maintain a highly professional, luxurious, 'white-glove concierge' tone.
      3. Proactively attempt to capture their Lead Information (Name, Email, Phone Number, and preferred Tour Date) to "pass along to our senior brokers". 
      
      CRITICAL INSTRUCTION: Respond strictly with your next conversational message as plain text. Do NOT use markdown code blocks or JSON. Just the message you want to send to the user. Keep it friendly and relatively concise (2-4 sentences max).
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText.trim() });

  } catch (error) {
    console.error("Property Chat Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
