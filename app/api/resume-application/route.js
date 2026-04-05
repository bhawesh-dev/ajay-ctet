import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req) {
  const { phone } = await req.json()

  // 1. find user
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single()

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
    .order('created_at', { ascending: false })
    .maybeSingle()

  if (payment) {
    const token = `token_${Date.now()}`

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
}