// Deterministic outfit scoring engine (M3).
// No LLM at suggestion time — rules + preference weights only.

export interface ClothingItem {
  id: string
  category: string
  color: string
  season: string[]
  formality: string
  is_favorite: boolean
}

export interface SuggestionInput {
  occasion: string
  weather: { temp_c: number; condition: string }
  preferences: { minimal: boolean; neutral: boolean }
}

export interface ScoredOutfit {
  items: ClothingItem[]
  score: number
  rationale: string[]
}

const FORMALITY_BY_OCCASION: Record<string, string> = {
  work: 'business',
  interview: 'formal',
  wedding: 'formal',
  dinner: 'smart-casual',
  casual: 'casual',
  gym: 'casual'
}

// Placeholder — filled in at M3.
export function scoreOutfits(
  _items: ClothingItem[],
  _input: SuggestionInput
): ScoredOutfit[] {
  return []
}
