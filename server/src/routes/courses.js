import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '../../data.json')

function read() {
  if (!fs.existsSync(dbPath)) return { users: [], courses: [], videos: [] }
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
}
function write(db) { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2)) }

router.get('/', (req, res) => {
  const { q = '', model, teacher } = req.query
  const db = read()
  let list = db.courses || []
  if (q) list = list.filter(c => (c.title || '').toLowerCase().includes(String(q).toLowerCase()))
  if (model) list = list.filter(c => c.model === model)
  if (teacher) list = list.filter(c => c.teacherId === teacher)
  res.json({ courses: list })
})

router.post('/', (req, res) => {
  const token = req.cookies['token']
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    if (payload.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
    const { title, description = '', model = 'video', price = 0 } = req.body
    if (!title) return res.status(400).json({ error: 'Title required' })
    const db = read()
    const id = 'course_' + Date.now()
    const course = { id, title, description, model, price, teacherId: payload.id }
    db.courses = db.courses || []
    db.courses.push(course)
    write(db)
    res.json({ course })
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

export default router
