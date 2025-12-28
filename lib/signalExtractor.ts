type Signals = {
  color: string | null;
  brand: string | null;
  damage: string | null;
  accessory: string | null;
  accessoryColor: string | null;
};

/* -------------------- Keyword Maps -------------------- */

const DAMAGE_KEYWORDS: Record<string, string[]> = {
  scratched: ["scratch", "scratched", "scratches"],
  cracked: ["crack", "cracked", "broken screen"],
  dented: ["dent", "dented"],
};

const ACCESSORY_KEYWORDS: Record<string, string[]> = {
  "back cover": ["cover", "case", "back cover"],
  "screen protector": ["tempered glass", "screen guard"],
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

/* -------------------- Helpers -------------------- */

function findFromKeywords(
  text: string,
  map: Record<string, string[]>
): string | null {
  for (const [value, keywords] of Object.entries(map)) {
    if (keywords.some((k) => text.includes(k))) {
      return value;
    }
  }
  return null;
}

function findColor(text: string): string | null {
  return COLOR_KEYWORDS.find((color) => text.includes(color)) || null;
}

/* -------------------- Extractor -------------------- */

export function extractSignals(found: any): Signals {
  const description =
    found?.description?.toLowerCase() || "";

  return {
    color: found?.color || findColor(description),
    brand: found?.brand || null,

    damage: findFromKeywords(description, DAMAGE_KEYWORDS),

    accessory: findFromKeywords(
      description,
      ACCESSORY_KEYWORDS
    ),

    accessoryColor: findColor(description),
  };
}
