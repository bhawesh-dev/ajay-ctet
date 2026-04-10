import crypto from 'crypto'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity

      const order_id = payment.order_id
      const payment_id = payment.id

      console.log('Webhook received:', order_id)

      await supabaseAdmin
        .from('payments')
        .update({
          status: 'paid',
          payment_id
        })
        .eq('order_id', order_id)

      console.log('Payment updated via webhook:', order_id)
    }

    return new Response('OK', { status: 200 })

  } catch (err) {
    console.log('WEBHOOK ERROR:', err)
    return new Response('Error', { status: 500 })
  }
}