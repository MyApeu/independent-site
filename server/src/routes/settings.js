import { Router } from 'express'
import { requireAdmin } from '../auth.js'
import { getSetting, setSetting } from '../settings.js'
import { DEFAULT_HOMEPAGE, DEFAULT_FOOTER } from '../defaults.js'

const router = Router()

router.get('/homepage', async (_req, res, next) => {
  try {
    res.json(await getSetting('homepage', DEFAULT_HOMEPAGE))
  } catch (error) {
    next(error)
  }
})

router.put('/homepage', requireAdmin, async (req, res, next) => {
  try {
    const current = await getSetting('homepage', DEFAULT_HOMEPAGE)
    const value = { ...current, ...(req.body || {}) }
    await setSetting('homepage', value)
    res.json(value)
  } catch (error) {
    next(error)
  }
})

router.get('/footer', async (_req, res, next) => {
  try {
    res.json(await getSetting('footer', DEFAULT_FOOTER))
  } catch (error) {
    next(error)
  }
})

router.put('/footer', requireAdmin, async (req, res, next) => {
  try {
    const current = await getSetting('footer', DEFAULT_FOOTER)
    const value = { ...current, ...(req.body || {}) }
    await setSetting('footer', value)
    res.json(value)
  } catch (error) {
    next(error)
  }
})

export default router
