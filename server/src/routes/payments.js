import { Router } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const router = Router()

function getClient() {
  const key_id = process.env.RAZORPAY_KEY_ID || ''
  const key_secret = process.env.RAZORPAY_KEY_SECRET || ''
  return new Razorpay({ key_id, key_secret })
}

router.get('/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || '' })
})

router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt = 'receipt_' + Date.now() } = req.body
  try {
    const client = getClient()
    const order = await client.orders.create({ amount, currency, receipt })
    res.json({ order })
  } catch (e) {
    res.status(500).json({ error: 'Order creation failed' })
  }
})

router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  const secret = process.env.RAZORPAY_KEY_SECRET || ''
  const payload = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  const ok = expected === razorpay_signature
  res.json({ verified: ok })
})

export default router
