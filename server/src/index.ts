import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { suggestFields } from './ai/deepseek'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/ai/suggest-fields', async (req, res) => {
  try {
    const description = String(req.body?.description ?? '').trim()
    if (!description) {
      res.status(400).json({ error: 'description is required' })
      return
    }
    const fields = await suggestFields(description)
    res.json({ fields })
  } catch (err) {
    console.error('[suggest-fields]', err)
    res.status(500).json({ error: 'AI suggestion failed' })
  }
})

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  console.log(`Wardrobe API listening on http://localhost:${port}`)
})
