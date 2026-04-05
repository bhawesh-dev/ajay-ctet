import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const body = await req.json()
    const { token } = body

    if (!token) {
      return Response.json({ error: 'Token missing' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !data) {
      return Response.json({ error: 'Application not found' }, { status: 404 })
    }

    return Response.json({ application: data })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}