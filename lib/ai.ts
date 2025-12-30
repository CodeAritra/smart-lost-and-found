import { geminiModel } from "./firebase";

/* -------------------- Types -------------------- */

type SignalValue = string | null | undefined;

export type Signals = {
    color?: SignalValue;
    brand?: SignalValue;
    damage?: SignalValue;
    accessory?: SignalValue;
    accessoryColor?: SignalValue;
};

export type Question = {
    id: keyof Signals;
    question: string;
};

/* -------------------- Gemini Client -------------------- */

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

/* -------------------- Generator -------------------- */

export async function generateQuestions(
    signals: Signals
): Promise<Question[]> {
    const prompt = `
You are generating ownership verification questions for a lost-and-found system.

Rules:
- Ask only questions that help verify true ownership
- Ask minimum 2 and maximum 3 questions
- Questions must be specific
- Do NOT reveal answers
- Do NOT mention the signals directly
- Use ONLY the provided signals
- Each question ID must match the signal key

Signals:
${JSON.stringify(signals, null, 2)}

Return STRICT JSON ONLY in this format:
[
  { "id": "color", "question": "..." }
]
`;

    const result = await geminiModel.generateContent(prompt);
    const rawText = result.response.text();

    if (!rawText) {
        throw new Error("Gemini returned empty response");
    }

    // 🔥 STRIP MARKDOWN / EXTRA TEXT
    const jsonText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let parsed: Question[];

    try {
        parsed = JSON.parse(jsonText);
    } catch (err) {
        console.error("Gemini raw output:", rawText);
        throw new Error("Gemini response is not valid JSON");
    }

    if (!Array.isArray(parsed) || parsed.length < 2) {
        throw new Error("Gemini returned invalid question array");
    }

    return parsed.slice(0, 3);
}

