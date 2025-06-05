
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { inputText } = await req.json();

    if (!inputText) {
      return Response.json({ error: 'Missing input' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert IIT-level tutor.
Generate 5 flashcards with DEEP questions (why, how, what-if) from the following content:

"${inputText}"

Each flashcard should be like:
- Question:
- Answer:

Avoid surface-level recall. Focus on deep understanding.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cards = text
      .split('- Question:')
      .filter(Boolean)
      .map((block) => {
        const [q, a] = block.split('- Answer:');
        return {
          question: q.trim(),
          answer: a ? a.trim() : 'No answer',
        };
      });

    return Response.json({ flashcards: cards });
  } catch (error) {
    console.error('Gemini Flashcard Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
