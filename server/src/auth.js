import crypto from 'crypto'
import { prisma } from './db.js'

const TOKEN_KEY = 'adminToken'

export async function login(password) {
  const expected = process.env.ADMIN_PASSWORD || 'admin123'
  const provided = typeof password === 'string' ? password : ''
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b)
  if (!ok) return null
  const token = crypto.randomBytes(32).toString('hex')
  await prisma.setting.upsert({
    where: { key: TOKEN_KEY },
    update: { value: token },
    create: { key: TOKEN_KEY, value: token },
  })
  return token
}

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const row = await prisma.setting.findUnique({ where: { key: TOKEN_KEY } })
    if (!row || row.value !== token) return res.status(401).json({ error: 'Unauthorized' })
    next()
  } catch (error) {
    next(error)
  }
}
