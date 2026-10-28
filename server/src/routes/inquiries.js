import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { prisma } from '../db.js'
import { requireAdmin } from '../auth.js'

const uploadsDir = path.resolve(process.cwd(), 'uploads', 'inquiries')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase()
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^(image\/(png|jpe?g|gif|webp|svg\+xml)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|postscript|illustrator))$/
    if (allowed.test(file.mimetype)) cb(null, true)
    else cb(new Error('附件格式不支持'))
  },
})

const router = Router()

function serialize(inquiry) {
  let attachments = []
  try {
    attachments = JSON.parse(inquiry.attachments || '[]')
  } catch {
    attachments = []
  }
  return { ...inquiry, attachments }
}

router.post('/', upload.array('attachments', 10), async (req, res, next) => {
  try {
    const body = req.body || {}
    if (!body.fullName || !body.businessEmail) {
      return res.status(400).json({ error: '姓名和邮箱必填' })
    }
    const attachments = (req.files || []).map((file) => ({
      name: file.originalname,
      url: `/uploads/inquiries/${file.filename}`,
      size: file.size,
      type: file.mimetype,
    }))
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName: body.fullName,
        companyName: body.companyName || '',
        businessEmail: body.businessEmail,
        phone: body.phone || '',
        country: body.country || '',
        productType: body.productType || '',
        quantity: body.quantity || '',
        packagingSize: body.packagingSize || '',
        material: body.material || '',
        printingRequirements: body.printingRequirements || '',
        additionalRequirements: body.additionalRequirements || '',
        attachments: JSON.stringify(attachments),
        status: 'pending',
      },
    })
    res.status(201).json(serialize(inquiry))
  } catch (error) {
    next(error)
  }
})

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { search, status, from, to } = req.query
    const where = {}
    if (status && status !== 'all') where.status = String(status)
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(`${from}T00:00:00.000Z`)
      if (to) where.createdAt.lte = new Date(`${to}T23:59:59.999Z`)
    }
    if (search) {
      where.OR = [
        { fullName: { contains: String(search) } },
        { companyName: { contains: String(search) } },
        { businessEmail: { contains: String(search) } },
        { phone: { contains: String(search) } },
      ]
    }
    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    res.json(inquiries.map(serialize))
  } catch (error) {
    next(error)
  }
})

router.get('/:id', requireAdmin, async (req, res, next) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } })
    if (!inquiry) return res.status(404).json({ error: '询盘不存在' })
    res.json(serialize(inquiry))
  } catch (error) {
    next(error)
  }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status, note } = req.body || {}
    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(note !== undefined ? { note } : {}),
      },
    })
    res.json(serialize(inquiry))
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } })
    if (inquiry) {
      const attachments = JSON.parse(inquiry.attachments || '[]')
      for (const file of attachments) {
        if (typeof file.url === 'string' && file.url.startsWith('/uploads/inquiries/')) {
          fs.promises.unlink(path.join(uploadsDir, path.basename(file.url))).catch(() => {})
        }
      }
    }
    await prisma.inquiry.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
