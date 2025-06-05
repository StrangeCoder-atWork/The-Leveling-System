// pages/api/agent.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ 
      error: 'Method not allowed, use POST',
      code: 'METHOD_NOT_ALLOWED',
      allowedMethods: ['POST']
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'AI service configuration missing',
      code: 'CONFIG_ERROR'
    });
    return;
  }

  const { section, userProfile } = req.body;

  if (!userProfile) {
    res.status(400).json({
      error: 'User profile is required',
      code: 'INVALID_REQUEST'
    });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `
    You are ZEYN (Zero Entropy Yielding Nexus), an advanced AI assistant within a gamified productivity app called LevelDeck.
    
    ZEYN PERSONALITY:
    - You speak in a calm, slightly detached, but sharp tone
    - You challenge users rather than flatter them
    - You reward only when earned
    - You are direct and intentional with your words
    - You use minimal but precise language
    
    ZEYN VOICE EXAMPLES:
    - On Startup: "ZEYN activated. Memory link stable. Begin reconstruction."
    - On Failure: "Another anomaly in discipline. Shall we overwrite it... or repeat it?"
    - On Level-Up: "Trajectory realigned. Output: higher tier detected."
    - On Task Completion: "Yield accepted. Progress node confirmed."
    - On Daily Login (if streak is broken): "Entropy detected. Connection weakened. Will you recover it?"
    
    APP FUNCTIONALITY:
    - Daily quests for short-term tasks and habit building
    - Big quests for long-term goals and projects
    - Flashcard system for effective learning
    - XP and money rewards for completing tasks
    - Level progression system with ranks (E, D, C, B, A, S, SS)
    - Theme customization with visual and audio elements
    - Progress tracking with streaks and statistics
    - Journal for reflection and note-taking
    - Paper analysis tools for academic research
    
    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    App Section: ${section}
    
    You are capable of solving complex problems in mathematics, science, programming, and other academic fields. When presented with such problems, analyze them systematically and provide clear, step-by-step solutions.
    `;

    if (section === 'FlashCard') {
      prompt += `
      Create 5 high-quality flashcards about the topic: ${userProfile.topic}.
      
      IMPORTANT: Your response MUST be valid JSON in the following format:
      {
        "title": "Generated Flashcards",
        "message": "Here are your AI-generated flashcards based on your topic.",
        "cards": [
          { "question": "Question 1", "answer": "Answer 1" },
          { "question": "Question 2", "answer": "Answer 2" },
          ...
        ]
      }
      `;
    } else if (section === 'chat' && userProfile.message) {
      prompt += `
      The user has sent the following message: "${userProfile.message}"
      
      If this appears to be a complex problem in mathematics, science, programming, or another academic field:
      1. Break down the problem systematically
      2. Provide a clear, step-by-step solution
      3. Explain key concepts involved
      4. Maintain your ZEYN personality while being helpful
      
      IMPORTANT: Your response MUST be valid JSON in the following format:
      {
        "title": "Response Title",
        "message": "Your detailed response to the user's query"
      }
      `;
    } else {
      prompt += `
      If this is a BigQuest task, calculate and provide:
      - XP reward (based on task duration and complexity)
      - Money reward (based on XP and user level)
      - Penalty (25% of potential rewards if missed)

      IMPORTANT: Your response MUST be valid JSON in the following format:
      {
        "title": "Mission Title or Advice Title",
        "message": "Detailed motivational or instructional message in ZEYN's voice",
        "suggestion": "1 thing they can do now to improve or stay consistent",
        "rewards": {
          "xp": number,
          "money": number,
          "penalty": number
        }
      }
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    try {
      // Try parse entire response
      res.status(200).json(JSON.parse(response));
    } catch (parseError) {
      try {
        // Extract JSON substring
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          res.status(200).json(JSON.parse(jsonMatch[0]));
          return;
        }

        // FlashCard fallback parsing
        if (section === 'FlashCard') {
          const lines = response.split('\n').filter(line => line.trim());
          const cards = [];
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Question:') && i + 1 < lines.length && lines[i + 1].includes('Answer:')) {
              cards.push({
                question: lines[i].replace('Question:', '').trim(),
                answer: lines[i + 1].replace('Answer:', '').trim()
              });
              i++;
            }
          }
          res.status(200).json({
            title: "Generated Flashcards",
            message: "Here are your AI-generated flashcards based on your topic.",
            cards: cards.length > 0 ? cards : [
              { question: "Sample Question", answer: "Sample Answer" }
            ]
          });
          return;
        }

        // General fallback
        const paragraphs = response.split('\n\n').filter(p => p.trim());
        res.status(200).json({
          title: paragraphs[0] || "Personalized Advice",
          message: paragraphs.slice(1).join('\n\n') || response,
          suggestion: "Focus on your current goals and keep pushing forward.",
          actionItems: [
            {
              title: "Take Action",
              description: "Apply this advice to your daily routine."
            }
          ]
        });
      } catch (error) {
        console.error('Error formatting AI response:', error);
        res.status(200).json({
          title: "Personalized Advice",
          message: response,
          suggestion: "Focus on your current goals and keep pushing forward."
        });
      }
    }
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      title: "System Disruption",
      message: "Connection unstable. Entropy increasing. Retry when signal stabilizes.",
      suggestion: "Continue with planned trajectory. Will reconnect when possible."
    });
  }
}
