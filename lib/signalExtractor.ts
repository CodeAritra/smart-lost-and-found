export type Signals = {
  color: string | null;
  brand: string | null;
  damage: string | null;
  accessory: string | null;
  accessoryColor: string | null;
};


const DAMAGE_KEYWORDS: Record<string, string[]> = {
  scratched: ["scratch", "scratched", "scratches"],
  cracked: ["crack", "cracked", "broken screen"],
  dented: ["dent", "dented"],
};

const ACCESSORY_KEYWORDS: Record<string, string[]> = {
  "back cover": ["cover", "case", "back cover"],
  "screen protector": ["tempered glass", "screen guard"],
};

const BRAND_KEYWORDS: Record<string, string[]> = {
  apple: ["apple", "iphone"],
  samsung: ["samsung", "galaxy"],
  oneplus: ["oneplus"],
  xiaomi: ["xiaomi", "redmi", "mi"],
  realme: ["realme"],
};

const COLOR_KEYWORDS = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "silver",
  "gold",
];



function findFromKeywords(
  text: string,
  map: Record<string, string[]>
): string | null {
  for (const [value, keywords] of Object.entries(map)) {
    if (keywords.some(k => text.includes(k))) {
      return value;
    }
  }
  return null;
}

function findColor(text: string): string | null {
  return COLOR_KEYWORDS.find(c => text.includes(c)) || null;
}


export function extractSignals(found: any): Signals {
  const description =
    found?.description?.toLowerCase() || "";

  return {
    // ⚠️ Matching only — NEVER trust for claim verification
    color:
      found?.color ||
      findColor(description) ||
      null,

    brand:
      found?.brand ||
      findFromKeywords(description, BRAND_KEYWORDS) ||
      null,

    // 🔐 Verification signals — NOT shown publicly
    damage: findFromKeywords(
      description,
      DAMAGE_KEYWORDS
    ),

    accessory: findFromKeywords(
      description,
      ACCESSORY_KEYWORDS
    ),

    accessoryColor: findColor(description),
  };
}
