import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const { phone } = await req.json()

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return Response.json({ type: 'invalid' })
    }

    // 1. find user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle()

    if (!user) {
      return Response.json({ type: 'new' })
    }

    // 2. check latest application (any)
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .maybeSingle()

    // CASE 1: application exists
    if (application) {
      if (application.form_filled) {
        return Response.json({
          type: 'completed',
          token: application.token
        })
      }

      return Response.json({
        type: 'resume',
        token: application.token
      })
    }

    // 3. check paid payment (no application yet)
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .not('payment_id', 'is', null)
      .order('created_at', { ascending: false })
      .maybeSingle()

    if (payment) {
      const { data: existing } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .is('form_filled', false)
        .maybeSingle()

      if (existing) {
        return Response.json({
          type: 'resume',
          token: existing.token
        })
      }

      const token = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`

      const { data: app } = await supabaseAdmin
        .from('applications')
        .insert([
          {
            user_id: user.id,
            token,
            form_filled: false
          }
        ])
        .select()
        .single()

      return Response.json({
        type: 'paid_resume',
        token: app.token
      })
    }

    // CASE 3: new user or not paid
    return Response.json({ type: 'new' })
  } catch (err) {
    console.log('RESUME ERROR:', err)
    return Response.json({ type: 'error' })
  }
}