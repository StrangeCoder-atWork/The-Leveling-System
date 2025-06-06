import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Missing prompt' });
    }
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a system message that explains the task to Gemini
    const systemPrompt = `
      You are an AI assistant that helps users create personalized dashboard layouts.
      Based on the user's description, generate a JSON array of blocks that should be added to their dashboard.
      Each block should have an id, type, and config object with appropriate settings.
      
      Available block types:
      - timer (config: duration, type, reward)
      - aiChat (config: agentType, prompt)
      - xpTracker (config: goal, reward)
      - progressMeter (config: goal, current, label)
      - flashcards (config: deckId, cardCount)
      - audioPlayer (config: playlist, volume)
      - animation (config: type, speed, color)
      
      Return ONLY the JSON array without any explanation or markdown formatting.
    `;
    
    // Combine system prompt and user prompt
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
    
    // Generate content using Gemini
    const result = await model.generateContent(fullPrompt);
    const responseText = await result.response.text();
    
    // Parse the JSON response
    let blocks;
    try {
      // Extract JSON if it's wrapped in code blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/) || 
                        responseText.match(/```([\s\S]*)```/);
      
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      blocks = JSON.parse(jsonString);
      
      // Ensure each block has a unique ID
      blocks = blocks.map(block => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return res.status(500).json({ 
        message: 'Error parsing AI response', 
        error: error.message,
        rawResponse: responseText
      });
    }
    
    return res.status(200).json({ blocks });
  } catch (error) {
    console.error('Error generating layout:', error);
    return res.status(500).json({ 
      message: 'Error generating layout', 
      error: error.message 
    });
  }
}