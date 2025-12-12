import { Router } from 'express'
import PDFDocument from 'pdfkit'

const router = Router()

router.get('/generate/:courseId', (req, res) => {
  const { courseId } = req.params
  const { studentName = 'Student' } = req.query
  res.setHeader('Content-Type', 'application/pdf')
  const doc = new PDFDocument({ size: 'A4' })
  doc.pipe(res)
  doc.fontSize(24).text('Virtuversity Certificate', { align: 'center' })
  doc.moveDown()
  doc.fontSize(16).text(`Awarded to ${studentName}`, { align: 'center' })
  doc.moveDown()
  doc.text(`For completing course ${courseId}`, { align: 'center' })
  doc.end()
})

export default router
