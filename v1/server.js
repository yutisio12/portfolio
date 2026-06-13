// ============================================================
// DEPRECATED — Digantikan oleh netlify/functions/admin.mjs
// Untuk development Netlify, gunakan: netlify dev
// ============================================================
/*
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3456
const SECRET_KEY = process.env.SECRET_KEY || 'admin123'
const DATA_FILE = path.join(__dirname, 'public', 'data.json')

app.use(cors())
app.use(express.json({ limit: '50mb' }))

function verifyKey(req, res, next) {
  const key = req.query.key
  if (!key || key !== SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing key' })
  }
  next()
}

app.get('/api/admin/data', verifyKey, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data file' })
  }
})

app.post('/api/admin/save', verifyKey, (req, res) => {
  try {
    const newData = req.body
    const dir = path.dirname(DATA_FILE)
    const files = fs.readdirSync(dir).filter(f => /^datav\d+\.json$/.test(f))
    const versions = files.map(f => parseInt(f.match(/datav(\d+)\.json/)[1], 10))
    const nextVersion = versions.length > 0 ? Math.max(...versions) + 1 : 1

    fs.copyFileSync(DATA_FILE, path.join(dir, `datav${nextVersion}.json`))
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2))

    res.json({ success: true, version: nextVersion })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data file' })
  }
})

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`)
})
*/
