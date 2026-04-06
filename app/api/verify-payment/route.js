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

    // 5. generate sequential roll number
    const appId = appData.id

    // get total number of applications (safe sequence)
    // count only rows where roll_seq is already assigned (ignore nulls)
const { count, error: countError } = await supabaseAdmin
  .from('applications')
  .select('roll_seq', { count: 'exact', head: true })
  .not('roll_seq', 'is', null)

if (countError) {
  return Response.json({ error: countError.message })
}

// next sequence = assigned count + 1
const nextSeq = (count || 0) + 1

    const rollNumber = `ACCST26-${String(nextSeq).padStart(4, '0')}`

    // 6. save roll number + sequence
    const { error: rollError } = await supabaseAdmin
      .from('applications')
      .update({
        roll_number: rollNumber,
        roll_seq: nextSeq
      })
      .eq('id', appId)

    if (rollError) {
      return Response.json({ error: rollError.message })
    }

    return Response.json({
      message: 'Payment verified',
      token,
      roll_number: rollNumber
    })

  } catch (err) {
    return Response.json({ error: 'Server error' })
  }
}