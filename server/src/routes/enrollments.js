import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { addEnrollment, getEnrollmentsByUser } from '../data/store.js'

const router = Router()

router.get('/me', requireAuth, (req, res) => {
  const list = getEnrollmentsByUser(req.user.id)
  res.json({ enrollments: list })
})

router.post('/', requireAuth, (req, res) => {
  const { courseId } = req.body
  if (!courseId) return res.status(400).json({ error: 'courseId required' })
  const e = addEnrollment(req.user.id, courseId)
  res.json({ enrollment: e })
})

export default router
