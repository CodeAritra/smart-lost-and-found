import { gemini25Flash, gemini20Flash } from "./firebase";

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

// Generate with fallback

function isRateLimitError(err: any): boolean {
    return (
        err?.status === 429 ||
        err?.code === 429 ||
        err?.code === "RESOURCE_EXHAUSTED" ||
        err?.message?.includes("429") ||
        err?.message?.includes("quota") ||
        err?.message?.includes("RESOURCE_EXHAUSTED")
    );
}


async function generateWithFallback(prompt: string): Promise<string> {
    const models = [
        { name: "gemini-2.5-flash", model: gemini25Flash },
        { name: "gemini-2.0-flash", model: gemini20Flash }
    ];

    for (const { name, model } of models) {
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            if (!text) {
                throw new Error("Empty response");
            }

            return text;
        } catch (err: any) {
            console.error(`❌ ${name} failed:`, err?.message);

            if (isRateLimitError(err)) {
                console.warn(`⚠️ Rate limit on ${name}, switching model...`);
                continue;
            }

            // Non-quota errors should stop execution
            throw err;
        }
    }

    throw new Error("All Gemini models are rate-limited");
}


/* -------------------- Generator -------------------- */

export async function generateQuestions(
    signals: Signals
): Promise<Question[]> {
    const prompt = `
You are generating ownership verification questions for a lost-and-found system.

Rules:
- Ask only questions that help verify true ownership
- Ask minimum 3 and maximum 5 questions
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

    const rawText = await generateWithFallback(prompt);
    // const rawText = result.response.text();

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

