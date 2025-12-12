import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

function transporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  return nodemailer.createTransport({ host, port, auth: { user, pass } })
}

router.post('/enrollment', async (req, res) => {
  const { to, course, teacher } = req.body
  try {
    const t = transporter()
    const info = await t.sendMail({ from: process.env.MAIL_FROM, to, subject: 'Enrollment Confirmed', text: `You are enrolled in ${course} by ${teacher}.` })
    res.json({ messageId: info.messageId })
  } catch {
    res.status(500).json({ error: 'Email failed' })
  }
})

router.post('/receipt', async (req, res) => {
  const { to, amount, currency = 'INR' } = req.body
  try {
    const t = transporter()
    const info = await t.sendMail({ from: process.env.MAIL_FROM, to, subject: 'Payment Receipt', text: `Payment received: ${amount} ${currency}.` })
    res.json({ messageId: info.messageId })
  } catch {
    res.status(500).json({ error: 'Email failed' })
  }
})

export default router
