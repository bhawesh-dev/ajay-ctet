import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const body = await req.json()
    const { token, formData } = body

    // 1. find application by token
    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !application) {
      return Response.json({ error: 'Invalid token' })
    }

    // 2. check if already filled
    if (application.form_filled) {
      return Response.json({ error: 'Form already submitted' })
    }

    // 3. update form data
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        form_data: formData,
        form_filled: true
      })
      .eq('token', token)

    if (updateError) {
      return Response.json({ error: updateError.message })
    }

    return Response.json({
      message: 'Form submitted successfully'
    })

  } catch (err) {
    return Response.json({ error: 'Server error' })
  }
}