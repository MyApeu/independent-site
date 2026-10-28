import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
    res.json(categories)
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, slug, image, description, featured, sortOrder } = req.body || {}
    if (!name || !slug) return res.status(400).json({ error: '名称和 slug 必填' })
    const exists = await prisma.category.findUnique({ where: { slug } })
    if (exists) return res.status(409).json({ error: 'slug 已存在' })
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: image || '',
        description: description || '',
        featured: Boolean(featured),
        sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      },
    })
    res.status(201).json(category)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name, slug, image, description, featured, sortOrder } = req.body || {}
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
        ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
      },
    })
    res.json(category)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
