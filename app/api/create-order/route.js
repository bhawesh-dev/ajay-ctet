import Razorpay from 'razorpay'
import supabaseAdmin from '@/lib/supabaseAdmin'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(req) {
  try {
    const { user_id } = await req.json()

    const options = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)

    // store in DB
    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert([{
        user_id,
        order_id: order.id,
        status: 'created',
        amount: 100
      }])
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message })
    }

    return Response.json({
      order_id: order.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    })

  } catch (err) {
    return Response.json({ error: 'Order creation failed' })
  }
}