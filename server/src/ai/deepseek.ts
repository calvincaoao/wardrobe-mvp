import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'
})

const MODEL = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat'

export interface ItemFields {
  category: 'top' | 'bottom' | 'dress' | 'shoes' | 'outerwear' | 'accessory' | 'unknown'
  color: string
  season: string[]
  formality: 'casual' | 'smart-casual' | 'business' | 'formal' | 'unknown'
}

const SYSTEM_PROMPT = `You are a wardrobe assistant. The user describes a clothing item in free text.
Return ONLY a valid JSON object with this exact shape (no markdown, no extra text):
{
  "category": "top" | "bottom" | "dress" | "shoes" | "outerwear" | "accessory" | "unknown",
  "color": "primary color, lowercase",
  "season": ["spring" | "summer" | "fall" | "winter"],
  "formality": "casual" | "smart-casual" | "business" | "formal" | "unknown"
}`

export async function suggestFields(description: string): Promise<ItemFields> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: description }
    ]
  })

  const content = completion.choices[0]?.message?.content ?? '{}'
  const parsed = JSON.parse(content) as Partial<ItemFields>

  return {
    category: parsed.category ?? 'unknown',
    color: parsed.color ?? '',
    season: Array.isArray(parsed.season) ? parsed.season : [],
    formality: parsed.formality ?? 'unknown'
  }
}
