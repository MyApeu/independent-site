import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || ''
}

router.post('/track', async (req, res, next) => {
  try {
    const { sessionId, path, referer } = req.body || {}
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' })
    await prisma.visit.create({
      data: {
        sessionId: String(sessionId),
        ip: clientIp(req),
        path: path ? String(path).slice(0, 300) : '/',
        referer: referer ? String(referer).slice(0, 500) : '',
        userAgent: String(req.headers['user-agent'] || '').slice(0, 500),
      },
    })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [onlineSessions, historySessions, monthSessions, pageViews, todayPageViews, ipRows, dailyRows, inquiryCount, mediaCount, productCount] =
      await Promise.all([
        prisma.visit.findMany({
          where: { createdAt: { gte: fiveMinutesAgo } },
          select: { sessionId: true },
          distinct: ['sessionId'],
        }),
        prisma.visit.findMany({ select: { sessionId: true }, distinct: ['sessionId'] }),
        prisma.visit.findMany({
          where: { createdAt: { gte: startOfMonth } },
          select: { sessionId: true },
          distinct: ['sessionId'],
        }),
        prisma.visit.count(),
        prisma.visit.count({ where: { createdAt: { gte: startOfDay } } }),
        prisma.visit.groupBy({
          by: ['ip'],
          _count: { _all: true },
          orderBy: { _count: { ip: 'desc' } },
          take: 20,
        }),
        prisma.visit.findMany({
          where: { createdAt: { gte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) } },
          select: { createdAt: true },
        }),
        prisma.inquiry.count(),
        prisma.media.count(),
        prisma.product.count(),
      ])

    const dailyMap = new Map()
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dailyMap.set(key, 0)
    }
    for (const row of dailyRows) {
      const key = new Date(row.createdAt).toISOString().slice(0, 10)
      if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) || 0) + 1)
    }

    res.json({
      online: onlineSessions.length,
      historyOnline: historySessions.length,
      monthOnline: monthSessions.length,
      pageViews,
      todayPageViews,
      ipSources: ipRows.map((row) => ({ ip: row.ip || 'unknown', count: row._count._all })),
      daily: Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count })),
      counts: { inquiries: inquiryCount, media: mediaCount, products: productCount },
    })
  } catch (error) {
    next(error)
  }
})

export default router
