import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { section, userProfile, message } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    if (section === "FlashCard") {
      prompt += `
Create 5 high-quality flashcards about the topic: ${userProfile.topic}.

IMPORTANT: Your response MUST be valid JSON in the following format:
{
  "title": "Generated Flashcards",
  "message": "Here are your AI-generated flashcards based on your topic.",
  "cards": [
    { "question": "Question 1", "answer": "Answer 1" },
    ...
  ]
}
`;
    } else if (section === "chat" && userProfile.message) {
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
    const raw = await result.response.text();

    // Try parsing cleanly
    try {
      return NextResponse.json(JSON.parse(raw));
    } catch (parseErr) {
      // Try extracting the first valid JSON block
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return NextResponse.json(JSON.parse(match[0]));
        } catch (err2) {
          // fallback
        }
      }

      // If flashcard section, try line-by-line fallback
      if (section === "FlashCard") {
        const lines = raw.split("\n").filter((line) => line.trim());
        const cards = [];
        for (let i = 0; i < lines.length; i++) {
          if (
            lines[i].includes("Question:") &&
            i + 1 < lines.length &&
            lines[i + 1].includes("Answer:")
          ) {
            cards.push({
              question: lines[i].replace("Question:", "").trim(),
              answer: lines[i + 1].replace("Answer:", "").trim(),
            });
            i++;
          }
        }

        return NextResponse.json({
          title: "Generated Flashcards",
          message: "Here are your AI-generated flashcards based on your topic.",
          cards: cards.length
            ? cards
            : [{ question: "Sample Question", answer: "Sample Answer" }],
        });
      }

      // Default fallback
      return NextResponse.json({
        title: "ZEYN Response",
        message: raw,
        suggestion: "Analyze. Reflect. Proceed.",
      });
    }
  } catch (err) {
    console.error("ZEYN error:", err);
    return NextResponse.json(
      {
        title: "System Disruption",
        message:
          "Connection unstable. Entropy increasing. Retry when signal stabilizes.",
        suggestion: "Continue with planned trajectory.",
        error: true,
      },
      { status: 500 }
    );
  }
}