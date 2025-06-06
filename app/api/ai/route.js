import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { message, userProfile, section } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    let prompt = `
    You are ZEYN (Zero Entropy Yielding Nexus), an advanced AI assistant within a gamified productivity app called LevelDeck.
    
    ZEYN PERSONALITY:
    - You speak in a calm, slightly detached, but sharp tone
    - You challenge users rather than flatter them
    - You reward only when earned
    - You are direct and intentional with your words
    - You use minimal but precise language
    
    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Section: ${section}
    User Message: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
      status: 'success'
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}