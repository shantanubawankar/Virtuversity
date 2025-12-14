import { Router } from 'express'
import { getCourses, getCourseById, seedSampleCourse } from '../data/store.js'

const router = Router()

seedSampleCourse()

router.get('/', (req, res) => {
  const courses = getCourses()
  res.json({ courses })
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  const course = getCourseById(id)
  if (!course) return res.status(404).json({ error: 'Not found' })
  res.json({ course })
})

export default router
