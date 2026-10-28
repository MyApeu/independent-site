import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'
import mediaRouter from './routes/media.js'
import settingsRouter from './routes/settings.js'
import inquiriesRouter from './routes/inquiries.js'
import statsRouter from './routes/stats.js'
import authRouter from './routes/auth.js'

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

const uploadsRoot = path.resolve(process.cwd(), 'uploads')
fs.mkdirSync(uploadsRoot, { recursive: true })
app.use('/uploads', express.static(uploadsRoot, { maxAge: '7d' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/media', mediaRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/inquiries', inquiriesRouter)
app.use('/api/stats', statsRouter)

app.use((req, res) => res.status(404).json({ error: 'Not found' }))

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(error.status || 500).json({ error: error.message || 'Server error' })
})

app.listen(port, () => {
  console.log(`Jintaihong API listening on http://127.0.0.1:${port}`)
})
