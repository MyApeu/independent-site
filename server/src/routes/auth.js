import { Router } from 'express'
import { login } from '../auth.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const token = await login(req.body?.password)
    if (!token) return res.status(401).json({ error: '密码错误' })
    res.json({ token })
  } catch (error) {
    next(error)
  }
})

export default router
