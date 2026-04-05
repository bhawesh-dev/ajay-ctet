import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const body = await req.json()
    const { order_id } = body

    // 1. find payment
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_id', order_id)
      .single()

    if (error || !payment) {
      return Response.json({ error: 'Payment not found' })
    }

    // 2. mark as paid (simulate Razorpay success)
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ status: 'paid' })
      .eq('order_id', order_id)

    if (updateError) {
      return Response.json({ error: updateError.message })
    }

    // 3. generate token
    const token = `token_${Date.now()}`

    // 4. create application entry
    const { data: appData, error: appError } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          user_id: payment.user_id,
          token,
          form_filled: false
        }
      ])
      .select()
      .single()

    if (appError) {
      return Response.json({ error: appError.message })
    }

    return Response.json({
      message: 'Payment verified',
      token
    })

  } catch (err) {
    return Response.json({ error: 'Server error' })
  }
}