import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()

function serialize(product) {
  return {
    ...product,
    gallery: parseList(product.gallery),
    specs: parseList(product.specs),
  }
}

function parseList(value) {
  try {
    const data = JSON.parse(value || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function toJson(value, fallback = []) {
  if (value === undefined) return JSON.stringify(fallback)
  if (typeof value === 'string') return value
  return JSON.stringify(Array.isArray(value) ? value : fallback)
}

router.get('/', async (req, res, next) => {
  try {
    const { category, search, all } = req.query
    const where = {}
    if (all !== '1') where.published = true
    if (category) where.category = { slug: String(category) }
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { summary: { contains: String(search) } },
        { description: { contains: String(search) } },
      ]
    }
    const products = await prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { category: true },
    })
    res.json(products.map(serialize))
  } catch (error) {
    next(error)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    })
    if (!product) return res.status(404).json({ error: '产品不存在' })
    res.json(serialize(product))
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {}
    if (!body.name || !body.slug) return res.status(400).json({ error: '名称和 slug 必填' })
    const exists = await prisma.product.findUnique({ where: { slug: body.slug } })
    if (exists) return res.status(409).json({ error: 'slug 已存在' })
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        categoryId: body.categoryId || null,
        image: body.image || '',
        gallery: toJson(body.gallery),
        summary: body.summary || '',
        description: body.description || '',
        specs: toJson(body.specs),
        featured: Boolean(body.featured),
        published: body.published === undefined ? true : Boolean(body.published),
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
      include: { category: true },
    })
    res.status(201).json(serialize(product))
  } catch (error) {
    next(error)
  }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {}
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.slug !== undefined ? { slug: body.slug } : {}),
        ...(body.categoryId !== undefined ? { categoryId: body.categoryId || null } : {}),
        ...(body.image !== undefined ? { image: body.image } : {}),
        ...(body.gallery !== undefined ? { gallery: toJson(body.gallery) } : {}),
        ...(body.summary !== undefined ? { summary: body.summary } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.specs !== undefined ? { specs: toJson(body.specs) } : {}),
        ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
        ...(body.published !== undefined ? { published: Boolean(body.published) } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: Number(body.sortOrder) } : {}),
      },
      include: { category: true },
    })
    res.json(serialize(product))
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
