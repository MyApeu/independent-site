import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { prisma } from '../db.js'
import { requireAdmin } from '../auth.js'

const uploadsDir = path.resolve(process.cwd(), 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase()
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`
    cb(null, name)
  },
})

const imageUpload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('只支持图片文件'))
  },
})

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(media)
  } catch (error) {
    next(error)
  }
})

router.post('/upload', requireAdmin, imageUpload.array('files', 20), async (req, res, next) => {
  try {
    const files = req.files || []
    const created = []
    for (const file of files) {
      const url = `/uploads/${file.filename}`
      const asset = await prisma.media.create({
        data: {
          name: file.originalname,
          url,
          alt: path.basename(file.originalname, path.extname(file.originalname)),
          description: '',
          size: file.size,
          type: file.mimetype,
        },
      })
      created.push(asset)
    }
    res.status(201).json(created)
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, url, alt, description } = req.body || {}
    if (!url) return res.status(400).json({ error: 'URL 必填' })
    const asset = await prisma.media.create({
      data: {
        name: name || 'external-image',
        url,
        alt: alt || '',
        description: description || '',
        size: 0,
        type: 'external',
      },
    })
    res.status(201).json(asset)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name, alt, description } = req.body || {}
    const asset = await prisma.media.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(alt !== undefined ? { alt } : {}),
        ...(description !== undefined ? { description } : {}),
      },
    })
    res.json(asset)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const asset = await prisma.media.findUnique({ where: { id: req.params.id } })
    if (asset && asset.url.startsWith('/uploads/')) {
      const filePath = path.join(uploadsDir, path.basename(asset.url))
      fs.promises.unlink(filePath).catch(() => {})
    }
    await prisma.media.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
