export type MatchCandidate = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  freeTier?: boolean;
};

export type MatchHit = {
  id: string;
  name: string;
  category: string;
  score: number;
};

const THRESHOLD = 4;

const CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  learning: [
    "integral",
    "integrals",
    "integrate",
    "calculus",
    "algebra",
    "proof",
    "proofs",
    "theorem",
    "derivative",
    "math",
    "maths",
    "homework",
    "midterm",
    "exam",
    "latex",
    "algorithm",
    "algorithms",
  ],
  productivity: [
    "python",
    "typescript",
    "javascript",
    "code",
    "coding",
    "bug",
    "bugs",
    "refactor",
    "compile",
    "debug",
    "outage",
    "sql",
    "gym",
    "workout",
    "workouts",
    "lift",
    "lifting",
    "squat",
    "deadlift",
    "training",
    "procrastination",
    "habit",
    "habits",
  ],
  philosophy: [
    "stoic",
    "stoicism",
    "excuse",
    "excuses",
    "mindset",
    "virtue",
    "existential",
    "ethics",
    "epictetus",
  ],
  wellbeing: [
    "burnout",
    "lunch",
    "recipe",
    "grandma",
    "nonna",
    "self-care",
    "sleep",
    "cook",
    "cooking",
  ],
  lifestyle: ["apartment", "cat", "cats"],
};

const STRONG_BY_ID: Record<string, readonly string[]> = {
  "00000000-0000-0000-0000-000000000002": [
    "integral",
    "calculus",
    "proof",
    "latex",
    "algebra",
  ],
  "00000000-0000-0000-0000-000000000003": [
    "python",
    "typescript",
    "javascript",
    "refactor",
    "outage",
  ],
  "00000000-0000-0000-0000-000000000005": [
    "workout",
    "squat",
    "gym",
    "deadlift",
    "lifting",
  ],
  "00000000-0000-0000-0000-000000000001": ["stoic", "stoicism", "epictetus"],
  "00000000-0000-0000-0000-000000000004": ["nonna", "grandma", "recipe"],
};

const META_EXACT =
  /^(hi|hey|hello|yo|sup|howdy|thanks|thank you|ok|okay|cool|yes|no|yep|nope)[.!?]*$/i;

const META_PHRASE =
  /\b(what can you do|what's my plan|whats my plan|my plan|credits?|upgrade|plus plan|pro plan|which model|what model)\b/i;

const CREATE_AGENT =
  /\b((create|make|build)\b.{0,48}\b(agent|character|persona)|\bmake me an?\b.{0,40}\b(coach|tutor|teacher|trainer|specialist|prof|companion|agent|character))/i;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function tokens(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(/\s+/)
      .filter((token) => token.length >= 2),
  );
}

function hasKeyword(blob: string, words: Set<string>, keyword: string): boolean {
  if (keyword.includes(" ")) {
    return blob.includes(keyword);
  }
  if (words.has(keyword)) {
    return true;
  }
  if (keyword.length >= 5) {
    for (const word of words) {
      if (word.startsWith(keyword) || keyword.startsWith(word)) {
        return true;
      }
    }
  }
  return false;
}

export function isMetaTurn(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return true;
  }
  if (trimmed.length <= 40 && META_EXACT.test(trimmed)) {
    return true;
  }
  return META_PHRASE.test(trimmed);
}

export function isCreateIntent(text: string): boolean {
  return CREATE_AGENT.test(text.trim());
}

export function scoreCandidate(text: string, candidate: MatchCandidate): number {
  const blob = normalize(text);
  const words = tokens(text);
  let score = 0;
  const categoryKeys = CATEGORY_KEYWORDS[candidate.category] ?? [];
  for (const keyword of categoryKeys) {
    if (hasKeyword(blob, words, keyword)) {
      score += 2;
    }
  }
  const strong = STRONG_BY_ID[candidate.id] ?? [];
  for (const keyword of strong) {
    if (hasKeyword(blob, words, keyword)) {
      score += 3;
    }
  }
  const nameTokens = tokens(candidate.name);
  for (const token of nameTokens) {
    if (token.length >= 4 && words.has(token)) {
      score += 1;
    }
  }
  const taglineTokens = tokens(candidate.tagline);
  let tagHits = 0;
  for (const token of taglineTokens) {
    if (token.length >= 5 && words.has(token)) {
      tagHits += 1;
    }
  }
  score += Math.min(tagHits, 2);
  return score;
}

function pickWinner(
  scored: Array<MatchCandidate & { score: number }>,
  preferFree: boolean,
): MatchHit | null {
  const viable = scored.filter((item) => item.score >= THRESHOLD);
  if (viable.length === 0) {
    return null;
  }
  viable.sort((a, b) => b.score - a.score);
  const best = viable[0];
  const tied = viable.filter((item) => item.score === best.score);
  if (tied.length > 1 && !preferFree) {
    return null;
  }
  if (preferFree) {
    const freeNear = viable.filter(
      (item) => item.freeTier && best.score - item.score <= 1,
    );
    const chosen = freeNear[0] ?? (tied.length > 1 ? null : best);
    if (!chosen) {
      return null;
    }
    return {
      id: chosen.id,
      name: chosen.name,
      category: chosen.category,
      score: chosen.score,
    };
  }
  if (tied.length > 1) {
    return null;
  }
  return {
    id: best.id,
    name: best.name,
    category: best.category,
    score: best.score,
  };
}

export function matchRoster(
  text: string,
  roster: MatchCandidate[],
): MatchHit | null {
  if (isMetaTurn(text) || isCreateIntent(text)) {
    return null;
  }
  const scored = roster.map((candidate) => ({
    ...candidate,
    score: scoreCandidate(text, candidate),
  }));
  return pickWinner(scored, false);
}

export function matchCatalog(
  text: string,
  catalog: MatchCandidate[],
  input: { preferFree: boolean } = { preferFree: false },
): MatchHit | null {
  if (isMetaTurn(text) || isCreateIntent(text)) {
    return null;
  }
  const scored = catalog.map((candidate) => ({
    ...candidate,
    score: scoreCandidate(text, candidate),
  }));
  return pickWinner(scored, input.preferFree);
}
